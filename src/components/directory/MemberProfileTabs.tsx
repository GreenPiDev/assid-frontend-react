import { useState } from "react";
import type { Member } from "../../types";
import CompanyFeed from "./CompanyFeed";
import PortfolioGallery from "./PortfolioGallery";
import CompanyDocumentLinks from "./CompanyDocumentLinks";
import ContactInfo from "./ContactInfo";
import InfoRequestForm from "./InfoRequestForm";

const TABS = ["Gönderiler", "Portfolyo", "Dökümanlar", "İletişim", "Bilgi Talep Et"] as const;
type Tab = (typeof TABS)[number];

export default function MemberProfileTabs({ member }: { member: Member }) {
  const [activeTab, setActiveTab] = useState<Tab>("Gönderiler");

  return (
    <div>
      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-assid-line">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-none cursor-pointer whitespace-nowrap border-0 border-b-2 bg-transparent px-3.5 py-3 text-[0.86rem] transition duration-200 ${
              activeTab === tab
                ? "border-assid-green font-extrabold text-assid-ink"
                : "border-transparent font-bold text-assid-muted hover:text-assid-ink"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Gönderiler" && <CompanyFeed memberId={member.id} />}

      {activeTab === "Portfolyo" &&
        ((member.portfolioSlides?.length ?? 0) > 0 ? (
          <PortfolioGallery slides={member.portfolioSlides ?? []} />
        ) : (
          <p className="text-[0.9rem] text-assid-muted">Henüz portfolyo görseli paylaşılmamış.</p>
        ))}

      {activeTab === "Dökümanlar" &&
        ((member.companyDocuments?.length ?? 0) > 0 ? (
          <CompanyDocumentLinks documents={member.companyDocuments ?? []} />
        ) : (
          <p className="text-[0.9rem] text-assid-muted">Henüz döküman paylaşılmamış.</p>
        ))}

      {activeTab === "İletişim" && <ContactInfo contact={member.contact} />}

      {activeTab === "Bilgi Talep Et" && <InfoRequestForm memberId={member.id} />}
    </div>
  );
}
