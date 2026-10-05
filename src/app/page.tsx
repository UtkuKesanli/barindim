import DemoForm from "@/components/demo-form";

const capacity = [
  { type: "Köpek", current: 64, reserved: 8, available: 28 },
  { type: "Kedi", current: 42, reserved: 6, available: 12 },
];
const features = [
  ["01", "Her tür için net kapasite", "Toplam, dolu, rezerve ve uygun alanları hayvan türüne göre bir arada görün. Yeni kabul kararlarını güncel kapasiteyle planlayın."],
  ["02", "Düzenli kabul süreci", "Hayvan kabul taleplerini değerlendirin; onay ve ret kararlarını izleyin. Onaylanan talep için ayrılan yeri fiziksel girişten ayrı takip edin."],
  ["03", "İzlenebilir giriş ve çıkış", "Fiziksel giriş ve çıkışları kayda alın. Bir hayvan ayrıldığında boşalan alanı kapasite görünümüne yansıtın."],
];

export default function Home() {
  return <>
    <a className="skip-link" href="#main">İçeriğe geç</a>
    <header className="site-header container">
      <a className="brand" href="#" aria-label="Barındım ana sayfa"><span className="brand-mark" aria-hidden="true">b.</span>barındım<span className="brand-dot">.</span></a>
      <nav aria-label="Ana gezinme"><a href="#ozellikler">Özellikler</a><a href="#nasil-calisir">Nasıl çalışır?</a><a className="nav-cta" href="#demo">Demo iste <span aria-hidden="true">↗</span></a></nav>
    </header>
    <main id="main">
      <section className="hero container" aria-labelledby="hero-title">
        <div className="eyebrow"><span aria-hidden="true" className="small-dot" /> BİR BARINAK YÖNETİMİ FİKRİ</div>
        <h1 id="hero-title">Her can için yer.<br /><span>Her karar için netlik.</span></h1>
        <p className="hero-copy">Barındım, barınak yöneticilerinin kapasiteyi görmesini, hayvan kabulünü planlamasını ve giriş / çıkışları takip etmesini amaçlayan kurgusal bir yazılım hizmetidir.</p>
        <div className="hero-actions"><a className="button" href="#demo">Demo iste <span aria-hidden="true">↗</span></a><a className="text-link" href="#ornek-panel">Örnek paneli incele <span aria-hidden="true">↓</span></a></div>
        <div className="hero-note"><span aria-hidden="true">◌</span> Daha görünür kapasite. Daha düzenli bir iş akışı.</div>
        <div className="hero-art" aria-hidden="true"><div className="arch"><span className="house-roof"/><span className="house-body"/><span className="animal">●<i/><b/></span><span className="cat">●<i/><b/></span></div><span className="art-caption">BİRLİKTE, DAHA İYİ BİR DÜZEN.</span></div>
      </section>
      <section id="ozellikler" className="section container" aria-labelledby="features-title">
        <div className="section-heading"><div><p className="eyebrow">DAHA AZ BELİRSİZLİK</p><h2 id="features-title">Barınağın günlük akışına<br />birlikte bakalım.</h2></div><p>Dağınık kayıtları tek bir görünümde toplamak için tasarlanan üç temel modül.</p></div>
        <div className="feature-grid">{features.map(([number, title, copy]) => <article className="feature" key={number}><span className="feature-number">{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </section>
      <section id="ornek-panel" className="panel-section" aria-labelledby="panel-title"><div className="container panel-layout">
        <div><p className="eyebrow">BÜTÜN RESMİ GÖRÜN</p><h2 id="panel-title">Bir bakışta<br />ne kadar yer var?</h2><p>Tür bazında kapasite görünümü, dolu ve ayrılmış yerleri birbirinden ayırır. Böylece uygun alanı daha kolay değerlendirebilirsiniz.</p><p className="panel-disclaimer">Örnek panel — kurgusal veriler.<br />Bu görünüm çalışan bir yönetim sistemi değildir.</p></div>
        <div className="dashboard"><div className="dashboard-top"><span className="mini-brand">barındım / kapasite</span><span className="sample-tag">ÖRNEK</span></div><h3>Kapasite özeti</h3><p className="dashboard-subtitle">Kurgusal Örnek Barınak</p><div className="stat-grid">{[[160,"Toplam"],[106,"Dolu"],[14,"Rezerve"],[40,"Uygun"]].map(([value,label]) => <div key={label} className={`stat ${label === "Uygun" ? "available" : ""}`}><strong>{value}</strong><span>{label}</span></div>)}</div>
          <div className="capacity-table"><table><caption className="sr-only">Hayvan türüne göre kurgusal kapasite dağılımı</caption><thead><tr><th scope="col">Tür</th><th scope="col">Toplam</th><th scope="col">Dolu</th><th scope="col">Rezerve</th><th scope="col">Uygun</th></tr></thead><tbody>{capacity.map(row => <tr key={row.type}><th scope="row">{row.type}</th><td>{row.current+row.reserved+row.available}</td><td>{row.current}</td><td>{row.reserved}</td><td className="available-text">{row.available}</td></tr>)}</tbody></table></div><p className="dashboard-foot">Toplam = dolu + rezerve + uygun</p>
        </div>
      </div></section>
      <section id="nasil-calisir" className="section container" aria-labelledby="flow-title"><p className="eyebrow">FİKRİN ARKASINDAKİ AKIŞ</p><h2 id="flow-title">Talep etmek, giriş yapmak değildir.</h2><p className="flow-intro">Barındım’ın hedeflediği yönetim akışı, bir kabul talebini hayvanın fiziksel gelişinden ayrı ele alır.</p><ol className="steps">{[["Talep", "Kabul isteği oluşturulur."],["Değerlendirme", "Yönetici onaylar veya reddeder."],["Yer ayırma", "Onayla birlikte yer rezerve edilir."],["Giriş / çıkış", "Fiziksel giriş kaydedilir; çıkışta yer açılır."]].map(([title,copy],i) => <li key={title}><span className="step-number">0{i+1}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol><p className="hint flow-note">Bu akış ürün fikrini açıklar; bu sitede yalnızca yazılım demo talebi kaydedilir.</p></section>
      <section id="demo" className="demo-section" aria-labelledby="demo-title"><div className="container demo-layout"><div className="demo-copy"><p className="eyebrow">İLK ADIMI ATIN</p><h2 id="demo-title">Barınağınızın<br />ihtiyacını konuşalım.</h2><p>İlgilendiğiniz modülü seçin, ihtiyacınızı anlatın. Yazılım demo talebinizi sunucuda kaydedelim.</p><div className="demo-info"><strong>Bu bir değerlendirme demosudur.</strong><p>Yalnızca kurgusal bilgiler girin. Form, hayvan teslimi, bağış veya yer rezervasyonu için kullanılmaz. E-posta bildirimi gönderilmez.</p></div></div><div className="form-card"><h3>Demo talebi</h3><p className="form-intro">Tüm alanlar zorunludur.</p><DemoForm /></div></div></section>
    </main>
    <footer className="container footer"><a className="brand" href="#">barındım<span className="brand-dot">.</span></a><p>Kurgusal teknoloji hizmeti · ALEX-24H-v1.0 değerlendirme çalışması</p><a href="#demo">Demo iste ↗</a></footer>
  </>;
}
