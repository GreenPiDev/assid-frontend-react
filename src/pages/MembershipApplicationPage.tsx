import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {
  applyForMembership,
  type MembershipApplicationFiles,
  type MembershipApplicationPayload,
} from "../api/membershipApplication";
import Button from "../components/ui/Button";
import TagEditor from "../components/forms/TagEditor";
import LegalConsentBox from "../components/forms/LegalConsentBox";
import PhoneInput from "../components/forms/PhoneInput";
import { DateField } from "../components/forms/DateField";
import {
  businessActivityOptions,
  collectionTypeOptions,
  maritalStatusOptions,
  membershipTypeOptions,
} from "../constants/memberEnums";
import { SECTORS } from "../constants/sectors";
import { LOCATIONS } from "../constants/locations";
import { useToast } from "../context/ToastContext";
import { useOrganizationSettings } from "../api/resources/organizationSettings";
import { useMembershipFees } from "../api/resources/membershipFees";

function RequiredMark() {
  return (
    <span className="text-[#c0392b]" aria-hidden="true">
      {" "}
      *
    </span>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[0.78rem] font-bold text-assid-muted">
        {label}
        {required && <RequiredMark />}
      </span>
      {children}
    </label>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-[20px] border border-assid-line bg-white p-6 md:p-7">
      <h2 className="mb-5 text-[1.05rem] font-bold text-assid-ink">{title}</h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">{children}</div>
    </div>
  );
}

const inputClass =
  "rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50";

function formatCardNumber(digits: string) {
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatCardExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

function formatPhoneDigits(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  const p1 = digits.slice(0, 3);
  const p2 = digits.slice(3, 6);
  const p3 = digits.slice(6, 8);
  const p4 = digits.slice(8, 10);
  let out = "";
  if (p1) out += `(${p1}`;
  if (p1.length === 3) out += ")";
  if (p2) out += ` ${p2}`;
  if (p3) out += ` ${p3}`;
  if (p4) out += ` ${p4}`;
  return out;
}

const initialForm = {
  fullName: "",
  companyName: "",
  title: "",
  email: "",
  phone: "",
  mobilePhone: "",
  companyAddress: "",
  references: "",
  membershipType: "" as "" | "individual" | "corporate",
  birthPlace: "",
  birthDate: "",
  nationality: "",
  nationalId: "",
  maritalStatus: "",
  faxPhone: "",
  personalMobilePhone: "",
  affiliatedOrganizations: "",
  collectionType: "" as "" | "entry_fee" | "monthly_fee" | "both",
  autoDebitDate: "",
  autoDebitDayOfMonth: "",
  cardHolderName: "",
  cardNumber: "",
  cardExpiry: "",
  cardCvc: "",
};

const REQUIRED_DOCUMENTS = [
  "2 Adet Fotoğraf",
  "Adli Sicil Kaydı",
  "Kimlik Fotokopisi",
  "Ticaret Sicil Gazetesi (Kurumsal)",
  "Vergi Levhası (Kurumsal)",
  "İmza Sirküleri (Kurumsal)",
];

const initialFiles: MembershipApplicationFiles = {
  photos: [],
  criminalRecord: [],
  idCopy: [],
  tradeRegistryGazette: [],
  taxCertificate: [],
  signatureCircular: [],
};

export default function MembershipApplicationPage() {
  const showToast = useToast();
  const { data: settings } = useOrganizationSettings();
  const { data: membershipFees } = useMembershipFees();
  const [form, setForm] = useState(initialForm);
  const [sectors, setSectors] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [businessActivityTypes, setBusinessActivityTypes] = useState<string[]>([]);
  const [activityAreas, setActivityAreas] = useState<string[]>([]);
  const [productsAndServices, setProductsAndServices] = useState<string[]>([]);
  const [kvkkConsent, setKvkkConsent] = useState(false);
  const [bylawsAcknowledged, setBylawsAcknowledged] = useState(false);
  const [infoAccuracyConfirmed, setInfoAccuracyConfirmed] = useState(false);
  const [paymentConsent, setPaymentConsent] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  const applyMutation = useMutation({
    mutationFn: ({ payload, files: applicationFiles }: { payload: MembershipApplicationPayload; files: MembershipApplicationFiles }) =>
      applyForMembership(payload, applicationFiles),
  });

  function toggleSector(slug: string) {
    setSectors((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  }

  function toggleLocation(slug: string) {
    setLocations((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  }

  function toggleActivityType(value: string) {
    setBusinessActivityTypes((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (sectors.length === 0) {
      showToast("Lütfen en az bir sektör seçin.");
      return;
    }
    if ((settings?.requireKvkkConsent ?? true) && !kvkkConsent) {
      showToast("Devam etmek için KVKK metnini onaylamanız gerekiyor.");
      return;
    }
    if ((settings?.requireBylawsConsent ?? true) && !bylawsAcknowledged) {
      showToast("Devam etmek için dernek tüzüğünü onaylamanız gerekiyor.");
      return;
    }
    if (!infoAccuracyConfirmed) {
      showToast("Devam etmek için belirttiğiniz bilgilerin doğruluğunu onaylamanız gerekiyor.");
      return;
    }
    const hasCardInfo = Boolean(form.cardHolderName || form.cardNumber || form.cardExpiry || form.cardCvc);
    if (hasCardInfo && !paymentConsent) {
      showToast("Kart bilgisi girdiyseniz üyelik aidatının karttan çekilmesine rıza onayı zorunludur.");
      return;
    }
    try {
      const pdfBlob = await applyMutation.mutateAsync({
        payload: {
          fullName: form.fullName,
          companyName: form.companyName || undefined,
          title: form.title || undefined,
          email: form.email,
          phone: form.phone || undefined,
          mobilePhone: form.mobilePhone || undefined,
          companyAddress: form.companyAddress || undefined,
          sectors,
          locations: locations.length ? locations : undefined,
          businessActivityTypes: businessActivityTypes.length ? businessActivityTypes : undefined,
          references: form.references || undefined,
          membershipType: form.membershipType || undefined,
          birthPlace: form.birthPlace || undefined,
          birthDate: form.birthDate || undefined,
          nationality: form.nationality || undefined,
          nationalId: form.nationalId || undefined,
          maritalStatus: form.maritalStatus || undefined,
          faxPhone: form.faxPhone || undefined,
          personalMobilePhone: form.personalMobilePhone || undefined,
          affiliatedOrganizations: form.affiliatedOrganizations || undefined,
          activityAreas: activityAreas.length ? activityAreas : undefined,
          productsAndServices: productsAndServices.length ? productsAndServices : undefined,
          kvkkConsent,
          bylawsAcknowledged,
          infoAccuracyConfirmed,
          collectionType: form.collectionType || undefined,
          autoDebitDate: form.collectionType === "entry_fee" ? form.autoDebitDate || undefined : undefined,
          autoDebitDayOfMonth:
            form.collectionType === "monthly_fee" || form.collectionType === "both"
              ? form.autoDebitDayOfMonth
                ? Number(form.autoDebitDayOfMonth)
                : undefined
              : undefined,
          cardHolderName: form.cardHolderName || undefined,
          cardNumber: form.cardNumber || undefined,
          cardExpiry: form.cardExpiry || undefined,
          cardCvc: form.cardCvc || undefined,
          paymentConsent: hasCardInfo ? paymentConsent : undefined,
        },
        files: initialFiles,
      });

      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "assid-uyelik-basvuru-formu.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Otomatik indirme her cihaz/tarayıcıda güvenilir olmayabileceğinden
      // URL hemen serbest bırakılmıyor — "Başvurunuz alındı" ekranında
      // manuel bir indirme linki olarak da sunulabilsin diye saklanıyor.
      setPdfUrl(url);
      setIsSent(true);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Başvuru gönderilemedi.");
    }
  }

  if (isSent) {
    return (
      <main className="min-h-screen bg-[linear-gradient(160deg,#081a2c_0%,#0d2743_100%)] py-17 md:py-24">
        <div className="mx-auto w-[min(calc(100%-40px),720px)] rounded-[24px] border border-assid-line bg-white p-8 text-center md:p-12">
          <span className="text-[0.74rem] font-extrabold uppercase tracking-[.16em] text-assid-green">
            Üyelik Başvurusu
          </span>
          <h1 className="mt-3 text-[1.7rem] tracking-[-.03em] text-assid-ink">Başvurunuz alındı</h1>
          <p className="mt-3 text-[0.95rem] text-assid-muted">
            Başvurunuz ASSİD yönetimi tarafından incelenecek. Onaylandığında, panelinize giriş yapabilmeniz için size
            e-posta adresinize giriş bilgileri iletilecektir.
          </p>
          {settings?.address && (
            <p className="mt-4 rounded-[14px] border border-assid-line bg-assid-paper px-5 py-4 text-[0.88rem] text-assid-ink">
              İndirilen başvuru formunu imzalayıp ıslak imzalı olarak posta yoluyla{" "}
              <strong>{settings.address}</strong> adresine göndermeniz gerekmektedir.
            </p>
          )}
          {pdfUrl && (
            <p className="mt-3 text-[0.85rem] text-assid-muted">
              PDF cihazınıza otomatik inmediyse{" "}
              <a
                href={pdfUrl}
                download="assid-uyelik-basvuru-formu.pdf"
                className="font-bold text-assid-green hover:underline"
              >
                buraya tıklayıp indirebilirsiniz
              </a>
              .
            </p>
          )}
          <Button as={Link} to="/anasayfa" variant="primary" className="mt-6">
            Ana Sayfaya Dön
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(160deg,#081a2c_0%,#0d2743_100%)] py-17 md:py-24">
      <div className="mx-auto w-[min(calc(100%-40px),1320px)]">
        <div className="mb-8 max-w-2xl">

          <h1 className="mt-3 text-[clamp(1.8rem,3.2vw,2.6rem)] leading-[1.05] tracking-[-.03em] text-white">
            Üyelik Başvurusu
          </h1>
          <p className="mt-3 text-[0.95rem] text-white/75">
            Aşağıdaki formu eksiksiz olarak doldurmanızın ardından başvurunuz değerlendirmeye alınacak ve sonuç hakkında tarafınıza geri dönüş sağlanacaktır.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5">
          <div className="rounded-[20px] border border-assid-line bg-white p-6 md:p-7">
            <h2 className="mb-5 text-[1.05rem] font-bold text-assid-ink">Genel Bilgiler</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Ad Soyad" required>
                <input
                  required
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Şirket / Kurum Adı">
                <input
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Görevi / Ünvanı">
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Şirket / Kurum Adresi">
                  <textarea
                    rows={2}
                    value={form.companyAddress}
                    onChange={(e) => setForm({ ...form, companyAddress: e.target.value })}
                    className={inputClass}
                  />
                </Field>
              </div>
              <Field label="Telefon/Faks">
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="(---) --- -- --"
                  value={formatPhoneDigits(form.phone)}
                  onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                  className={inputClass}
                />
              </Field>
              <Field label="Cep Telefonu">
                <PhoneInput value={form.mobilePhone} onChange={(v) => setForm({ ...form, mobilePhone: v })} />
              </Field>
              <Field label="E-posta" required>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputClass}
                />
              </Field>
            </div>

            <h2 className="mb-5 mt-8 text-[1.05rem] font-bold text-assid-ink">Sektör ve Faaliyet Bilgileri</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <span className="mb-2 block text-[0.78rem] font-bold text-assid-muted">
                  Sektörler
                  <RequiredMark />
                </span>
                <div className="flex flex-wrap gap-2">
                  {SECTORS.map((sector) => (
                    <button
                      type="button"
                      key={sector.slug}
                      onClick={() => toggleSector(sector.slug)}
                      className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-[0.78rem] font-bold ${
                        sectors.includes(sector.slug)
                          ? "border-assid-green bg-assid-green text-white"
                          : "border-assid-line bg-transparent text-assid-ink"
                      }`}
                    >
                      {sector.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2">
                <span className="mb-2 block text-[0.78rem] font-bold text-assid-muted">Faaliyet Türleri</span>
                <div className="flex flex-wrap gap-2">
                  {businessActivityOptions.map((opt) => (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => toggleActivityType(opt.value)}
                      className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-[0.78rem] font-bold ${
                        businessActivityTypes.includes(opt.value)
                          ? "border-assid-green bg-assid-green text-white"
                          : "border-assid-line bg-transparent text-assid-ink"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2">
                <span className="mb-2 block text-[0.78rem] font-bold text-assid-muted">Alt Faaliyet Alanları</span>
                <TagEditor items={activityAreas} onChange={setActivityAreas} placeholder="Faaliyet alanı ekle..." />
              </div>

              <div className="sm:col-span-2">
                <span className="mb-2 block text-[0.78rem] font-bold text-assid-muted">Ürün ve Hizmetler</span>
                <TagEditor
                  items={productsAndServices}
                  onChange={setProductsAndServices}
                  placeholder="Ürün / hizmet ekle..."
                />
              </div>

              <div className="sm:col-span-2">
                <span className="mb-2 block text-[0.78rem] font-bold text-assid-muted">Referanslar</span>
                <textarea
                  rows={2}
                  value={form.references}
                  onChange={(e) => setForm({ ...form, references: e.target.value })}
                  className={`w-full ${inputClass}`}
                />
              </div>
            </div>
          </div>

          <Section title="Lokasyonlar">
            <div className="sm:col-span-2 flex flex-wrap gap-2">
              {LOCATIONS.map((loc) => (
                <button
                  type="button"
                  key={loc.slug}
                  onClick={() => toggleLocation(loc.slug)}
                  className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-[0.78rem] font-bold ${
                    locations.includes(loc.slug)
                      ? "border-assid-green bg-assid-green text-white"
                      : "border-assid-line bg-transparent text-assid-ink"
                  }`}
                >
                  {loc.name}
                </button>
              ))}
            </div>
          </Section>

          {(settings?.showMembershipClassSection ?? true) && (
          <Section title="Üyelik Sınıfı">
            <Field label="Üyelik Tipi">
              <select
                value={form.membershipType}
                onChange={(e) =>
                  setForm({ ...form, membershipType: e.target.value as "" | "individual" | "corporate" })
                }
                className={inputClass}
              >
                <option value="" disabled>
                  Seçiniz
                </option>
                {membershipTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Field>
            <div className="sm:col-span-2">
              <ul className="grid gap-2 text-[0.92rem] text-assid-muted">
                <li>* Sınıflandırma Yönetim Kurulu kriterlerine göre kesinleşir.</li>
                <li>
                  * Sektör durumu (Sektör İçi / Sektör Dışı) başvurunuz değerlendirilirken Yönetim Kurulu tarafından
                  belirlenir; bu formdan girilmez.
                </li>
              </ul>
            </div>
          </Section>
          )}

          <Section title="Kişisel Bilgiler">
            <Field label="Doğum Yeri">
              <input
                value={form.birthPlace}
                onChange={(e) => setForm({ ...form, birthPlace: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Doğum Tarihi">
              <DateField
                id="birthDate"
                value={form.birthDate}
                onChange={(v) => setForm({ ...form, birthDate: v })}
                className={inputClass}
              />
            </Field>
            <Field label="Uyruk">
              <input
                value={form.nationality}
                onChange={(e) => setForm({ ...form, nationality: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="TC Kimlik No">
              <input
                inputMode="numeric"
                maxLength={11}
                value={form.nationalId}
                onChange={(e) => setForm({ ...form, nationalId: e.target.value.replace(/\D/g, "").slice(0, 11) })}
                className={inputClass}
              />
            </Field>
            <Field label="Medeni Hal">
              <select
                value={form.maritalStatus}
                onChange={(e) => setForm({ ...form, maritalStatus: e.target.value })}
                className={inputClass}
              >
                <option value="">Seçiniz</option>
                {maritalStatusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Telefon / Faks">
              <input
                type="tel"
                inputMode="numeric"
                placeholder="(---) --- -- --"
                value={formatPhoneDigits(form.faxPhone)}
                onChange={(e) => setForm({ ...form, faxPhone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                className={inputClass}
              />
            </Field>
            <Field label="Cep Telefonu">
              <PhoneInput
                value={form.personalMobilePhone}
                onChange={(v) => setForm({ ...form, personalMobilePhone: v })}
              />
            </Field>
            <Field label="Üye Olduğu Oda veya Dernekler">
              <input
                value={form.affiliatedOrganizations}
                onChange={(e) => setForm({ ...form, affiliatedOrganizations: e.target.value })}
                className={inputClass}
              />
            </Field>
            <div className="sm:col-span-2">
              <label className="flex cursor-pointer items-center gap-2 text-[0.85rem] text-assid-ink">
                <input
                  type="checkbox"
                  checked={infoAccuracyConfirmed}
                  onChange={(e) => setInfoAccuracyConfirmed(e.target.checked)}
                />
                Belirttiğim bilgilerimin doğru olduğunu kabul ediyorum
                <RequiredMark />
              </label>
            </div>
          </Section>

          {(settings?.showMembershipFeesTable ?? true) && (
            <div className="rounded-[20px] border border-assid-line bg-white p-6 md:p-7">
              <h2 className="text-[1.05rem] font-bold text-assid-ink">Ücretler</h2>
              <p className="mb-5 mt-1 text-[0.78rem] text-assid-muted">Bilgilendirme Amaçlıdır</p>
              <div className="overflow-x-auto rounded-[12px] border border-assid-line">
                <table className="w-full min-w-[420px] border-collapse text-left text-[0.85rem]">
                  <thead>
                    <tr className="bg-assid-ink text-white">
                      <th className="px-4 py-3 font-bold">Üyelik Sınıfı</th>
                      <th className="px-4 py-3 font-bold">Tutar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(membershipFees ?? []).map((fee) => (
                      <tr key={fee._id} className="border-t border-assid-line">
                        <td className="px-4 py-3 font-bold text-assid-ink">{fee.label}</td>
                        <td className="px-4 py-3 font-bold text-assid-ink">{fee.amount.toLocaleString("tr-TR")}₺</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {(settings?.showAttachmentsSection ?? true) && (
            <Section title="Ekler">
              <div className="sm:col-span-2">
                <p className="mb-3 text-[0.88rem] text-assid-ink">
                  Aşağıdaki evrakları, başvuru formunu gönderdiğinizde oluşacak PDF çıktısıyla birlikte fiziksel
                  olarak derneğe ulaştırmanız gerekmektedir:
                </p>
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {REQUIRED_DOCUMENTS.map((doc) => (
                    <li key={doc} className="flex items-center gap-2 text-[0.88rem] text-assid-ink">
                      <span
                        aria-hidden="true"
                        className="inline-block h-4 w-4 shrink-0 rounded-[4px] border border-assid-line"
                      />
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>
            </Section>
          )}

          <Section title="Ödeme Tercihi (Opsiyonel)">
            <div className="sm:col-span-2">
              <p className="text-[0.85rem] text-assid-muted">
                Ödeme entegrasyonu bulunmamaktadır. Kart bilgilerinizi paylaşırsanız, üyelik aidatının çekimi ASSİD
                yönetimi tarafından manuel olarak gerçekleştirilir.
              </p>
            </div>
            <Field label="Tahsilat Türü">
              <select
                value={form.collectionType}
                onChange={(e) =>
                  setForm({ ...form, collectionType: e.target.value as typeof form.collectionType })
                }
                className={inputClass}
              >
                <option value="">Seçiniz</option>
                {collectionTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Field>
            {form.collectionType === "monthly_fee" || form.collectionType === "both" ? (
              <Field label="Otomatik Çekim Günü">
                <select
                  value={form.autoDebitDayOfMonth}
                  onChange={(e) => setForm({ ...form, autoDebitDayOfMonth: e.target.value })}
                  className={inputClass}
                >
                  <option value="">Seçiniz</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day}>
                      Her ayın {day}'i
                    </option>
                  ))}
                </select>
              </Field>
            ) : (
              <Field label="Otomatik Çekim Tarihi">
                <DateField
                  id="autoDebitDate"
                  value={form.autoDebitDate}
                  onChange={(v) => setForm({ ...form, autoDebitDate: v })}
                  className={inputClass}
                />
              </Field>
            )}
            <Field label="Kart Üzerindeki İsim">
              <input
                value={form.cardHolderName}
                onChange={(e) => setForm({ ...form, cardHolderName: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Kart Numarası">
              <input
                inputMode="numeric"
                value={formatCardNumber(form.cardNumber)}
                onChange={(e) =>
                  setForm({ ...form, cardNumber: e.target.value.replace(/[^0-9]/g, "").slice(0, 16) })
                }
                className={inputClass}
              />
            </Field>
            <Field label="Son Kullanma Tarihi (AA/YY)">
              <input
                placeholder="AA/YY"
                inputMode="numeric"
                value={form.cardExpiry}
                onChange={(e) => setForm({ ...form, cardExpiry: formatCardExpiry(e.target.value) })}
                className={inputClass}
              />
            </Field>
            <Field label="Güvenlik Kodu (CVC)">
              <input
                inputMode="numeric"
                maxLength={4}
                value={form.cardCvc}
                onChange={(e) => setForm({ ...form, cardCvc: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                className={inputClass}
              />
            </Field>
            <div className="sm:col-span-2">
              <label className="flex cursor-pointer items-center gap-2 text-[0.85rem] text-assid-ink">
                <input
                  type="checkbox"
                  checked={paymentConsent}
                  onChange={(e) => setPaymentConsent(e.target.checked)}
                />
                Üyelik aidatımın karttan çekilmesine rıza gösteriyorum
              </label>
            </div>
          </Section>

          {((settings?.showKvkkConsent ?? true) || (settings?.showBylawsConsent ?? true)) && (
            <Section title="Onaylar">
              {(settings?.showKvkkConsent ?? true) && (
                <LegalConsentBox
                  title="KVKK Aydınlatma Metni"
                  text={settings?.kvkkText ?? ""}
                  checked={kvkkConsent}
                  onChange={setKvkkConsent}
                  checkboxLabel={
                    <>
                      KVKK Aydınlatma Metni'ni okudum, anladım.
                      <RequiredMark />
                    </>
                  }
                />
              )}
              {(settings?.showBylawsConsent ?? true) && (
                <LegalConsentBox
                  title="Dernek Tüzüğü"
                  text={settings?.bylawsText ?? ""}
                  checked={bylawsAcknowledged}
                  onChange={setBylawsAcknowledged}
                  checkboxLabel={
                    <>
                      Dernek tüzüğünü okudum, anladım.
                      <RequiredMark />
                    </>
                  }
                />
              )}
            </Section>
          )}

          <div className="flex justify-end">
            <Button type="submit" variant="primary" disabled={applyMutation.isPending}>
              {applyMutation.isPending ? "Gönderiliyor..." : "Başvuruyu Gönder"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
