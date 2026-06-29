import React, { useState } from 'react';
import {
    Plus, MoreHorizontal, ArrowRight, Smartphone,
    Apple, Play, RefreshCw, TrendingUp, ChevronRight,
    User, CreditCard as CardIcon, Send, Bolt,
} from 'lucide-react';
import CreditCard from './CreditCard';

const S = {
    /* ── Layout ── */
    grid: { display: 'grid', gridTemplateColumns: '1fr', gap: 28 },
    gridXL: { display: 'grid', gridTemplateColumns: '1fr 360px', gap: 28 },
    col: { display: 'flex', flexDirection: 'column', gap: 24 },
    row: { display: 'flex', alignItems: 'center', gap: 12 },
    /* ── Cards ── */
    panel: {
        background: 'rgba(13,20,37,0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 22,
        padding: 24,
    },
    /* ── Text ── */
    label: { color: '#525b6e', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5 },
    h1: { color: '#f0f2f8', fontSize: 36, fontWeight: 900, fontFamily: 'Outfit,sans-serif', letterSpacing: -1 },
    h2: { color: '#f0f2f8', fontSize: 22, fontWeight: 800, fontFamily: 'Outfit,sans-serif', letterSpacing: -0.5 },
    h3: { color: '#f0f2f8', fontSize: 16, fontWeight: 700 },
    body: { color: '#8891a8', fontSize: 13, lineHeight: 1.6 },
    /* ── Buttons ── */
    btnPrimary: {
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '11px 22px', borderRadius: 14,
        background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
        border: 'none', color: '#fff', fontSize: 14, fontWeight: 700,
        cursor: 'pointer', fontFamily: 'Inter,sans-serif',
        boxShadow: '0 4px 20px rgba(59,130,246,0.35)',
        transition: 'transform 0.15s, box-shadow 0.15s',
    },
    btnSecondary: {
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '11px 22px', borderRadius: 14,
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: '#c0c8d8', fontSize: 14, fontWeight: 700,
        cursor: 'pointer', fontFamily: 'Inter,sans-serif',
        transition: 'background 0.15s, color 0.15s',
    },
    iconBtn: {
        width: 36, height: 36, borderRadius: 11,
        background: 'rgba(59,130,246,0.12)',
        border: '1px solid rgba(59,130,246,0.2)',
        color: '#60a5fa', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'background 0.15s',
        flexShrink: 0,
    },
    input: {
        width: '100%', background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12, padding: '11px 14px',
        fontSize: 14, color: '#f0f2f8', outline: 'none',
        fontFamily: 'Inter,monospace',
        transition: 'border-color 0.2s',
    },
};

const Dashboard = ({ cards, activeCard, setActiveCard, activities, language, onNavigate, onOpenAddCard }) => {
    const isUz = language === 'uz';

    /* ── Computed totals ── */
    const totalUzs = cards.filter(c => c.currency === 'UZS')
        .reduce((s, c) => s + parseFloat(c.balance.toString().replace(/\s/g, '')), 0);
    const totalUsd = cards.filter(c => c.currency === 'USD')
        .reduce((s, c) => s + parseFloat(c.balance.toString().replace(/\s/g, '')), 0);

    /* ── Currency calculator ── */
    const [usdInput, setUsdInput] = useState('100');
    const rate = 12_650;
    const uzResult = !isNaN(+usdInput) ? Math.round(+usdInput * rate).toLocaleString('uz-UZ') : '—';

    /* ── Quick transfer ── */
    const [qCard, setQCard] = useState('');
    const [qAmount, setQAmount] = useState('');
    const [qErr, setQErr] = useState('');

    const onQCard = e => {
        let v = e.target.value.replace(/\D/g, '').slice(0, 16);
        setQCard(v.match(/\d{1,4}/g)?.join(' ') ?? '');
    };

    const submitQuick = e => {
        e.preventDefault(); setQErr('');
        if (qCard.replace(/\s/g, '').length !== 16)
            return setQErr(isUz ? "16 xonali karta raqam kiriting!" : "Enter a 16-digit card number.");
        if (!+qAmount)
            return setQErr(isUz ? "Summani kiriting!" : "Enter an amount.");
        onNavigate('Transfer', { recipientPrefill: qCard, amountPrefill: qAmount });
    };

    /* ── Use CSS grid media query via class only at XL ── */
    const [isXL, setIsXL] = useState(typeof window !== 'undefined' && window.innerWidth >= 1280);
    React.useEffect(() => {
        const check = () => setIsXL(window.innerWidth >= 1280);
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    return (
        <div style={{ display: 'grid', gridTemplateColumns: isXL ? '1fr 340px' : '1fr', gap: 28 }}>

            {/* ═══════════════ LEFT COLUMN ═══════════════ */}
            <div style={S.col}>

                {/* ── Hero Balance ── */}
                <div style={{
                    ...S.panel,
                    background: 'linear-gradient(135deg, rgba(17,28,56,0.95) 0%, rgba(10,16,30,0.9) 100%)',
                    position: 'relative', overflow: 'hidden',
                    display: 'flex', flexDirection: 'column', gap: 20,
                }}>
                    {/* glow */}
                    <div style={{
                        position: 'absolute', top: -60, right: -60,
                        width: 260, height: 260,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }} />

                    <span style={S.label}>{isUz ? "Jami mablag'lar" : "Total Net Assets"}</span>

                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '8px 20px' }}>
                        <div>
                            <span style={{ ...S.h1, fontSize: 38 }}>{totalUzs.toLocaleString('uz-UZ')}</span>
                            <span style={{ color: '#8891a8', fontSize: 18, fontWeight: 600, marginLeft: 8 }}>so'm</span>
                        </div>
                        <div style={{ color: '#525b6e', fontSize: 18 }}>•</div>
                        <div>
                            <span style={{ color: '#60a5fa', fontSize: 26, fontWeight: 800, fontFamily: 'Outfit,sans-serif' }}>
                                ${totalUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                            <span style={{ color: '#525b6e', fontSize: 13, fontWeight: 600, marginLeft: 6 }}>USD</span>
                        </div>
                    </div>

                    <p style={{ ...S.body, fontSize: 12, marginTop: -6 }}>
                        {isUz ? "Humo, Uzcard, Visa, Mastercard jamlanmasi" : "Combined balance across all linked cards"}
                    </p>

                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        <button
                            style={S.btnPrimary}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(59,130,246,0.5)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 20px rgba(59,130,246,0.35)'; }}
                            onClick={() => onNavigate('Transfer')}
                        >
                            <Send size={15} />
                            {isUz ? "Yuborish" : "Send Money"}
                        </button>
                        <button
                            style={S.btnSecondary}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#c0c8d8'; }}
                            onClick={() => onNavigate('Payments')}
                        >
                            <Bolt size={15} />
                            {isUz ? "To'lovlar" : "Quick Pay"}
                        </button>
                    </div>
                </div>

                {/* ── Cards section ── */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                        <div style={S.row}>
                            <h2 style={{ ...S.h2, fontSize: 18 }}>{isUz ? "Mening kartalarim" : "My Cards"}</h2>
                            <button
                                onClick={onOpenAddCard}
                                style={S.iconBtn}
                                title={isUz ? "Karta qo'shish" : "Add card"}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.22)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(59,130,246,0.12)'}
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                        {cards.length > 0 && (
                            <span style={{ color: '#525b6e', fontSize: 12 }}>{cards.length} {isUz ? "ta karta" : "cards"}</span>
                        )}
                    </div>

                    {cards.length === 0 ? (
                        /* ── Empty state ── */
                        <button
                            onClick={onOpenAddCard}
                            style={{
                                width: '100%', border: '2px dashed rgba(59,130,246,0.25)',
                                borderRadius: 22, padding: '40px 24px',
                                background: 'rgba(59,130,246,0.03)',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
                                cursor: 'pointer', transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = 'rgba(59,130,246,0.5)';
                                e.currentTarget.style.background = 'rgba(59,130,246,0.07)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = 'rgba(59,130,246,0.25)';
                                e.currentTarget.style.background = 'rgba(59,130,246,0.03)';
                            }}
                        >
                            <div style={{
                                width: 56, height: 56, borderRadius: 18,
                                background: 'rgba(59,130,246,0.12)',
                                border: '1px solid rgba(59,130,246,0.2)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#60a5fa',
                            }}>
                                <Plus size={26} />
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ color: '#f0f2f8', fontSize: 15, fontWeight: 700, marginBottom: 6 }}>
                                    {isUz ? "Karta qo'shing" : "Add your first card"}
                                </div>
                                <div style={{ color: '#525b6e', fontSize: 13 }}>
                                    {isUz ? "Humo, Uzcard, Visa yoki Mastercard kartangizni ulang" : "Link your Humo, Uzcard, Visa or Mastercard"}
                                </div>
                            </div>
                        </button>
                    ) : (
                        <div style={{ display: 'flex', gap: 20, overflowX: 'auto', paddingBottom: 12 }}
                            className="no-scrollbar">
                            {cards.map((card, i) => (
                                <div key={i} onClick={() => setActiveCard(i)}
                                    style={{ flexShrink: 0, cursor: 'pointer' }}>
                                    <CreditCard {...card} active={activeCard === i} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Bottom 2-col grid ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>

                    {/* Mobile App promo */}
                    <div style={{ ...S.panel, position: 'relative', overflow: 'hidden', minHeight: 200 }}>
                        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', gap: 14 }}>
                            <h3 style={S.h3}>{isUz ? "Barcha to'lovlar bir joyda." : "Bank at your fingertips."}</h3>
                            <p style={S.body}>{isUz ? "Apex Mobile ilovamizni bepul yuklab oling!" : "Download the Apex Mobile app for free."}</p>
                            <div style={{ display: 'flex', gap: 10, marginTop: 'auto' }}>
                                {[Apple, Play].map((Icon, i) => (
                                    <button key={i} style={{
                                        width: 40, height: 40, borderRadius: 12,
                                        background: 'rgba(255,255,255,0.08)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        color: '#f0f2f8', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', transition: 'background 0.15s',
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                                    >
                                        <Icon size={18} />
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* decorative phone silhouette */}
                        <div style={{
                            position: 'absolute', right: -16, bottom: -16,
                            width: 100, height: 140,
                            background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(99,102,241,0.08) 100%)',
                            borderRadius: 20, border: '1px solid rgba(255,255,255,0.05)',
                            transform: 'rotate(10deg)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <CardIcon size={22} style={{ color: 'rgba(59,130,246,0.4)' }} />
                        </div>
                    </div>

                    {/* Quick Transfer Widget */}
                    <div style={{ ...S.panel, display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={S.row}>
                            <div style={{ width: 36, height: 36, borderRadius: 11, background: 'rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa' }}>
                                <Smartphone size={17} />
                            </div>
                            <h3 style={S.h3}>{isUz ? "Kartadan kartaga" : "Quick Transfer"}</h3>
                        </div>
                        <form onSubmit={submitQuick} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <input
                                type="text" value={qCard} onChange={onQCard}
                                placeholder="8600 0000 0000 0000"
                                style={S.input}
                                onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.5)'}
                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                            />
                            <div style={{ display: 'flex', gap: 8 }}>
                                <input
                                    type="text" value={qAmount}
                                    onChange={e => setQAmount(e.target.value.replace(/\D/g, ''))}
                                    placeholder={isUz ? "Summa" : "Amount"}
                                    style={{ ...S.input, flex: 1 }}
                                    onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.5)'}
                                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                                />
                                <button type="submit" style={{
                                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                                    background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                                    border: 'none', color: '#fff', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: '0 4px 14px rgba(59,130,246,0.4)',
                                    transition: 'transform 0.15s',
                                }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = ''}
                                >
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                            {qErr && <span style={{ color: '#f87171', fontSize: 12 }}>{qErr}</span>}
                            <span style={{ color: '#525b6e', fontSize: 11, letterSpacing: 1 }}>HUMO · UZCARD · VISA · MC</span>
                        </form>
                    </div>
                </div>
            </div>

            {/* ═══════════════ RIGHT COLUMN ═══════════════ */}
            <div style={S.col}>

                {/* Currency converter */}
                <div style={{ ...S.panel, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={S.row}>
                        <RefreshCw size={15} style={{ color: '#60a5fa' }} />
                        <h3 style={S.h3}>{isUz ? "Valyuta konvertori" : "Currency Converter"}</h3>
                    </div>

                    {[
                        { flag: '🇺🇸', code: 'USD', value: usdInput, onChange: e => setUsdInput(e.target.value), editable: true },
                        { flag: '🇺🇿', code: 'UZS', value: uzResult, editable: false },
                    ].map(({ flag, code, value, onChange, editable }) => (
                        <div key={code} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                            borderRadius: 14, padding: '12px 16px',
                        }}>
                            <div style={S.row}>
                                <span style={{ fontSize: 22 }}>{flag}</span>
                                <span style={{ color: '#f0f2f8', fontSize: 13, fontWeight: 700 }}>{code}</span>
                            </div>
                            {editable
                                ? <input value={value} onChange={onChange} style={{ background: 'transparent', border: 'none', color: '#f0f2f8', fontSize: 15, fontWeight: 800, textAlign: 'right', width: 90, outline: 'none' }} />
                                : <span style={{ color: '#f0f2f8', fontSize: 14, fontWeight: 700 }}>{value}</span>
                            }
                        </div>
                    ))}

                    <div style={{
                        background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(99,102,241,0.08))',
                        border: '1px solid rgba(59,130,246,0.12)', borderRadius: 14,
                        padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                        <div>
                            <div style={{ color: '#8891a8', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>{isUz ? "Daromadlar" : "Income growth"}</div>
                            <div style={{ color: '#f0f2f8', fontSize: 14, fontWeight: 800, marginTop: 4 }}>
                                4.82% <span style={{ color: '#525b6e', fontSize: 12, fontWeight: 500 }}>{isUz ? "bu oyda" : "this month"}</span>
                            </div>
                        </div>
                        <TrendingUp size={22} style={{ color: '#10b981' }} />
                    </div>
                </div>

                {/* Last Activity */}
                <div style={S.panel}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                        <div style={S.row}>
                            <h3 style={S.h3}>{isUz ? "Oxirgi amallar" : "Recent Activity"}</h3>
                            <ChevronRight size={14} style={{ color: '#525b6e' }} />
                        </div>
                        <MoreHorizontal size={17} style={{ color: '#525b6e', cursor: 'pointer' }} />
                    </div>

                    {activities.length === 0 ? (
                        <div style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            gap: 10, padding: '28px 16px', textAlign: 'center',
                        }}>
                            <div style={{
                                width: 48, height: 48, borderRadius: 16,
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.07)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#525b6e',
                            }}>
                                <MoreHorizontal size={22} />
                            </div>
                            <div style={{ color: '#525b6e', fontSize: 13 }}>
                                {isUz ? "Hali hech qanday amal amalga oshirilmagan" : "No transactions yet"}
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {activities.map((item, i) => {
                                const Icon = item.icon || User;
                                const val = parseFloat(item.amount.replace(/\s/g, ''));
                                const neg = item.amount.startsWith('-');
                                const fmt = item.currency === 'USD'
                                    ? (neg ? '-$' : '+$') + Math.abs(val).toFixed(2)
                                    : (neg ? '-' : '+') + Math.abs(val).toLocaleString('uz-UZ') + " so'm";

                                return (
                                    <div key={i} style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '10px 8px', borderRadius: 13, cursor: 'pointer',
                                        transition: 'background 0.15s',
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{
                                                width: 40, height: 40, borderRadius: 13, flexShrink: 0,
                                                background: 'rgba(255,255,255,0.05)',
                                                border: '1px solid rgba(255,255,255,0.07)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: neg ? '#f87171' : '#34d399',
                                            }}>
                                                <Icon size={17} />
                                            </div>
                                            <div>
                                                <div style={{ color: '#f0f2f8', fontSize: 13, fontWeight: 600 }}>{item.name}</div>
                                                <div style={{ color: '#525b6e', fontSize: 11, marginTop: 2 }}>{item.type}</div>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ color: neg ? '#f0f2f8' : '#34d399', fontSize: 13, fontWeight: 700 }}>{fmt}</div>
                                            <div style={{ color: '#525b6e', fontSize: 11, marginTop: 2 }}>{item.time}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
