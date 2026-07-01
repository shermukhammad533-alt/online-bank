import React, { useState } from 'react';
import {
    Plus, MoreHorizontal, ArrowRight, Smartphone,
    Apple, Play, RefreshCw, TrendingUp, ChevronRight,
    User, CreditCard as CardIcon, Send, Bolt,
} from 'lucide-react';
import CreditCard from './CreditCard';

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
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-7 animate-fade-in pb-20">

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
                    </div>
                </div>

                {/* ── Cards section ── */}
                <div className="mt-2">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold text-white tracking-tight">{isUz ? "Mening kartalarim" : "My Cards"}</h2>
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
                        <div className="flex gap-5 overflow-x-auto pb-4 no-scrollbar snap-x">
                            {cards.map((card, i) => (
                                <div key={i} onClick={() => setActiveCard(i)}
                                    className="flex-shrink-0 cursor-pointer snap-start hover:-translate-y-1 transition-transform">
                                    <CreditCard {...card} active={activeCard === i} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Bottom 2-col grid ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">

                    {/* Mobile App promo */}
                    <div className="glass border-white/5 rounded-3xl p-6 relative overflow-hidden min-h-[200px] flex flex-col">
                        <div className="relative z-10 flex flex-col h-full gap-3">
                            <h3 className="text-lg font-bold text-white leading-tight">{isUz ? "Barcha to'lovlar bir joyda." : "Bank at your fingertips."}</h3>
                            <p className="text-gray-400 text-sm">{isUz ? "Apex Mobile ilovamizni bepul yuklab oling!" : "Download the Apex Mobile app for free."}</p>
                            <div className="flex gap-3 mt-auto">
                                {[Apple, Play].map((Icon, i) => (
                                    <button key={i} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-colors">
                                        <Icon size={20} />
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
                        <form onSubmit={submitQuick} className="flex flex-col gap-3">
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
                        <MoreHorizontal size={20} className="text-gray-500 cursor-pointer hover:text-white transition-colors" />
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
        </div>
    );
};

export default Dashboard;
