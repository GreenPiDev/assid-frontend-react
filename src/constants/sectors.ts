// Sektörler backend'de admin tarafından yönetilen bir veri değil, sistemde
// sabit bir enum'dur (üye başvuru formunda seçilen sabit liste ile birebir
// aynı olmalı). Bu yüzden API'den çekilmez, frontend'de sabit tutulur.
// Üye kayıtları (bkz. api/resources/members.js) bu slug'lara referans verir.
import type { Sector } from "../types";

export const SECTORS: Sector[] = [
  { slug: "mobilya-ve-dekorasyon", name: "Mobilya ve Dekorasyon", image: "/sektor-resimleri/mobilya-ve-dekorasyon.jpg", pin: { left: "39.6%", top: "17.6%" } },
  { slug: "insaat-ve-yapi", name: "İnşaat ve Yapı", image: "/sektor-resimleri/insaat-ve-yapi.webp", pin: { left: "7.8%", top: "24.1%" } },
  { slug: "mimarlik-ve-tasarim", name: "Mimarlık ve Tasarım", image: "/sektor-resimleri/mimarlik-ve-tasarim.jpg", pin: { left: "23.4%", top: "21.3%" } },
  { slug: "uretim-ve-sanayi", name: "Üretim ve Sanayi", image: "/sektor-resimleri/uretim-ve-sanayi.webp", pin: { left: "54.2%", top: "26.9%" } },
  { slug: "metal-ve-makine", name: "Metal ve Makine", image: "/sektor-resimleri/metal-ve-makine.jpg", pin: { left: "56.8%", top: "14.8%" } },
  { slug: "tekstil-ve-ev-tekstili", name: "Tekstil ve Ev Tekstili", image: "/sektor-resimleri/tekstil-ve-ev-tekstili.jpg", pin: { left: "71.9%", top: "19%" } },
  { slug: "ticaret-ve-dis-ticaret", name: "Ticaret ve Dış Ticaret", image: "/sektor-resimleri/ticaret-ve-dis-ticaret.jpg", pin: { left: "32.6%", top: "42.1%" } },
  { slug: "reklam-medya-ve-matbaa", name: "Reklam, Medya ve Matbaa", image: "/sektor-resimleri/reklam-medya-matbaa.jpg", pin: { left: "12.5%", top: "46.8%" } },
  { slug: "otomotiv", name: "Otomotiv", image: "/sektor-resimleri/otomotiv.jpg", pin: { left: "21.9%", top: "60.2%" } },
  { slug: "lojistik-ve-tasimacilik", name: "Lojistik ve Taşımacılık", image: "/sektor-resimleri/lojistik-ve-tasimacilik.jpg", pin: { left: "72.4%", top: "41.7%" } },
  { slug: "gayrimenkul-ve-finans", name: "Gayrimenkul ve Finans", image: "/sektor-resimleri/gayrimenkul-ve-finans.webp", pin: { left: "56.8%", top: "54.6%" } },
  { slug: "bilisim-ve-teknoloji", name: "Bilişim ve Teknoloji", image: "/sektor-resimleri/bilisim-ve-teknoloji.png", pin: { left: "46.4%", top: "38.9%" } },
  { slug: "gida-turizm-ve-hizmet", name: "Gıda, Turizm ve Hizmet", image: "/sektor-resimleri/gıda-turizm-ve-hizmet.jpg", pin: { left: "39.1%", top: "72.2%" } },
  { slug: "saglik-ve-profesyonel-hizmetler", name: "Sağlık ve Profesyonel Hizmetler", image: "/sektor-resimleri/saglik-ve-profesyonel-hizmetler.jpeg", pin: { left: "82.3%", top: "55.6%" } },
];
