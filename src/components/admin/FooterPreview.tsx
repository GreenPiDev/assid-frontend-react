import { FacebookIcon, InstagramIcon, LinkedInIcon } from "../layout/Footer";

interface FooterPreviewProps {
  logoUrl?: string;
  shortName: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  footerText: string;
  instagram: string;
  facebook: string;
  linkedin: string;
}

const socialIconMap = [
  { key: "instagram", label: "Instagram", Icon: InstagramIcon },
  { key: "facebook", label: "Facebook", Icon: FacebookIcon },
  { key: "linkedin", label: "LinkedIn", Icon: LinkedInIcon },
] as const;

export default function FooterPreview(props: FooterPreviewProps) {
  const socials = { instagram: props.instagram, facebook: props.facebook, linkedin: props.linkedin };

  return (
    <div className="overflow-hidden rounded-[20px] border border-assid-line">
      <div className="border-b border-assid-line bg-assid-paper px-4 py-2 text-[0.72rem] font-bold uppercase tracking-wide text-assid-muted">
        Footer Önizlemesi
      </div>
      <div className="bg-[#0a2540] px-6 py-8 text-white/74 sm:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="flex flex-col items-start gap-2 sm:col-span-1">
            {props.logoUrl && <img src={props.logoUrl} alt="" className="h-9 w-auto object-contain" />}
            <span>
              <b className="block text-[0.9rem] leading-none tracking-tight text-white">{props.shortName || "—"}</b>
              <small className="mt-1 block text-[0.5rem] tracking-wide text-white/55">{props.name || "—"}</small>
            </span>
            <p className="max-w-[260px] text-[0.76rem]">{props.description || "—"}</p>
          </div>
          <div className="sm:col-span-2">
            <h4 className="mb-2 text-[0.72rem] tracking-wide text-assid-lime uppercase">İletişim</h4>
            <div className="text-[0.76rem]">{props.address || "—"}</div>
            <div className="text-[0.76rem]">{props.phone || "—"}</div>
            <div className="text-[0.76rem]">{props.email || "—"}</div>
            <div className="mt-2.5 flex gap-2">
              {socialIconMap.map(({ key, label, Icon }) => {
                const url = socials[key];
                return url ? (
                  <span
                    key={key}
                    aria-label={label}
                    className="grid h-7 w-7 place-items-center rounded-full border border-white/15 text-white/74"
                  >
                    <Icon />
                  </span>
                ) : (
                  <span
                    key={key}
                    aria-hidden="true"
                    className="grid h-7 w-7 place-items-center rounded-full border border-white/8 text-white/25"
                  >
                    <Icon />
                  </span>
                );
              })}
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-col justify-between gap-3 border-t border-white/11 pt-4 text-[0.7rem] sm:flex-row">
          <span>{props.footerText || "—"}</span>
          <span className="flex gap-1.5">
            <span>KVKK</span>·<span>Çerez Politikası</span>·<span>Gizlilik</span>
          </span>
        </div>
      </div>
    </div>
  );
}
