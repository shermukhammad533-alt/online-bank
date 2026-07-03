import React, { useState } from 'react';
import {
    Plus, MoreHorizontal, ArrowRight, Smartphone,
    Apple, Play, RefreshCw, TrendingUp, ChevronRight,
    User, CreditCard as CardIcon, Send, Bolt, X
} from 'lucide-react';
import CreditCard from './CreditCard';

const S = {
    /* ── Layout ── */
    grid: { display: 'grid', gridTemplateColumns: '1fr', gap: 32 },
    gridXL: { display: 'grid', gridTemplateColumns: '1fr 360px', gap: 36 },
    col: { display: 'flex', flexDirection: 'column', gap: 40 },
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

const Dashboard = ({ cards, setCards, activeCard, setActiveCard, activities, onAddActivity, language, onNavigate, onOpenAddCard }) => {
    const isUz = language === 'uz';

    /* ── Add Money State ── */
    const [isTopUpOpen, setIsTopUpOpen] = useState(false);
    const [topUpAmount, setTopUpAmount] = useState('');
    const [topUpError, setTopUpError] = useState('');

    const handleTopUpSubmit = (e) => {
        e.preventDefault();
        setTopUpError('');
        const amount = parseFloat(topUpAmount);
        if (!amount || amount <= 0) {
            return setTopUpError(isUz ? "To'g'ri summa kiriting!" : "Enter a valid amount!");
        }
        if (cards.length === 0) {
            return setTopUpError(isUz ? "Avval karta qo'shing!" : "Add a card first!");
        }

        const updatedCards = [...cards];
        const currentBal = parseFloat(updatedCards[activeCard].balance.toString().replace(/\s/g, ''));
        updatedCards[activeCard].balance = (currentBal + amount).toFixed(2);
        setCards(updatedCards);

        onAddActivity({
            name: isUz ? 'Hisobni to\'ldirish' : 'Top Up',
            type: 'Top Up',
            time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
            amount: '+' + amount,
            currency: updatedCards[activeCard].currency,
            icon: Plus
        });

        setIsTopUpOpen(false);
        setTopUpAmount('');
    };

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
        <div style={{ display: 'grid', gridTemplateColumns: isXL ? '1fr 340px' : '1fr', gap: 40 }}>

            {/* ═══════════════ LEFT COLUMN ═══════════════ */}
            <div className="flex flex-col gap-6">

                {/* ── Hero Balance ── */}
                <div className="glass border border-white/5 rounded-3xl p-8 relative overflow-hidden flex flex-col gap-5 shadow-2xl shadow-blue-900/10">
                    {/* glow */}
                    <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl pointer-events-none"></div>

                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{isUz ? "Jami mablag'lar" : "Total Net Assets"}</span>

                    <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 relative z-10">
                        <div>
                            <span className="text-4xl sm:text-5xl font-black text-white font-sans tracking-tight">{totalUzs.toLocaleString('uz-UZ')}</span>
                            <span className="text-gray-400 text-lg font-bold ml-2">so'm</span>
                        </div>
                        <div className="text-gray-600 text-xl">•</div>
                        <div>
                            <span className="text-blue-400 text-3xl font-black font-mono tracking-tight">
                                ${totalUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                            <span className="text-gray-500 text-sm font-bold ml-2">USD</span>
                        </div>
                    </div>

                    <p className="text-gray-400 text-xs -mt-2">
                        {isUz ? "Humo, Uzcard, Visa, Mastercard jamlanmasi" : "Combined balance across all linked cards"}
                    </p>

                    <div className="flex gap-3 flex-wrap mt-2 relative z-10">
                        <button
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-[0_4px_20px_rgba(59,130,246,0.35)] transition-all transform hover:-translate-y-0.5 active:scale-95"
                            onClick={() => onNavigate('Transfer')}
                        >
                            <Send size={16} />
                            {isUz ? "Yuborish" : "Send Money"}
                        </button>
                        <button
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white text-gray-300 font-bold text-sm transition-all active:scale-95"
                            onClick={() => onNavigate('Payments')}
                        >
                            <Bolt size={16} />
                            {isUz ? "To'lovlar" : "Quick Pay"}
                        </button>
                        <button
                            style={{ ...S.btnSecondary, background: 'rgba(52,211,153,0.1)', borderColor: 'rgba(52,211,153,0.2)', color: '#34d399' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(52,211,153,0.15)'; e.currentTarget.style.color = '#6ee7b7'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(52,211,153,0.1)'; e.currentTarget.style.color = '#34d399'; }}
                            onClick={() => setIsTopUpOpen(true)}
                        >
                            <Plus size={15} />
                            {isUz ? "Pul qo'shish" : "Add Money"}
                        </button>
                    </div>
                </div>

                {/* ── Cards section ── */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, padding: '0 12px' }}>
                        <div style={S.row}>
                            <h2 style={{ ...S.h2, fontSize: 18 }}>{isUz ? "Mening kartalarim" : "My Cards"}</h2>
                            <button
                                onClick={onOpenAddCard}
                                className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center hover:bg-blue-500/20 transition-all flex-shrink-0"
                                title={isUz ? "Karta qo'shish" : "Add card"}
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                        {cards.length > 0 && (
                            <span className="text-gray-500 text-sm font-medium">{cards.length} {isUz ? "ta karta" : "cards"}</span>
                        )}
                    </div>

                    {cards.length === 0 ? (
                        /* ── Empty state ── */
                        <button
                            onClick={onOpenAddCard}
                            className="w-full border-2 border-dashed border-blue-500/30 rounded-3xl p-10 bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-500/50 flex flex-col items-center gap-4 cursor-pointer transition-all group"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                <Plus size={28} />
                            </div>
                            <div className="text-center">
                                <div className="text-white text-lg font-bold mb-1">
                                    {isUz ? "Karta qo'shing" : "Add your first card"}
                                </div>
                                <div className="text-gray-400 text-sm">
                                    {isUz ? "Humo, Uzcard, Visa yoki Mastercard kartangizni ulang" : "Link your Humo, Uzcard, Visa or Mastercard"}
                                </div>
                            </div>
                        </button>
                    ) : (
                        <div style={{ display: 'flex', gap: 20, overflowX: 'auto', padding: '24px 16px', margin: '0 -16px', justifyContent: cards.length === 1 ? 'center' : 'flex-start' }}
                            className="no-scrollbar">
                            {cards.map((card, i) => (
                                <div key={i} onClick={() => setActiveCard(i)}
                                    style={{ flexShrink: 0, cursor: 'pointer', display: 'flex' }}>
                                    <CreditCard {...card} active={activeCard === i} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Bottom 2-col grid ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 32 }}>

                    {/* Mobile App promo */}
                    <div style={{ ...S.panel, position: 'relative', overflow: 'hidden', minHeight: 200 }}>
                        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', gap: 18 }}>
                            <h3 style={S.h3}>{isUz ? "Barcha to'lovlar bir joyda." : "Bank at your fingertips."}</h3>
                            <p style={S.body}>{isUz ? "Apex Mobile ilovamizni bepul yuklab oling!" : "Download the Apex Mobile app for free."}</p>
                            <div style={{ display: 'flex', gap: 10, marginTop: 'auto' }}>
                                {[Apple, Play].map((Icon, i) => (
                                    <button key={i} onClick={() => alert(isUz ? "Ilova tez orada taqdim etiladi!" : "App coming soon!")} style={{
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
                        <div className="absolute -right-4 -bottom-4 w-24 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-3xl border border-white/5 transform rotate-12 flex items-center justify-center pointer-events-none">
                            <CardIcon size={28} className="text-blue-500/40" />
                        </div>
                    </div>

                    {/* Quick Transfer Widget */}
                    <div className="glass border-white/5 rounded-3xl p-6 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                                <Smartphone size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-white">{isUz ? "Kartadan kartaga" : "Quick Transfer"}</h3>
                        </div>
                        <form onSubmit={submitQuick} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <input
                                type="text" value={qCard} onChange={onQCard}
                                placeholder="8600 0000 0000 0000"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-blue-500/50 transition-colors"
                            />
                            <div className="flex gap-2">
                                <input
                                    type="text" value={qAmount}
                                    onChange={e => setQAmount(e.target.value.replace(/\D/g, ''))}
                                    placeholder={isUz ? "Summa" : "Amount"}
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-blue-500/50 transition-colors"
                                />
                                <button type="submit" className="w-12 h-12 rounded-xl flex-shrink-0 bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 transition-transform hover:scale-105 active:scale-95 border-none cursor-pointer">
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                            {qErr && <span className="text-red-400 text-xs font-medium">{qErr}</span>}
                            <span className="text-gray-500 text-[10px] tracking-widest uppercase font-bold mt-1">HUMO · UZCARD · VISA · MC</span>
                        </form>
                    </div>
                </div>
            </div>

            {/* ═══════════════ RIGHT COLUMN ═══════════════ */}
            <div className="flex flex-col gap-6">

                {/* Currency converter */}
                <div className="glass border-white/5 rounded-3xl p-6 flex flex-col gap-4">
                    <div className="flex items-center gap-3 mb-2">
                        <RefreshCw size={18} className="text-blue-400" />
                        <h3 className="text-lg font-bold text-white">{isUz ? "Valyuta konvertori" : "Currency Converter"}</h3>
                    </div>

                    {[
                        { flag: '🇺🇸', code: 'USD', value: usdInput, onChange: e => setUsdInput(e.target.value), editable: true },
                        { flag: '🇺🇿', code: 'UZS', value: uzResult, editable: false },
                    ].map(({ flag, code, value, onChange, editable }) => (
                        <div key={code} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{flag}</span>
                                <span className="text-white text-sm font-bold">{code}</span>
                            </div>
                            {editable
                                ? <input value={value} onChange={onChange} className="bg-transparent border-none text-white text-base font-black text-right w-24 outline-none font-mono" />
                                : <span className="text-white text-base font-black font-mono">{value}</span>
                            }
                        </div>
                    ))}

                    <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-2xl p-4 flex items-center justify-between mt-2">
                        <div>
                            <div className="text-gray-400 text-[11px] uppercase tracking-widest font-bold">{isUz ? "Daromadlar" : "Income growth"}</div>
                            <div className="text-white text-sm font-black mt-1">
                                4.82% <span className="text-gray-500 text-xs font-medium ml-1">{isUz ? "bu oyda" : "this month"}</span>
                            </div>
                        </div>
                        <TrendingUp size={24} className="text-emerald-400" />
                    </div>
                </div>

                {/* Last Activity */}
                <div className="glass border-white/5 rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-white">{isUz ? "Oxirgi amallar" : "Recent Activity"}</h3>
                            <ChevronRight size={16} className="text-gray-500" />
                        </div>
                        <MoreHorizontal size={17} style={{ color: '#525b6e', cursor: 'pointer' }} onClick={() => alert(isUz ? "Barcha amallar (Tez orada)" : "All history (Coming soon)")} />
                    </div>

                    {activities.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 py-8 text-center">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500">
                                <MoreHorizontal size={24} />
                            </div>
                            <div className="text-gray-500 text-sm">
                                {isUz ? "Hali hech qanday amal amalga oshirilmagan" : "No transactions yet"}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {activities.map((item, i) => {
                                const Icon = item.icon || User;
                                const val = parseFloat(item.amount.replace(/\s/g, ''));
                                const neg = item.amount.startsWith('-');
                                const fmt = item.currency === 'USD'
                                    ? (neg ? '-$' : '+$') + Math.abs(val).toFixed(2)
                                    : (neg ? '-' : '+') + Math.abs(val).toLocaleString('uz-UZ') + " so'm";

                                return (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-2xl cursor-pointer hover:bg-white/5 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-11 h-11 rounded-xl flex-shrink-0 bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform ${neg ? 'text-red-400' : 'text-emerald-400'}`}>
                                                <Icon size={20} />
                                            </div>
                                            <div>
                                                <div className="text-white text-sm font-bold">{item.name}</div>
                                                <div className="text-gray-500 text-[11px] mt-0.5">{item.type}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-sm font-bold font-mono ${neg ? 'text-white' : 'text-emerald-400'}`}>{fmt}</div>
                                            <div className="text-gray-500 text-[11px] mt-0.5">{item.time}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>

            {/* Top Up Modal */}
            {isTopUpOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}>
                    <div style={{ background: '#0e1628', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: 32, width: '100%', maxWidth: 400, position: 'relative' }}>
                        <button onClick={() => setIsTopUpOpen(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'transparent', border: 'none', color: '#8891a8', cursor: 'pointer' }}>
                            <X size={20} />
                        </button>
                        <h2 style={{ ...S.h2, marginBottom: 20, fontSize: 24 }}>{isUz ? "Hisobni to'ldirish" : "Top Up Account"}</h2>
                        {cards.length === 0 ? (
                            <p style={{ color: '#f87171', fontSize: 15 }}>{isUz ? "Iltimos, oldin karta qo'shing." : "Please add a card first."}</p>
                        ) : (
                            <form onSubmit={handleTopUpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                <div>
                                    <label style={{ ...S.label, display: 'block', marginBottom: 8 }}>{isUz ? "Qaysi kartaga:" : "To which card:"}</label>
                                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px 16px', borderRadius: 12, color: '#60a5fa', fontWeight: 'bold' }}>
                                        {cards[activeCard].type} •••• {cards[activeCard].number.slice(-4)}
                                    </div>
                                </div>
                                <div>
                                    <label style={{ ...S.label, display: 'block', marginBottom: 8 }}>{isUz ? "Summani kiriting:" : "Enter amount:"}</label>
                                    <input
                                        type="number"
                                        value={topUpAmount}
                                        onChange={e => setTopUpAmount(e.target.value)}
                                        placeholder="50000"
                                        style={{ ...S.input, fontSize: 20, padding: 16 }}
                                        autoFocus
                                    />
                                    {topUpError && <p style={{ color: '#f87171', fontSize: 13, marginTop: 8 }}>{topUpError}</p>}
                                </div>
                                <button type="submit" style={{ ...S.btnPrimary, width: '100%', justifyContent: 'center', height: 56, fontSize: 16, marginTop: 8 }}>
                                    {isUz ? "To'ldirish" : "Top Up"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
