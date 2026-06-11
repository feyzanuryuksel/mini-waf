# 🛡️ Mini-WAF: Web Application Firewall & Security Dashboard

![Sürüm](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)
![React](https://img.shields.io/badge/React-Dashboard-61dafb.svg)
![Güvenlik](https://img.shields.io/badge/Security-OWASP_Top_10-red.svg)

**Mini-WAF**, modern web uygulamalarını siber saldırılara karşı korumak, HTTP trafiğini analiz etmek ve tehditleri gerçek zamanlı (real-time) izlemek amacıyla geliştirilmiş bir **Kavram Kanıtı (Proof of Concept - PoC)** projesidir. Sistem; zararlı trafikleri yakalayan bir Reverse Proxy (Ters Vekil) motoru, saldırıları görselleştiren bir React paneli ve test senaryoları için bilerek zafiyetli bırakılmış (Vulnerable) bir hedef uygulamadan oluşmaktadır.

---

## 📸 Ekran Görüntüleri

*Aşağıdaki alanlara projenin çalıştığı anlara ait ekran görüntülerini ekleyiniz. (Örn: Ekran görüntüsünü GitHub'a sürükleyip bırakarak linkini alabilirsiniz).*

**1. Gerçek Zamanlı Tehdit İzleme Paneli (Dashboard)**
> `![Dashboard Görünümü](BURAYA_FOTOGRAF_LINKINI_YAPISTIR)`
*(Açıklama: React ile geliştirilen, MongoDB'den anlık veri çeken saldırı izleme ve analitik ekranı.)*

**2. WAF Engelleme İşlemi (Terminal & Tarayıcı Logları)**
> `![WAF Block Screen](BURAYA_FOTOGRAF_LINKINI_YAPISTIR)`
*(Açıklama: Zararlı bir payload'un WAF tarafından HTTP 403 Forbidden ile engellendiği an.)*

**3. VulnBank Test Ortamı (Hedef Uygulama)**
> `![Kurban Uygulama](BURAYA_FOTOGRAF_LINKINI_YAPISTIR)`
*(Açıklama: Zafiyet testleri (Penetration Testing) için hazırlanan senaryo tabanlı hedef uygulama.)*

---

## 🏗️ Sistem Mimarisi

Sistem 3 ana katmandan (Tier) oluşmaktadır:

1. **Hedef Uygulama (Port 3001):** İçerisinde SQLi, XSS ve LFI zafiyetleri barındıran test laboratuvarı.
2. **WAF Motoru (Port 3002):** Araya girerek (Man-in-the-Middle) trafiği dinleyen, zararlı payload'ları (Regex kuralları ile) tespit edip bloklayan ve IP/Coğrafi konum verilerini veritabanına işleyen Express.js proxy katmanı.
3. **SOC Paneli (Port 3000):** WAF tarafından veritabanına kaydedilen tehditleri (Threat Intelligence) görselleştiren React.js arayüzü.


graph TD
    Client[👤 İstemci / Saldırgan] -->|HTTP Request| WAF{🛡️ WAF Proxy <br> Port 3002}
    
    WAF -->|✅ Temiz İstek| Target[🏦 Hedef Uygulama <br> Port 3001]
    WAF -->|❌ Zararlı Payload| Block[⛔ HTTP 403 Blocked]
    
    WAF -.->|📝 Olay Kaydı & GeoIP| DB[(MongoDB Atlas)]
    
    Dashboard[💻 React SOC Paneli <br> Port 3000] -->|📡 Veri Çekme API| DB<img width="1897" height="1079" alt="Ekran görüntüsü 2026-06-11 213543" src="https://github.com/user-attachments/assets/60859b38-abee-4a73-8243-b8e297d8dfec" />


✨ Temel Özellikler (Key Features)
Gerçek Zamanlı Tehdit İzleme: React ve Axios ile belirli aralıklarla (polling) güncellenen dinamik veri akışı.

Kural Tabanlı Filtreleme (Rule-based WAF): OWASP standartlarına uygun Regex kuralları ile SQL Injection, Cross-Site Scripting (XSS) ve Path Traversal (LFI) koruması.

GeoIP Analitiği: Saldırganın IP adresinden coğrafi konumunu (ülke) tespit etme.

Reverse Proxy: http-proxy-middleware kullanılarak güvenli veri aktarımı ve body-parsing düzeltmeleri (POST fix).

🛠️ Kullanılan Teknolojiler
Backend: Node.js, Express.js, http-proxy-middleware

Frontend: React.js, Recharts (Grafikler), Axios

Veritabanı & Güvenlik: MongoDB, Mongoose, GeoIP-lite, dotenv

⚙️ Kurulum (Installation)
Sistemi yerel ortamınızda (localhost) çalıştırmak için aşağıdaki adımları izleyin.

1. Depoyu Klonlayın
Bash
git clone [https://github.com/KULLANICI_ADIN/mini-waf-projesi.git](https://github.com/KULLANICI_ADIN/mini-waf-projesi.git)
cd mini-waf-projesi
2. Çevre Değişkenlerini Ayarlayın (Environment Variables)
Güvenlik standartları gereği MongoDB bağlantı dizesi GitHub üzerinde paylaşılmamıştır. waf-backend dizini altında .env adında bir dosya oluşturun ve .env.example dosyasındaki şablonu kullanarak kendi veritabanı bilgilerinizi girin.

Plaintext
# waf-backend/.env
DB_URI=mongodb+srv://<kullanici_adi>:<sifre>@cluster.mongodb.net/mini-waf-db
3. Bağımlılıkları Yükleyin ve Başlatın
Sistem 3 farklı terminal penceresi gerektirir.

Terminal 1: Hedef Uygulamayı (Victim) Başlatın

Bash
cd waf-backend
npm install
node victim.js
Terminal 2: WAF Motorunu Başlatın

Bash
cd waf-backend
node server.js
Terminal 3: React İzleme Panelini Başlatın

Bash
cd waf-dashboard
npm install
npm start
🧪 Kullanım ve Test Senaryoları
Sistem ayağa kalktıktan sonra WAF sunucusu üzerinden (Port 3002) test işlemleri yapabilirsiniz:

SQL Injection Testi: http://localhost:3002/login-page adresine gidin. Kullanıcı adı olarak ' OR 1=1 -- payload'unu deneyin.

XSS Testi: http://localhost:3002/transactions adresine gidin. Arama kısmına <script>alert(1)</script> yazın.

LFI Testi: URL üzerinden http://localhost:3002/file?name=../../victim.js dizin atlama saldırısı deneyin.

Tüm bu denemeler WAF tarafından engellenecek (403 Error) ve React Dashboard üzerinde kırmızı loglar halinde raporlanacaktır.

⚠️ Bilgi: Bu proje yalnızca akademik/eğitim amaçlı ve siber güvenlik konseptlerini anlamak için geliştirilmiştir. Yetkisiz sistemler üzerinde kullanılamaz.
