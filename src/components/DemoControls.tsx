import { useState } from 'react';
import { X, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useDemoState } from '@/contexts/DemoStateContext';
import { useToast } from '@/contexts/ToastContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { getTierLabel } from '@/utils/accessControl';

interface Persona {
  id: string;
  name: string;
  shortName: string;
  tier: string;
  role: string;
  group: 'tenant' | 'landlord' | 'admin';
}

const PERSONAS: Persona[] = [
  // Tenants
  { id: 'roommate-1', name: 'Priya Sharma', shortName: 'Priya', tier: 'T3 Gold', role: 'Residing', group: 'tenant' },
  { id: 'roommate-7', name: 'Aisha Patel', shortName: 'Aisha', tier: 'T3 Gold', role: 'Searching', group: 'tenant' },
  { id: 'tier0-2', name: 'Sofia Kowalski', shortName: 'Sofia', tier: 'T1 KYC', role: 'Approved', group: 'tenant' },
  { id: 'tier0-1', name: 'James Okafor', shortName: 'James', tier: 'T1 Pending', role: 'KYC', group: 'tenant' },
  { id: 'tier1-1', name: "Liam O'Brien", shortName: 'Liam', tier: 'T0', role: 'Explorer', group: 'tenant' },
  // Landlords
  { id: 'landlord-1', name: 'Ahmed Al Maktoum', shortName: 'Ahmed', tier: '', role: 'Landlord', group: 'landlord' },
  { id: 'agent-1', name: 'Khalid Al Rashid', shortName: 'Khalid', tier: '', role: 'Agent', group: 'landlord' },
  { id: 'landlord-2', name: 'Fatima Hassan', shortName: 'Fatima', tier: '', role: 'Landlord', group: 'landlord' },
  // Admins
  { id: 'admin-1', name: 'Sara Al Hashimi', shortName: 'Sara', tier: '', role: 'Compliance', group: 'admin' },
  { id: 'admin-3', name: 'Rashid Khalil', shortName: 'Rashid', tier: '', role: 'Operations', group: 'admin' },
];

// Role-gated pages: if current path requires a specific role, redirect on mismatch
const ROLE_PATHS: Record<string, string[]> = {
  '/dashboard': ['landlord', 'letting_agent'],
  '/add-property': ['landlord', 'letting_agent'],
  '/compliance': ['compliance'],
  '/customers': ['operations', 'compliance'],
  '/residing-dashboard': ['roommate'],
  '/viewings': ['roommate', 'landlord', 'letting_agent'],
};

function getDefaultRoute(userType: string): string {
  switch (userType) {
    case 'landlord':
    case 'letting_agent':
      return '/dashboard';
    case 'compliance':
    case 'operations':
      return '/compliance';
    default:
      return '/browse';
  }
}

export default function DemoControls() {
  const [expanded, setExpanded] = useState(false);
  const { currentUser, login } = useAuth();
  const { resetDemoState, setDemoState } = useDemoState();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  if (!currentUser) return null;

  const tierBadge = getTierLabel(currentUser.verification_tier);

  const handlePersonaSwitch = (persona: Persona) => {
    login(persona.id);
    showToast(`Switched to ${persona.name}`, 'info');
    setExpanded(false);

    // Smart redirect: if on a role-gated page that the new persona can't access
    const currentPath = location.pathname;
    for (const [path, allowedTypes] of Object.entries(ROLE_PATHS)) {
      if (currentPath.startsWith(path)) {
        // Determine user type from persona
        const p = PERSONAS.find(pp => pp.id === persona.id);
        const pGroup = p?.group;
        let userType = '';
        if (pGroup === 'tenant') userType = 'roommate';
        else if (pGroup === 'landlord') userType = persona.role === 'Agent' ? 'letting_agent' : 'landlord';
        else if (pGroup === 'admin') userType = persona.role === 'Compliance' ? 'compliance' : 'operations';

        if (!allowedTypes.includes(userType)) {
          navigate(getDefaultRoute(userType));
          return;
        }
      }
    }
  };

  const handleApproveKyc = () => {
    if (currentUser.verification_tier === 'tier0_passport' || currentUser.verification_tier === 'tier1_unverified') {
      setDemoState(prev => ({
        ...prev,
        tierOverrides: { ...prev.tierOverrides, [currentUser.id]: 'tier0_passport' },
        kycSubmissions: { ...prev.kycSubmissions, [currentUser.id]: 'approved' },
      }));
      showToast('KYC approved! Tier upgraded.', 'success');
    } else {
      showToast('This user is already verified.', 'info');
    }
  };

  const handleUaePassUpgrade = () => {
    setDemoState(prev => ({
      ...prev,
      tierOverrides: { ...prev.tierOverrides, [currentUser.id]: 'gold' },
    }));
    showToast('UAE PASS verified! Tier 2 — Gold unlocked.', 'success');
  };

  const handleResetDemo = () => {
    resetDemoState();
    showToast('Demo state reset.', 'info');
  };

  return (
    <>
      {/* Collapsed pill */}
      {!expanded && (
        <button
          onClick={() => setExpanded(true)}
          style={{
            position: 'fixed', bottom: '1.5rem', right: '1.5rem',
            zIndex: 9999, display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 1rem', borderRadius: '999px',
            background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)',
            color: 'var(--brand-purple-light, #a78bfa)', fontSize: '0.8125rem',
            fontWeight: 600, cursor: 'pointer', backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}
        >
          <span role="img" aria-label="demo">🎭</span>
          {currentUser.name.split(' ')[0]}
          {currentUser.verification_tier === 'tier2_uae_pass' && (
            <span style={{ fontSize: '0.625rem', padding: '0.125rem 0.375rem', borderRadius: '999px', background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>Gold</span>
          )}
          {currentUser.verification_tier === 'tier0_passport' && (
            <span style={{ fontSize: '0.625rem', padding: '0.125rem 0.375rem', borderRadius: '999px', background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>T0</span>
          )}
          {currentUser.verification_tier === 'tier1_unverified' && (
            <span style={{ fontSize: '0.625rem', padding: '0.125rem 0.375rem', borderRadius: '999px', background: 'rgba(156,163,175,0.2)', color: '#9ca3af' }}>T1</span>
          )}
          <ChevronRight size={14} />
        </button>
      )}

      {/* Expanded panel */}
      {expanded && (
        <div style={{
          position: 'fixed', bottom: '1.5rem', right: '1.5rem',
          zIndex: 9999, width: '280px',
          background: 'var(--bg-card, #1a1a2e)', border: '1px solid var(--border-subtle, #333)',
          borderRadius: 'var(--radius-lg, 12px)', padding: '1rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)',
          maxHeight: '80vh', overflowY: 'auto',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>Demo Controls</div>
              <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>(not visible in production)</div>
            </div>
            <button onClick={() => setExpanded(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
              <X size={16} />
            </button>
          </div>

          {/* Current user info */}
          <div style={{
            padding: '0.5rem 0.625rem', borderRadius: 'var(--radius-md, 8px)',
            background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)',
            marginBottom: '0.75rem', fontSize: '0.75rem',
          }}>
            <div style={{ fontWeight: 600, marginBottom: '0.125rem' }}>{currentUser.name}</div>
            <div style={{ color: 'var(--text-muted)' }}>{tierBadge} &middot; {currentUser.type}</div>
          </div>

          {/* Switch Persona */}
          <div style={{ marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>
              Switch Persona
            </div>

            {/* Tenants */}
            <div style={{ fontSize: '0.5625rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem', marginTop: '0.25rem' }}>Tenants</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem', marginBottom: '0.5rem' }}>
              {PERSONAS.filter(p => p.group === 'tenant').map(p => (
                <button
                  key={p.id}
                  onClick={() => handlePersonaSwitch(p)}
                  style={{
                    padding: '0.375rem 0.5rem', borderRadius: '6px', fontSize: '0.6875rem',
                    background: currentUser.id === p.id ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${currentUser.id === p.id ? 'rgba(124,58,237,0.4)' : 'var(--border-subtle, #333)'}`,
                    color: 'var(--text-primary, #fff)', cursor: 'pointer', textAlign: 'left',
                    lineHeight: 1.3,
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{p.shortName}</div>
                  <div style={{ fontSize: '0.5625rem', color: 'var(--text-muted)' }}>{p.tier} {p.role}</div>
                </button>
              ))}
            </div>

            {/* Landlords */}
            <div style={{ fontSize: '0.5625rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Landlords</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.25rem', marginBottom: '0.5rem' }}>
              {PERSONAS.filter(p => p.group === 'landlord').map(p => (
                <button
                  key={p.id}
                  onClick={() => handlePersonaSwitch(p)}
                  style={{
                    padding: '0.375rem 0.5rem', borderRadius: '6px', fontSize: '0.6875rem',
                    background: currentUser.id === p.id ? 'rgba(20,184,166,0.2)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${currentUser.id === p.id ? 'rgba(20,184,166,0.4)' : 'var(--border-subtle, #333)'}`,
                    color: 'var(--text-primary, #fff)', cursor: 'pointer', textAlign: 'left',
                    lineHeight: 1.3,
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{p.shortName}</div>
                  <div style={{ fontSize: '0.5625rem', color: 'var(--text-muted)' }}>{p.role}</div>
                </button>
              ))}
            </div>

            {/* Admins */}
            <div style={{ fontSize: '0.5625rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Admins</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem' }}>
              {PERSONAS.filter(p => p.group === 'admin').map(p => (
                <button
                  key={p.id}
                  onClick={() => handlePersonaSwitch(p)}
                  style={{
                    padding: '0.375rem 0.5rem', borderRadius: '6px', fontSize: '0.6875rem',
                    background: currentUser.id === p.id ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${currentUser.id === p.id ? 'rgba(245,158,11,0.4)' : 'var(--border-subtle, #333)'}`,
                    color: 'var(--text-primary, #fff)', cursor: 'pointer', textAlign: 'left',
                    lineHeight: 1.3,
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{p.shortName}</div>
                  <div style={{ fontSize: '0.5625rem', color: 'var(--text-muted)' }}>{p.role}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>
              Quick Actions
            </div>
            <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
              <button
                onClick={handleApproveKyc}
                style={{
                  padding: '0.375rem 0.625rem', borderRadius: '6px', fontSize: '0.6875rem', fontWeight: 600,
                  background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
                  color: '#22c55e', cursor: 'pointer',
                }}
              >
                Approve KYC
              </button>
              <button
                onClick={handleUaePassUpgrade}
                style={{
                  padding: '0.375rem 0.625rem', borderRadius: '6px', fontSize: '0.6875rem', fontWeight: 600,
                  background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.3)',
                  color: '#14b8a6', cursor: 'pointer',
                }}
              >
                UAE PASS Upgrade
              </button>
              <button
                onClick={handleResetDemo}
                style={{
                  padding: '0.375rem 0.625rem', borderRadius: '6px', fontSize: '0.6875rem', fontWeight: 600,
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                  color: '#ef4444', cursor: 'pointer',
                }}
              >
                Reset Demo State
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
