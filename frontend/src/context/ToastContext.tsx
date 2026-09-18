import { createContext, useContext, useState, ReactNode } from 'react';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {toasts.map((toast) => (
          <div key={toast.id} className="animate-slide-up" style={{
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(16px)',
            border: `1px solid ${toast.type === 'success' ? 'var(--primary-light)' : toast.type === 'error' ? '#EF4444' : 'var(--border)'}`,
            padding: '16px 20px',
            borderRadius: 'var(--radius-md)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            minWidth: '300px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
          }}>
            {toast.type === 'success' && <CheckCircle2 size={20} color="var(--primary-light)" />}
            {toast.type === 'error' && <AlertCircle size={20} color="#EF4444" />}
            {toast.type === 'info' && <Info size={20} color="#60A5FA" />}
            
            <span style={{ flex: 1, fontSize: '0.95rem' }}>{toast.message}</span>
            
            <button onClick={() => removeToast(toast.id)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
