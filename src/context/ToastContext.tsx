import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

type ShowToast = (text: string) => void;

const ToastContext = createContext<ShowToast | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const showToast = useCallback<ShowToast>((text) => {
    setMessage(text);
    setVisible(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(false), 3200);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className={`fixed bottom-5.5 right-5.5 z-50 max-w-80 rounded-2xl bg-assid-green-dark px-4.5 py-3.5 text-[0.86rem] text-white shadow-card transition duration-350 ${
          visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-[150%] opacity-0"
        }`}
      >
        {message}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const showToast = useContext(ToastContext);
  if (!showToast) throw new Error("useToast, ToastProvider içinde kullanılmalı");
  return showToast;
}
