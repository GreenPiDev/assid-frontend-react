const corporateLinks = ["Hakkımızda", "Yönetim Kurulu", "Faaliyetler", "Basın Merkezi"];

export default function Footer() {
  return (
    <footer className="bg-[#0a2540] pt-16 text-white/74">
      <div className="mx-auto grid w-[min(calc(100%-40px),1240px)] grid-cols-1 gap-7 pb-12 sm:grid-cols-3 lg:grid-cols-[1.2fr_.7fr_.7fr_1fr]">
        <div className="sm:col-span-3 lg:col-span-1">
          <a className="flex items-center gap-2.5 text-white" href="#anasayfa">
            <span className="relative grid h-[43px] w-[43px] place-items-center overflow-hidden rounded-full bg-assid-green text-base font-black tracking-tighter text-white">
              A
              <span className="absolute -right-3.5 -top-2.5 h-7 w-7 rounded-full border-[3px] border-assid-lime" />
            </span>
            <span>
              <b className="block text-base leading-none tracking-tight">ASSİD</b>
              <small className="mt-1 block text-[0.58rem] tracking-wide text-white/55">
                ANKARA SİTELER SANAYİCİ VE İŞ İNSANLARI DERNEĞİ
              </small>
            </span>
          </a>
          <p className="my-4 max-w-[310px] text-[0.86rem]">
            Üretim, ticaret ve iş birliklerini büyüten Ankara Siteler dijital platformu.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-[0.79rem] tracking-wide text-assid-lime uppercase">Kurumsal</h4>
          <ul className="grid gap-2 text-[0.84rem]">
            {corporateLinks.map((label) => (
              <li key={label}>
                <a href="#" className="hover:text-white">{label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-[0.79rem] tracking-wide text-assid-lime uppercase">Platform</h4>
          <ul className="grid gap-2 text-[0.84rem]">
            <li><a href="#firma-rehberi" className="hover:text-white">Firma Rehberi</a></li>
            <li><a href="#b2b" className="hover:text-white">B2B İş Birliği</a></li>
            <li><a href="#etkinlikler" className="hover:text-white">Etkinlikler</a></li>
            <li><a href="#" className="hover:text-white">Üye Avantajları</a></li>
          </ul>
        </div>
        <div id="iletisim">
          <h4 className="mb-3 text-[0.79rem] tracking-wide text-assid-lime uppercase">İletişim</h4>
          <div className="mb-2.5 flex gap-2.5 text-[0.84rem]">⌖ Siteler, Altındağ / Ankara</div>
          <div className="mb-2.5 flex gap-2.5 text-[0.84rem]">☎ +90 312 000 00 00</div>
          <div className="mb-2.5 flex gap-2.5 text-[0.84rem]">✉ bilgi@assid.org.tr</div>
        </div>
      </div>
      <div className="mx-auto flex w-[min(calc(100%-40px),1240px)] flex-col justify-between gap-5 border-t border-white/11 py-5 text-[0.76rem] sm:flex-row">
        <span>© 2026 ASSİD. Tüm hakları saklıdır.</span>
        <span>KVKK · Çerez Politikası · Gizlilik</span>
      </div>
    </footer>
  );
}
