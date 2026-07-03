import React from 'react';
import { Search, Bell, Globe } from 'lucide-react';

const Topbar = ({ language, onChangeLanguage, locales, userProfile, onOpenProfile }) => {
    const isUz = language === 'uz';

    return (
        <header style={{
            height: 70,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            background: 'rgba(8,13,26,0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            gap: 20,
        }}>
            {/* Search */}
            <div style={{ flex: 1, maxWidth: 420, position: 'relative' }}>
                <Search size={16} style={{
                    position: 'absolute', left: 16, top: '50%',
                    transform: 'translateY(-50%)', color: '#525b6e', pointerEvents: 'none',
                }} />
                <input
                    type="text"
                    placeholder={isUz ? "Xizmatlarni qidirish..." : "Search services..."}
                    style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: 14,
                        padding: '10px 16px 10px 44px',
                        fontSize: 14,
                        color: '#f0f2f8',
                        outline: 'none',
                        fontFamily: 'Inter, sans-serif',
                        transition: 'border-color 0.2s',
                    }}
                    onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.07)'}
                />
            </div>

            {/* Right cluster */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* Exchange rate */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginRight: 8 }}
                    className="hidden md:flex">
                    <span style={{ color: '#f0f2f8', fontSize: 13, fontWeight: 700 }}>12,650 / 12,720 UZS</span>
                    <span style={{ color: '#525b6e', fontSize: 10, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: 1 }}>USD Markaziy Bank kursi</span>
                </div>

                {/* Lang toggle */}
                <button
                    onClick={() => onChangeLanguage(isUz ? 'en' : 'uz')}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '7px 12px', borderRadius: 10,
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: '#c0c8d8', fontSize: 13, fontWeight: 600,
                        cursor: 'pointer', transition: 'all 0.15s',
                        fontFamily: 'Inter, sans-serif',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#c0c8d8'; }}
                >
                    <Globe size={14} style={{ color: '#60a5fa' }} />
                    <span>{isUz ? '🇺🇿 UZ' : '🇬🇧 EN'}</span>
                </button>

                {/* Bell */}
                <button style={{
                    width: 38, height: 38, borderRadius: 12,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#8891a8', cursor: 'pointer',
                    position: 'relative', transition: 'all 0.15s',
                }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#8891a8'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                >
                    <Bell size={17} />
                    <span style={{
                        position: 'absolute', top: 8, right: 8,
                        width: 7, height: 7, borderRadius: '50%',
                        background: '#3b82f6', border: '2px solid #080d1a',
                    }} />
                </button>

                {/* Avatar */}
                <div
                    onClick={onOpenProfile}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 12, borderLeft: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer', transition: 'opacity 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    title={isUz ? "Profilni tahrirlash" : "Edit Profile"}
                >
                    <div className="hidden lg:block">
                        <div style={{ color: '#f0f2f8', fontSize: 13, fontWeight: 700, lineHeight: 1 }}>{userProfile?.name || 'Foydalanuvchi'}</div>
                        <div style={{ color: '#10b981', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginTop: 3 }}>Premium</div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
