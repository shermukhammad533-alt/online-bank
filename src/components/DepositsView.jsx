import React, { useState, useEffect } from 'react';
import { PieChart, Landmark, TrendingUp, HelpCircle, ChevronRight, Plus, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const depositTemplates = [
    { id: 'smart', nameUz: 'Smart Omonat (Tezkor)', nameEn: 'Smart Deposit (High-Yield UZS)', rate: 23, duration: 12, minAmount: 1000000, currency: 'UZS', descUz: 'Oylik foizlar plastik kartangizga o\'tkaziladi. Istalgan paytda yopish imkoniyati.', descEn: 'Monthly interest sent straight to your card. High liquidity, cancel anytime.' },
    { id: 'capital', nameUz: 'Apex Maksimal Sarmoya', nameEn: 'Apex Capital Profit UZS', rate: 24, duration: 24, minAmount: 5000000, currency: 'UZS', descUz: 'Yillik 24% eng yuqori foyda koeffitsiyenti. Yopish faqat muddat oxirida.', descEn: 'Maximum 24% annual interest rate. Funds locked until the end of the term.' },
    { id: 'usd_shield', nameUz: 'Milliy Valyuta Himoyasi (USD)', nameEn: 'USD Shield Saver', rate: 6.5, duration: 12, minAmount: 500, currency: 'USD', descUz: 'Xorijiy valyutada barqaror va kafolatlangan inflyatsiyadan holi daromad.', descEn: 'Stable, inflation-proof foreign currency growth with state guarantees.' }
];

const DepositsView = ({ cards, onUpdateCards, onAddActivity, language, locales }) => {
    const t = locales[language];

    const [activeDeposits, setActiveDeposits] = useState([
        { id: 'DEP1029', nameUz: 'Smart Omonat #1', nameEn: 'Smart Deposit #1', rate: 22, amount: 15000000, currency: 'UZS', date: '21.03.2026', monthlyGain: 275000 }
    ]);

    // Open deposit form
    const [selectedCardIdx, setSelectedCardIdx] = useState(0);
    const [selectedTemplateIdx, setSelectedTemplateIdx] = useState(0);
    const [investAmount, setInvestAmount] = useState('');
    const [error, setError] = useState('');

    // Profit Calculation
    const [profitCalc, setProfitCalc] = useState({ monthly: 0, total: 0 });

    // Statuses
    const [isCreating, setIsCreating] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [successData, setSuccessData] = useState(null);

    const activeTemplate = depositTemplates[selectedTemplateIdx];

    useEffect(() => {
        const amt = parseFloat(investAmount);
        if (isNaN(amt) || amt <= 0) {
            setProfitCalc({ monthly: 0, total: 0 });
            return;
        }

        const rateDec = activeTemplate.rate / 100;
        const totalProfit = amt * rateDec * (activeTemplate.duration / 12);
        const monthlyProfit = totalProfit / activeTemplate.duration;

        setProfitCalc({
            monthly: Math.round(monthlyProfit),
            total: Math.round(totalProfit)
        });
    }, [investAmount, selectedTemplateIdx]);

    const handleCreateDeposit = (e) => {
        e.preventDefault();
        setError('');

        const amt = parseFloat(investAmount);
        const sourceCard = cards[selectedCardIdx];

        if (isNaN(amt) || amt <= 0) {
            setError(language === 'uz' ? "Sarmoya summasini to'g'ri kiriting!" : "Please enter a valid investment amount!");
            return;
        }

        if (amt < activeTemplate.minAmount) {
            const minText = activeTemplate.currency === 'USD' ? `$ ${activeTemplate.minAmount}` : `${activeTemplate.minAmount.toLocaleString('uz-UZ')} so'm`;
            setError(language === 'uz' ? `Minimal sarmoya miqdori orqali to'ldiring: ${minText}` : `Minimum amount required: ${minText}`);
            return;
        }

        const balanceNum = parseFloat(sourceCard.balance.toString().replace(/\s/g, ''));

        // Currency matching
        if (sourceCard.currency !== activeTemplate.currency) {
            setError(language === 'uz'
                ? `Karta valyutasi (${sourceCard.currency}) omonat valyutasiga (${activeTemplate.currency}) mos kelishi kerak!`
                : `Card currency (${sourceCard.currency}) must match deposit currency (${activeTemplate.currency})!`);
            return;
        }

        if (balanceNum < amt) {
            setError(language === 'uz' ? "Kartangizda yetarli mablag' mavjud emas!" : "Insufficient funds on your selected card!");
            return;
        }

        setIsCreating(true);

        setTimeout(() => {
            setIsCreating(false);

            // Deduct card balance
            const updatedCards = [...cards];
            updatedCards[selectedCardIdx] = {
                ...sourceCard,
                balance: (balanceNum - amt).toFixed(2)
            };
            onUpdateCards(updatedCards);

            // Add transactions activity record
            const dateObj = new Date();
            const dateStr = dateObj.toLocaleDateString('uz-UZ');

            const newAct = {
                name: language === 'uz' ? `${activeTemplate.nameUz} ochildi` : `${activeTemplate.nameEn} opened`,
                type: language === 'uz' ? "Omonat ochish" : "Savings Deposit",
                amount: `-${amt.toFixed(2)}`,
                time: t.today || 'Bugun',
                color: 'bg-indigo-500/20 text-indigo-400',
                icon: Landmark,
                currency: sourceCard.currency
            };
            onAddActivity(newAct);

            // Calculate profit gain
            const rateDec = activeTemplate.rate / 100;
            const totalProfit = amt * rateDec * (activeTemplate.duration / 12);
            const monthlyProfit = totalProfit / activeTemplate.duration;

            const newDeposit = {
                id: 'DEP' + Math.floor(1000 + Math.random() * 9000),
                nameUz: activeTemplate.nameUz,
                nameEn: activeTemplate.nameEn,
                rate: activeTemplate.rate,
                amount: amt,
                currency: activeTemplate.currency,
                date: dateStr,
                monthlyGain: Math.round(monthlyProfit)
            };

            setActiveDeposits(prev => [newDeposit, ...prev]);

            setSuccessData({
                name: language === 'uz' ? activeTemplate.nameUz : activeTemplate.nameEn,
                amount: amt,
                currency: activeTemplate.currency,
                rate: activeTemplate.rate,
                duration: activeTemplate.duration,
                monthlyGain: Math.round(monthlyProfit),
                date: dateStr
            });

            setIsSuccess(true);
            setInvestAmount('');
        }, 1600);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-600/20 rounded-2xl text-emerald-400">
                    <Landmark size={28} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold font-sans">{t.deposits}</h2>
                    <p className="text-sm text-gray-400">{language === 'uz' ? "Garantiyalangan yuqori daromadli sarmoyalar" : "Maximize your savings with safe, high-yield digital portfolios"}</p>
                </div>
            </div>

            {isSuccess && successData ? (
                // SUCCESS DETAILS VIEW
                <div className="glass p-8 max-w-xl mx-auto text-center space-y-6 animate-fade-in border-emerald-500/20">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-500/5">
                        <CheckCircle2 size={40} className="animate-pulse" />
                    </div>

                    <div className="space-y-1">
                        <h3 className="text-xl font-bold text-white">{language === 'uz' ? "Omonat muvaffaqiyatli ochildi!" : "Deposit created successfully!"}</h3>
                        <p className="text-sm text-gray-400">{successData.name}</p>
                    </div>

                    <div className="bg-white/5 border border-white/5 rounded-2xl p-6 text-left space-y-3 font-sans text-sm">
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-gray-400">{language === 'uz' ? "Muddat" : "Duration"}</span>
                            <span className="font-bold text-white">{successData.duration} {language === 'uz' ? 'oy' : 'months'}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-gray-400">{language === 'uz' ? "Yillik Ustama (stavka)" : "Annual Yield Rate"}</span>
                            <span className="font-bold text-emerald-400">+{successData.rate}%</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-gray-400">{language === 'uz' ? "Oylik sof daromad (taxminan)" : "Est. Monthly Income"}</span>
                            <span className="font-mono text-white">
                                {successData.currency === 'USD' ? `$ ${successData.monthlyGain}` : `${successData.monthlyGain.toLocaleString('uz-UZ')} so'm`}
                            </span>
                        </div>
                        <div className="flex justify-between pt-2">
                            <span className="text-gray-400 font-bold">{language === 'uz' ? "Kiritilgan mablag' (jami)" : "Invested Capital"}</span>
                            <span className="font-black text-white text-lg">
                                {successData.currency === 'USD' ? `$ ${successData.amount.toLocaleString()}` : `${successData.amount.toLocaleString('uz-UZ')} so'm`}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsSuccess(false)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-xl transition-all shadow-lg shadow-blue-500/20"
                    >
                        {language === 'uz' ? "Tushunarli / Rahmat" : "Excellent / Return"}
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Active deposits list */}
                    <div className="md:col-span-5 space-y-6">
                        <h3 className="text-lg font-bold text-white">{language === 'uz' ? "Faol omonatlarim" : "Active savings portfolios"}</h3>
                        <div className="space-y-4">
                            {activeDeposits.map((dep) => (
                                <div key={dep.id} className="glass p-5 relative overflow-hidden border-emerald-500/10">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl"></div>
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <span className="text-xs text-gray-500 font-mono block">{dep.id}</span>
                                            <h4 className="font-bold text-sm text-gray-200">{language === 'uz' ? dep.nameUz : dep.nameEn}</h4>
                                        </div>
                                        <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-black">+{dep.rate}%</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-4 pt-3 border-t border-white/5">
                                        <div>
                                            <span className="text-[10px] text-gray-500 uppercase">{language === 'uz' ? "Sarmoya" : "Balance"}</span>
                                            <p className="text-sm font-extrabold text-white">
                                                {dep.currency === 'USD' ? `$ ${dep.amount.toLocaleString()}` : `${dep.amount.toLocaleString('uz-UZ')} so'm`}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-gray-500 uppercase">{language === 'uz' ? "Oylik daromad" : "Monthly Profit"}</span>
                                            <p className="text-sm font-extrabold text-emerald-400">
                                                +{dep.currency === 'USD' ? `$ ${dep.monthlyGain}` : `${dep.monthlyGain.toLocaleString('uz-UZ')} UZS`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Open new deposit card form */}
                    <div className="md:col-span-7">
                        <div className="glass p-6 md:p-8 space-y-6">
                            <h3 className="text-lg font-bold text-white">{language === 'uz' ? "Yangi omonat paketini rasmiylashtirish" : "Activate Premium Yield Portfolio"}</h3>

                            {/* Choose template */}
                            <div className="space-y-3">
                                <label className="text-xs text-gray-400 font-medium block uppercase tracking-widest">{language === 'uz' ? "Omonat turi" : "Deposit Scheme"}</label>
                                <div className="grid grid-cols-1 gap-3">
                                    {depositTemplates.map((temp, index) => (
                                        <div
                                            key={temp.id}
                                            onClick={() => {
                                                setSelectedTemplateIdx(index);
                                                setError('');
                                            }}
                                            className={`p-4 rounded-xl cursor-pointer border text-left transition-all ${selectedTemplateIdx === index
                                                ? 'bg-blue-600/10 border-blue-500 text-white ring-1 ring-blue-500/50'
                                                : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'}`}
                                        >
                                            <div className="flex justify-between items-center mb-1">
                                                <h4 className="font-bold text-sm text-gray-200">{language === 'uz' ? temp.nameUz : temp.nameEn}</h4>
                                                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-black">+{temp.rate}%</span>
                                            </div>
                                            <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">{language === 'uz' ? temp.descUz : temp.descEn}</p>
                                            <div className="text-[10px] text-gray-500 font-mono mt-2 uppercase">
                                                {language === 'uz' ? `Muddat: ${temp.duration} oy` : `Duration: ${temp.duration} mos`} | {language === 'uz' ? "Mas: minimum" : "Min:"} {temp.currency === 'USD' ? `$ ${temp.minAmount}` : `${temp.minAmount.toLocaleString('uz-UZ')} so'm`}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <form onSubmit={handleCreateDeposit} className="space-y-6 pt-2">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Selected debit card */}
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-400 uppercase tracking-widest block font-medium">{language === 'uz' ? "Debet Karta" : "Debit Card"}</label>
                                        <select
                                            value={selectedCardIdx}
                                            onChange={(e) => {
                                                setSelectedCardIdx(parseInt(e.target.value));
                                                setError('');
                                            }}
                                            className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
                                        >
                                            {cards.map((card, idx) => {
                                                const bal = typeof card.balance === 'string' ? parseFloat(card.balance.replace(/\s/g, '')) : card.balance;
                                                const amtText = card.currency === 'USD' ? `$ ${bal.toLocaleString()}` : `${bal.toLocaleString()} UZS`;
                                                return (
                                                    <option key={idx} value={idx} className="bg-slate-900 text-white">
                                                        *{card.number.slice(-4)} ({card.type}) - {amtText}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>

                                    {/* Investment amount */}
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-400 uppercase tracking-widest block font-medium">{language === 'uz' ? "Sarmoya summasi" : "Investment Capital"}</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={investAmount}
                                                onChange={(e) => {
                                                    setInvestAmount(e.target.value.replace(/\D/g, ''));
                                                    setError('');
                                                }}
                                                placeholder="0.00"
                                                className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono font-bold"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold font-mono">
                                                {activeTemplate.currency}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Profit calculations calculator */}
                                {profitCalc.total > 0 && (
                                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-xs text-emerald-400 space-y-1.5 animate-fade-in font-sans">
                                        <div className="flex justify-between">
                                            <span>{language === 'uz' ? "Oylik qo'shiladigan foiz:" : "Est. Monthly Interest:"}</span>
                                            <span className="font-bold font-mono">
                                                +{activeTemplate.currency === 'USD' ? `$ ${profitCalc.monthly}` : `${profitCalc.monthly.toLocaleString('uz-UZ')} so'm`}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>{language === 'uz' ? "Jami sof daromad:" : "Est. Net Profit:"}</span>
                                            <span className="font-bold font-mono">
                                                +{activeTemplate.currency === 'USD' ? `$ ${profitCalc.total}` : `${profitCalc.total.toLocaleString('uz-UZ')} so'm`}
                                            </span>
                                        </div>
                                        <div className="flex justify-between pt-1.5 border-t border-emerald-500/10 font-bold text-white text-sm">
                                            <span>{language === 'uz' ? "Omonat oxiridagi jami summa:" : "Total payout on completion:"}</span>
                                            <span className="font-mono">
                                                {activeTemplate.currency === 'USD'
                                                    ? `$ ${(parseFloat(investAmount) + profitCalc.total).toLocaleString('en-US')}`
                                                    : `${(parseFloat(investAmount) + profitCalc.total).toLocaleString('uz-UZ')} so'm`}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-500 text-xs flex items-center gap-2">
                                        <AlertCircle size={16} className="shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isCreating}
                                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3.5 px-6 rounded-xl flex justify-center items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all font-sans disabled:opacity-50"
                                >
                                    {isCreating ? (
                                        <>
                                            <Loader2 className="animate-spin" size={18} />
                                            <span>{language === 'uz' ? "Omonat ochilmoqda..." : "Securing portfolio..."}</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>{language === 'uz' ? "Omonatni faollashtirish" : "Activate Deposit Plan"}</span>
                                            <ArrowRight size={16} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DepositsView;
