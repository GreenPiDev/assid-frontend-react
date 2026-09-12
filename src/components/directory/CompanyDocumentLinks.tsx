export default function CompanyDocumentLinks({ documents }: { documents: { label: string; url: string }[] }) {
  if (!documents || documents.length === 0) return <span>—</span>;

  return (
    <ul className="grid gap-2">
      {documents.map((doc) => (
        <li key={doc.url}>
          <a
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[0.95rem] font-bold text-assid-ink underline decoration-assid-ink/30 underline-offset-4 transition duration-200 hover:text-assid-green hover:decoration-current"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
            </svg>
            {doc.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
