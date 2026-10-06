import DemoForm from "@/components/demo-form";
import AnimalArt from "@/components/animal-art";

const capacity = [
  { type: "Köpek", kind: "dog", current: 64, reserved: 8, available: 28 },
  { type: "Kedi", kind: "cat", current: 42, reserved: 6, available: 12 },
  { type: "Kuş", kind: "bird", current: 18, reserved: 4, available: 8 },
  { type: "Tavşan", kind: "rabbit", current: 12, reserved: 3, available: 5 },
  { type: "Balık", kind: "fish", current: 36, reserved: 6, available: 18 },
] as const;
const capacityTotals = capacity.reduce((totals, row) => ({
  total: totals.total + row.current + row.reserved + row.available,
  current: totals.current + row.current,
  reserved: totals.reserved + row.reserved,
  available: totals.available + row.available,
}), { total: 0, current: 0, reserved: 0, available: 0 });
const features = [
  { kind: "bird", title: "Kapasiteyi net görün", copy: "Her tür için dolu, rezerve ve boş yerleri bir arada görün. Yeni kabulleri mevcut kapasiteye göre planlayın." },
  { kind: "rabbit", title: "Kabulleri düzenli planlayın", copy: "Kabul taleplerini değerlendirin. Onaylanan hayvanın yerini, barınağa fiziksel girişinden ayrı takip edin." },
  { kind: "fish", title: "Giriş ve çıkışları takip edin", copy: "Hayvanların gelişini ve ayrılışını kayda alın. Boşalan alanları güncel kapasite görünümünde izleyin." },
] as const;

export default function Home() {
  return <>
    <a className="skip-link" href="#main">İçeriğe geç</a>
    <header className="site-header container">
      <a className="brand" href="#" aria-label="Barındım ana sayfa"><span className="brand-mark" aria-hidden="true">B.</span>Barındım</a>
      <nav aria-label="Ana gezinme"><a href="#ozellikler">Özellikler</a><a href="#nasil-calisir">Nasıl çalışır?</a><a className="nav-cta" href="#demo">Demo iste</a></nav>
    </header>
    <main id="main">
      <section className="hero container" aria-labelledby="hero-title">
        <div className="hero-content"><p className="eyebrow">Barınak yöneticileri için</p>
          <h1 id="hero-title">Barınağınızın kapasitesi,<br /><span>bir bakışta net.</span></h1>
          <p className="hero-copy">Dolu yerleri görün, yeni kabulleri planlayın, giriş ve çıkışları takip edin. Barındım ile her can için daha düzenli bir barınak.</p>
          <div className="hero-actions"><a className="button" href="#demo">Demo iste</a><a className="text-link" href="#ornek-panel">Örnek paneli incele</a></div>
          <p className="hero-note">Kurgusal bir yazılım hizmeti · Barınaklar için tasarlandı</p>
        </div>
        <div className="hero-art" aria-hidden="true"><div className="arch"><span className="house-roof"/><span className="house-body"/><span className="animal">●<i/><b/></span><span className="cat">●<i/><b/></span></div><span className="art-caption">Her canın bir yeri olsun.</span></div>
      </section>
      <section id="ozellikler" className="section container" aria-labelledby="features-title">
        <div className="section-heading"><h2 id="features-title">Günlük işlerinize daha çok düzen.</h2><p>Kapasiteden kabul sürecine, barınağınızın ihtiyaçları aynı yerde.</p></div>
        <div className="feature-grid">{features.map(({ kind, title, copy }) => <article className={`feature feature-${kind}`} key={kind}><AnimalArt kind={kind}/><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </section>
      <section id="ornek-panel" className="panel-section" aria-labelledby="panel-title"><div className="container panel-layout">
        <div className="panel-copy"><p className="eyebrow">Kapasite takibi</p><h2 id="panel-title">Kimler burada,<br />ne kadar yer var?</h2><p>Her hayvan türünün dolu, rezerve ve boş kapasitesini tek tabloda görün.</p><AnimalArt kind="dog" className="panel-animal"/></div>
        <div className="dashboard">
          <div className="dashboard-top"><div><span className="mini-brand">Barındım</span><h3>Kapasite özeti</h3></div><span className="sample-tag">Örnek panel · Kurgusal veriler</span></div>
          <div className="capacity-table"><table><caption className="sr-only">Hayvan türüne göre kurgusal kapasite dağılımı</caption>
            <thead><tr><th scope="col">Tür</th><th scope="col" className="total-text">Toplam</th><th scope="col" className="occupied-text">Dolu</th><th scope="col" className="reserved-text">Rezerve</th><th scope="col" className="available-text">Boş</th></tr></thead>
            <tbody>{capacity.map(row => <tr key={row.type} className={`species-${row.kind}`}><th scope="row"><span className="species-name"><AnimalArt kind={row.kind}/>{row.type}</span></th><td>{row.current + row.reserved + row.available}</td><td>{row.current}</td><td>{row.reserved}</td><td>{row.available}</td></tr>)}</tbody>
          </table></div>
          <div className="grand-total"><p>Σ Genel toplam</p><div className="stat-grid">
            {[[capacityTotals.total, "Toplam", "total"], [capacityTotals.current, "Dolu", "occupied"], [capacityTotals.reserved, "Rezerve", "reserved"], [capacityTotals.available, "Boş", "available"]].map(([value, label, status]) => <div key={status} className={`stat ${status}`}><span>{label}</span><strong>{value}</strong></div>)}
          </div></div>
          <p className="dashboard-foot">Balık kapasitesi balık sayısını ifade eder.</p>
        </div>
      </div></section>
      <section id="nasil-calisir" className="section container" aria-labelledby="flow-title">
        <div className="section-heading"><h2 id="flow-title">Kabulden çıkışa, her adım belli.</h2><p>Planlanan yer ile fiziksel giriş birbirinden ayrı takip edilir.</p></div>
        <ol className="steps">{[["Talep", "Yeni hayvan için kabul talebi oluşturulur."], ["Değerlendirme", "Yönetici talebi onaylar veya reddeder."], ["Yer ayırma", "Onaylanan hayvan için yer rezerve edilir."], ["Giriş ve çıkış", "Geliş kaydedilir; ayrılışta yer boşalır."]].map(([title, copy], i) => <li key={title}><span className="step-number">{i + 1}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol>
        <p className="hint flow-note">Bu akış ürün fikrini gösterir. Bu sitede yalnızca yazılım demo talebi oluşturabilirsiniz.</p>
      </section>
      <section id="demo" className="demo-section" aria-labelledby="demo-title"><div className="container demo-layout">
        <div className="demo-copy"><p className="eyebrow">Barındım’ı keşfedin</p><h2 id="demo-title">Barınağınız için<br />bir demo isteyin.</h2><p>İlgilendiğiniz modülü seçin ve ihtiyacınızı kısaca anlatın.</p>
          <div className="demo-animals" aria-hidden="true"><AnimalArt kind="rabbit"/><AnimalArt kind="bird"/><AnimalArt kind="fish"/></div>
          <p className="demo-context">Daha görünür kapasite.<br />Daha düzenli bir günlük akış.</p>
        </div>
        <div className="form-card"><h3>Demo talebi</h3><p className="form-intro">Tüm alanlar zorunludur. Lütfen kurgusal test bilgileri kullanın.</p><DemoForm/></div>
      </div></section>
    </main>
    <footer className="container footer"><a className="brand" href="#">Barındım</a><p>Kurgusal teknoloji hizmeti · ALEX-24H-v1.0 değerlendirme çalışması</p><a href="#demo">Demo iste</a></footer>
  </>;
}
