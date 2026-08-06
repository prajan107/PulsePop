import React, { useEffect, useState } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
}

export const toast = {
  listeners: [] as ((message: ToastMessage) => void)[],
  show(message: Omit<ToastMessage, 'id'>) {
    const fullMessage = { ...message, id: Math.random().toString(36).substring(2, 9) };
    this.listeners.forEach((listener) => listener(fullMessage));
  },
  success(message: string, title?: string) {
    this.show({ type: 'success', message, title });
  },
  error(message: string, title?: string) {
    this.show({ type: 'error', message, title });
  },
  warning(message: string, title?: string) {
    this.show({ type: 'warning', message, title });
  },
  info(message: string, title?: string) {
    this.show({ type: 'info', message, title });
  },
  subscribe(listener: (message: ToastMessage) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  },
};

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const unsubscribe = toast.subscribe((newToast) => {
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 4000);
    });

    const handleUnauthorized = () => {
      toast.error('Session expired or unauthorized. Please sign in again.');
    };

    window.addEventListener('pulsepop:unauthorized', handleUnauthorized);

    return () => {
      unsubscribe();
      window.removeEventListener('pulsepop:unauthorized', handleUnauthorized);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((item) => (
        <div
          key={item.id}
          className={cn(
            'pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-xl transition-all duration-300 backdrop-blur-lg animate-in slide-in-from-bottom-5 text-xs',
            item.type === 'error' && 'border-[#EF4444]/30 bg-[#111827]/95 text-[#F8FAFC]',
            item.type === 'success' && 'border-[#10B981]/30 bg-[#111827]/95 text-[#F8FAFC]',
            item.type === 'warning' && 'border-[#F59E0B]/30 bg-[#111827]/95 text-[#F8FAFC]',
            item.type === 'info' && 'border-[#6366F1]/30 bg-[#111827]/95 text-[#F8FAFC]'
          )}
        >
          {item.type === 'error' && <AlertCircle className="h-5 w-5 text-[#EF4444] shrink-0 mt-0.5" />}
          {item.type === 'success' && <CheckCircle className="h-5 w-5 text-[#10B981] shrink-0 mt-0.5" />}
          {item.type === 'warning' && <AlertTriangle className="h-5 w-5 text-[#F59E0B] shrink-0 mt-0.5" />}
          {item.type === 'info' && <Info className="h-5 w-5 text-[#6366F1] shrink-0 mt-0.5" />}

          <div className="flex-1 space-y-1">
            {item.title && <h5 className="font-bold leading-none text-white">{item.title}</h5>}
            <p className="text-[#CBD5E1]">{item.message}</p>
          </div>

          <button
            onClick={() => removeToast(item.id)}
            className="text-[#94A3B8] hover:text-white p-1 rounded-md transition-colors"
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
