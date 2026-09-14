import { useEffect, useRef, type RefObject } from "react";

export function useOutsideClick<T extends HTMLElement>(onOutside: () => void): RefObject<T | null> {
  const ref = useRef<T>(null);
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) onOutside();
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [onOutside]);
  return ref;
}
