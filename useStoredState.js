import { useEffect, useState } from "react";

/**
 * useState that also saves to this browser's localStorage.
 * Nothing leaves the student's device. Falls back to plain state if storage is blocked.
 */
export function useStoredState(key, initial, clean = (v) => v) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) return clean(JSON.parse(raw));
    } catch {
      /* storage blocked or bad data: use the default */
    }
    return typeof initial === "function" ? initial() : initial;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage blocked: keep working without saving */
    }
  }, [key, value]);

  return [value, setValue];
}
