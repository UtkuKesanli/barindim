# Barındım

Barınak yöneticilerine yönelik **kurgusal** yazılım tanıtım sitesi ve gerçek sunucu kaydı oluşturmak için demo talebi formu. Dil Türkçe, görev ALEX-24H-v1.0. Kapasite, kabul ve giriş/çıkış özellikleri ürün fikridir; yönetim uygulaması değildir. Üyelik, hayvan kaydı, ödeme, bildirim ve admin paneli kapsam dışındadır.

## Yerel kurulum

Node.js 22 ve npm kullanıldı. Kilit dosyası sürüm kontrolündedir.

```sh
npm ci
cp .env.example .env.local
# Aşağıdaki sunucu değişkenlerini yerel dosyada doldurun.
npm run dev
```

http://localhost:3000 adresini açın. Ortam değişkenlerini değiştirdikten sonra dev sunucusunu yeniden başlatın. `.env.local` ve anahtarlar Git'e eklenmez. Değerleri sohbete veya loga yazmayın.

Gerekli değişkenler: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`. `NEXT_PUBLIC_` kullanılmaz. Private key, indirilen hizmet hesabı JSON'undaki `private_key` değeridir; çift tırnak içinde `\n` kaçışlarıyla saklanabilir. Firebase Web SDK yapılandırması gerekli değildir.

## Firebase kurulumu (kullanıcı hesabında)

1. Firebase Console → Add project: TaleVD'den ayrı proje oluşturun. Spark planını kullanın; faturalandırma hesabı bağlamayın. Analytics gerekli değil.
2. Build → Firestore Database → Create database: Standard, `(default)`, production mode. Bölgeyi ihtiyaca uygun seçin; veritabanı bölgesi sonradan değiştirilemez.
3. Rules sekmesine `firestore.rules` içeriğini koyup Publish yapın. Tarayıcı okuma/yazmaları kapalıdır. Admin SDK bu kuralları atlar; sunucu doğrulaması ve hizmet hesabı IAM yetkisi ayrı güvenlik sınırlarıdır.
4. Project settings → Service accounts → Firebase Admin SDK → Generate new private key. İndirilen JSON'u repo dışında saklayın. Dosyadan ilgili üç değeri `.env.local` içine aktarın. Anahtar sızarsa iptal edip yenileyin.
5. Kurgusal bir demo isteği gönderin. Firestore Data sekmesinde `demoRequests` koleksiyonunda dönen kayıt kimliğini ve `name`, `email`, `service`, `description`, `createdAt` alanlarını doğrulayın. Sunucuyu yeniden başlattıktan sonra kaydın hâlâ mevcut olduğunu kontrol edin.

## Mimari ve veri akışı

`src/app/page.tsx`: statik içerik ve kurgusal panel (köpek: 100=64+8+28; kedi: 60=42+6+12). `src/components/demo-form.tsx`: istemci doğrulaması, pending/error/success durumları. `src/lib/demo-schema.ts`: iki tarafta kullanılan Zod şeması. `POST /api/demo-requests`: origin, içerik türü, 16 KiB gövde sınırı ve sunucu doğrulaması. `src/lib/firebase-admin.ts`: yalnızca sunucuda, `demoRequests` koleksiyonuna `await add()` ve sunucu zamanı. Sadece yazma tamamlanınca HTTP 201, `ok:true` ve belge kimliği döner. Yapılandırma yoksa gerçek hata 503 olur; sahte başarılı kayıt yoktur.

Zod alanları trim eder; ad 2–80, e-posta en fazla 254 ve geçerli biçim, açıklama 10–2000 karakter. Hizmet yalnızca `capacity`, `check-in-out`, `all`. Sayı/null türleri ve beklenmeyen alanlar reddedilir. React kullanıcı metnini HTML olarak yorumlamaz. API veri okuma/listeme uç noktası içermez.

## Kontroller

```sh
npm run test
npm run lint
npm run typecheck
npm run build
npm start
npm audit
npm audit --omit=dev
```

Testler kontrollü depolama fonksiyonu kullanır; gerçek Firestore kalıcılığına kanıt değildir. Geçersiz alanlar, browser doğrulamasını atlama, geciken yazma, yazma hatası, bozuk JSON, origin ve büyük gövde sınanır. Tarayıcı ve canlı ortam kontrol kaydı `AI_LOG.md` içinde tutulur. Yerel sonuç: 7/7 test, lint, typecheck ve production build geçti. 320–1440px taşma, klavye ile form, kontrollü pending/503 ve gerçek eksik yapılandırma 503 akışı sınandı. Gerçek form → API → bulut Firestore kaydı ve sunucu yeniden başlatma sonrası kalıcılık doğrulandı. Canlı hosting testi henüz yapılmadı.

Manuel uçtan uca kontrol: 360px/masaüstü, Tab/Shift+Tab/Enter, görünür odak, alan hataları, gönderiliyor durumu, çift tıklama, veri korunması, gerçek Firestore belge eşleşmesi. Firestore devre dışıyken başarı gösterilmemeli. Test verisi yalnızca `Deniz Örnek / deniz@example.com` gibi kurgusal veridir.

## Hosting önerisi ve yayın adımları

Öneri: Vercel Hobby + Firebase Spark. Firebase projesi kullanıcı tarafından oluşturuldu ve yerel sunucu bağlandı. Vercel yayını henüz oluşturulmadı. 6 Ekim 2026 resmi kaynak kontrolü: [Vercel Hobby](https://vercel.com/docs/plans/hobby) kişisel/ticari olmayan kullanım içindir; aylık 1 milyon function invocation ve 4 CPU saati dahil listelenir, kota aşımında erişim durabilir. [Next.js desteği](https://vercel.com/docs/frameworks/full-stack/nextjs) sunucu işlevleri ve Route Handlers destekler. Değerlendirmeyle sınırlı kurgusal kullanım bu plana uygun görünüyor; bu bir çıkarımdır, plan koşulları yayın öncesinde yeniden kontrol edilmeli.

[Firestore kotası](https://firebase.google.com/docs/firestore/pricing): proje başına tek ücretsiz veritabanı; 1 GiB depolama, günde 50.000 okuma/20.000 yazma/20.000 silme, ayda 10 GiB dışa aktarım. [Spark](https://firebase.google.com/docs/projects/billing/firebase-pricing-plans) ödeme bilgisi gerektirmez; Blaze veya ücretli özellikler açılmamalı. Spark limiti aşılırsa kullanılabilirlik etkilenebilir.

Kullanıcı yayın kararı sonrasında: GitHub kişisel reposunu (özel olabilir) oluşturun, değerlendiriciye erişim verin. Vercel → Add New → Project → repo import → Next.js, root `.` → üç sunucu ortam değişkenini Production'a ekleyin → Deploy. Ücretsiz `vercel.app` adresini kullanın. Production erişim korumasının değerlendiriciyi engellemediğini gizli pencerede kontrol edin. Canlı formdan kurgusal kayıt ve Firestore eşleşmesi doğrulanmadan teslim etmeyin. API gerektiği için statik export/GitHub Pages kullanılmaz.

## Güvenlik durumu ve bilinen eksikler

`braces@3.0.3` için [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), 2 Ekim 2026 güncellemesinde etkilenen sürümler <=3.0.3, patched version yok. Yerel zincir: eslint-config-next@16.3.8 → @next/eslint-plugin-next → fast-glob@3.3.1 → micromatch@4.0.8 → braces@3.0.3. İç içe saldırgan brace desenleri stack exhaustion/DoS yaratabilir. API kullanıcı alanlarını glob desenine dönüştürmez; lint/build süreçlerinin güvenilmeyen desen veya repo girdilerine maruz kalması ayrıca değerlendirilmelidir. Dev bağımlılığı olması riski yok etmez. npm'in önerdiği eslint-config-next@14.2.35 düşürmesi Next sürümüyle uyumu bozacağı için uygulanmadı; override yok. Son denetim: tam audit 5 high/2 moderate; `--omit=dev` 0 high/2 moderate. Yayından önce yeniden kontrol edilmelidir.

Firebase Admin@14.5.0 kurulumu ayrıca `@google-cloud/storage@8.2.0 → gaxios@6.7.1 → uuid@9.0.1` üzerinden 2 moderate audit uyarısı getiriyor. [GHSA-w5hq-g745-h8pq](https://github.com/advisories/GHSA-w5hq-g745-h8pq) düzeltilen sürümleri 11.1.1/12.0.1/13.0.1 olarak listeler; bu geçişli bağımlılık ^9 kullanıyor. `npm audit fix --dry-run` uyumlu sürüm değişikliği göstermedi. gaxios kaynakta uuid v4 kullanıyor; advisory v3/v5/v6 için çıktı buffer sınırlarıyla ilgili. Uygulama Cloud Storage veya UUID çıktı buffer API'lerini kullanmıyor; bu doğrudan API sömürüsü kanıtı değildir ve audit uyarısı devam eder. Uyumsuz override/downgrade uygulanmadı; upstream düzelmesi yayın öncesi yeniden izlenmeli.

- Origin kontrolü tarayıcı kaynaklı çapraz site gönderimini azaltır; origin atlanabilir/taklit edilebilir, bot veya DDoS koruması değildir.
- 16 KiB gövde sınırı kaynak tüketimini sınırlar; kapsamlı rate limiting yok. Her geçerli API çağrısı kota tüketir. Canlı ortam için sağlayıcının güvenlik/usage ekranı izlenmelidir.
- Pending kilidi aynı formda çift tıklamayı engeller; ağ kesilip kayıt yanıtı kaybolursa yeniden gönderme mükerrer kayıt yaratabilir. Idempotency uygulanmadı.
- İstemci 25 saniyede beklemeyi bırakabilir; bu sunucu yazmasını geri almaz. Bu durumda onay alınamadı mesajı gösterilir.
- E-posta teslimi veya sahiplik doğrulaması, kimlik doğrulama, CAPTCHA, yönetim paneli yok.
- Yerel production API üzerinden gerçek Firestore belgesi ve alanları doğrulandı. Canlı URL, değerlendirici repo erişimi ve teslim commit'i henüz doğrulanmadı. Hesap kurulumu ve yayın sonrası tamamlanacak.

## Kaynaklar ve katkılar

Başlangıç: kullanıcı `create-next-app` ile Next.js/React/TypeScript/ESLint iskeletini kurdu. Orijinal README ve başlangıç dosyaları bu oturumda değiştirilmeden önce `/private/tmp/barindim-starter-backup` içine yedeklendi (bu geçici yedek teslimin parçası değildir). Hazır landing page şablonu, harici görsel, ücretli araç veya üçüncü taraf font kullanılmadı; sistem fontları ve basit CSS çizimi kullanıldı. Kullanılmayan başlangıç SVG'leri/page.module.css repoda durabilir.

Ürün adı, kapsam, hedef kullanıcı ve teknoloji tercihi kullanıcıya aittir. Bu oturumda AI sayfa metni, CSS/React, şema, API, testler ve belgeleri hazırladı; kullanıcı incelemesi ve Firebase/hosting hesabı işlemleri ayrıca kaydedilecek. Paketlerin kendi lisansları geçerlidir. Firebase [Admin setup](https://firebase.google.com/docs/admin/setup) ve [rules](https://firebase.google.com/docs/firestore/security/rules-conditions) resmi referanslardır.

## Teslim durumu

Yerel production önizleme: http://localhost:3001. Firebase proje kimliği: `barindim-f66f4`. Doğrulanmış kurgusal kayıt: `GB9I2niB3rwtXsAAvSpD`. Canlı URL: bekliyor. Kaynak kod erişimi: yerel repo, remote/erişim doğrulaması bekliyor. Teslim commit ID: henüz belirlenmedi; yayın doğrulaması sonrası `git rev-parse HEAD` ile alınacak. Başlangıç commit'i teslim commit'i değildir. Resmi süre ve portal teslimi yalnızca kullanıcı tarafından yapılır.
