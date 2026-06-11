# 🛡️ Mini-WAF: Web Application Firewall & Security Operations Dashboard

![Version](https://img.shields.io/badge/Version-1.0.0-blue.svg)
![Status](https://img.shields.io/badge/Status-Active-success.svg)
![Node.js](https://img.shields.io/badge/Backend-Node.js_|_Express-339933.svg)
![React](https://img.shields.io/badge/Frontend-React_|_Recharts-61DAFB.svg)
![Security](https://img.shields.io/badge/Focus-Threat_Analysis_&_SOC-red.svg)

## 📌 Yönetici Özeti (Executive Summary)

**Mini-WAF**, modern web uygulamalarını OWASP Top 10 zafiyetlerine karşı korumak amacıyla tasarlanmış, kural tabanlı (rule-based) bir **Web Application Firewall (WAF)** ve **Tehdit İstihbaratı (Threat Intelligence)** projesidir. 

Sistem; ağ trafiğini "Ters Vekil" (Reverse Proxy) mimarisiyle üzerine alır, Zararlı Yükleri (Malicious Payloads) hedef sisteme ulaşmadan önce derinlemesine analiz eder (Deep Packet Inspection mantığıyla) ve engellenen olayları gerçek zamanlı olarak bir **Security Operations Center (SOC)** paneline aktarır.

Bu proje, siber saldırıların nasıl çalıştığını (Offensive) ve bu saldırıların uygulama katmanında nasıl izole edilip engellendiğini (Defensive) uçtan uca göstermek için bir Kavram Kanıtı (PoC) olarak geliştirilmiştir.

---

## 🚀 Güvenlik Yetenekleri ve Özellikler (Core Capabilities)

* **Aktif Tehdit Engelleme (Active Threat Mitigation):**
  * **SQL Injection (SQLi):** `UNION SELECT`, `OR 1=1`, `SLEEP()` gibi mantıksal ve zaman tabanlı veritabanı manipülasyonlarını bloklar.
  * **Cross-Site Scripting (XSS):** Sadece `<script>` etiketlerini değil; zararlı event handler'ları (`onerror`, `onload`) ve DOM tabanlı manipülasyonları tespit eder.
  * **Local File Inclusion / Path Traversal (LFI):** Dizin atlatma karakterlerini (`../`, `%2e%2e`) ve kritik OS dosyalarına (`/etc/passwd`, `C:\Windows`) erişim girişimlerini engeller.

* **Olay Müdahalesi ve Telemetri (Incident Response & Telemetry):**
  * HTTP isteklerindeki (Header, URI, Body) URL-encoded verileri otomatik decode ederek gizlenmiş (obfuscated) payload'ları açığa çıkarır.
  * POST isteklerindeki Body verisini Proxy aşamasında yeniden yapılandırarak (Body Fix) veri kayıplarını önler.

* **Gelişmiş Görünürlük (SOC Visibility):**
  * Engellenen her istek için kaynak IP adresi üzerinden **Geo-Location (Coğrafi Konum)** tespiti yapar.
  * Saldırı vektörlerini, zaman damgalarını ve saldırı türlerini MongoDB üzerinde normalize ederek kalıcı loglar (Audit Trails) oluşturur.
  * React tabanlı arayüz ile polling mekanizması kullanarak sayfayı yenilemeden canlı anomali takibi sağlar.

---

## 🏗️ Sistem Mimarisi (Architecture)

Sistem, güvenlik prensipleri gereği (Separation of Concerns) üç izole katmandan oluşmaktadır:

1. **WAF Gateway (Port 3002):** İsteklerin karşılandığı, filtreleme kurallarının (Regex) işletildiği ve temiz trafiğin yönlendirildiği ana güvenlik duvarı.
2. **Vulnerable Target / Kurban Uygulama (Port 3001):** WAF'ın koruma yeteneklerini test edebilmek için kasıtlı olarak SQLi, XSS ve LFI zafiyetleri barındıran simülasyon bankacılık portalı.
3. **SOC Dashboard (Port 3000):** Güvenlik analistlerinin olayları (Incidents) izlediği veri görselleştirme arayüzü.

```text
[Saldırgan/İstemci] 
       │ (HTTP Request)
       ▼
[ WAF Proxy Motoru ] ──(Temiz İstek)──> [ Hedef Bankacılık Uygulaması ]
       │ 
       ├──(Zararlı İstek Yakalandı) ──> ⛔ HTTP 403 Forbidden
       │
       ▼ (IP, Ülke, Payload, Zaman Damgası)
[ MongoDB Atlas Veritabanı ] 
       │
       ▼ (REST API Polling)
[ SOC Tehdit İzleme Paneli (React) ]
```

💻 Teknoloji Yığını (Tech Stack)
Backend (Güvenlik & Proxy Katmanı): Node.js, Express.js, http-proxy-middleware, geoip-lite

Frontend (İzleme Katmanı): React.js, Axios, Recharts (Veri Görselleştirme)

Veritabanı: MongoDB, Mongoose ORM

Güvenlik Standardı: OWASP Top 10 Mitigation Guidelines

📸 Sistem Görselleri (Screenshots)
Not: Projeyi yerel ortamınızda çalıştırdığınızda aşağıdaki arayüzlerle karşılaşacaksınız.

1. SOC Dashboard (Tehdit Paneli),2. VulnBank (Hedef Sistem),3. WAF Logları (Terminal)
![Dashboard Resmi Ekle](Link_Buraya),![Banka Resmi Ekle](Link_Buraya),![Terminal Resmi Ekle](Link_Buraya)
Anlık saldırı dağılımları ve detaylı olay logları (Incident Logs).,Zafiyet testleri için özel hazırlanmış finansal arayüz.,WAF motorunun payload tespit anı ve veritabanı kayıt işlemi.

⚙️ Kurulum ve Yapılandırma (Installation)
Sistemi lokal ortamınızda ayağa kaldırmak için Node.js'in yüklü olması gerekmektedir.

1. Depoyu Klonlayın
```text
git clone [https://github.com/KULLANICI_ADIN/mini-waf-projesi.git](https://github.com/KULLANICI_ADIN/mini-waf-projesi.git)
cd mini-waf-projesi
```
2. Çevre Değişkenlerini (Environment Variables) Tanımlayın
Hardcoded şifreleme mantığından kaçınmak için MongoDB veritabanı bağlantısı .env dosyası üzerinden sağlanmaktadır. waf-backend dizini içinde .env adında bir dosya oluşturun ve .env.example dosyasını referans alarak kendi bilgilerinizi girin:
```text
# waf-backend/.env
DB_URI=mongodb+srv://<kullanici>:<sifre>@cluster.mongodb.net/mini-waf-db
PORT=3002
```
3. Servisleri Başlatın
Mikroservis benzeri bu yapıyı çalıştırmak için 3 ayrı terminal sekmesi kullanın:

Terminal 1 (Hedef Uygulama):
```text
cd waf-backend
npm install
node victim.js
# Port 3001'de çalışır
```
Terminal 2 (WAF Motoru):
```text
cd waf-backend
npm install dotenv # (Eğer yüklü değilse)
node server.js
# Port 3002'de çalışır
```
Terminal 3 (SOC Paneli):
```text
cd waf-dashboard
npm install
npm start
# Port 3000'de çalışır
```
🧪 Sızma Testi (Penetration Testing) Senaryoları
Sistem ayağa kalktıktan sonra, WAF'ın koruma kalkanını test etmek için WAF Gateway (http://localhost:3002) üzerinden aşağıdaki payload'ları deneyebilirsiniz.

Tüm bu denemelerin hedef sisteme ulaşamadan HTTP 403 hatasıyla düşürüldüğünü ve React Dashboard üzerinde loglandığını gözlemleyebilirsiniz.

Senaryo 1: Authentication Bypass (SQL Injection)
Hedef URL: http://localhost:3002/login-page

Test Payload: Formdaki kullanıcı adı alanına ' OR 1=1 -- yazarak şifresiz giriş yapmayı deneyin. WAF anında veritabanı manipülasyonunu tespit edecektir.

Senaryo 2: Reflected XSS
Hedef URL: http://localhost:3002/transactions

Test Payload: Arama çubuğuna <script>alert(document.cookie)</script> girin. WAF, istemci tarafı (client-side) kod çalıştırma girişimini bloklayacaktır.

Senaryo 3: Local File Inclusion (LFI)
Hedef URL: http://localhost:3002/documents

Test Payload: URL sonuna manuel olarak müdahale edip http://localhost:3002/file?name=../../../../../etc/passwd parametresini gönderin. Dizin atlatma (Path Traversal) denemesi başarısız olacaktır.

Önemli: Bu sistem; siber güvenlik analizleri, savunma mekanizmaları geliştirme ve akademik amaçlar doğrultusunda hazırlanmıştır. Yalnızca yetkiniz dahilindeki sistemlerde test ediniz.
