# OX Dijital landing: kalan işler

Son güncelleme: 8 Kasım 2026. Dal: `demo/blue-accent` (push edilmedi, yayında değil).

## Yayından önce

### 1. Şirket bilgileri
- `src/components/about-page/about-data.ts` → `COMPANY`: MERSİS, vergi dairesi/no, ticaret sicil no ve **resmî İstanbul adresi** hâlâ sahte ("0000…", "Örnek Mah."). KVKK, çerez politikası ve kullanım koşulları sayfalarında görünüyor.
- Yasal metinler taslak: avukat onayı gerekiyor.
- Kullanım koşulları (`legal-data.ts`): "Çalışmalar bölümündeki müşteri markaları ilgili şirketlere aittir." cümlesi, yayında çalışma yokken yersiz. Avukat incelemesinde ele alınmalı.
- Resmî adres gelince kurum şemasına (`layout.tsx` → `ORGANIZATION`) da eklenebilir.

### 2. WhatsApp numarası
- Dokploy'a `NEXT_PUBLIC_WHATSAPP_NUMBER` girilmeli (ör. `905XXXXXXXXX`), sonra **yeniden derleme** (değer derlemede koda yazılıyor).
- Girilmezse bütün WhatsApp butonları sahte numaraya (`905000000000`) gider. Panel kapalıyken bütün "Ücretsiz görüşme" butonları da WhatsApp'a gittiği için bu en kritik ayar.

### 3. Çerez kararı (onay vermeyen ziyaretçiyi anonim sayma)
- Karar bekleniyor: **A)** onaysız ziyaretçinin sayfa görüntülemesini anonim saymaya devam et, ya da **B)** onay olmadan hiçbir şey gönderme.
- A seçilirse: çerez politikasında "analiz yalnız onayla çalışır" yazıyor; onaysız anonim sayımın da metne eklenmesi gerekir.
- B seçilirse: `src/lib/analytics.ts` içindeki `track()` onaysızken hiç göndermeyecek şekilde değişir.

### 4. Mobil kontrol
- Tarayıcı penceresi küçültülemediği için hiçbir sayfa telefon genişliğinde (320–430 px) gözle kontrol edilmedi.
- Öncelikli: ana sayfa (hero metni, "Referanslar" boş durum kutusu), `/calismalar` (boş durum + ızgara), hizmet sayfalarındaki "Bir bakışta" kutuları, footer'daki Balıkesir linki, menü, Balıkesir sayfası, 404 ve hata sayfası.
- Mekanda sayfasındaki QR kod telefonla okutulup test edilmeli.

### 5. Yayın günü adımları
1. `src/lib/launch.ts` → `LAUNCH_DATE` = yayın günü (ör. `"2026-11-20"`). Meta reklam ve küçük işletme SEO yazılarının yayın tarihi olur.
2. OX Panel açıldıysa `src/lib/links.ts` → `PANEL_PAUSED = false` (butonlar tekrar panele gider). Açılmadıysa olduğu gibi kalsın.
3. Dalı ana dala almak ve push etmek; Dokploy'un hangi daldan derlediğini kontrol etmek.
4. Dokploy: `NOINDEX=1` hem Build-time Arguments hem Environment'tan kaldırılıp **yeniden derleme** (yeniden başlatma yetmez).
5. Prod uygulamasında env'ler: `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_PANEL_URL`, GA4 ve Meta kimlikleri, Rybbit ve OX Panel ölçüm anahtarları.
6. `oxdijital.com` DNS'i Framer'dan Dokploy'a yönlendirmek.
7. Yayından sonra: çerezleri kabul edip tarayıcı konsolunda "Content Security Policy" uyarısı var mı bakmak (yerelden doğrulanamadı); GA4 ve Meta'da gerçek zamanlı ziyaret görünüyor mu kontrol etmek.
8. Search Console'a `sitemap.xml` göndermek.

## Yayından sonra

### İçerik
- Gerçek çalışmalar: `work-data.ts` içine eklenip `live: true`; referans kartları (`references.tsx`) ve `/calismalar` bento düzeni buna göre yeniden dengelenmeli.
- Gerçek müşteri yorumları gelince yorum kartı yeniden eklenebilir (şu an kaldırıldı).
- Gizli demo yazılar (reels, landing page, otomasyon): gerçeğiyle değiştirilecek ya da öyle kalacak. Landing page yazısı açılırsa Balıkesir yazısındaki ona giden cümle geri eklenebilir.
- Branding paketleri hâlâ genel yer tutucu (`service-page-data.ts`); senin metninin "Paket 02" sonrası eksik.
- Hizmet sayfalarındaki koyu "statement" bandı genel bir metin.
- "3 ay teknik destek" (Website, Bir bakışta): şimdilik bilerek bırakıldı, teyit edilecek.
- Balıkesir sayfaları "siz", sitenin geri kalanı "sen" diliyle: hangisi kalacak?
- Sosyal medya bantlarında ve çalışmalarda stok/tekrar görseller.
- Otomasyon modül olarak eklenecekse: hizmet flyout'undaki "Otomasyonlar" grubu, "Sosyal Medya Otomasyonu" modülü, e-ticaret "İhtiyaca uygun otomasyonlar" kalemi, Satışa Geç ve Ölçekle paket açıklamaları gözden geçirilecek.
- SSS'teki fiyatlar (3.499 / 9.999) flyout'larla elle eşitleniyor.

### Tasarım ve küçük düzeltmeler
- Hakkımızda: Mission imzasında isim yok; "Tasarım, yazılım ve pazarlama" satırında takvim ikonu; yeşil kalıntılar; "Nasıl çalışıyoruz?" tekrarı; "Her gün otomatik kontrol edilir" notu; ilkelerdeki iddialar.
- About başlığında tek kalan "katıyoruz."; hero'da son satırda tek kalan "altında.".
- Eski düzende kalan flyout'lar (Sosyal Medya, paket flyout'ları); Mekanda flyout görselindeki yazı başlıkla çakışıyor.
- Footer'daki yukarı butonu `#2AABEE`, marka mavisi değil.
- Dock'taki hizmet piksel ikonları.

### Entegrasyonlar
- OX Panel: ayrı oturumda bakılacak; eski webhook adresleri, Cal 30 dakikalık etkinliği, panelin yasal bilgileri.
- ElevenLabs asistanı bağlı değil ("Bana sor" şu an WhatsApp'a gidiyor).
- PageSpeed API anahtarı yok (dock'taki hız testinin kotası çabuk doluyor).
- Google Ads kimliği ve dönüşüm etiketi (reklamdan önce). Not: panel kapalıyken görüşme tıklamaları "WhatsApp tıklaması" sayılır.
- Vercel demo'da GA4 ve Meta env'leri eksik (düşük öncelik).

### Teknik
- Lighthouse / Core Web Vitals ölçümü; erişilebilirlik (klavye, kontrast, boş `alt`'lar, içeriğe geç linki).
- Meta ve SEO yazılarına kendi paylaşım görselleri eklenirse sosyal paylaşımlarda yayın tarihi de görünür.
- İsteğe bağlı: `llms.txt`, web manifest, test ve CI.
- Kullanılmayan dosyalar (silmeden önce karar): `public/videos/hero.mp4`, `public/images/footer/glow.png`, `glow-2.png`, `src/components/team/team.tsx`, `paket-flyout-handoff.md`.
