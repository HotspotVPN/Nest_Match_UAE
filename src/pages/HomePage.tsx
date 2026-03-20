import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Building2, Users, Search, CheckCircle2, ArrowRight, FileText, BarChart2, UserPlus, MapPin, Eye, Compass, TrendingUp, Shield, Home } from 'lucide-react';
import { useState, useEffect } from 'react';

// Flowing descriptive tag recommendations for auto-scrolling carousel
const FLOWING_TAGS: { label: string; query: string; color: string }[] = [
    { label: 'Budget Friendly', query: 'budget', color: '#22c55e' },
    { label: 'Premium Rooms', query: 'premium', color: '#f59e0b' },
    { label: 'Near Metro', query: 'metro', color: '#3b82f6' },
    { label: 'En-suite Bathroom', query: 'en-suite', color: '#06b6d4' },
    { label: 'Sea View', query: 'sea-view', color: '#0ea5e9' },
    { label: 'Villa Living', query: 'villa', color: '#14b8a6' },
    { label: 'New Building', query: 'new-building', color: '#a855f7' },
    { label: 'Fully Furnished', query: 'furnished', color: '#ec4899' },
    { label: 'Balcony', query: 'balcony', color: '#f97316' },
    { label: 'Private Room', query: 'private-room', color: '#8b5cf6' },
    { label: 'Red Line', query: 'Red Line', color: '#E21836' },
    { label: 'Green Line', query: 'Green Line', color: '#009639' },
];

// Rolling placeholder prompts (Zoopla-style) — uses real district names and tags
const SEARCH_PROMPTS = [
    'Dubai Marina',
    'budget rooms in Deira',
    'en-suite in Business Bay',
    'JLT lake view',
    'villa in JVC',
    'premium Al Barsha',
    'International City',
    'Silicon Oasis',
    'Discovery Gardens',
    'Al Nahda',
];

// Popular search suggestions — clickable chips that auto-search
const POPULAR_SEARCHES = [
    { label: 'Dubai Marina', query: 'Dubai Marina' },
    { label: 'Budget under AED 1,000', query: 'Deira' },
    { label: 'Business Bay', query: 'Business Bay' },
    { label: 'JLT', query: 'JLT' },
    { label: 'En-suite rooms', query: 'en-suite' },
    { label: 'Near Metro', query: 'metro' },
    { label: 'JVC Villa', query: 'JVC' },
    { label: 'Al Barsha', query: 'Al Barsha' },
];

// Discover locations data
const DISCOVER_LOCATIONS: { district: string; tagline: string; color: string; listings: number }[] = [
    { district: 'Dubai Marina', tagline: 'Waterfront living', color: '#3b82f6', listings: 3 },
    { district: 'JLT', tagline: 'Lakeside community', color: '#14b8a6', listings: 2 },
    { district: 'Business Bay', tagline: 'City professionals', color: '#6366f1', listings: 2 },
    { district: 'Deira', tagline: 'Budget-friendly hub', color: '#E21836', listings: 2 },
    { district: 'Bur Dubai', tagline: 'Historic & connected', color: '#f59e0b', listings: 1 },
    { district: 'Al Barsha', tagline: 'Central & convenient', color: '#f97316', listings: 1 },
    { district: 'JVC', tagline: 'Villa communities', color: '#ec4899', listings: 1 },
    { district: 'Silicon Oasis', tagline: 'Tech hub living', color: '#06b6d4', listings: 1 },
];

export default function HomePage() {
    const navigate = useNavigate();
    const [heroQuery, setHeroQuery] = useState('');
    const [promptIndex, setPromptIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(true);
    const [displayedPrompt, setDisplayedPrompt] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    // Rolling typewriter effect for search placeholder
    const currentPrompt = SEARCH_PROMPTS[promptIndex];

    useEffect(() => {
        if (isFocused || heroQuery) return; // Stop animation when user is typing

        let charIndex = 0;
        let timeout: ReturnType<typeof setTimeout>;

        if (isTyping) {
            // Type out the prompt character by character
            const typeChar = () => {
                if (charIndex <= currentPrompt.length) {
                    setDisplayedPrompt(currentPrompt.slice(0, charIndex));
                    charIndex++;
                    timeout = setTimeout(typeChar, 45);
                } else {
                    // Pause at full text, then start erasing
                    timeout = setTimeout(() => setIsTyping(false), 2200);
                }
            };
            typeChar();
        } else {
            // Erase and move to next
            let eraseIndex = currentPrompt.length;
            const eraseChar = () => {
                if (eraseIndex >= 0) {
                    setDisplayedPrompt(currentPrompt.slice(0, eraseIndex));
                    eraseIndex--;
                    timeout = setTimeout(eraseChar, 25);
                } else {
                    setPromptIndex(prev => (prev + 1) % SEARCH_PROMPTS.length);
                    setIsTyping(true);
                }
            };
            eraseChar();
        }

        return () => clearTimeout(timeout);
    }, [promptIndex, isTyping, isFocused, heroQuery, currentPrompt]);

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const params = new URLSearchParams();
        if (heroQuery.trim()) params.set('q', heroQuery.trim());
        navigate(`/browse${params.toString() ? '?' + params.toString() : ''}`);
    };

    // Placeholder text: show rolling prompt when not focused, static when focused
    const placeholderText = (isFocused || heroQuery) ? 'Try "Dubai Marina", "JLT", "budget", "en-suite"...' : `Search for ${displayedPrompt}`;

    return (
        <div className="home-page">
            {/* Typewriter cursor blink + flowing tags animation */}
            <style>{`
                @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
                .search-input-rolling::placeholder { transition: color 0.2s; }
                .search-input-rolling:focus::placeholder { color: var(--text-muted) !important; }
                @keyframes flowScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
                .flowing-tags-track { animation: flowScroll 30s linear infinite; }
                .flowing-tags-track:hover { animation-play-state: paused; }
            `}</style>

            {/* ═══ Section 1 — Hero: Search-First Layout ═══ */}
            <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', padding: '4rem 1.5rem 2rem', background: 'radial-gradient(circle at top, rgba(99,102,241,0.08) 0%, transparent 70%)' }}>
                <div style={{ maxWidth: '900px', width: '100%', margin: '0 auto' }}>
                    {/* NestMatch Logo — Hero Block */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '3rem' }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: '160px', height: '160px', borderRadius: '36px',
                            background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
                            fontSize: '5.5rem', fontWeight: 800, color: '#fff',
                            fontFamily: 'var(--font-display)',
                            boxShadow: '0 0 80px rgba(124,58,237,0.4), 0 12px 40px rgba(0,0,0,0.3)',
                            marginBottom: '1.25rem',
                        }}>N</div>
                        <div style={{ fontSize: 'clamp(3.5rem, 10vw, 6rem)', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--text-primary)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>
                            NestMatch
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.75rem' }}>
                            <span style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '4px 18px', borderRadius: 'var(--radius-full)', background: 'rgba(124,58,237,0.15)', color: 'var(--brand-purple-light)', border: '1px solid rgba(124,58,237,0.25)' }}>UAE</span>
                            <span style={{ fontSize: '1.125rem', color: 'var(--text-muted)', fontWeight: 500 }}>Shared Housing Platform</span>
                        </div>
                    </div>

                    {/* Badge */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0.875rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)', marginBottom: '1.25rem' }}>
                        <ShieldCheck size={14} style={{ color: 'var(--uaepass-green)' }} />
                        <span style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.02em', color: 'var(--text-muted)' }}>BUILT FOR LAW NO. 4 OF 2026 COMPLIANCE</span>
                    </div>

                    {/* Headline — Above search */}
                    <h1 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)', fontWeight: 700, lineHeight: 1.2, marginBottom: '1.75rem', letterSpacing: '-0.01em', color: 'var(--text-secondary)' }}>
                        Legal shared rooms in Dubai.{' '}
                        <span className="text-gradient">Verified tenants. Compliant landlords.</span>
                    </h1>

                    {/* ★ SEARCH BAR with Rolling Placeholder ★ */}
                    <form onSubmit={handleSearch} style={{ maxWidth: '700px', margin: '0 auto 1.5rem', width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.07)', border: '2px solid rgba(124,58,237,0.5)', borderRadius: '16px', padding: '0.75rem 0.75rem 0.75rem 1.5rem', gap: '1rem', boxShadow: '0 0 40px rgba(124,58,237,0.15), 0 4px 20px rgba(0,0,0,0.2)', position: 'relative' }}>
                            <Search size={24} style={{ color: 'var(--brand-purple-light)', flexShrink: 0 }} />
                            <div style={{ flex: 1, position: 'relative' }}>
                                <input
                                    type="text"
                                    className="search-input-rolling"
                                    value={heroQuery}
                                    onChange={e => setHeroQuery(e.target.value)}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                    placeholder={placeholderText}
                                    style={{
                                        width: '100%', background: 'transparent', border: 'none', outline: 'none',
                                        color: 'var(--text-primary)', fontSize: '1.125rem',
                                        fontFamily: 'inherit', fontWeight: 500,
                                    }}
                                />
                                {/* Blinking cursor after rolling text when not focused */}
                                {!isFocused && !heroQuery && (
                                    <span style={{
                                        position: 'absolute', top: '50%', transform: 'translateY(-50%)',
                                        left: `${(placeholderText.length) * 0.58}em`,
                                        width: '2px', height: '1.25em',
                                        background: 'var(--brand-purple-light)',
                                        animation: 'blink 1s step-end infinite',
                                        pointerEvents: 'none',
                                    }} />
                                )}
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ padding: '0.875rem 1.75rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 700 }}>
                                Search <ArrowRight size={18} />
                            </button>
                        </div>

                        {/* Flowing tag recommendations — auto-scrolling carousel */}
                        <div style={{ overflow: 'hidden', marginTop: '0.875rem', maskImage: 'linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)', WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)' }}>
                            <div className="flowing-tags-track" style={{ display: 'flex', gap: '0.5rem', width: 'max-content' }}>
                                {[...FLOWING_TAGS, ...FLOWING_TAGS].map((tag, i) => (
                                    <button
                                        key={`${tag.label}-${i}`}
                                        type="button"
                                        onClick={() => { setHeroQuery(tag.query); navigate(`/browse?q=${encodeURIComponent(tag.query)}`); }}
                                        style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                                            padding: '0.3rem 0.75rem', borderRadius: '999px', cursor: 'pointer',
                                            fontSize: '0.6875rem', fontWeight: 500, whiteSpace: 'nowrap',
                                            background: `${tag.color}08`, border: `1px solid ${tag.color}20`,
                                            color: tag.color, transition: 'all 0.15s',
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.background = `${tag.color}18`; e.currentTarget.style.borderColor = `${tag.color}40`; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = `${tag.color}08`; e.currentTarget.style.borderColor = `${tag.color}20`; }}
                                    >
                                        {tag.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Popular searches — guide users to real results */}
                        <div style={{ marginTop: '0.875rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Popular:</span>
                            {POPULAR_SEARCHES.map(s => (
                                <button
                                    key={s.label}
                                    type="button"
                                    onClick={() => { setHeroQuery(s.query); navigate(`/browse?q=${encodeURIComponent(s.query)}`); }}
                                    style={{
                                        padding: '0.25rem 0.75rem', borderRadius: '999px', cursor: 'pointer',
                                        fontSize: '0.6875rem', fontWeight: 500,
                                        background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)',
                                        color: 'var(--brand-purple-light)', transition: 'all 0.15s',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.15)'; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.35)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.06)'; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.15)'; }}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </form>

                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '620px', margin: '0 auto 1.75rem' }}>
                        NestMatch digitises the official DLD Property Viewing Agreement and connects UAE PASS-verified landlords with identity-verified tenants. Every viewing is documented. Every listing is permitted.
                    </p>

                    {/* Secondary CTAs */}
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                        <Link to="/register?role=landlord" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.125rem', borderRadius: 'var(--radius-md)', border: '0.5px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', color: '#9b9bab', fontSize: '0.8125rem', fontWeight: 500, textDecoration: 'none' }}>
                            <Building2 size={15} /> I'm a Landlord / Operator
                        </Link>
                        <Link to="/register?role=tenant" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.125rem', borderRadius: 'var(--radius-md)', border: '0.5px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', color: '#9b9bab', fontSize: '0.8125rem', fontWeight: 500, textDecoration: 'none' }}>
                            <UserPlus size={15} /> Create Tenant Profile
                        </Link>
                    </div>

                    {/* NestMatch OS flow bar */}
                    <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                            <span style={{ color: 'var(--brand-purple-light)' }}>NestMatch OS:</span> Search &rarr; Verify &rarr; Book Viewing &rarr; Sign DLD Agreement &rarr; Move In
                        </div>
                        <Link to="/how-it-works" className="btn btn-outline btn-sm" style={{ padding: '0.4rem 0.875rem', fontSize: '0.75rem' }}>
                            How it works <ArrowRight size={12} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ═══ Section 2 — Empowerment Tools (Zoopla-inspired) ═══ */}
            <section style={{ padding: '5rem 0', background: 'var(--bg-surface-2)' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '0.75rem' }}>
                            Feel empowered to make your <span className="text-gradient">next move</span>
                        </h2>
                        <p style={{ fontSize: '1rem', color: 'var(--text-muted)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.6 }}>
                            Our range of tools help you make confident, informed decisions about your shared housing in Dubai.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
                        {[
                            { icon: Eye, title: 'Browse Verified Rooms', desc: 'Every listing is permit-checked and DLD-compliant. No fake ads, no illegal partitions.', link: '/browse', cta: 'Browse rooms', color: '#7c3aed' },
                            { icon: Shield, title: 'Three-Tier Verification', desc: 'Start with email, verify your passport, or authenticate with UAE PASS for full access.', link: '/register/tenant', cta: 'Get verified', color: '#22c55e' },
                            { icon: FileText, title: 'DLD Viewing Agreements', desc: 'Every viewing generates an official DLD agreement — signed digitally by both parties.', link: '/how-it-works', cta: 'Learn more', color: '#3b82f6' },
                            { icon: TrendingUp, title: 'GCC Trust Score', desc: 'Build your Good Conduct Certificate over time. Higher scores unlock premium features.', link: '/gcc', cta: 'Check your score', color: '#f59e0b' },
                            { icon: Compass, title: 'Location Intelligence', desc: 'See where verified tenants are searching and what areas match your budget and lifestyle.', link: '/browse', cta: 'Explore areas', color: '#14b8a6' },
                            { icon: Home, title: 'Landlord Dashboard', desc: 'List properties, manage viewings, track occupancy — all in one compliance-first dashboard.', link: '/register?role=landlord', cta: 'List a property', color: '#ec4899' },
                        ].map(tool => {
                            const Icon = tool.icon;
                            return (
                                <Link key={tool.title} to={tool.link} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className="glass-card" style={{ padding: '2rem', height: '100%', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' }}
                                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 8px 30px ${tool.color}15`; }}
                                        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                                    >
                                        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${tool.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                                            <Icon size={24} style={{ color: tool.color }} />
                                        </div>
                                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>{tool.title}</h3>
                                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.25rem' }}>{tool.desc}</p>
                                        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: tool.color, display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                                            {tool.cta} <ArrowRight size={14} />
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ═══ Section 3 — Discover Dubai Locations ═══ */}
            <section style={{ padding: '5rem 0' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '0.75rem' }}>
                            Discover Dubai <span className="text-gradient">districts</span>
                        </h2>
                        <p style={{ fontSize: '1rem', color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
                            Explore verified shared rooms across Dubai's most popular neighbourhoods.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
                        {DISCOVER_LOCATIONS.map(loc => (
                            <Link key={loc.district} to={`/browse?q=${encodeURIComponent(loc.district)}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div style={{
                                    padding: '1.5rem', borderRadius: 'var(--radius-lg)',
                                    border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.02)',
                                    transition: 'all 0.2s', cursor: 'pointer', position: 'relative', overflow: 'hidden',
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = `${loc.color}50`; e.currentTarget.style.background = `${loc.color}08`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.transform = ''; }}
                                >
                                    {/* Accent bar */}
                                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${loc.color}, transparent)` }} />

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                        <div>
                                            <div style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.25rem' }}>{loc.district}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{loc.tagline}</div>
                                        </div>
                                        <MapPin size={18} style={{ color: loc.color, opacity: 0.6, flexShrink: 0, marginTop: '0.125rem' }} />
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: '0.6875rem', fontWeight: 600, padding: '0.2rem 0.625rem', borderRadius: '999px', background: `${loc.color}15`, color: loc.color, border: `1px solid ${loc.color}30` }}>
                                            {loc.listings} listing{loc.listings !== 1 ? 's' : ''}
                                        </span>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: loc.color, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                            Explore <ArrowRight size={12} />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <Link to="/browse" className="btn btn-outline" style={{ padding: '0.75rem 2rem', fontSize: '0.9375rem' }}>
                            Explore all Dubai districts <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ═══ Section 4 — Compliance + Stakeholders ═══ */}
            <section style={{ padding: '6rem 0', background: 'var(--bg-surface-2)' }}>
                <div className="container">
                    {/* Row 1: Compliance Engine */}
                    <div className="glass-card" style={{ padding: '4rem', display: 'grid', gridTemplateColumns: '2fr 3fr', gap: '4rem', alignItems: 'center', marginBottom: '4rem' }}>
                        <div>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>The NestMatch <br /><span className="text-gradient">Compliance Engine</span></h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.7 }}>
                                We've digitised the legal requirements of Dubai's shared housing laws into a seamless experience.
                                Our platform acts as a neutral third-party ensuring every stay is documented and compliant.
                            </p>
                            <Link to="/how-it-works" className="btn btn-secondary">
                                See how it works <ArrowRight size={18} />
                            </Link>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            {[
                                { icon: ShieldCheck, title: 'Three-Tier Identity', desc: 'Browse with email, verify with passport, or authenticate with UAE PASS — access scales with your verification level.' },
                                { icon: FileText, title: 'Official DLD Viewing Agreements', desc: 'Every confirmed viewing generates a DLD Property Viewing Agreement (Ref: DLD/RERA/RL/LP/P210), signed digitally by both parties.' },
                                { icon: Building2, title: 'Permit-Verified Listings', desc: 'Every listing is checked for a valid Trakheesi advertising permit, shared-housing permit, and 10-digit Makani number before going live.' },
                                { icon: BarChart2, title: 'Demand Intelligence', desc: 'Real-time data on how many verified tenants are searching each area, budget band, and room type — so landlords price and market smarter.' }
                            ].map(item => {
                                const Icon = item.icon;
                                return (
                                    <div key={item.title} className="glass-card" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
                                        <Icon size={24} style={{ color: 'var(--brand-purple-light)', marginBottom: '0.75rem' }} />
                                        <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{item.title}</div>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{item.desc}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Row 2: Stakeholder Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        <div className="glass-card" style={{ padding: '2.5rem' }}>
                            <div style={{ padding: '0.75rem', background: 'rgba(99,102,241,0.1)', borderRadius: 'var(--radius-lg)', width: 'fit-content', color: 'var(--brand-purple-light)', marginBottom: '1.5rem' }}>
                                <Building2 size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Landlords & Operators</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                                List your shared-housing units on a platform built for compliance. Reach verified tenants and manage viewings with full DLD documentation.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {['DLD Permit Verification', 'Occupancy Cap Enforcement', 'DLD Viewing Agreement Generation', 'Demand Intelligence Dashboard'].map(item => (
                                    <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                        <CheckCircle2 size={16} style={{ color: 'var(--success)' }} /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="glass-card" style={{ padding: '2.5rem' }}>
                            <div style={{ padding: '0.75rem', background: 'rgba(20,184,166,0.1)', borderRadius: 'var(--radius-lg)', width: 'fit-content', color: '#14b8a6', marginBottom: '1.5rem' }}>
                                <Users size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Residents</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                                Already living in shared housing? Keep your stay documented and build a verifiable Good Conduct Certificate for your next move.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {['Signed DLD Viewing Agreements on File', 'Maintenance Request Ticketing', 'Good Conduct Certificate Building', 'Verified Residency Timeline'].map(item => (
                                    <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                        <CheckCircle2 size={16} style={{ color: '#14b8a6' }} /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="glass-card" style={{ padding: '2.5rem' }}>
                            <div style={{ padding: '0.75rem', background: 'rgba(245,158,11,0.1)', borderRadius: 'var(--radius-lg)', width: 'fit-content', color: '#f59e0b', marginBottom: '1.5rem' }}>
                                <Search size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Room Seekers</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                                Find verified rooms and flatmates in Dubai. No fake listings, no illegal partitions, no cash viewings with strangers.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {['Permit-Verified Listings Only', 'Identity-Verified Flatmates', 'DLD Viewing Agreement Protection', 'Lifestyle & Location Matching'].map(item => (
                                    <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                        <CheckCircle2 size={16} style={{ color: '#f59e0b' }} /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
