import { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';

interface UAEPassOverlayProps {
  onComplete: (user: { name: string; emiratesId: string }) => void;
  onClose: () => void;
  userName?: string;
}

export default function UAEPassOverlay({ onComplete, onClose, userName }: UAEPassOverlayProps) {
  const [phase, setPhase] = useState<'authenticating' | 'verified'>('authenticating');
  const [dots, setDots] = useState('');

  const displayName = userName || 'Ahmed Al Maktoum';
  const maskedId = '784-****-*****-1';

  // Animate dots during authenticating phase
  useEffect(() => {
    if (phase !== 'authenticating') return;
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 400);
    return () => clearInterval(interval);
  }, [phase]);

  // Auto-transition to verified after 2s
  useEffect(() => {
    const timer = setTimeout(() => setPhase('verified'), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{ background: 'rgba(0,0,0,0.7)' }}
    >
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '420px', textAlign: 'center', padding: '2.5rem 2rem' }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '1rem', right: '1rem',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', display: 'flex',
          }}
        >
          <X size={18} />
        </button>

        {/* UAE PASS wordmark */}
        <div style={{
          fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.05em',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          UAE PASS
        </div>

        {phase === 'authenticating' && (
          <div>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              margin: '0 auto 1.5rem',
              border: '3px solid rgba(20,184,166,0.3)',
              borderTopColor: '#14b8a6',
              animation: 'spin 1s linear infinite',
            }} />
            <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Authenticating with UAE PASS{dots}
            </p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Verifying your Emirates ID
            </p>
          </div>
        )}

        {phase === 'verified' && (
          <div>
            {/* Green shield */}
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              margin: '0 auto 1.25rem',
              background: 'rgba(34,197,94,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ShieldCheck size={36} style={{ color: '#22c55e' }} />
            </div>

            <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.125rem' }}>
              Emirates ID Verified
            </h3>

            <p style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              {displayName}
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem', fontFamily: 'monospace' }}>
              {maskedId}
            </p>

            {/* Tier 2 Gold badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
              padding: '0.375rem 0.75rem', borderRadius: '999px',
              background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
              fontSize: '0.75rem', fontWeight: 700, color: '#22c55e',
              marginBottom: '1.5rem',
            }}>
              <ShieldCheck size={14} /> Tier 2 — Gold
            </div>

            <div>
              <button
                onClick={() => onComplete({ name: displayName, emiratesId: maskedId })}
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
              >
                Continue to NestMatch &rarr;
              </button>
            </div>
          </div>
        )}

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
