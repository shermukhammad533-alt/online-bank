import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, CreditCard, ArrowRight, CheckCircle2, Loader2, Info, RotateCcw, Printer } from 'lucide-react';

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
        <div className="max-w-2xl mx-auto pt-8 animate-fade-in pb-20">
            <div className="glass p-10 text-center relative overflow-hidden border-blue-500/30 shadow-2xl shadow-blue-500/10">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-400"></div>
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-500/5 shadow-inner mb-6">
                    <CheckCircle2 size={40} className="animate-pulse-slow" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2 font-sans tracking-tight">
                    {isUz ? "O'tkazma muvaffaqiyatli!" : "Transfer Successful!"}
                </h2>
                <p className="text-gray-400 text-base mb-8">
                    {isUz ? "Mablag' qabul qiluvchi hisobiga yuborildi" : "Funds sent to recipient successfully"}
                </p>

                {/* Receipt rows */}
                <div className="bg-[#0a0f1c] border border-white/5 rounded-2xl p-6 mb-8 text-left space-y-4 font-sans shadow-inner">
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
                        <div key={i} className="flex justify-between items-end pb-4 border-b border-white/5 last:border-0 last:pb-0">
                            <span className="text-gray-400 font-medium text-sm">{label}</span>
                            <span className={`text-right max-w-[60%] ${highlight ? 'text-emerald-400 text-xl font-black bg-emerald-500/10 px-3 py-1 rounded-lg' : 'text-white text-base font-bold'}`}>{value}</span>
                        </div>
                    ))}
                </div>

                <div className="flex gap-4">
                    <button onClick={reset} className="flex-1 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold inline-flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 active:scale-95">
                        <RotateCcw size={18} />{isUz ? "Yangi o'tkazma" : "New Transfer"}
                    </button>
                    <button onClick={() => window.print()} className="px-6 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 font-bold inline-flex items-center gap-2 transition-all">
                        <Printer size={18} />PDF
                    </button>
                </div>
            </div>
        </div>
    );

    /* ── Main transfer form ── */
    return (
        <div className="max-w-[1200px] mx-auto animate-fade-in pb-20">
            {/* Header */}
            <div className="flex items-center gap-5 mb-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/10 flex-shrink-0">
                    <ArrowRightLeft size={28} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white font-sans tracking-tight mb-1">
                        {isUz ? "Pul o'tkazmalari" : "Money Transfer"}
                    </h1>
                    <p className="text-gray-400 text-sm">
                        {isUz ? "O'zbekiston bo'ylab istalgan kartaga pul yuboring" : "Send money to any card instantly and securely"}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: source card selector */}
                <div className="lg:col-span-5 space-y-6">
                    <h3 className="text-xl font-bold text-white tracking-wide">
                        {isUz ? "Mablag' manbasi" : "Source Card"}
                    </h3>

                    {cards.length === 0 ? (
                        <div className="glass p-6 text-center text-gray-400 rounded-2xl">
                            {isUz ? "Karta yo'q. Avval karta qo'shing." : "No cards. Add a card first."}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cards.map((card, i) => {
                                const bal = parseFloat(card.balance);
                                const fmtBal = card.currency === 'USD'
                                    ? `$${bal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                                    : `${bal.toLocaleString('uz-UZ')} so'm`;
                                const active = selectedIdx === i;
                                return (
                                    <div key={i} onClick={() => setSelectedIdx(i)} 
                                        className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${active ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/10 border-2 border-blue-500/50 shadow-lg shadow-blue-500/10 transform scale-[1.02]' : 'glass border-transparent hover:border-white/10 hover:bg-white/5'}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-gray-400 font-mono text-sm tracking-wider">•••• {card.number.slice(-4)}</span>
                                            <span className={`text-xs font-bold px-3 py-1 rounded-md ${active ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-gray-400'}`}>{card.type}</span>
                                        </div>
                                        <div className="text-[11px] text-gray-500 uppercase font-bold tracking-widest mb-1">{isUz ? "Balans" : "Balance"}</div>
                                        <div className="text-2xl font-black text-white font-mono">{fmtBal}</div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Info note */}
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 flex gap-4 mt-6">
                        <Info size={24} className="text-amber-400 flex-shrink-0 mt-0.5" />
                        <p className="text-amber-200/80 text-sm leading-relaxed">
                            {isUz ? "Humo va Uzcard o'rtasida 0.5% komissiya undiriladi." : "0.5% commission applies for Humo & Uzcard transfers."}
                        </p>
                    </div>
                </div>

                {/* Right: form */}
                <div className="lg:col-span-7">
                    <div className="glass p-8 lg:p-10 space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                        <h3 className="text-2xl font-bold text-white tracking-tight border-b border-white/5 pb-4 relative z-10">
                            {isUz ? "Kartadan kartaga" : "Card to Card Transfer"}
                        </h3>

                        <form onSubmit={onSubmit} className="space-y-6 pt-2 relative z-10">
                            {/* Recipient card */}
                            <div className="space-y-2">
                                <label className="text-[12px] text-gray-400 font-bold uppercase tracking-widest block">
                                    {isUz ? "Qabul qiluvchi karta raqami" : "Recipient Card Number"}
                                </label>
                                <div className="relative">
                                    <input
                                        type="text" value={recipient} onChange={onRecipientChange}
                                        placeholder="8600 0000 0000 0000"
                                        className="w-full bg-[#0a0f1c] border-2 border-white/5 rounded-xl px-4 py-4 text-xl text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-mono font-bold transition-all placeholder:text-gray-600 tracking-wider"
                                    />
                                    {cardType && (
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-blue-500/20 text-blue-400 text-[11px] font-black px-3 py-1.5 rounded-lg tracking-widest uppercase">
                                            {cardType}
                                        </span>
                                    )}
                                </div>
                                {recipientName && (
                                    <div className="mt-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center justify-between animate-fade-in">
                                        <span className="text-emerald-400 text-sm font-medium">
                                            {isUz ? "Qabul qiluvchi: " : "Recipient: "}<strong className="font-bold text-emerald-300 text-base ml-1">{recipientName}</strong>
                                        </span>
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                                    </div>
                                )}
                            </div>

                            {/* Amount + Comment */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[12px] text-gray-400 font-bold uppercase tracking-widest block">
                                        {isUz ? "O'tkazma summasi" : "Amount to Send"}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text" value={amount}
                                            onChange={e => { setAmount(e.target.value.replace(/\D/g, '')); setError(''); }}
                                            placeholder="0"
                                            className="w-full bg-[#0a0f1c] border-2 border-white/5 rounded-xl px-4 py-4 text-lg text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-mono font-bold transition-all placeholder:text-gray-600"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold font-mono">
                                            {cards[selectedIdx]?.currency || 'UZS'}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[12px] text-gray-400 font-bold uppercase tracking-widest block">
                                        {isUz ? "Izoh (majburiy emas)" : "Comment (optional)"}
                                    </label>
                                    <input
                                        type="text" value={comment}
                                        onChange={e => setComment(e.target.value)}
                                        placeholder={isUz ? "Xizmat haqi..." : "Payment for..."}
                                        className="w-full bg-[#0a0f1c] border-2 border-white/5 rounded-xl px-4 py-4 text-base text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-medium transition-all placeholder:text-gray-600"
                                    />
                                </div>
                            </div>

                            {/* Commission preview */}
                            {amount && cards[selectedIdx]?.currency === 'UZS' && (
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center animate-fade-in shadow-inner">
                                    <span className="text-gray-400 text-sm font-medium">{isUz ? "Komissiya (0.5%)" : "Commission (0.5%)"}</span>
                                    <span className="text-white text-base font-bold bg-white/10 px-3 py-1 rounded-md font-mono">
                                        {Math.round(+amount * 0.005).toLocaleString('uz-UZ')} so'm
                                    </span>
                                </div>
                            )}

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
                                        {isUz ? "Yuborilmoqda..." : "Sending..."}
                                    </div>
                                ) : (
                                    <>
                                        {isUz ? "Pulni yuborish" : "Send Transfer"}
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransferView;
