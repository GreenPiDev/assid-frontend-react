import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { applyForMembership, type MembershipApplicationFiles } from "../api/membershipApplication";
import Button from "../components/ui/Button";
import TagEditor from "../components/forms/TagEditor";
import FileUploadField from "../components/forms/FileUploadField";
import LegalConsentBox from "../components/forms/LegalConsentBox";
import {
  businessActivityOptions,
  contactPreferenceOptions,
  membershipTypeOptions,
  sectorStatusOptions,
} from "../constants/memberEnums";
import { SECTORS } from "../constants/sectors";
import { useToast } from "../context/ToastContext";
import { useOrganizationSettings } from "../api/resources/organizationSettings";

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
  sectorStatus: "",
  birthPlace: "",
  birthDate: "",
  nationality: "",
  maritalStatus: "",
  affiliatedOrganizations: "",
  contactPreference: "",
};

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
  const [form, setForm] = useState(initialForm);
  const [sectors, setSectors] = useState<string[]>([]);
  const [businessActivityTypes, setBusinessActivityTypes] = useState<string[]>([]);
  const [activityAreas, setActivityAreas] = useState<string[]>([]);
  const [productsAndServices, setProductsAndServices] = useState<string[]>([]);
  const [files, setFiles] = useState<MembershipApplicationFiles>(initialFiles);
  const [kvkkConsent, setKvkkConsent] = useState(false);
  const [bylawsAcknowledged, setBylawsAcknowledged] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const isCorporate = form.membershipType === "corporate";

  function toggleSector(slug: string) {
    setSectors((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
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
    if (!form.membershipType) {
      showToast("Lütfen üyelik tipini seçin.");
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
    setIsSubmitting(true);
    try {
      await applyForMembership(
        {
          fullName: form.fullName,
          companyName: form.companyName || undefined,
          title: form.title || undefined,
          email: form.email,
          phone: form.phone || undefined,
          mobilePhone: form.mobilePhone || undefined,
          companyAddress: form.companyAddress || undefined,
          sectors,
          businessActivityTypes: businessActivityTypes.length ? businessActivityTypes : undefined,
          references: form.references || undefined,
          membershipType: form.membershipType,
          sectorStatus: form.sectorStatus || undefined,
          birthPlace: form.birthPlace || undefined,
          birthDate: form.birthDate || undefined,
          nationality: form.nationality || undefined,
          maritalStatus: form.maritalStatus || undefined,
          affiliatedOrganizations: form.affiliatedOrganizations || undefined,
          contactPreference: form.contactPreference || undefined,
          activityAreas: activityAreas.length ? activityAreas : undefined,
          productsAndServices: productsAndServices.length ? productsAndServices : undefined,
          kvkkConsent,
          bylawsAcknowledged,
        },
        files,
      );
      setIsSent(true);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Başvuru gönderilemedi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSent) {
    return (
      <main className="py-17 md:py-24">
        <div className="mx-auto w-[min(calc(100%-40px),720px)] rounded-[24px] border border-assid-line bg-white p-8 text-center md:p-12">
          <span className="text-[0.74rem] font-extrabold uppercase tracking-[.16em] text-assid-green">
            Üyelik Başvurusu
          </span>
          <h1 className="mt-3 text-[1.7rem] tracking-[-.03em] text-assid-ink">Başvurunuz alındı</h1>
          <p className="mt-3 text-[0.95rem] text-assid-muted">
            Başvurunuz ASSİD yönetimi tarafından incelenecek. Onaylandığında, panelinize giriş yapabilmeniz için size
            e-posta adresinize giriş bilgileri iletilecektir.
          </p>
          <Button as={Link} to="/" variant="primary" className="mt-6">
            Ana Sayfaya Dön
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="py-17 md:py-24">
      <div className="mx-auto w-[min(calc(100%-40px),1320px)]">
        <div className="mb-8 max-w-2xl">

          <h1 className="mt-3 text-[clamp(1.8rem,3.2vw,2.6rem)] leading-[1.05] tracking-[-.03em] text-assid-ink">
            Üyelik Başvurusu
          </h1>
          <p className="mt-3 text-[0.95rem] text-[#5d665f]">
            Aşağıdaki formu eksiksiz olarak doldurmanızın ardından başvurunuz değerlendirmeye alınacak ve sonuç hakkında tarafınıza geri dönüş sağlanacaktır.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5">
          <Section title="Genel Bilgiler">
            <Field label="Ad Soyad" required>
              <input
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Firma Adı">
              <input
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Unvan">
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={inputClass}
              />
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
            <Field label="Telefon">
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Cep Telefonu">
              <input
                value={form.mobilePhone}
                onChange={(e) => setForm({ ...form, mobilePhone: e.target.value })}
                className={inputClass}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Firma Adresi">
                <textarea
                  rows={2}
                  value={form.companyAddress}
                  onChange={(e) => setForm({ ...form, companyAddress: e.target.value })}
                  className={inputClass}
                />
              </Field>
            </div>
          </Section>

          <Section title="Sektör ve Faaliyet Bilgileri">
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
          </Section>

          <Section title="Üyelik Sınıfı">
            <Field label="Üyelik Tipi" required>
              <select
                required
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
            <Field label="Sektör Durumu">
              <select
                value={form.sectorStatus}
                onChange={(e) => setForm({ ...form, sectorStatus: e.target.value })}
                className={inputClass}
              >
                <option value="">Seçiniz</option>
                {sectorStatusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Field>
          </Section>

          <Section title="Kişisel Bilgiler">
            <Field label="Doğum Yeri">
              <input
                value={form.birthPlace}
                onChange={(e) => setForm({ ...form, birthPlace: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Doğum Tarihi">
              <input
                type="date"
                value={form.birthDate}
                onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
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
            <Field label="Medeni Hal">
              <input
                value={form.maritalStatus}
                onChange={(e) => setForm({ ...form, maritalStatus: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Bağlı Olduğu Kuruluşlar">
              <input
                value={form.affiliatedOrganizations}
                onChange={(e) => setForm({ ...form, affiliatedOrganizations: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="İletişim Tercihi">
              <select
                value={form.contactPreference}
                onChange={(e) => setForm({ ...form, contactPreference: e.target.value })}
                className={inputClass}
              >
                <option value="">Seçiniz</option>
                {contactPreferenceOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Field>
          </Section>

          <Section title="Ekler">
            <FileUploadField
              label="Fotoğraf (en fazla 2 adet)"
              hint="PNG, JPEG veya WEBP"
              files={files.photos ?? []}
              onChange={(f) => setFiles({ ...files, photos: f })}
              multiple
            />
            <FileUploadField
              label="Kimlik Fotokopisi"
              hint="PNG, JPEG veya PDF"
              files={files.idCopy ?? []}
              onChange={(f) => setFiles({ ...files, idCopy: f })}
            />
            <FileUploadField
              label="Adli Sicil Kaydı"
              hint="PNG, JPEG veya PDF"
              files={files.criminalRecord ?? []}
              onChange={(f) => setFiles({ ...files, criminalRecord: f })}
            />
            {isCorporate && (
              <>
                <FileUploadField
                  label="Ticaret Sicil Gazetesi"
                  hint="Kurumsal üyelik için — PNG, JPEG veya PDF"
                  files={files.tradeRegistryGazette ?? []}
                  onChange={(f) => setFiles({ ...files, tradeRegistryGazette: f })}
                />
                <FileUploadField
                  label="Vergi Levhası"
                  hint="Kurumsal üyelik için — PNG, JPEG veya PDF"
                  files={files.taxCertificate ?? []}
                  onChange={(f) => setFiles({ ...files, taxCertificate: f })}
                />
                <FileUploadField
                  label="İmza Sirküleri"
                  hint="Kurumsal üyelik için — PNG, JPEG veya PDF"
                  files={files.signatureCircular ?? []}
                  onChange={(f) => setFiles({ ...files, signatureCircular: f })}
                />
              </>
            )}
          </Section>

          {((settings?.showKvkkConsent ?? true) || (settings?.showBylawsConsent ?? true)) && (
            <Section title="Onaylar">
              {(settings?.showKvkkConsent ?? true) && (
                <LegalConsentBox
                  title="KVKK Aydınlatma Metni"
                  text={settings?.kvkkText ?? ""}
                  checked={kvkkConsent}
                  onChange={setKvkkConsent}
                  checkboxLabel="KVKK Aydınlatma Metni'ni okudum, anladım."
                />
              )}
              {(settings?.showBylawsConsent ?? true) && (
                <LegalConsentBox
                  title="Dernek Tüzüğü"
                  text={settings?.bylawsText ?? ""}
                  checked={bylawsAcknowledged}
                  onChange={setBylawsAcknowledged}
                  checkboxLabel="Dernek tüzüğünü okudum, anladım."
                />
              )}
            </Section>
          )}

          <div className="flex justify-end">
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Gönderiliyor..." : "Başvuruyu Gönder"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
