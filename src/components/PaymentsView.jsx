import React, { useState } from 'react';
import { Zap, CheckCircle2, RotateCcw, ChevronDown } from 'lucide-react';

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
        id: 'mobile', icon: '📱',
        uz: 'Mobil aloqa', en: 'Mobile Operators',
        providers: [
            { id: 'beeline', name: 'Beeline', color: '#FFD700' },
            { id: 'ucell', name: 'Ucell', color: '#E94057' },
            { id: 'mobiuz', name: 'Mobiuz', color: '#1DA462' },
            { id: 'uzmobile', name: 'UzMobile', color: '#0066CC' },
        ],
    },
    {
        id: 'electricity', icon: '⚡',
        uz: 'Elektr energiyasi', en: 'Electricity',
        providers: [{ id: 'energo', name: 'Hududenergo', color: '#F59E0B' }],
    },
    {
        id: 'gas', icon: '🔥',
        uz: 'Gaz ta\'minoti', en: 'Gas Supply',
        providers: [{ id: 'hududgaz', name: 'Hududgaz', color: '#EF4444' }],
    },
    {
        id: 'water', icon: '💧',
        uz: 'Suv ta\'minoti', en: 'Water Supply',
        providers: [{ id: 'suvsoz', name: 'Suvsoz', color: '#3B82F6' }],
    },
    {
        id: 'tax', icon: '🏛️',
        uz: 'Davlat soliqlari', en: 'Government Tax',
        providers: [{ id: 'soliq', name: "Soliq Qo'mitasi", color: '#8B5CF6' }],
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
    const [focused, setFocused] = useState('');

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
        <div style={{ maxWidth: 480, margin: '0 auto', paddingTop: 16 }}>
            <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 24, padding: 48, textAlign: 'center' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(52,211,153,0.12)', border: '2px solid rgba(52,211,153,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: C.green }}>
                    <CheckCircle2 size={38} />
                </div>
                <h2 style={{ color: C.text1, fontSize: 24, fontWeight: 800, fontFamily: 'Outfit,sans-serif', marginBottom: 10 }}>
                    {isUz ? "To'lov amalga oshirildi!" : "Payment Successful!"}
                </h2>
                <p style={{ color: C.text2, fontSize: 15, marginBottom: 8 }}>{provider?.name}</p>
                <p style={{ color: C.green, fontSize: 28, fontWeight: 900, marginBottom: 32 }}>
                    {cards[cardIdx]?.currency === 'USD'
                        ? `$${parseFloat(amount).toFixed(2)}`
                        : `${parseFloat(amount).toLocaleString('uz-UZ')} so'm`}
                </p>
                <button onClick={reset} style={{ padding: '14px 36px', borderRadius: 14, background: 'linear-gradient(135deg,#3b82f6,#6366f1)', border: 'none', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <RotateCcw size={16} />{isUz ? "Yangi to'lov" : "New Payment"}
                </button>
            </div>
        </div>
    );

    return (
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 36 }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>⚡</div>
                <div>
                    <h1 style={{ color: C.text1, fontSize: 26, fontWeight: 800, fontFamily: 'Outfit,sans-serif', marginBottom: 4 }}>
                        {isUz ? "Xizmatlar to'lovi" : "Service Payments"}
                    </h1>
                    <p style={{ color: C.text2, fontSize: 14 }}>
                        {isUz ? "Mobil aloqa, kommunal xizmatlar va davlat to'lovlari" : "Mobile, utilities and government payments"}
                    </p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24 }}>

                {/* Category list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <p style={{ color: C.text3, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>
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
                                <span style={{ fontSize: 22 }}>{svc.icon}</span>
                                <span style={{ color: active ? '#60a5fa' : C.text1, fontSize: 14, fontWeight: active ? 700 : 500 }}>
                                    {isUz ? svc.uz : svc.en}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Payment form */}
                <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 22, padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <h3 style={{ color: C.text1, fontSize: 18, fontWeight: 700 }}>
                        {isUz ? service?.uz : service?.en}
                    </h3>

                    {/* Provider selection */}
                    {service && service.providers.length > 1 && (
                        <div>
                            <p style={{ color: C.text3, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>
                                {isUz ? "Operatorni tanlang" : "Select Provider"}
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                                {service.providers.map(p => {
                                    const act = activeProvider === p.id;
                                    return (
                                        <button key={p.id} onClick={() => setActiveProvider(p.id)} style={{
                                            padding: '10px 20px', borderRadius: 12,
                                            background: act ? `${p.color}22` : 'rgba(255,255,255,0.04)',
                                            border: `1px solid ${act ? p.color + '55' : C.border}`,
                                            color: act ? p.color : C.text2,
                                            fontSize: 14, fontWeight: act ? 700 : 500,
                                            cursor: 'pointer', transition: 'all 0.18s',
                                        }}>{p.name}</button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {/* Phone / account number */}
                        <div>
                            <label style={{ display: 'block', color: C.text3, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>
                                {isUz ? "Telefon / Hisob raqam" : "Phone / Account Number"}
                            </label>
                            <input
                                type="text" value={phone}
                                onChange={e => { setPhone(e.target.value.replace(/\D/g, '')); setError(''); }}
                                placeholder="+998 90 000 00 00"
                                style={inputStyle(focused === 'phone')}
                                onFocus={() => setFocused('phone')}
                                onBlur={() => setFocused('')}
                            />
                        </div>

                        {/* Amount + Card */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                            <div>
                                <label style={{ display: 'block', color: C.text3, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>
                                    {isUz ? "To'lov summasi" : "Amount"}
                                </label>
                                <input
                                    type="text" value={amount}
                                    onChange={e => { setAmount(e.target.value.replace(/\D/g, '')); setError(''); }}
                                    placeholder="50 000"
                                    style={inputStyle(focused === 'amount')}
                                    onFocus={() => setFocused('amount')}
                                    onBlur={() => setFocused('')}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', color: C.text3, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>
                                    {isUz ? "Debet karta" : "Debit Card"}
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <select value={cardIdx} onChange={e => setCardIdx(+e.target.value)} style={{ ...inputStyle(false), appearance: 'none', cursor: 'pointer', paddingRight: 40 }}>
                                        {cards.length === 0
                                            ? <option>{isUz ? "Karta yo'q" : "No cards"}</option>
                                            : cards.map((c, i) => <option key={i} value={i}>•••• {c.number.slice(-4)} ({c.type})</option>)
                                        }
                                    </select>
                                    <ChevronDown size={16} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: C.text3, pointerEvents: 'none' }} />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.22)', borderRadius: 12, padding: '12px 16px', color: C.red, fontSize: 14 }}>{error}</div>
                        )}

                        <button type="submit" disabled={processing} style={{
                            padding: '16px 0', borderRadius: 16,
                            background: processing ? 'rgba(59,130,246,0.4)' : 'linear-gradient(135deg,#3b82f6,#6366f1)',
                            border: 'none', color: '#fff', fontSize: 16, fontWeight: 700,
                            cursor: processing ? 'not-allowed' : 'pointer',
                            boxShadow: '0 6px 24px rgba(59,130,246,0.3)',
                            transition: 'transform 0.15s',
                        }}
                            onMouseEnter={e => { if (!processing) e.currentTarget.style.transform = 'translateY(-2px)'; }}
                            onMouseLeave={e => e.currentTarget.style.transform = ''}
                        >
                            {processing ? (isUz ? "Amalga oshirilmoqda..." : "Processing...") : (isUz ? "To'lovni amalga oshirish" : "Make Payment")}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PaymentsView;
