import React from 'react';
import { Home, Zap, BarChart3, ArrowRightLeft, PieChart, ShieldCheck } from 'lucide-react';

const menuItems = [
    { key: 'Home', icon: Home, uz: "Bosh sahifa", en: "Dashboard" },
    { key: 'Transfer', icon: ArrowRightLeft, uz: "Pul o'tkazmalari", en: "Transfers" },
    { key: 'Payments', icon: Zap, uz: "Xizmatlar to'lovi", en: "Payments" },
    { key: 'Income & Exp...', icon: BarChart3, uz: "Xarajatlar tahlili", en: "Analytics" },
    { key: 'Deposits', icon: PieChart, uz: "Omonatlar", en: "Deposits" },
];

const Sidebar = ({ activeMenu, setActiveMenu, language }) => {
    const isUz = language === 'uz';

    return (
        <aside
            className="hidden lg:flex flex-col h-screen sticky top-0 overflow-y-auto"
            style={{
                background: 'linear-gradient(180deg, #0a1020 0%, #080d1a 100%)',
                borderRight: '1px solid rgba(255,255,255,0.05)',
                width: 240,
                minWidth: 240,
            }}
        >
            {/* Logo */}
            <div style={{ padding: '28px 20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: 14,
                        background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 8px 24px rgba(59,130,246,0.35)',
                        flexShrink: 0,
                    }}>
                        <span style={{ color: '#fff', fontWeight: 900, fontSize: 18, fontFamily: 'Outfit, sans-serif' }}>A</span>
                    </div>
                    <div>
                        <div style={{ color: '#f0f2f8', fontWeight: 800, fontSize: 18, fontFamily: 'Outfit, sans-serif', lineHeight: 1 }}>Apex Bank</div>
                        <div style={{ color: '#525b6e', fontSize: 10, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: 2, marginTop: 4 }}>Uzbekistan</div>
                    </div>
                </div>
            </div>

            {/* Label */}
            <div style={{ padding: '0 20px 10px' }}>
                <span style={{ color: '#525b6e', fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>
                    {isUz ? 'Menyu' : 'Menu'}
                </span>
            </div>

            {/* Nav items */}
            <nav style={{ flex: 1, padding: '0 12px' }}>
                {menuItems.map(({ key, icon: Icon, uz, en }) => {
                    const active = activeMenu === key;
                    return (
                        <button
                            key={key}
                            onClick={() => setActiveMenu(key)}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                padding: '12px 14px',
                                borderRadius: 14,
                                marginBottom: 4,
                                background: active ? 'rgba(59,130,246,0.12)' : 'transparent',
                                border: active ? '1px solid rgba(59,130,246,0.2)' : '1px solid transparent',
                                color: active ? '#60a5fa' : '#8891a8',
                                cursor: 'pointer',
                                transition: 'all 0.18s ease',
                                textAlign: 'left',
                            }}
                            onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                            onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                        >
                            <Icon size={18} style={{ flexShrink: 0 }} />
                            <span style={{ fontSize: 14, fontWeight: active ? 700 : 500 }}>{isUz ? uz : en}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Security badge */}
            <div style={{ padding: '16px 16px 24px' }}>
                <div style={{
                    background: 'rgba(59,130,246,0.07)',
                    border: '1px solid rgba(59,130,246,0.12)',
                    borderRadius: 16,
                    padding: 16,
                }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <div style={{
                            width: 34, height: 34, borderRadius: 10,
                            background: 'rgba(59,130,246,0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#60a5fa', flexShrink: 0,
                        }}>
                            <ShieldCheck size={17} />
                        </div>
                        <div>
                            <div style={{ color: '#f0f2f8', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                                {isUz ? "Xavfsizlik kafolatlangan" : "Bank-grade Security"}
                            </div>
                            <div style={{ color: '#525b6e', fontSize: 11, lineHeight: 1.5 }}>
                                {isUz ? "Omonat sug'urtalash a'zosi." : "Member of State Deposit Insurance Fund."}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
