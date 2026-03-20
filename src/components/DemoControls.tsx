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
  status: string;      // Residing / Searching
  context: string;     // Location, GCC, KYC status etc.
  role: string;
  group: 'tenant-t2' | 'tenant-t1' | 'tenant-t0' | 'landlord' | 'admin';
}

const PERSONAS: Persona[] = [
  // ── Tenants — Tier 2 — Gold (UAE PASS Verified) ──
  { id: 'S001', name: 'Priya Sharma', shortName: 'Priya', tier: 'Tier 2 — Gold', status: 'Residing', context: 'JLT · GCC 85', role: 'Residing', group: 'tenant-t2' },
  { id: 'S002', name: 'Marcus Chen', shortName: 'Marcus', tier: 'Tier 2 — Gold', status: 'Residing', context: 'Marina', role: 'Residing', group: 'tenant-t2' },
  { id: 'S003', name: 'Aisha Patel', shortName: 'Aisha', tier: 'Tier 2 — Gold', status: 'Searching', context: 'GCC 92 · Premium', role: 'Searching', group: 'tenant-t2' },
  { id: 'S004', name: 'James Morrison', shortName: 'James M', tier: 'Tier 2 — Gold', status: 'Searching', context: 'Relocating from London', role: 'Searching', group: 'tenant-t2' },
  // ── Tenants — Tier 1 — Verified ──
  { id: 'S008', name: "Liam O'Brien", shortName: 'Liam', tier: 'Tier 1 — Verified', status: 'Residing', context: 'Irish · Job-seeker visa', role: 'Residing', group: 'tenant-t1' },
  { id: 'S009', name: 'Amara Diallo', shortName: 'Amara', tier: 'Tier 1 — Verified', status: 'Searching', context: 'Senegalese · Exploratory visit', role: 'Searching', group: 'tenant-t1' },
  // ── Tenants — Tier 0 — Explorer ──
  { id: 'S005', name: 'James Okafor', shortName: 'James O', tier: 'Tier 0 — Explorer', status: 'Searching', context: 'Nigerian · Pending KYC', role: 'Searching', group: 'tenant-t0' },
  { id: 'S006', name: 'Sofia Kowalski', shortName: 'Sofia', tier: 'Tier 0 — Explorer', status: 'Residing', context: 'Polish · Approved KYC', role: 'Residing', group: 'tenant-t0' },
  { id: 'S007', name: 'Ravi Menon', shortName: 'Ravi', tier: 'Tier 0 — Explorer', status: 'Searching', context: 'Indian · No docs yet', role: 'Searching', group: 'tenant-t0' },
  // ── Landlords & Agents ──
  { id: 'L001', name: 'Ahmed Al Maktoum', shortName: 'Ahmed', tier: '', status: '', context: '', role: 'Landlord', group: 'landlord' },
  { id: 'L002', name: 'Fatima Hassan', shortName: 'Fatima', tier: '', status: '', context: '', role: 'Landlord', group: 'landlord' },
  { id: 'A001', name: 'Khalid Al Rashid', shortName: 'Khalid', tier: '', status: '', context: '', role: 'Agent', group: 'landlord' },
  { id: 'A002', name: 'Tariq Mahmood', shortName: 'Tariq', tier: '', status: '', context: '', role: 'Agent', group: 'landlord' },
  // ── Platform Admin ──
  { id: 'ADM001', name: 'Sara Al Hashimi', shortName: 'Sara', tier: '', status: '', context: '', role: 'Compliance', group: 'admin' },
  { id: 'ADM002', name: 'Rashid Khalil', shortName: 'Rashid', tier: '', status: '', context: '', role: 'Operations', group: 'admin' },
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
        if (pGroup?.startsWith('tenant')) userType = 'roommate';
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

            {/* Tenant persona button renderer */}
            {([
              { group: 'tenant-t2' as const, label: 'Tier 2 — Gold (UAE PASS)', color: '#f59e0b' },
              { group: 'tenant-t1' as const, label: 'Tier 1 — Verified', color: '#94a3b8' },
              { group: 'tenant-t0' as const, label: 'Tier 0 — Explorer', color: '#b4824f' },
            ] as const).map(tier => (
              <div key={tier.group}>
                <div style={{ fontSize: '0.5625rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem', marginTop: '0.25rem', color: tier.color, letterSpacing: '0.04em' }}>{tier.label}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem', marginBottom: '0.5rem' }}>
                  {PERSONAS.filter(p => p.group === tier.group).map(p => (
                    <button key={p.id} onClick={() => handlePersonaSwitch(p)} style={{
                      padding: '0.375rem 0.5rem', borderRadius: '6px', fontSize: '0.6875rem',
                      background: currentUser.id === p.id ? `${tier.color}20` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${currentUser.id === p.id ? `${tier.color}66` : 'var(--border-subtle, #333)'}`,
                      color: 'var(--text-primary, #fff)', cursor: 'pointer', textAlign: 'left', lineHeight: 1.3,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <span style={{ fontWeight: 600 }}>{p.shortName}</span>
                        <span style={{
                          padding: '0.0625rem 0.3rem', borderRadius: '3px', fontWeight: 700,
                          fontSize: '0.5625rem', letterSpacing: '0.02em',
                          background: p.status === 'Residing' ? 'rgba(34,197,94,0.2)' : 'rgba(59,130,246,0.2)',
                          color: p.status === 'Residing' ? '#4ade80' : '#60a5fa',
                          border: `1px solid ${p.status === 'Residing' ? 'rgba(34,197,94,0.3)' : 'rgba(59,130,246,0.3)'}`,
                        }}>{p.status}</span>
                      </div>
                      <div style={{ fontSize: '0.5625rem', color: 'var(--text-muted)', marginTop: '0.1875rem' }}>{p.context}</div>
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Landlords & Agents */}
            <div style={{ fontSize: '0.5625rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem', color: '#a855f7', letterSpacing: '0.04em' }}>Landlords & Agents</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem', marginBottom: '0.5rem' }}>
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
            <div style={{ fontSize: '0.5625rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem', color: '#6366f1', letterSpacing: '0.04em' }}>Platform Admin</div>
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
