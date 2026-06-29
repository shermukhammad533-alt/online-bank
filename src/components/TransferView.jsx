import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, CreditCard, ArrowRight, CheckCircle2, Loader2, Info, RotateCcw, Printer } from 'lucide-react';

/* ── shared style tokens ── */
const C = {
    bg: '#080d1a',
    panel: 'rgba(13,20,37,0.85)',
    border: 'rgba(255,255,255,0.07)',
    blue: '#3b82f6',
    text1: '#f0f2f8',
    text2: '#8891a8',
    text3: '#525b6e',
    green: '#34d399',
    red: '#f87171',
    radius: 20,
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
    fontFamily: 'Inter,monospace',
    transition: 'border-color 0.2s',
});

const labelStyle = {
    display: 'block',
    color: C.text3,
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
};

const TransferView = ({ cards, onUpdateCards, onAddActivity, language }) => {
    const isUz = language === 'uz';

    const [selectedIdx, setSelectedIdx] = useState(0);
    const [recipient, setRecipient] = useState('');
    const [recipientName, setRName] = useState('');
    const [cardType, setCardType] = useState('');
    const [amount, setAmount] = useState('');
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [receipt, setReceipt] = useState(null);
    const [focusedField, setFocused] = useState('');

    useEffect(() => {
        const raw = recipient.replace(/\s/g, '');
        if (raw.length < 4) { setCardType(''); setRName(''); return; }
        if (raw.startsWith('8600')) setCardType('UZCARD');
        else if (raw.startsWith('9860')) setCardType('HUMO');
        else if (raw.startsWith('4')) setCardType('VISA');
        else if (raw.startsWith('5')) setCardType('MASTERCARD');
        else setCardType('APEX');
        if (raw.length === 16) {
            const sum = raw.split('').reduce((a, c) => a + +c, 0);
            const names = ['Farrux Xamidov', 'Zilola Rustamova', 'Jasur Abdullaev', 'Malika Karimova', 'Azizbek Alimov', 'Nilufar Turobova'];
            setRName(names[sum % names.length]);
        } else setRName('');
    }, [recipient]);

    const onRecipientChange = (e) => {
        let v = e.target.value.replace(/\D/g, '').slice(0, 16);
        setRecipient(v.match(/\d{1,4}/g)?.join(' ') ?? '');
    };

    const onSubmit = (e) => {
        e.preventDefault(); setError('');
        const src = cards[selectedIdx];
        if (!src) return setError(isUz ? "Avval karta tanlang!" : "Please select a source card.");
        const raw = recipient.replace(/\s/g, '');
        if (raw.length !== 16) return setError(isUz ? "16 xonali karta raqam kiriting!" : "Enter a valid 16-digit card number.");
        const amt = parseFloat(amount);
        if (!amt || amt <= 0) return setError(isUz ? "Summani kiriting!" : "Enter a valid amount.");
        const bal = parseFloat(src.balance);
        if (bal < amt) return setError(isUz ? "Kartangizda mablag' yetarli emas!" : "Insufficient balance.");

        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            const commission = src.currency === 'UZS' ? Math.round(amt * 0.005) : 0;
            const total = amt + commission;
            const updated = [...cards];
            updated[selectedIdx] = { ...src, balance: (bal - total).toFixed(2) };
            onUpdateCards(updated);
            onAddActivity({
                name: recipientName || `*${raw.slice(-4)}`,
                type: isUz ? "Kartalararo o'tkazma" : "Card transfer",
                amount: `-${amt.toFixed(2)}`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                color: 'bg-red-500/20 text-red-400',
                icon: CreditCard,
                currency: src.currency,
            });
            setReceipt({
                id: 'TXN' + Math.floor(10000000 + Math.random() * 90000000),
                date: new Date().toLocaleString(),
                from: src.number,
                to: recipient,
                toName: recipientName || (isUz ? "Noma'lum" : "Unknown"),
                toType: cardType,
                amount: amt,
                currency: src.currency,
                commission,
                comment,
            });
            setSuccess(true);
        }, 1800);
    };

    const reset = () => {
        setRecipient(''); setRName(''); setAmount(''); setComment('');
        setError(''); setSuccess(false); setReceipt(null);
    };

    /* ── Success receipt screen ── */
    if (success && receipt) return (
        <div style={{ maxWidth: 560, margin: '0 auto', paddingTop: 16 }}>
            <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 24, padding: 40, textAlign: 'center' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(52,211,153,0.12)', border: '2px solid rgba(52,211,153,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: C.green }}>
                    <CheckCircle2 size={36} />
                </div>
                <h2 style={{ color: C.text1, fontSize: 24, fontWeight: 800, marginBottom: 8, fontFamily: 'Outfit,sans-serif' }}>
                    {isUz ? "O'tkazma muvaffaqiyatli!" : "Transfer Successful!"}
                </h2>
                <p style={{ color: C.text2, fontSize: 15, marginBottom: 32 }}>
                    {isUz ? "Mablag' qabul qiluvchi hisobiga yuborildi" : "Funds sent to recipient successfully"}
                </p>

                {/* Receipt rows */}
                {[
                    [isUz ? "Tranzaksiya ID" : "Transaction ID", receipt.id],
                    [isUz ? "Sana va vaqt" : "Date & Time", receipt.date],
                    [isUz ? "Qabul qiluvchi" : "Recipient", `${receipt.toName} — ${receipt.to} (${receipt.toType})`],
                    [isUz ? "Yuboruvchi karta" : "From Card", receipt.from],
                    [isUz ? "Komissiya" : "Commission", receipt.currency === 'USD' ? '$0.00' : `${receipt.commission.toLocaleString('uz-UZ')} so'm`],
                    [isUz ? "Jami summa" : "Total Paid",
                    receipt.currency === 'USD'
                        ? `$${receipt.amount.toFixed(2)}`
                        : `${receipt.amount.toLocaleString('uz-UZ')} so'm`, true],
                ].map(([label, value, highlight], i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '14px 0', borderBottom: `1px solid ${C.border}` }}>
                        <span style={{ color: C.text3, fontSize: 13 }}>{label}</span>
                        <span style={{ color: highlight ? C.green : C.text1, fontSize: highlight ? 18 : 14, fontWeight: highlight ? 800 : 600, textAlign: 'right', maxWidth: '60%' }}>{value}</span>
                    </div>
                ))}

                <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
                    <button onClick={reset} style={{ flex: 1, padding: '14px 0', borderRadius: 14, background: 'linear-gradient(135deg,#3b82f6,#6366f1)', border: 'none', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        <RotateCcw size={16} />{isUz ? "Yangi o'tkazma" : "New Transfer"}
                    </button>
                    <button onClick={() => window.print()} style={{ padding: '14px 22px', borderRadius: 14, background: 'rgba(255,255,255,0.06)', border: `1px solid ${C.border}`, color: C.text2, fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Printer size={16} />PDF
                    </button>
                </div>
            </div>
        </div>
    );

    /* ── Main transfer form ── */
    return (
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 36 }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(59,130,246,0.12)', border: `1px solid rgba(59,130,246,0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa', flexShrink: 0 }}>
                    <ArrowRightLeft size={24} />
                </div>
                <div>
                    <h1 style={{ color: C.text1, fontSize: 26, fontWeight: 800, fontFamily: 'Outfit,sans-serif', marginBottom: 4 }}>
                        {isUz ? "Pul o'tkazmalari" : "Money Transfer"}
                    </h1>
                    <p style={{ color: C.text2, fontSize: 14 }}>
                        {isUz ? "O'zbekiston bo'ylab istalgan kartaga pul yuboring" : "Send money to any card instantly and securely"}
                    </p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24 }}>

                {/* Left: source card selector */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <h3 style={{ color: C.text1, fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
                        {isUz ? "Mablag' manbasi" : "Source Card"}
                    </h3>

                    {cards.length === 0 ? (
                        <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, textAlign: 'center', color: C.text3, fontSize: 14 }}>
                            {isUz ? "Karta yo'q. Avval karta qo'shing." : "No cards. Add a card first."}
                        </div>
                    ) : (
                        cards.map((card, i) => {
                            const bal = parseFloat(card.balance);
                            const fmtBal = card.currency === 'USD'
                                ? `$${bal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                                : `${bal.toLocaleString('uz-UZ')} so'm`;
                            const active = selectedIdx === i;
                            return (
                                <div key={i} onClick={() => setSelectedIdx(i)} style={{
                                    background: active ? 'rgba(59,130,246,0.1)' : C.panel,
                                    border: `1px solid ${active ? 'rgba(59,130,246,0.4)' : C.border}`,
                                    borderRadius: 16, padding: 18, cursor: 'pointer',
                                    transition: 'all 0.18s',
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                        <span style={{ color: C.text3, fontSize: 12, fontFamily: 'monospace' }}>•••• {card.number.slice(-4)}</span>
                                        <span style={{ color: active ? '#60a5fa' : C.text3, fontSize: 11, fontWeight: 700, background: active ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.05)', padding: '3px 8px', borderRadius: 6 }}>{card.type}</span>
                                    </div>
                                    <div style={{ color: C.text3, fontSize: 11, marginBottom: 4 }}>{isUz ? "Balans" : "Balance"}</div>
                                    <div style={{ color: C.text1, fontSize: 18, fontWeight: 800 }}>{fmtBal}</div>
                                </div>
                            );
                        })
                    )}

                    {/* Info note */}
                    <div style={{ background: 'rgba(234,179,8,0.07)', border: '1px solid rgba(234,179,8,0.18)', borderRadius: 14, padding: 16, display: 'flex', gap: 12 }}>
                        <Info size={20} style={{ color: '#fbbf24', flexShrink: 0, marginTop: 2 }} />
                        <p style={{ color: '#fbbf24', fontSize: 13, lineHeight: 1.6 }}>
                            {isUz ? "Humo va Uzcard o'rtasida 0.5% komissiya undiriladi." : "0.5% commission applies for Humo & Uzcard transfers."}
                        </p>
                    </div>
                </div>

                {/* Right: form */}
                <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 22, padding: 32 }}>
                    <h3 style={{ color: C.text1, fontSize: 18, fontWeight: 700, marginBottom: 28 }}>
                        {isUz ? "Kartadan kartaga" : "Card to Card Transfer"}
                    </h3>

                    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        {/* Recipient card */}
                        <div>
                            <label style={labelStyle}>{isUz ? "Qabul qiluvchi karta raqami" : "Recipient Card Number"}</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text" value={recipient} onChange={onRecipientChange}
                                    placeholder="8600 0000 0000 0000"
                                    style={inputStyle(focusedField === 'card')}
                                    onFocus={() => setFocused('card')}
                                    onBlur={() => setFocused('')}
                                />
                                {cardType && (
                                    <span style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(59,130,246,0.15)', color: '#60a5fa', fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 8, letterSpacing: 1 }}>{cardType}</span>
                                )}
                            </div>
                            {recipientName && (
                                <div style={{ marginTop: 10, background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 12, padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ color: C.green, fontSize: 13 }}>
                                        {isUz ? "Qabul qiluvchi: " : "Recipient: "}<strong>{recipientName}</strong>
                                    </span>
                                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.green, animation: 'none' }} />
                                </div>
                            )}
                        </div>

                        {/* Amount + Comment */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                            <div>
                                <label style={labelStyle}>{isUz ? "O'tkazma summasi" : "Amount to Send"}</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text" value={amount}
                                        onChange={e => { setAmount(e.target.value.replace(/\D/g, '')); setError(''); }}
                                        placeholder="0"
                                        style={inputStyle(focusedField === 'amount')}
                                        onFocus={() => setFocused('amount')}
                                        onBlur={() => setFocused('')}
                                    />
                                    <span style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: C.text3, fontSize: 13, fontWeight: 700 }}>
                                        {cards[selectedIdx]?.currency || 'UZS'}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label style={labelStyle}>{isUz ? "Izoh (majburiy emas)" : "Comment (optional)"}</label>
                                <input
                                    type="text" value={comment}
                                    onChange={e => setComment(e.target.value)}
                                    placeholder={isUz ? "Xizmat haqi..." : "Payment for..."}
                                    style={inputStyle(focusedField === 'comment')}
                                    onFocus={() => setFocused('comment')}
                                    onBlur={() => setFocused('')}
                                />
                            </div>
                        </div>

                        {/* Commission preview */}
                        {amount && cards[selectedIdx]?.currency === 'UZS' && (
                            <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: C.text2, fontSize: 14 }}>{isUz ? "Komissiya (0.5%)" : "Commission (0.5%)"}</span>
                                <span style={{ color: C.text1, fontSize: 14, fontWeight: 700 }}>
                                    {Math.round(+amount * 0.005).toLocaleString('uz-UZ')} so'm
                                </span>
                            </div>
                        )}

                        {error && (
                            <div style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.22)', borderRadius: 12, padding: '12px 16px', color: C.red, fontSize: 14 }}>
                                {error}
                            </div>
                        )}

                        <button type="submit" disabled={processing} style={{
                            width: '100%', padding: '16px 0', borderRadius: 16,
                            background: processing ? 'rgba(59,130,246,0.4)' : 'linear-gradient(135deg,#3b82f6,#6366f1)',
                            border: 'none', color: '#fff', fontSize: 16, fontWeight: 700,
                            cursor: processing ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                            boxShadow: '0 6px 24px rgba(59,130,246,0.35)',
                            transition: 'transform 0.15s, box-shadow 0.15s',
                        }}
                            onMouseEnter={e => { if (!processing) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(59,130,246,0.5)'; } }}
                            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 6px 24px rgba(59,130,246,0.35)'; }}
                        >
                            {processing
                                ? <><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />{isUz ? "Yuborilmoqda..." : "Sending..."}</>
                                : <><ArrowRight size={20} />{isUz ? "Pulni yuborish" : "Send Transfer"}</>
                            }
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TransferView;
