import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { scrollToId } from "../../utils/scroll";
import { useOrganizationSettings } from "../../api/resources/organizationSettings";
import TextModal from "../ui/TextModal";

type LegalModalKey = "kvkk" | "cookies" | "privacy";

const corporateLinks = ["Hakkımızda", "Yönetim Kurulu", "Faaliyetler", "Basın Merkezi"];

export function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M13.5 21v-7.6h2.6l.4-3h-3v-1.9c0-.9.25-1.5 1.55-1.5h1.65V4.3c-.3-.05-1.25-.13-2.37-.13-2.35 0-3.96 1.43-3.96 4.06v2.27H7.75v3h2.66V21h3.09Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M18.9 3h3.1l-6.77 7.74L23.2 21h-6.24l-4.89-6.4-5.59 6.4H3.36l7.24-8.28L2.8 3h6.4l4.42 5.85L18.9 3Zm-1.09 16.17h1.72L8.28 4.73H6.43l11.38 14.44Z" />
    </svg>
  );
}

export function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M6.94 8.5H3.56V21h3.38V8.5ZM5.25 3.25a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92ZM20.44 21h-3.38v-6.4c0-1.53-.03-3.49-2.13-3.49-2.14 0-2.47 1.67-2.47 3.38V21H9.08V8.5h3.24v1.71h.05c.45-.85 1.56-1.75 3.21-1.75 3.43 0 4.86 2.26 4.86 5.98V21Z" />
    </svg>
  );
}

export default function Footer() {
  const { data: settings } = useOrganizationSettings();
  const [openModal, setOpenModal] = useState<LegalModalKey | null>(null);
  const navigate = useNavigate();

  const legalModals: Record<LegalModalKey, { title: string; text: string }> = {
    kvkk: { title: "KVKK Aydınlatma Metni", text: settings?.kvkkText ?? "" },
    cookies: { title: "Çerez Politikası", text: settings?.cookiePolicyText ?? "" },
    privacy: { title: "Gizlilik Politikası", text: settings?.privacyPolicyText ?? "" },
  };

  const socialPlatforms = [
    { key: "instagram", label: "Instagram", url: settings?.socialLinks?.instagram, Icon: InstagramIcon },
    { key: "facebook", label: "Facebook", url: settings?.socialLinks?.facebook, Icon: FacebookIcon },
    // { key: "twitter", label: "X", url: settings?.socialLinks?.twitter, Icon: XIcon },
    { key: "linkedin", label: "LinkedIn", url: settings?.socialLinks?.linkedin, Icon: LinkedInIcon },
  ];

  return (
    <footer className="bg-[#0a2540] pt-16 text-white/74">
      <div className="mx-auto grid w-[min(calc(100%-40px),1240px)] grid-cols-1 gap-7 pb-12 sm:grid-cols-3 lg:grid-cols-[1.2fr_.7fr_.7fr_1fr]">
        <div className="sm:col-span-3 lg:col-span-1">
          <button type="button" className="flex cursor-pointer flex-col items-start gap-2.5 border-0 bg-transparent p-0 text-left text-white" onClick={() => navigate("/")}>
            {settings?.logo && <img src={settings.logo} alt={settings.shortName || settings.name || "Logo"} className="h-[43px] w-auto object-contain" />}
            <span>
              <b className="block text-base leading-none tracking-tight">{settings?.shortName}</b>
              <small className="mt-1 block text-[0.58rem] tracking-wide text-white/55">
                {settings?.name}
              </small>
            </span>
          </button>
          <p className="my-4 max-w-[310px] text-[0.86rem]">
            {settings?.description}
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-[0.79rem] tracking-wide text-assid-lime uppercase">Kurumsal</h4>
          <ul className="grid gap-2 text-[0.84rem]">
            {corporateLinks.map((label) => (
              <li key={label}>
                <button type="button" className="cursor-pointer border-0 bg-transparent p-0 text-left hover:text-white">{label}</button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-[0.79rem] tracking-wide text-assid-lime uppercase">Platform</h4>
          <ul className="grid gap-2 text-[0.84rem]">
            <li><button type="button" className="cursor-pointer border-0 bg-transparent p-0 text-left hover:text-white" onClick={() => scrollToId("firma-rehberi")}>Firma Rehberi</button></li>
            <li><button type="button" className="cursor-pointer border-0 bg-transparent p-0 text-left hover:text-white" onClick={() => scrollToId("etkinlikler")}>Etkinlikler</button></li>
          </ul>
        </div>
        <div id="iletisim">
          <h4 className="mb-3 text-[0.79rem] tracking-wide text-assid-lime uppercase">İletişim</h4>
          {settings?.address && (
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(settings.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-2.5 flex text-[0.84rem] hover:text-white"
            >
              {settings.address}
            </a>
          )}
          {settings?.phone && (
            <div className="mb-2.5 flex text-[0.84rem]">{settings.phone}</div>
          )}
          {settings?.email && (
            <a
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(settings.email)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-2.5 flex text-[0.84rem] hover:text-white"
            >
              {settings.email}
            </a>
          )}
          <div className="mt-3 flex gap-2.5">
            {socialPlatforms.map(({ key, label, url, Icon }) =>
              url ? (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/74 transition-colors hover:border-assid-lime hover:text-assid-lime"
                >
                  <Icon />
                </a>
              ) : (
                <span
                  key={key}
                  aria-hidden="true"
                  className="grid h-9 w-9 cursor-not-allowed place-items-center rounded-full border border-white/8 text-white/25"
                >
                  <Icon />
                </span>
              ),
            )}
          </div>
        </div>
      </div>
      <div className="mx-auto flex w-[min(calc(100%-40px),1240px)] flex-col justify-between gap-5 border-t border-white/11 py-5 text-[0.76rem] sm:flex-row">
        <span>{settings?.footerText}</span>
        <span className="flex gap-1.5">
          <button type="button" className="cursor-pointer border-0 bg-transparent p-0 text-inherit hover:text-white" onClick={() => setOpenModal("kvkk")}>KVKK</button>
          ·
          <button type="button" className="cursor-pointer border-0 bg-transparent p-0 text-inherit hover:text-white" onClick={() => setOpenModal("cookies")}>Çerez Politikası</button>
          ·
          <button type="button" className="cursor-pointer border-0 bg-transparent p-0 text-inherit hover:text-white" onClick={() => setOpenModal("privacy")}>Gizlilik</button>
        </span>
      </div>
      {openModal && (
        <TextModal
          title={legalModals[openModal].title}
          text={legalModals[openModal].text}
          onClose={() => setOpenModal(null)}
        />
      )}
    </footer>
  );
}
