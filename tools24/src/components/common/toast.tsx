"use client";

import { useState, useEffect, useCallback, createContext, useContext } from "react";

interface ToastState {
  message: string;
  visible: boolean;
}

interface ToastContextValue {
  show: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue>({ show: () => {} });

export function useToast(): ToastContextValue {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [toast, setToast] = useState<ToastState>({ message: "", visible: false });

  const show = useCallback((message: string): void => {
    setToast({ message, visible: true });
  }, []);

  useEffect(() => {
    if (!toast.visible) return;
    const timer = setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 2000);
    return () => clearTimeout(timer);
  }, [toast.visible]);

  return (
    <ToastContext value={{ show }}>
      {children}
      {toast.visible && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl border bg-card px-4 py-3 text-sm shadow-lg animate-in slide-in-from-bottom-4 fade-in duration-200">
          {toast.message}
        </div>
      )}
    </ToastContext>
  );
}
