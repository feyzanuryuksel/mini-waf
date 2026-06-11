require('dotenv').config(); // <-- YENİ EKLENDİ: Ortam değişkenlerini yükler
const geoip = require('geoip-lite');
const express = require('express');
const { createProxyMiddleware, fixRequestBody } = require('http-proxy-middleware');
const cors = require('cors');
const mongoose = require('mongoose');
const Log = require('./models/Log');

const app = express();

// --- AYARLAR ---
const PORT = process.env.PORT || 3002;  // WAF (Kapı)
const TARGET_URL = 'http://localhost:3001'; // Kurban (Kasa)

app.use(cors()); 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// MongoDB Bağlantısı (ŞİFRE GİZLENDİ)
const DB_URI = process.env.DB_URI; // <-- YENİ EKLENDİ: Şifreyi .env dosyasından alır
mongoose.connect(DB_URI)
    .then(() => console.log('✅ Veritabanı Bağlantısı Başarılı!'))
    .catch(err => console.error('❌ Veritabanı Hatası:', err));

// --- GÜNCELLENMİŞ VE SERTLEŞTİRİLMİŞ KURALLAR ---
const securityRules = {
    // 1. SQL INJECTION: ' OR 1=1, --, union select ve zaman tabanlı (sleep) saldırıları kapsar
    sqlInjection: /(\%27)|(\')|(\-\-)|(\%23)|(#)|(\/\*)|(union|select|insert|update|delete|drop|truncate|alter|create|into|values|where|like|or\s+.+?\s*=|and\s+.+?\s*=|having|group|order|sleep|benchmark|extractvalue|updatexml)/i,
    
    // 2. XSS: Sadece <script> değil, onmouseover, onerror gibi event handler'ları ve svg/iframe gibi etiketleri yakalar
    xss: /(<script)|(javascript:)|(on\w+\s*=)|(alert\s*\()|(confirm\s*\()|(prompt\s*\()|(<img)|(src\s*=)|(eval\s*\()|(<iframe)|(<svg)|(<object)|(<body)|(<embed)|(<link)|(style\s*=)/i,
    
    // 3. PATH TRAVERSAL (LFI): ../ dışında %2e%2e gibi encode edilmiş halleri ve kritik sistem dosyalarını korur
    pathTraversal: /(\.\.\/)|(\.\.\\)|(\.\.)|(%2e%2e)|(\/etc\/passwd)|(\/etc\/shadow)|(\/etc\/group)|(c:\\windows)|(victim\.js)|(server\.js)|(\.env)|(package\.json)|(node_modules)|(\.git)|(win\.ini)|(boot\.ini)/i
};

async function logAttackToDB(req, type) {
    try {
        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
        if (ip === '::1' || ip === '127.0.0.1') ip = '176.240.0.0'; 

        const geo = geoip.lookup(ip);
        const country = geo ? geo.country : 'Bilinmiyor';

        const newLog = new Log({
            ip: ip,
            country: country,
            attackType: type,
            payload: decodeURIComponent(req.url), 
            method: req.method
        });
        
        await newLog.save();
        console.log(`💾 [DB] Saldırı Kaydedildi: ${type} (${country})`);
    } catch (error) {
        console.error('Loglama hatası:', error);
    }
}

const wafMiddleware = async (req, res, next) => {
    if (req.url.startsWith('/api') || req.url.includes('favicon.ico')) return next();

    // 1. URL ve Body'yi birleştir
    let rawPayload = req.url + JSON.stringify(req.body || {});
    
    // 2. Decode et (Şifreli karakterleri çöz)
    let decodedPayload = "";
    try {
        decodedPayload = decodeURIComponent(rawPayload);
    } catch (e) {
        decodedPayload = rawPayload;
    }

    // 3. KONTROLLER
    if (securityRules.xss.test(decodedPayload)) {
        await logAttackToDB(req, "XSS Attack");
        return res.status(403).json({ error: "WAF BLOCKED", reason: "XSS Detected" });
    }

    if (securityRules.sqlInjection.test(decodedPayload)) {
        await logAttackToDB(req, "SQL Injection");
        return res.status(403).json({ error: "WAF BLOCKED", reason: "SQL Injection Detected" });
    }

    if (securityRules.pathTraversal.test(decodedPayload)) {
        await logAttackToDB(req, "Path Traversal");
        // Buraya log atalım ki terminalde neden blokladığını görelim
        console.warn(`🛑 [BLOKLANDI] Path Traversal: ${decodedPayload}`);
        return res.status(403).json({ error: "WAF BLOCKED", reason: "Sensitive File Access Detected" });
    }

    next();
};

app.use(wafMiddleware);

app.get('/api/logs', async (req, res) => {
    try {
        const logs = await Log.find().sort({ timestamp: -1 }).limit(50);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: "Loglar çekilemedi" });
    }
});

app.use('/', createProxyMiddleware({
    target: TARGET_URL,
    changeOrigin: true,
    onProxyReq: fixRequestBody, 
    onError: (err, req, res) => {
        res.status(500).send("Hedef sunucu (Port 3001) kapalı!");
    }
}));

app.listen(PORT, () => {
    console.log(`🛡️  WAF (Port ${PORT}) Hazır - Kurallar Sertleştirildi!`);
});