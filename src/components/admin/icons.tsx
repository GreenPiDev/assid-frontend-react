type IconProps = { className?: string };

const base = "h-5 w-5";

export function MenuIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={className}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export function CloseIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={className}>
      <line x1="5" y1="5" x2="19" y2="19" />
      <line x1="19" y1="5" x2="5" y2="19" />
    </svg>
  );
}

export function UserIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20v-1.2A4.8 4.8 0 0 1 9.8 14h4.4A4.8 4.8 0 0 1 19 18.8V20" />
    </svg>
  );
}

export function UsersIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M17 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 5 18.5V20" />
      <circle cx="9.5" cy="8" r="3.25" />
      <path d="M19.5 20v-1.5a3.2 3.2 0 0 0-2.2-3.03" />
      <path d="M15 5.13a3.25 3.25 0 0 1 0 6.24" />
    </svg>
  );
}

export function CalendarIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <line x1="3.5" y1="10" x2="20.5" y2="10" />
      <line x1="8" y1="3" x2="8" y2="7" />
      <line x1="16" y1="3" x2="16" y2="7" />
    </svg>
  );
}

export function NewsIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <line x1="7" y1="9" x2="17" y2="9" />
      <line x1="7" y1="13" x2="17" y2="13" />
      <line x1="7" y1="17" x2="13" y2="17" />
    </svg>
  );
}

export function SettingsIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  );
}

export function BuildingIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="4" y="3" width="12" height="18" rx="1.5" />
      <path d="M16 9.5h3.5A1.5 1.5 0 0 1 21 11v8.5a.5.5 0 0 1-.5.5H16" />
      <line x1="7.5" y1="7" x2="7.5" y2="7.01" />
      <line x1="12.5" y1="7" x2="12.5" y2="7.01" />
      <line x1="7.5" y1="11" x2="7.5" y2="11.01" />
      <line x1="12.5" y1="11" x2="12.5" y2="11.01" />
      <line x1="7.5" y1="15" x2="7.5" y2="15.01" />
      <line x1="12.5" y1="15" x2="12.5" y2="15.01" />
      <path d="M9 21v-3.5h2V21" />
    </svg>
  );
}

export function UserCogIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="9.5" cy="7.5" r="3.25" />
      <path d="M3.5 20v-1.5A3.5 3.5 0 0 1 7 15h2" />
      <circle cx="17.5" cy="16.5" r="2.75" />
      <path d="M17.5 12.5v.9M17.5 19.6v.9M13.9 16.5h.9M20.1 16.5h.9M14.9 13.9l.65.65M19.45 18.45l.65.65M14.9 19.1l.65-.65M19.45 14.55l.65-.65" />
    </svg>
  );
}

export function LogoutIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15.5 17.5 21 12l-5.5-5.5" />
      <line x1="21" y1="12" x2="9" y2="12" />
      <path d="M9 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4" />
    </svg>
  );
}

export function PencilIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

export function TrashIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 7h16" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      <path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" />
    </svg>
  );
}

export function CheckIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function BanIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <line x1="6.3" y1="6.3" x2="17.7" y2="17.7" />
    </svg>
  );
}

export function KeyIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="8" cy="15.5" r="4" />
      <path d="M11 12.5 20 3.5" />
      <path d="M16.5 7 19 9.5" />
      <path d="M14 9.5 16.2 11.7" />
    </svg>
  );
}

export function ListIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="4.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="17.5" r="1" fill="currentColor" stroke="none" />
      <line x1="8.5" y1="6.5" x2="20.5" y2="6.5" />
      <line x1="8.5" y1="12" x2="20.5" y2="12" />
      <line x1="8.5" y1="17.5" x2="20.5" y2="17.5" />
    </svg>
  );
}

export function ArrowLeftIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="11 6 5 12 11 18" />
    </svg>
  );
}

export function ChevronDownIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function FolderIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3.5 6.5a1.5 1.5 0 0 1 1.5-1.5h4.2l2 2H19a1.5 1.5 0 0 1 1.5 1.5v8.5A1.5 1.5 0 0 1 19 18.5H5A1.5 1.5 0 0 1 3.5 17Z" />
    </svg>
  );
}

export function PlusIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={className}>
      <line x1="12" y1="4" x2="12" y2="20" />
      <line x1="4" y1="12" x2="20" y2="12" />
    </svg>
  );
}
