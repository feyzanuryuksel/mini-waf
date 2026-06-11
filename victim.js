const express = require('express');
const app = express();
const path = require('path');

// Body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = 3001; 

// --- HTML ŞABLON MOTORU (STRING LITERALS) ---
const renderLayout = (content, activeTab) => `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VulnBank | NextGen Finance</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary-gradient: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            --secondary-gradient: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
            --bg-color: #f3f4f6;
            --card-bg: #ffffff;
            --text-main: #1f2937;
            --text-light: #6b7280;
            --nav-bg: #111827;
            --accent: #8b5cf6;
        }

        body { 
            margin: 0; 
            font-family: 'Poppins', sans-serif; 
            background-color: var(--bg-color); 
            color: var(--text-main);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        /* NAVBAR - MODERN & GRADIENT */
        .navbar {
            background: var(--nav-bg);
            padding: 0 40px;
            height: 70px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 1000;
        }

        .brand {
            font-size: 1.5rem;
            font-weight: 700;
            color: white;
            display: flex;
            align-items: center;
            gap: 10px;
            background: var(--primary-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .brand i {
            /* Icon için gradient workaround */
            background: var(--primary-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .nav-links {
            display: flex;
            gap: 10px;
        }

        .nav-item {
            color: #d1d5db;
            text-decoration: none;
            padding: 8px 16px;
            border-radius: 50px;
            font-size: 0.9rem;
            font-weight: 500;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .nav-item:hover {
            color: white;
            background: rgba(255,255,255,0.1);
        }

        .nav-item.active {
            background: var(--primary-gradient);
            color: white;
            box-shadow: 0 4px 15px rgba(124, 58, 237, 0.4);
        }

        /* CONTAINER & CARDS */
        .container {
            max-width: 1000px;
            margin: 40px auto;
            padding: 0 20px;
            width: 100%;
            animation: fadeIn 0.6s ease-out;
        }

        .card {
            background: var(--card-bg);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.05);
            border: 1px solid rgba(255,255,255,0.5);
            position: relative;
            overflow: hidden;
        }
        
        /* Dekoratif üst çizgi */
        .card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 6px;
            background: var(--primary-gradient);
        }

        .card-header {
            margin-bottom: 30px;
            text-align: center;
        }

        .card-title {
            font-size: 1.8rem;
            font-weight: 700;
            margin-bottom: 10px;
            color: var(--text-main);
        }

        .card-subtitle {
            color: var(--text-light);
            font-size: 0.95rem;
        }

        /* FORMS & INPUTS */
        .form-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            font-size: 0.9rem;
            color: var(--text-main);
        }

        input {
            width: 100%;
            padding: 15px;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            font-size: 1rem;
            font-family: 'Poppins', sans-serif;
            transition: all 0.3s;
            box-sizing: border-box;
            background: #f9fafb;
        }

        input:focus {
            outline: none;
            border-color: var(--accent);
            background: white;
            box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
        }

        button {
            width: 100%;
            padding: 16px;
            background: var(--primary-gradient);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            font-family: 'Poppins', sans-serif;
        }

        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(124, 58, 237, 0.4);
        }

        /* UTILITIES */
        .badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .badge-live { background: #dcfce7; color: #15803d; }
        
        /* HACKER HINT BOX (Modernized) */
        .hint-box {
            margin-top: 30px;
            background: #1e1e1e;
            border-radius: 12px;
            padding: 20px;
            border-left: 5px solid #10b981;
            font-family: 'Courier New', monospace;
            color: #d1d5db;
            position: relative;
        }
        
        .hint-label {
            position: absolute;
            top: -12px;
            left: 20px;
            background: #10b981;
            color: #000;
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 0.7rem;
            font-weight: bold;
        }

        code {
            color: #34d399;
            background: rgba(255,255,255,0.1);
            padding: 2px 6px;
            border-radius: 4px;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Search Results specific */
        .result-empty {
            text-align: center;
            padding: 40px;
            color: var(--text-light);
        }
        .result-empty i {
            font-size: 3rem;
            margin-bottom: 15px;
            opacity: 0.3;
        }
    </style>
</head>
<body>

    <!-- MODERN NAVBAR -->
    <nav class="navbar">
        <div class="brand">
            <i class="fas fa-cube"></i> VulnBank
        </div>
        <div class="nav-links">
            <a href="/login-page" class="nav-item ${activeTab === 'login' ? 'active' : ''}">
                <i class="fas fa-lock"></i> Giriş (SQLi)
            </a>
            <a href="/transactions" class="nav-item ${activeTab === 'xss' ? 'active' : ''}">
                <i class="fas fa-search"></i> Transferler (XSS)
            </a>
            <a href="/documents" class="nav-item ${activeTab === 'lfi' ? 'active' : ''}">
                <i class="fas fa-file-alt"></i> Belgeler (LFI)
            </a>
        </div>
        <div class="badge badge-live">
            ● Port 3002
        </div>
    </nav>

    <!-- MAIN CONTAINER -->
    <div class="container">
        ${content}
    </div>

</body>
</html>
`;

// --- ROTALAR ---

// 1. ROOT -> Login'e yönlendir
app.get('/', (req, res) => {
    res.redirect('/login-page');
});

// 2. SQL INJECTION SAYFASI
app.get('/login-page', (req, res) => {
    const content = `
        <div class="card" style="max-width: 450px; margin: 40px auto;">
            <div class="card-header">
                <div class="card-title">Portal Girişi</div>
                <div class="card-subtitle">Kurumsal hesabınıza erişin</div>
            </div>
            
            <form action="/login" method="POST">
                <div class="form-group">
                    <label>Kullanıcı Adı</label>
                    <input type="text" name="username" placeholder="örn: admin" required>
                </div>
                <div class="form-group">
                    <label>Şifre</label>
                    <input type="password" name="password" placeholder="••••••••">
                </div>
                <button type="submit">Güvenli Giriş Yap</button>
            </form>

            <div class="hint-box">
                <div class="hint-label">HACKER ZONE: SQLi</div>
                <p style="margin:0; font-size:0.9rem;">
                    Bypass Payload:<br>
                    <code>' OR 1=1 --</code>
                </p>
            </div>
        </div>
    `;
    res.send(renderLayout(content, 'login'));
});

app.post('/login', (req, res) => {
    const { username } = req.body;
    // SQLi Simülasyonu
    if (username.includes("' OR 1=1") || username === 'admin') {
        res.send(renderLayout(`
            <div class="card" style="text-align:center;">
                <div style="font-size: 4rem; color: #10b981; margin-bottom: 20px;">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h1 style="color: #10b981; margin-bottom: 10px;">Erişim Başarılı!</h1>
                <p style="color: #6b7280; font-size: 1.1rem;">SQL Enjeksiyonu ile yönetici paneline sızdınız.</p>
                <div style="margin-top: 30px;">
                    <a href="/login-page" style="text-decoration:none;">
                        <button style="background: #374151; max-width: 200px;">Çıkış Yap</button>
                    </a>
                </div>
            </div>
        `, 'login'));
    } else {
        res.send(renderLayout(`
            <div class="card" style="text-align:center;">
                <div style="font-size: 4rem; color: #ef4444; margin-bottom: 20px;">
                    <i class="fas fa-times-circle"></i>
                </div>
                <h1 style="color: #ef4444; margin-bottom: 10px;">Erişim Reddedildi</h1>
                <p style="color: #6b7280;">Hatalı kullanıcı adı veya şifre.</p>
                <div style="margin-top: 30px;">
                    <a href="/login-page" style="text-decoration:none;">
                        <button style="background: #374151; max-width: 200px;">Tekrar Dene</button>
                    </a>
                </div>
            </div>
        `, 'login'));
    }
});

// 3. XSS (TRANSFER ARAMA) SAYFASI
app.get('/transactions', (req, res) => {
    const content = `
        <div class="card">
            <div class="card-header" style="text-align: left;">
                <div class="card-title">Transfer Sorgulama</div>
                <div class="card-subtitle">İşlem ID veya Alıcı Adı ile arama yapın</div>
            </div>
            
            <form action="/search-result" method="GET" style="display:flex; gap:15px; align-items:flex-end;">
                <div style="flex-grow: 1;">
                    <input type="text" name="q" placeholder="örn: TRX-8842..." style="margin-bottom:0;">
                </div>
                <button type="submit" style="width: auto; padding: 15px 30px; margin-bottom:0;">
                    <i class="fas fa-search"></i> Ara
                </button>
            </form>

            <div class="hint-box" style="border-color: #f59e0b;">
                <div class="hint-label" style="background: #f59e0b;">HACKER ZONE: XSS</div>
                <p style="margin:0; font-size:0.9rem;">
                    Reflected XSS Payload:<br>
                    <code>&lt;script&gt;alert('Hacked')&lt;/script&gt;</code>
                </p>
            </div>
        </div>
    `;
    res.send(renderLayout(content, 'xss'));
});

app.get('/search-result', (req, res) => {
    const query = req.query.q;
    // XSS Zafiyeti: Gelen veriyi direkt ekrana basıyoruz
    const content = `
        <div class="card">
            <h2 style="margin-top:0;">Arama Sonuçları</h2>
            <div style="background: #eff6ff; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6; color: #1e40af; margin-bottom: 30px;">
                Aranan Terim: <strong>${query}</strong>
            </div>
            
            <div class="result-empty">
                <i class="fas fa-folder-open"></i>
                <h3>Kayıt Bulunamadı</h3>
                <p>Girdiğiniz kriterlere uygun işlem yok.</p>
            </div>

            <a href="/transactions" style="text-decoration:none;">
                <button style="background: #e5e7eb; color: #374151; width: auto; padding: 10px 25px;">
                    <i class="fas fa-arrow-left"></i> Geri Dön
                </button>
            </a>
        </div>
    `;
    res.send(renderLayout(content, 'xss'));
});

// 4. LFI (FATURA GÖRÜNTÜLEME) SAYFASI
app.get('/documents', (req, res) => {
    const content = `
        <div class="card">
            <div class="card-header">
                <div class="card-title">Belge & Fatura Arşivi</div>
                <div class="card-subtitle">İndirilebilir kurumsal dökümanlar</div>
            </div>
            
            <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px;">
                <!-- Doc 1 -->
                <div style="border: 2px solid #f3f4f6; padding: 25px; border-radius: 16px; text-align: center; transition: 0.3s; cursor: pointer;">
                    <div style="font-size: 3rem; color: #ef4444; margin-bottom: 15px;">
                        <i class="fas fa-file-pdf"></i>
                    </div>
                    <div style="font-weight: 700; margin-bottom: 5px;">Mali_Rapor_2024.pdf</div>
                    <div style="font-size: 0.8rem; color: #9ca3af; margin-bottom: 15px;">1.2 MB</div>
                    <a href="/file?name=ocak.pdf" style="text-decoration:none;">
                        <button style="font-size:0.85rem; padding: 10px; background: #fee2e2; color: #991b1b;">İndir</button>
                    </a>
                </div>

                <!-- Doc 2 -->
                <div style="border: 2px solid #f3f4f6; padding: 25px; border-radius: 16px; text-align: center; transition: 0.3s; cursor: pointer;">
                    <div style="font-size: 3rem; color: #3b82f6; margin-bottom: 15px;">
                        <i class="fas fa-file-word"></i>
                    </div>
                    <div style="font-weight: 700; margin-bottom: 5px;">Personel_Listesi.docx</div>
                    <div style="font-size: 0.8rem; color: #9ca3af; margin-bottom: 15px;">840 KB</div>
                    <a href="/file?name=subat.pdf" style="text-decoration:none;">
                        <button style="font-size:0.85rem; padding: 10px; background: #dbeafe; color: #1e40af;">İndir</button>
                    </a>
                </div>
            </div>

            <div class="hint-box" style="border-color: #8b5cf6;">
                <div class="hint-label" style="background: #8b5cf6;">HACKER ZONE: LFI</div>
                <p style="margin:0; font-size:0.9rem;">
                    Path Traversal Payload:<br>
                    URL sonuna ekle: <code>/file?name=../../victim.js</code>
                </p>
            </div>
        </div>
    `;
    res.send(renderLayout(content, 'lfi'));
});

app.get('/file', (req, res) => {
    const fileName = req.query.name;
    // Gerçek dosya okuma işlemi
    res.sendFile(path.join(__dirname, fileName), (err) => {
        if (err) {
            // Dosya bulunamazsa
            res.status(404).send(renderLayout(`
                <div class="card" style="text-align: center; border-top: 5px solid #ef4444;">
                    <h2 style="color: #ef4444;">Sistem Hatası</h2>
                    <p>Dosya sunucuda bulunamadı veya erişim izni yok.</p>
                    <div style="background: #1f2937; color: #f87171; padding: 10px; border-radius: 6px; font-family: monospace; display: inline-block; margin: 20px 0;">
                        Error: ENOENT: no such file or directory, open '${fileName}'
                    </div>
                    <br>
                    <a href="/documents"><button style="max-width: 150px; background: #e5e7eb; color: #374151;">Geri Dön</button></a>
                </div>
            `, 'lfi'));
        }
    });
});

app.listen(PORT, () => {
    console.log(`💀 MODERN KURBAN SUNUCUSU ÇALIŞIYOR: http://localhost:${PORT}`);
});