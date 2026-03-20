import { useToast } from '@/contexts/ToastContext';
import { X } from 'lucide-react';

const TYPE_STYLES: Record<string, { bg: string; border: string; color: string }> = {
  success: { bg: 'rgba(20,184,166,0.12)', border: 'rgba(20,184,166,0.4)', color: '#14b8a6' },
  error: { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.4)', color: '#ef4444' },
  info: { bg: 'rgba(124,58,237,0.12)', border: 'rgba(124,58,237,0.4)', color: '#7c3aed' },
  warning: { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.4)', color: '#f59e0b' },
};

export default function Toast() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      maxWidth: '380px',
      width: '100%',
      pointerEvents: 'none',
    }}>
      {toasts.map(toast => {
        const style = TYPE_STYLES[toast.type] || TYPE_STYLES.info;
        return (
          <div
            key={toast.id}
            style={{
              background: style.bg,
              border: `1px solid ${style.border}`,
              borderRadius: 'var(--radius-md, 8px)',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              backdropFilter: 'blur(12px)',
              pointerEvents: 'auto',
              animation: 'slideInRight 0.3s ease-out',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: 600, color: style.color, lineHeight: 1.4 }}>
              {toast.message}
            </span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: style.color, opacity: 0.7, padding: '2px',
                display: 'flex', alignItems: 'center', flexShrink: 0,
              }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
