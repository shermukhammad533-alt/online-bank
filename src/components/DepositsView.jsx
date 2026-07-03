
import React, { useState, useEffect } from 'react';
import { Landmark, Loader2, CheckCircle2, ShieldCheck, TrendingUp, CreditCard, ChevronDown, AlertCircle, Rocket, Zap, Shield, ArrowUpRight, Check, Activity } from 'lucide-react';

const depositTemplates = [
    { 
        id: 'smart', nameUz: 'Smart Omonat', nameEn: 'Smart Deposit', rate: 23, duration: 12, minAmount: 1000000, currency: 'UZS', 
        descUz: 'Yillik foiz plastik kartangizga tushadi kafolatlangan daromad.', 
        descEn: 'Monthly interest sent to card securely.',
        color: 'primary',
        icon: Zap 
    },
    { 
        id: 'capital', nameUz: 'Apex Maksimal', nameEn: 'Apex Capital', rate: 24, duration: 24, minAmount: 5000000, currency: 'UZS', 
        descUz: 'Eng yuqori yillik daromad kafolati', 
        descEn: 'Maximum 24% annual interest rate',
        color: 'dark',
        icon: TrendingUp 
    },
    { 
        id: 'usd_shield', nameUz: 'Valyuta Himoyasi', nameEn: 'USD Shield Saver', rate: 6.5, duration: 12, minAmount: 500, currency: 'USD', 
        descUz: 'Inflyatsiyadan holi dollardagi sarmoya', 
        descEn: 'Stable USD currency growth',
        color: 'dark',
        icon: Shield 
    }
];

// Luxury 3D Isometric Cube
const LuxuryIsometricCube = ({ size = 64, x = 0, y = 0, z = 0, type = 'primary', glow = false }) => {
    const half = size / 2;
    const colors = {
        primary: { 
            top: 'bg-gradient-to-br from-[#724DFF] to-[#5B6CFF]', 
            left: 'bg-[#4352D9]', 
            right: 'bg-[#2E3BA6]', 
            border: 'border-[rgba(255,255,255,0.2)]' 
        },
        dark: { 
            top: 'bg-gradient-to-br from-[#1A2859] to-[#14204D]', 
            left: 'bg-[#0F183B]', 
            right: 'bg-[#0A102A]', 
            border: 'border-[rgba(255,255,255,0.08)]' 
        },
    };
    const c = colors[type];
    
    return (
        <div className="absolute" style={{ width: size, height: size, transformStyle: 'preserve-3d', transform: `translate3d(${x}px, ${y}px, ${z}px)` }}>
            {/* Top Face */}
            <div className={`absolute inset-0 ${c.top} ${c.border} border-t border-l border-b-0 border-r-0 backdrop-blur-md`} style={{ transform: `translateZ(${half}px)` }}>
                {glow && <div className="absolute inset-0 bg-[#5B6CFF] blur-[30px] opacity-70"></div>}
                {/* Inner highlight */}
                <div className="absolute inset-0 bg-gradient-to-b from-[rgba(255,255,255,0.15)] to-transparent pointer-events-none"></div>
            </div>
            {/* Front/Left Face */}
            <div className={`absolute inset-0 ${c.left} ${c.border} border border-t-0 border-r-0 origin-bottom`} style={{ transform: `rotateX(-90deg) translateZ(${half}px)` }}>
                <div className="absolute inset-0 bg-gradient-to-r from-[rgba(0,0,0,0.2)] to-transparent pointer-events-none"></div>
            </div>
            {/* Right Face */}
            <div className={`absolute inset-0 ${c.right} ${c.border} border border-t-0 border-l-0 origin-right`} style={{ transform: `rotateY(90deg) translateZ(${half}px)` }}>
                <div className="absolute inset-0 bg-gradient-to-l from-[rgba(0,0,0,0.4)] to-transparent pointer-events-none"></div>
            </div>
        </div>
    );
};

const DepositsView = ({ cards, onUpdateCards, onAddActivity, language, locales }) => {
    const isUz = language === 'uz';
    const t = locales[language];

    const [activeDeposits] = useState([
        { id: 'DEP1029', nameUz: 'Smart Omonat #1', nameEn: 'Smart Deposit #1', rate: 23, amount: 15000000, currency: 'UZS', date: '21.03.2026', monthlyGain: 287500 }
    ]);

    const [selectedCardIdx, setSelectedCardIdx] = useState(0);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedTemplateIdx, setSelectedTemplateIdx] = useState(0);
    const [investAmount, setInvestAmount] = useState('');
    const [error, setError] = useState('');
    const [profitCalc, setProfitCalc] = useState({ monthly: 0, total: 0 });
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
        setProfitCalc({ monthly: Math.round(monthlyProfit), total: Math.round(totalProfit) });
    }, [investAmount, selectedTemplateIdx]);

    const handleCreateDeposit = (e) => {
        e.preventDefault();
        setError('');
        
        if (!cards || cards.length === 0) {
            setError(isUz ? "Sizda to'lov kartasi yo'q!" : "No payment cards available!");
            return;
        }
        
        const amt = parseFloat(investAmount);
        const sourceCard = cards[selectedCardIdx];

        if (isNaN(amt) || amt <= 0) {
            setError(isUz ? "Sarmoyani to'g'ri kiriting!" : "Enter valid amount!");
            return;
        }
        if (amt < activeTemplate.minAmount) {
            const minText = activeTemplate.currency === 'USD' ? `$${activeTemplate.minAmount.toLocaleString()}` : `${activeTemplate.minAmount.toLocaleString('uz-UZ')} UZS`;
            setError(isUz ? `Minimal sarmoya: ${minText}` : `Minimum amount: ${minText}`);
            return;
        }
        const balanceNum = typeof sourceCard.balance === 'string' ? parseFloat(sourceCard.balance.replace(/\s/g, '')) : sourceCard.balance;
        if (sourceCard.currency !== activeTemplate.currency) {
            setError(isUz ? `Karta valyutasi mos emas (${sourceCard.currency})` : `Currency mismatch (${sourceCard.currency})`);
            return;
        }
        if (balanceNum < amt) {
            setError(isUz ? "Kartada mablag' yetarli emas!" : "Insufficient funds on card!");
            return;
        }

        setIsCreating(true);
        setTimeout(() => {
            setIsCreating(false);
            const updatedCards = [...cards];
            updatedCards[selectedCardIdx] = { ...sourceCard, balance: (balanceNum - amt).toFixed(2) };
            onUpdateCards(updatedCards);

            const dateStr = new Date().toLocaleDateString('uz-UZ');
            onAddActivity({
                name: isUz ? `${activeTemplate.nameUz} ochildi` : `${activeTemplate.nameEn} opened`,
                type: isUz ? "Omonat" : "Deposit",
                amount: `-${amt.toFixed(2)}`,
                time: t?.today || 'Bugun',
                color: 'bg-[#5B6CFF]/20 text-[#5B6CFF]',
                icon: Landmark,
                currency: sourceCard.currency
            });

            const rateDec = activeTemplate.rate / 100;
            const totalProfit = amt * rateDec * (activeTemplate.duration / 12);

            setSuccessData({
                name: isUz ? activeTemplate.nameUz : activeTemplate.nameEn,
                amount: amt,
                currency: activeTemplate.currency,
                rate: activeTemplate.rate,
                duration: activeTemplate.duration,
                monthlyGain: Math.round(totalProfit / activeTemplate.duration),
                date: dateStr
            });
            setIsSuccess(true);
            setInvestAmount('');
        }, 1500);
    };

    // Design System Classes
    const cardBase = "bg-[#0F183B] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.05)] backdrop-blur-xl relative overflow-hidden transition-all duration-300";
    const buttonBase = "h-[48px] rounded-[14px] bg-gradient-to-r from-[#5B6CFF] to-[#724DFF] text-white font-semibold text-[14px] tracking-wide relative overflow-hidden group shadow-[0_6px_20px_rgba(91,108,255,0.4)] hover:shadow-[0_8px_28px_rgba(114,77,255,0.6)] transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
    
    // Premium Form Controls
    const glassControlBase = "w-full h-[58px] bg-[rgba(17,24,54,0.75)] backdrop-blur-[18px] border border-[rgba(255,255,255,0.08)] rounded-[18px] shadow-[0_10px_30px_rgba(0,0,0,0.35)] flex items-center px-[20px] transition-all duration-300 hover:border-[rgba(255,255,255,0.15)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.35),0_0_15px_rgba(91,108,255,0.15)] focus-within:border-[#5B6CFF] focus-within:shadow-[0_0_0_2px_rgba(91,108,255,0.4)]";
    const labelStyle = "block text-[12px] font-[600] text-[#7E89B8] tracking-[1px] uppercase mb-[8px] pl-[4px]";

    if (isSuccess && successData) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in w-full min-h-[80vh] font-sans">
                <div className={`${cardBase} max-w-md w-full text-center flex flex-col items-center gap-[32px] shadow-[0_0_80px_rgba(91,108,255,0.2)]`}>
                    
                    {/* Success Icon */}
                    <div className="w-[96px] h-[96px] rounded-full bg-gradient-to-br from-[#724DFF] to-[#5B6CFF] flex items-center justify-center text-white shadow-[0_16px_40px_rgba(91,108,255,0.5)] relative">
                        <div className="absolute inset-0 rounded-full border border-white/20"></div>
                        <Check size={48} strokeWidth={2.5} />
                    </div>
                    
                    <div>
                        <h3 className="text-[32px] font-bold text-white tracking-tight mb-[8px]">{isUz ? "Muvaffaqiyatli!" : "Success!"}</h3>
                        <p className="text-[16px] text-[#00D9FF] font-medium">{successData.name}</p>
                    </div>

                    <div className="w-full bg-[#14204D] rounded-[18px] p-[24px] flex flex-col gap-[16px] text-left border border-[rgba(255,255,255,0.04)] shadow-inner">
                        <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.08)] pb-[16px]">
                            <span className="text-[13px] text-[rgba(255,255,255,0.5)] font-semibold uppercase tracking-wider">{isUz ? "Sarmoya" : "Capital"}</span>
                            <span className="text-white font-bold font-mono text-[18px]">
                                {successData.currency === 'USD' ? '$' : ''}{successData.amount.toLocaleString()} <span className="text-[13px] font-sans text-[rgba(255,255,255,0.4)]">{successData.currency === 'UZS' ? 'UZS' : ''}</span>
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[13px] text-[rgba(255,255,255,0.5)] font-semibold uppercase tracking-wider">{isUz ? "Oylik daromad" : "Monthly Yield"}</span>
                            <span className="text-[#18F6A3] font-bold font-mono text-[18px]">
                                +{successData.currency === 'USD' ? '$' : ''}{successData.monthlyGain.toLocaleString()} <span className="text-[13px] font-sans text-[#18F6A3]/60">{successData.currency === 'UZS' ? 'UZS' : ''}</span>
                            </span>
                        </div>
                    </div>

                    <button onClick={() => setIsSuccess(false)} className={`${buttonBase} w-full`}>
                        {isUz ? "Davom etish" : "Continue"}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-[32px] animate-fade-in font-sans relative pb-[64px] min-h-[90vh]">
            
            {/* LUXURY BACKGROUND */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 rounded-[32px] bg-[#050816]">
                {/* Ambient Radial Lights */}
                <div className="absolute top-[10%] right-[5%] w-[800px] h-[800px] bg-[#5B6CFF] opacity-[0.08] rounded-full blur-[120px] mix-blend-screen"></div>
                <div className="absolute bottom-[20%] left-[10%] w-[600px] h-[600px] bg-[#724DFF] opacity-[0.05] rounded-full blur-[100px] mix-blend-screen"></div>
                <div className="absolute top-[40%] right-[30%] w-[400px] h-[400px] bg-[#00D9FF] opacity-[0.03] rounded-full blur-[80px] mix-blend-screen"></div>
                
                {/* Premium Grid Pattern overlay */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50"></div>
                
                {/* Financial Graph Sweep */}
                <svg className="absolute w-full h-[80%] right-0 top-[10%]" viewBox="0 0 1000 600" preserveAspectRatio="none">
                    <path d="M0 600 L200 450 L400 500 L600 250 L800 300 L1000 50" fill="none" stroke="url(#luxLineGlow)" strokeWidth="3" filter="drop-shadow(0 0 24px rgba(91,108,255,0.8))" />
                    <path d="M0 600 L200 450 L400 500 L600 250 L800 300 L1000 50 L1000 600 Z" fill="url(#luxAreaGradient)" opacity="0.3" />
                    <defs>
                        <linearGradient id="luxLineGlow" x1="0" y1="600" x2="1000" y2="50" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#724DFF" />
                            <stop offset="50%" stopColor="#5B6CFF" />
                            <stop offset="100%" stopColor="#00D9FF" />
                        </linearGradient>
                        <linearGradient id="luxAreaGradient" x1="0" y1="600" x2="1000" y2="50" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#5B6CFF" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#00D9FF" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* HEADER SECTION */}
            <div className="px-[8px] pt-[24px]">
                <h1 className="text-[36px] font-bold text-white tracking-tight leading-tight">{isUz ? "Omonatlar" : "Deposits"}</h1>
                <p className="text-[15px] text-[rgba(255,255,255,0.5)] mt-[8px] font-medium">{isUz ? "Sarmoyangizni xavfsiz va kafolatli ko'paytiring" : "Grow your wealth securely and beautifully"}</p>
            </div>

            {/* TOP CARDS ROW */}
            <div className="flex flex-col lg:flex-row justify-between items-stretch gap-[32px] z-10 relative w-full">
                <div className="flex flex-col sm:flex-row gap-[32px] w-full lg:w-auto">
                    
                    {/* Active Deposit Card */}
                    {activeDeposits.map(dep => (
                        <div key={dep.id} className="bg-[#0F183B] border border-[rgba(255,255,255,0.08)] rounded-[16px] p-[16px] w-full xl:w-[320px] min-h-[240px] flex flex-col relative group overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.5),0_0_30px_rgba(91,108,255,0.15),inset_0_1px_1px_rgba(255,255,255,0.2)] transition-all duration-500 hover:-translate-y-1">
                            
                            {/* Visual Richness Background Layers */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[rgba(20,32,77,0.4)] to-[#0A102A] z-0"></div>
                            {/* Blue Radial Glow Top Left */}
                            <div className="absolute top-[-20%] left-[-20%] w-[45%] h-[45%] bg-[#5B6CFF]/20 blur-[45px] rounded-full z-0 pointer-events-none transition-all duration-700 group-hover:bg-[#5B6CFF]/30"></div>
                            {/* Purple Radial Glow Bottom Right */}
                            <div className="absolute bottom-[-20%] right-[-20%] w-[45%] h-[45%] bg-[#724DFF]/15 blur-[45px] rounded-full z-0 pointer-events-none transition-all duration-700 group-hover:bg-[#724DFF]/25"></div>
                            {/* Top Reflection */}
                            <div className="absolute top-0 left-0 right-0 h-[30%] bg-gradient-to-b from-white/10 to-transparent z-0 pointer-events-none transform group-hover:translate-y-2 transition-transform duration-700"></div>
                            {/* Subtle geometric shapes (opacity < 8%) */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')]"></div>

                            {/* Header */}
                            <div className="relative z-10 w-full flex justify-between items-start">
                                <div>
                                    <div className="text-[10px] text-white/60 font-semibold uppercase tracking-[1.5px] mb-[6px]">
                                        {isUz ? "Faol sarmoya" : "Active Capital"}
                                    </div>
                                    <div className="text-[20px] font-bold text-white mb-[10px] leading-[1.1] tracking-tight drop-shadow-sm">
                                        {isUz ? dep.nameUz : dep.nameEn}
                                    </div>
                                </div>
                                <div className="w-[28px] h-[28px] rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center shadow-[0_0_15px_rgba(91,108,255,0.2)] backdrop-blur-md transition-all duration-500 group-hover:bg-[rgba(255,255,255,0.1)] group-hover:border-[rgba(255,255,255,0.2)] group-hover:shadow-[0_0_20px_rgba(91,108,255,0.4)]">
                                    <Rocket size={14} className="text-[#5B6CFF] drop-shadow-[0_0_6px_rgba(91,108,255,0.8)]" />
                                </div>
                            </div>
                            
                            {/* Content (Balance centered) */}
                            <div className="relative z-10 flex-1 flex flex-col justify-center">
                                <div className="text-[28px] font-[800] text-white tracking-[-0.01em] leading-none flex items-baseline gap-[6px] drop-shadow-md">
                                    {dep.amount.toLocaleString()} 
                                    <span className="text-[11px] font-medium text-gray-400 tracking-normal drop-shadow-none">{dep.currency === 'UZS' ? 'UZS' : ''}</span>
                                </div>
                            </div>
                            
                            {/* Footer Badge */}
                            <div className="absolute bottom-[16px] right-[16px] z-10 h-[26px] px-[12px] rounded-full bg-[#18F6A3]/10 border border-[#18F6A3]/20 flex items-center justify-center shadow-[0_0_10px_rgba(24,246,163,0.15)] backdrop-blur-md">
                                <span className="text-[#18F6A3] font-bold font-mono text-[10px] tracking-wide">
                                    +{dep.monthlyGain.toLocaleString()} {dep.currency === 'UZS' ? 'UZS' : ''}
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* Ad Card (Yangi Imkoniyat) */}
                    <div className="bg-[#0F183B] border border-[#5B6CFF]/30 rounded-[16px] p-[16px] w-full xl:w-[320px] min-h-[240px] flex flex-col relative group overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.4),0_0_20px_rgba(91,108,255,0.1),inset_0_1px_1px_rgba(255,255,255,0.1)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.5),0_0_30px_rgba(91,108,255,0.2),inset_0_1px_1px_rgba(255,255,255,0.2)] transition-all duration-500 hover:-translate-y-1 cursor-pointer">
                         
                        {/* Visual Richness Background Layers */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#14204D] to-[#050816] z-0"></div>
                        {/* Top Right White Reflection */}
                        <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-white/10 blur-[35px] rounded-full z-0 pointer-events-none transition-all duration-700 group-hover:bg-white/15"></div>
                        {/* Bottom Left Cyan Glow */}
                        <div className="absolute bottom-[-20%] left-[-20%] w-[50%] h-[50%] bg-[#00D9FF]/15 blur-[45px] rounded-full z-0 pointer-events-none transition-all duration-700 group-hover:bg-[#00D9FF]/25"></div>
                        {/* Glass Highlight */}
                        <div className="absolute top-0 left-0 right-0 h-[30%] bg-gradient-to-b from-white/10 to-transparent z-0 pointer-events-none transform group-hover:translate-y-2 transition-transform duration-700"></div>
                        {/* Thin abstract wave (SVG) < 8% */}
                        <svg className="absolute bottom-0 left-0 w-full h-[40%] opacity-[0.04] pointer-events-none z-0 transform group-hover:scale-105 transition-transform duration-700" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0,50 Q25,20 50,50 T100,50 L100,100 L0,100 Z" fill="url(#waveGrad)" />
                            <defs>
                                <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#5B6CFF" />
                                    <stop offset="100%" stopColor="#00D9FF" />
                                </linearGradient>
                            </defs>
                        </svg>

                        {/* Header */}
                        <div className="relative z-10 w-full flex justify-between items-start mb-[6px]">
                            <div className="text-[10px] text-[#00D9FF] font-semibold uppercase tracking-[1.5px] flex items-center gap-[6px]">
                                <Zap size={12} className="text-[#00D9FF] drop-shadow-[0_0_4px_rgba(0,217,255,0.8)] animate-pulse" /> 
                                {isUz ? "Yangi imkoniyat" : "New Opportunity"}
                            </div>
                        </div>
                        
                        {/* Content */}
                        <div className="relative z-10 flex-1 flex flex-col justify-center mb-[12px]">
                            <div className="text-[32px] font-[900] tracking-tighter leading-[0.9] flex items-baseline gap-[6px] bg-clip-text text-transparent bg-gradient-to-br from-white via-blue-100 to-[#5B6CFF] drop-shadow-[0_0_18px_rgba(91,108,255,0.5)] group-hover:drop-shadow-[0_0_25px_rgba(91,108,255,0.7)] transition-all duration-300">
                                +23% 
                                <span className="text-[10px] font-bold text-white/60 tracking-[1.5px] uppercase">
                                    {isUz ? "Yillik" : "Annual"}
                                </span>
                            </div>
                            <div className="text-[12px] text-gray-300 font-medium mt-[8px] leading-[1.4]">
                                {isUz ? "Kafolatlangan daromad oling." : "Get guaranteed income."}
                            </div>
                        </div>
                        
                        {/* Footer (Green monthly income) */}
                        <div className="relative z-10 mt-auto pt-[12px] border-t border-[rgba(255,255,255,0.08)] flex items-center gap-[8px]">
                            <div className="w-[6px] h-[6px] rounded-full bg-[#18F6A3] shadow-[0_0_8px_rgba(24,246,163,1)] animate-pulse"></div>
                            <div className="text-[#18F6A3] text-[11px] font-bold tracking-wide">
                                {isUz ? "Oyiga +287,500 UZS gacha" : "Up to +287,500 UZS/mo"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* State Guarantee Badge */}
                <div className="hidden lg:flex items-center gap-[8px] bg-[#0F183B]/80 backdrop-blur-xl border border-[#18F6A3]/30 px-[16px] py-[12px] rounded-[16px] shadow-[0_6px_24px_rgba(0,0,0,0.3),0_0_15px_rgba(24,246,163,0.1)] self-start transition-all hover:bg-[#14204D] cursor-default">
                    <div className="w-[28px] h-[28px] rounded-full bg-[#18F6A3]/10 flex items-center justify-center border border-[#18F6A3]/20">
                        <ShieldCheck size={14} className="text-[#18F6A3]" />
                    </div>
                    <span className="text-[12px] text-white font-semibold tracking-wide">{isUz ? "Davlat Kafolati" : "State Guarantee"}</span>
                </div>
            </div>

            {/* MAIN CONTENT SPLIT */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-[32px] relative z-10">
                
                {/* LEFT COLUMN: Templates + Form */}
                <div className="xl:col-span-7 flex flex-col gap-[32px] w-full">
                    
                    {/* Templates Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-[32px]">
                        {depositTemplates.map((temp, index) => {
                            const isSelected = selectedTemplateIdx === index;
                            
                            return (
                                <button
                                    key={temp.id}
                                    onClick={() => { setSelectedTemplateIdx(index); setError(''); }}
                                    className={`relative flex flex-col text-left p-[16px] rounded-[16px] overflow-hidden group transition-all duration-300 ease-out min-h-[240px]
                                        ${isSelected ? 'scale-[1.02] -translate-y-2 border-[rgba(255,255,255,0.25)]' : 'border-[rgba(255,255,255,0.1)] hover:-translate-y-2 hover:border-[rgba(255,255,255,0.2)]'}
                                        border shadow-[0_6px_24px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.6),0_0_20px_rgba(91,108,255,0.3),inset_0_1px_1px_rgba(255,255,255,0.25)]
                                    `}
                                >
                                    {/* --- 6 BACKGROUND LAYERS --- */}
                                    {/* Layer 1: Dark premium gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#0A102A] to-[#050816] z-0"></div>
                                    
                                    {/* Layer 2: Large radial glow */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                                        <div className={`w-[120px] h-[120px] rounded-full blur-[30px] ${isSelected ? 'bg-[#5B6CFF]/20' : 'bg-[#5B6CFF]/10'}`}></div>
                                    </div>
                                    
                                    {/* Layer 3: Blueprint lines */}
                                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-[0.2] z-0"></div>
                                    
                                    {/* Layer 4: Mesh gradient & Lighting (4 corners) */}
                                    <div className="absolute top-[-20%] left-[-20%] w-[35%] h-[35%] bg-[#5B6CFF]/30 blur-[35px] rounded-full z-0 group-hover:bg-[#5B6CFF]/40 transition-all duration-700"></div>
                                    <div className="absolute top-[-10%] right-[-10%] w-[30%] h-[30%] bg-white/10 blur-[30px] rounded-full z-0 group-hover:bg-white/20 transition-all duration-700"></div>
                                    <div className="absolute bottom-[-20%] left-[-20%] w-[45%] h-[45%] bg-[#724DFF]/20 blur-[45px] rounded-full z-0 group-hover:bg-[#724DFF]/30 transition-all duration-700"></div>
                                    <div className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] bg-[#00D9FF]/20 blur-[35px] rounded-full z-0 group-hover:bg-[#00D9FF]/30 transition-all duration-700"></div>
                                    
                                    {/* Layer 5: Soft particles (Noise) */}
                                    <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")'}}></div>

                                    {/* Layer 6: Glass reflection */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-[rgba(255,255,255,0.07)] via-transparent to-transparent pointer-events-none z-0 transform group-hover:translate-y-4 transition-transform duration-700 ease-out"></div>

                                    {/* UNIQUE ILLUSTRATIONS (Under 10% opacity) */}
                                    <div className="absolute -bottom-6 -right-6 opacity-[0.05] pointer-events-none z-0 transform group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-700 ease-out">
                                        {index === 0 && (
                                            <svg width="110" height="110" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="0.5">
                                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                                <line x1="12" y1="22.08" x2="12" y2="12"></line>
                                            </svg>
                                        )}
                                        {index === 1 && (
                                            <svg width="110" height="110" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="0.5">
                                                <path d="M4 14a8 8 0 0 1 16 0"></path>
                                                <path d="M4 10a12 12 0 0 1 16 0"></path>
                                                <path d="M4 6a16 16 0 0 1 16 0"></path>
                                                <path d="M4 2a20 20 0 0 1 16 0"></path>
                                            </svg>
                                        )}
                                        {index === 2 && (
                                            <svg width="110" height="110" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="0.5">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <circle cx="12" cy="12" r="6"></circle>
                                                <circle cx="12" cy="12" r="2"></circle>
                                                <line x1="2" y1="12" x2="22" y2="12"></line>
                                                <line x1="12" y1="2" x2="12" y2="22"></line>
                                            </svg>
                                        )}
                                    </div>

                                    {/* --- CONTENT --- */}
                                    <div className="relative z-10 w-full flex flex-col h-full">
                                        
                                        {/* Top Row: Icon + Badge */}
                                        <div className="flex justify-between items-start mb-[16px]">
                                            <div className={`w-[24px] h-[24px] rounded-full border flex items-center justify-center transition-all duration-500 shadow-[0_0_15px_rgba(255,255,255,0.05)]
                                                ${isSelected ? 'bg-[rgba(91,108,255,0.2)] border-[rgba(91,108,255,0.4)] shadow-[0_0_15px_rgba(91,108,255,0.4)]' : 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)] group-hover:bg-[rgba(255,255,255,0.08)] group-hover:border-[rgba(255,255,255,0.2)]'}
                                            `}>
                                                <temp.icon size={12} className={`transition-transform duration-500 group-hover:rotate-[15deg] ${isSelected ? 'text-[#00ffff] drop-shadow-[0_0_6px_rgba(0,255,255,0.8)]' : 'text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.5)]'}`} />
                                            </div>
                                            <div className={`px-[10px] py-[4px] rounded-full border text-[10px] font-bold tracking-widest uppercase backdrop-blur-md transition-colors duration-300
                                                ${isSelected ? 'bg-[#5B6CFF]/20 border-[#5B6CFF]/40 text-[#00ffff] shadow-[0_0_10px_rgba(91,108,255,0.3)]' : 'bg-white/5 border-white/10 text-gray-400 group-hover:text-white'}
                                            `}>
                                                {temp.duration} {isUz ? "OY" : "MONTHS"}
                                            </div>
                                        </div>

                                        {/* Percentage */}
                                        <div className="mb-[16px]">
                                            <div className="text-[36px] font-black leading-[0.8] tracking-tighter text-[#00ffff] drop-shadow-[0_0_15px_rgba(0,255,255,0.7)] group-hover:drop-shadow-[0_0_25px_rgba(0,255,255,0.9)] transition-all duration-300">
                                                {temp.rate}<span className="text-[20px] text-[#00ffff]/80 font-bold ml-[4px]">%</span>
                                            </div>
                                        </div>

                                        {/* Text Details */}
                                        <div className="mt-auto pt-[12px]">
                                            <h3 className="text-[20px] font-bold text-white mb-[8px] tracking-tight leading-tight group-hover:text-[#00ffff] transition-colors duration-300">
                                                {isUz ? temp.nameUz : temp.nameEn}
                                            </h3>
                                            <p className="text-[14px] font-medium text-gray-300 leading-[1.6] max-w-[95%]">
                                                {isUz ? temp.descUz : temp.descEn}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            )
                        })}
                    </div>

                    {/* Form Container */}
                    <div className={`${cardBase} flex flex-col gap-[24px]`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
                            
                            {/* Card Selection */}
                            <div className="flex flex-col relative" onMouseLeave={() => setIsDropdownOpen(false)}>
                                <label className={labelStyle}>
                                    {isUz ? "Karta tanlash" : "Select Card"}
                                </label>
                                <div 
                                    className={`${glassControlBase} cursor-pointer justify-between group`}
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    <div className="flex items-center gap-[12px] overflow-hidden">
                                        <CreditCard size={20} className="text-[#5B6CFF] group-hover:text-[#00D9FF] transition-colors" />
                                        <div className="flex flex-col items-start leading-[1.2]">
                                            <span className="text-[14px] font-semibold text-white">
                                                {!cards || cards.length === 0 ? (isUz ? "Karta mavjud emas" : "No cards") : `${cards[selectedCardIdx].type} •••• ${cards[selectedCardIdx].number ? cards[selectedCardIdx].number.slice(-4) : ''}`}
                                            </span>
                                            {cards && cards.length > 0 && (
                                                <span className="text-[11px] font-medium text-[#7E89B8]">
                                                    {cards[selectedCardIdx].currency === 'USD' ? '$' : ''}{typeof cards[selectedCardIdx].balance === 'string' ? parseFloat(cards[selectedCardIdx].balance.replace(/\s/g, '')).toLocaleString() : cards[selectedCardIdx].balance.toLocaleString()} {cards[selectedCardIdx].currency === 'UZS' ? 'UZS' : ''}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className={`w-[24px] h-[24px] flex items-center justify-center rounded-[8px] transition-colors ${isDropdownOpen ? 'bg-[#5B6CFF]/20' : 'bg-white/5 group-hover:bg-white/10'}`}>
                                        <ChevronDown size={14} className={`text-[#7E89B8] transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-[#00D9FF]' : ''}`} />
                                    </div>
                                </div>

                                {/* Custom Dropdown Menu */}
                                <div className={`absolute top-[90px] left-0 right-0 bg-[rgba(17,24,54,0.9)] backdrop-blur-[24px] border border-[rgba(255,255,255,0.1)] rounded-[18px] shadow-[0_15px_40px_rgba(0,0,0,0.5)] overflow-hidden z-50 transition-all duration-300 transform origin-top ${isDropdownOpen ? 'opacity-100 scale-100 pointer-events-auto translate-y-0' : 'opacity-0 scale-95 pointer-events-none -translate-y-2'}`}>
                                    {!cards || cards.length === 0 ? (
                                        <div className="p-[20px] text-center text-[13px] text-[#7E89B8]">{isUz ? "Mavjud emas" : "Not available"}</div>
                                    ) : (
                                        cards.map((card, idx) => {
                                            const isSelected = selectedCardIdx === idx;
                                            const bal = typeof card.balance === 'string' ? parseFloat(card.balance.replace(/\s/g, '')) : card.balance;
                                            return (
                                                <div 
                                                    key={idx} 
                                                    onClick={() => { setSelectedCardIdx(idx); setError(''); setIsDropdownOpen(false); }}
                                                    className={`h-[48px] px-[20px] flex items-center justify-between cursor-pointer transition-colors duration-200 ${isSelected ? 'bg-gradient-to-r from-[#5B6CFF]/20 to-transparent border-l-[3px] border-[#5B6CFF]' : 'hover:bg-[#5B6CFF]/10 border-l-[3px] border-transparent'}`}
                                                >
                                                    <div className="flex items-center gap-[12px]">
                                                        <CreditCard size={16} className={isSelected ? 'text-[#00D9FF]' : 'text-[#7E89B8]'} />
                                                        <span className={`text-[14px] ${isSelected ? 'font-semibold text-white' : 'font-medium text-[#7E89B8]'}`}>
                                                            {card.type} •••• {card.number ? card.number.slice(-4) : ''}
                                                        </span>
                                                    </div>
                                                    <span className={`text-[13px] font-mono ${isSelected ? 'text-[#18F6A3]' : 'text-white'}`}>
                                                        {card.currency === 'USD' ? '$' : ''}{bal.toLocaleString()}
                                                    </span>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                            {/* Investment Amount */}
                            <div className="flex flex-col relative">
                                <label className={labelStyle}>
                                    {isUz ? "Omonat summasi" : "Investment Amount"}
                                </label>
                                <div className={`${glassControlBase} p-0 relative group overflow-hidden`}>
                                    <input
                                        type="text"
                                        value={investAmount}
                                        onChange={(e) => { setInvestAmount(e.target.value.replace(/\D/g, '')); setError(''); }}
                                        placeholder="0"
                                        className="w-full h-full bg-transparent border-none outline-none text-white font-[600] text-[18px] pl-[20px] pr-[80px] placeholder:text-[rgba(255,255,255,0.2)] placeholder:font-medium placeholder:transition-opacity focus:placeholder:opacity-50"
                                    />
                                    <div className="absolute right-[8px] top-1/2 -translate-y-1/2 h-[42px] px-[16px] bg-[#5B6CFF]/10 backdrop-blur-md rounded-[12px] border border-[#5B6CFF]/30 flex items-center justify-center pointer-events-none shadow-[0_0_15px_rgba(91,108,255,0.15)] group-focus-within:border-[#00D9FF]/50 group-focus-within:shadow-[0_0_20px_rgba(0,217,255,0.2)] group-focus-within:bg-[#00D9FF]/10 transition-all duration-300">
                                        <span className="text-[13px] font-bold text-[#00D9FF] uppercase tracking-widest drop-shadow-[0_0_8px_rgba(0,217,255,0.5)]">
                                            {activeTemplate.currency}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-[8px] text-[12px] text-[#7E89B8] font-medium pl-[4px] flex items-center gap-[6px]">
                                    <AlertCircle size={12} className="text-[#00D9FF]" />
                                    Min: {activeTemplate.currency === 'USD' ? '$' : ''}{activeTemplate.minAmount.toLocaleString()} {activeTemplate.currency === 'UZS' ? 'UZS' : ''}
                                </div>
                            </div>

                        </div>

                        {error && (
                            <div className="text-[#FF5A7A] text-[13px] font-medium flex items-center gap-[10px] bg-[#FF5A7A]/10 border border-[#FF5A7A]/20 px-[16px] py-[12px] rounded-[12px] w-full animate-fade-in shadow-[0_0_15px_rgba(255,90,122,0.1)]">
                                <div className="w-[24px] h-[24px] rounded-full bg-[#FF5A7A]/20 flex items-center justify-center shrink-0">
                                    <AlertCircle size={14} className="text-[#FF5A7A]" />
                                </div>
                                {error}
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN: The Glowing 3D Graphic Panel */}
                <div className={`${cardBase} xl:col-span-5 flex flex-col justify-between p-[24px] min-h-[360px] group`}>
                    {/* Ambient Hover Glow */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#5B6CFF]/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                    {/* Top Stats Row */}
                    <div className="flex justify-between items-start relative z-10 w-full">
                        <div className="flex items-center gap-[6px] bg-[#18F6A3]/10 border border-[#18F6A3]/20 px-[10px] py-[4px] rounded-[8px] shadow-[0_0_10px_rgba(24,246,163,0.1)]">
                            <CheckCircle2 size={12} className="text-[#18F6A3]" />
                            <span className="text-[10px] font-bold text-[#18F6A3] uppercase tracking-wider">{isUz ? "Tasdiqlangan" : "Verified"}</span>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] text-[rgba(255,255,255,0.5)] font-bold uppercase tracking-wider mb-[2px]">{isUz ? "Jami sarmoya qaytishi" : "Total Return"}</div>
                            <div className="text-[24px] font-bold text-white font-mono tracking-tight flex justify-end items-baseline gap-[6px]">
                                <span className="text-[#18F6A3] font-sans mr-[2px]">+</span>
                                {activeTemplate.currency === 'USD' ? '$' : ''}{profitCalc.total.toLocaleString()}
                                <span className="text-[11px] font-sans font-semibold text-[rgba(255,255,255,0.4)]">{activeTemplate.currency === 'UZS' ? 'UZS' : ''}</span>
                            </div>
                        </div>
                    </div>

                    {/* Middle: Luxury 3D Isometric Composition */}
                    <div className="flex-1 w-full flex items-center justify-center relative pointer-events-none my-[24px]">
                        
                        {/* Glow Behind Cubes */}
                        <div className="absolute w-[160px] h-[160px] bg-[#5B6CFF]/20 rounded-full blur-[45px]"></div>

                        <div className="relative w-[140px] h-[140px] flex items-center justify-center">
                            {/* Wrapper with isometric perspective */}
                            <div style={{ transformStyle: 'preserve-3d', transform: 'rotateX(60deg) rotateZ(-45deg) scale(0.75)' }} className="relative">
                                {/* Back left cube */}
                                <LuxuryIsometricCube size={48} type="dark" x={-36} y={-48} z={0} />
                                {/* Back right cube */}
                                <LuxuryIsometricCube size={48} type="dark" x={36} y={-12} z={0} />
                                {/* Main front glowing blue cube */}
                                <LuxuryIsometricCube size={72} type="primary" x={12} y={24} z={24} glow={true} />
                            </div>

                            {/* Luxury Badge */}
                            <div className="absolute -bottom-[10px] -right-[10px] bg-[#0A102A]/90 backdrop-blur-xl border border-[#5B6CFF]/40 rounded-full w-[64px] h-[64px] flex flex-col items-center justify-center shadow-[0_12px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(91,108,255,0.3)] z-20">
                                <span className="text-[7px] text-[#00D9FF] font-bold tracking-widest uppercase">x 21000</span>
                                <span className="text-[20px] font-black text-white leading-none my-[2px] tracking-tighter">13</span>
                                <span className="text-[7px] text-[rgba(255,255,255,0.5)] font-bold tracking-widest">RANGE</span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom: Submit Button */}
                    <button
                        onClick={handleCreateDeposit}
                        disabled={isCreating}
                        className={`${buttonBase} w-full mt-auto z-10`}
                    >
                        {isCreating ? <Loader2 className="animate-spin text-white" size={20} /> : (
                            <>
                                {isUz ? "Omonatni faollashtirish" : "Activate Deposit"}
                                <ArrowUpRight size={18} className="opacity-80 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                            </>
                        )}
                    </button>
                </div>
            </div>

        </div>
    );
};

export default DepositsView;
