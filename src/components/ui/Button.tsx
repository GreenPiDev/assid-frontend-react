import type { ElementType, ReactNode } from "react";

const variants = {
  primary:
    "bg-assid-green text-white shadow-[0_8px_20px_rgba(18,58,99,0.22)] hover:-translate-y-0.5 hover:bg-assid-green-dark",
  outline:
    "border border-assid-line text-assid-green bg-transparent hover:border-assid-green hover:bg-white",
  light: "bg-white text-assid-green-dark",
};

interface ButtonProps {
  as?: ElementType;
  variant?: keyof typeof variants;
  className?: string;
  children?: ReactNode;
  [key: string]: unknown;
}

export default function Button({ as: As = "button", variant = "primary", className = "", children, ...props }: ButtonProps) {
  return (
    <As
      className={`inline-flex items-center justify-center gap-2.5 rounded-full px-5 py-4 text-[0.94rem] font-extrabold cursor-pointer transition duration-250 ease-out ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </As>
  );
}
