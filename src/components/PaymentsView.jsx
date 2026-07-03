import React, { useState } from 'react';
import { Zap, CheckCircle2, RotateCcw, ChevronDown, Smartphone, Flame, Droplets, Landmark } from 'lucide-react';

const C = {
    panel: 'rgba(13,20,37,0.85)',
    border: 'rgba(255,255,255,0.07)',
    text1: '#f0f2f8',
    text2: '#8891a8',
    text3: '#525b6e',
    green: '#34d399',
    red: '#f87171',
};

const inputStyle = (focused) => ({
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: `1px solid ${focused ? 'rgba(59,130,246,0.55)' : C.border}`,
    borderRadius: 14,
    padding: '14px 18px',
    fontSize: 15,
    color: C.text1,
    outline: 'none',
    fontFamily: 'Inter,sans-serif',
    transition: 'border-color 0.2s',
});

const SERVICES = [
    {
        id: 'mobile', Icon: Smartphone, color: '#60a5fa',
        uz: 'Mobil aloqa', en: 'Mobile Operators',
        providers: [
            { id: 'beeline', name: 'Beeline', color: 'from-yellow-400 to-yellow-600', text: 'text-yellow-400' },
            { id: 'ucell', name: 'Ucell', color: 'from-purple-500 to-purple-700', text: 'text-purple-400' },
            { id: 'mobiuz', name: 'Mobiuz', color: 'from-red-500 to-red-700', text: 'text-red-400' },
            { id: 'uzmobile', name: 'UzMobile', color: 'from-blue-500 to-blue-700', text: 'text-blue-400' },
        ],
    },
    {
        id: 'electricity', Icon: Zap, color: '#FBBF24',
        uz: 'Elektr energiyasi', en: 'Electricity',
        providers: [{ id: 'energo', name: 'Hududenergo', color: 'from-amber-400 to-amber-600', text: 'text-amber-400' }],
    },
    {
        id: 'gas', Icon: Flame, color: '#F87171',
        uz: "Gaz ta'minoti", en: 'Gas Supply',
        providers: [{ id: 'hududgaz', name: 'Hududgaz', color: '#EF4444' }],
    },
    {
        id: 'water', Icon: Droplets, color: '#38BDF8',
        uz: "Suv ta'minoti", en: 'Water Supply',
        providers: [{ id: 'suvsoz', name: 'Suvsoz', color: '#3B82F6' }],
    },
    {
        id: 'tax', Icon: Landmark, color: '#A78BFA',
        uz: 'Davlat soliqlari', en: 'Government Tax',
        providers: [{ id: 'soliq', name: "Soliq Qo'mitasi", color: 'from-indigo-400 to-purple-600', text: 'text-indigo-400' }],
    },
];

const PaymentsView = ({ cards, onUpdateCards, onAddActivity, language }) => {
    const isUz = language === 'uz';

    const [activeService, setActiveService] = useState(SERVICES[0].id);
    const [activeProvider, setActiveProvider] = useState(SERVICES[0].providers[0].id);
    const [phone, setPhone] = useState('');
    const [amount, setAmount] = useState('');
    const [cardIdx, setCardIdx] = useState(0);
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);
    const [done, setDone] = useState(false);

    const service = SERVICES.find(s => s.id === activeService);
    const provider = service?.providers.find(p => p.id === activeProvider) ?? service?.providers[0];

    const onSubmit = (e) => {
        e.preventDefault(); setError('');
        const src = cards[cardIdx];
        if (!src) return setError(isUz ? "Avval karta tanlang!" : "Select a source card first.");
        if (phone.length < 9) return setError(isUz ? "To'g'ri raqam kiriting!" : "Enter a valid account/phone number.");
        const amt = parseFloat(amount);
        if (!amt || amt <= 0) return setError(isUz ? "Summani kiriting!" : "Enter an amount.");
        if (parseFloat(src.balance) < amt) return setError(isUz ? "Mablag' yetarli emas!" : "Insufficient balance.");

        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            const updated = [...cards];
            updated[cardIdx] = { ...src, balance: (parseFloat(src.balance) - amt).toFixed(2) };
            onUpdateCards(updated);
            onAddActivity({
                name: provider?.name ?? service.id,
                type: isUz ? service.uz : service.en,
                amount: `-${amt.toFixed(2)}`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                color: 'bg-yellow-500/20 text-yellow-400',
                icon: Zap,
                currency: src.currency,
            });
            setDone(true);
        }, 1500);
    };

    const reset = () => { setPhone(''); setAmount(''); setError(''); setDone(false); };

    if (done) return (
        <div className="max-w-2xl mx-auto pt-8 animate-fade-in pb-20">
            <div className="glass p-12 text-center relative overflow-hidden border-emerald-500/30 shadow-2xl shadow-emerald-500/10">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-400"></div>
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-500/5 shadow-inner mb-6">
                    <CheckCircle2 size={48} className="animate-pulse-slow" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2 font-sans">
                    {isUz ? "To'lov amalga oshirildi!" : "Payment Successful!"}
                </h2>
                <p className="text-gray-400 text-lg mb-4">{provider?.name}</p>
                <p className="text-emerald-400 text-4xl font-black mb-10 font-mono tracking-tight">
                    {cards[cardIdx]?.currency === 'USD'
                        ? `$${parseFloat(amount).toFixed(2)}`
                        : `${parseFloat(amount).toLocaleString('uz-UZ')} so'm`}
                </p>
                <button onClick={reset} className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold inline-flex items-center gap-3 shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 active:scale-95">
                    <RotateCcw size={20} />{isUz ? "Yangi to'lov" : "New Payment"}
                </button>
            </div>
        </div>
    );

    return (
        <div className="max-w-[1200px] mx-auto animate-fade-in pb-20">
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 36 }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Zap size={24} style={{ color: '#FBBF24' }} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white font-sans tracking-tight mb-1">
                        {isUz ? "Xizmatlar to'lovi" : "Service Payments"}
                    </h1>
                    <p className="text-gray-400 text-sm">
                        {isUz ? "Mobil aloqa, kommunal xizmatlar va davlat to'lovlari" : "Mobile, utilities and government payments"}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Category list */}
                <div className="lg:col-span-4 space-y-4">
                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mb-4">
                        {isUz ? "Kategoriya" : "Category"}
                    </p>
                    {SERVICES.map(svc => {
                        const active = activeService === svc.id;
                        return (
                            <button key={svc.id} onClick={() => { setActiveService(svc.id); setActiveProvider(svc.providers[0].id); setError(''); }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                                    borderRadius: 14, cursor: 'pointer', textAlign: 'left',
                                    background: active ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.03)',
                                    border: `1px solid ${active ? 'rgba(59,130,246,0.3)' : C.border}`,
                                    transition: 'all 0.18s',
                                }}>
                                <div style={{
                                    width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: active ? `${svc.color}22` : 'rgba(255,255,255,0.05)',
                                    border: `1px solid ${active ? svc.color + '44' : 'rgba(255,255,255,0.07)'}`,
                                    color: active ? svc.color : '#525b6e',
                                    transition: 'all 0.18s',
                                }}>
                                    <svc.Icon size={17} />
                                </div>
                                <span style={{ color: active ? '#60a5fa' : C.text1, fontSize: 14, fontWeight: active ? 700 : 500 }}>
                                    {isUz ? svc.uz : svc.en}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Payment form */}
                <div className="lg:col-span-8">
                    <div className="glass p-8 lg:p-10 space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                        <h3 className="text-2xl font-bold text-white tracking-tight border-b border-white/5 pb-4">
                            {isUz ? service?.uz : service?.en}
                        </h3>

                        {/* Provider selection */}
                        {service && service.providers.length > 1 && (
                            <div className="space-y-4 relative z-10">
                                <p className="text-[12px] text-gray-400 font-bold uppercase tracking-widest">
                                    {isUz ? "Operatorni tanlang" : "Select Provider"}
                                </p>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {service.providers.map(p => {
                                        const act = activeProvider === p.id;
                                        return (
                                            <button key={p.id} onClick={() => setActiveProvider(p.id)} 
                                                className={`py-3 px-2 rounded-xl transition-all duration-300 border-2 font-bold text-sm ${act ? ("bg-gradient-to-br " + p.color + " border-transparent text-white shadow-lg transform scale-105") : 'bg-[#0a0f1c] border-white/5 text-gray-400 hover:border-white/10 hover:bg-white/5'}`}>
                                                {p.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <form onSubmit={onSubmit} className="space-y-6 pt-2 relative z-10">
                            {/* Phone / account number */}
                            <div className="space-y-2">
                                <label className="text-[12px] text-gray-400 font-bold uppercase tracking-widest block">
                                    {isUz ? "Telefon / Hisob raqam" : "Phone / Account Number"}
                                </label>
                                <input
                                    type="text" value={phone}
                                    onChange={e => { setPhone(e.target.value.replace(/\D/g, '')); setError(''); }}
                                    placeholder="90 000 00 00"
                                    className="w-full bg-[#0a0f1c] border-2 border-white/5 rounded-xl px-4 py-4 text-lg text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-mono font-bold transition-all placeholder:text-gray-600"
                                />
                            </div>

                            {/* Amount + Card */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[12px] text-gray-400 font-bold uppercase tracking-widest block">
                                        {isUz ? "To'lov summasi" : "Amount"}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text" value={amount}
                                            onChange={e => { setAmount(e.target.value.replace(/\D/g, '')); setError(''); }}
                                            placeholder="50 000"
                                            className="w-full bg-[#0a0f1c] border-2 border-white/5 rounded-xl px-4 py-4 text-lg text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-mono font-bold transition-all placeholder:text-gray-600"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold font-mono">UZS</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[12px] text-gray-400 font-bold uppercase tracking-widest block">
                                        {isUz ? "Debet karta" : "Debit Card"}
                                    </label>
                                    <div className="relative">
                                        <select value={cardIdx} onChange={e => setCardIdx(+e.target.value)} 
                                            className="w-full bg-[#0a0f1c] border-2 border-white/5 rounded-xl px-4 py-4 text-base text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-medium transition-all appearance-none cursor-pointer">
                                            {cards.length === 0
                                                ? <option>{isUz ? "Karta yo'q" : "No cards"}</option>
                                                : cards.map((c, i) => <option key={i} value={i} className="bg-slate-900 py-2">•••• {c.number.slice(-4)} ({c.type})</option>)
                                            }
                                        </select>
                                        <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm font-medium animate-fade-in flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                    {error}
                                </div>
                            )}

                            <button type="submit" disabled={processing} 
                                className="w-full mt-4 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-lg shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex justify-center items-center gap-3">
                                {processing ? (
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        {isUz ? "Amalga oshirilmoqda..." : "Processing..."}
                                    </div>
                                ) : (
                                    <>{isUz ? "To'lovni amalga oshirish" : "Make Payment"}</>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentsView;
