import React from 'react';
import { Wifi } from 'lucide-react';

const CreditCard = ({ type, number, balance, expiry, color, active, currency = 'UZS' }) => {
    const getGradient = () => {
        switch (color) {
            case 'teal': return 'from-teal-600 via-emerald-600 to-cyan-700'; // Humo custom
            case 'indigo': return 'from-indigo-600 via-blue-600 to-sky-700'; // Uzcard custom
            case 'gold': return 'from-amber-600 via-yellow-600 to-amber-800'; // Visa Gold/Infinite
            case 'black': return 'from-zinc-900 via-slate-800 to-zinc-900'; // Premium Black
            case 'purple': return 'from-purple-600 via-fuchsia-600 to-pink-700'; // Luxury Purple
            default: return 'from-blue-600 to-blue-400';
        }
    }

    const formatBalance = (bal) => {
        const val = typeof bal === 'string' ? parseFloat(bal.replace(/\s/g, '')) : bal;
        if (isNaN(val)) return bal;
        if (currency === 'USD') {
            return '$ ' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
        return val.toLocaleString('uz-UZ') + " so'm";
    }

    // Render type-specific badge/logo
    const renderCardLogo = () => {
        const t = type.toUpperCase();
        if (t === 'HUMO') {
            return (
                <div className="flex flex-col items-end">
                    <span className="bg-gradient-to-r from-teal-300 to-cyan-300 text-slate-900 font-extrabold text-[10px] px-2 py-0.5 rounded-md tracking-wider shadow-sm">
                        HUMO
                    </span>
                    <span className="text-[7px] text-teal-200 mt-0.5 tracking-tight font-medium">Uzbekistan</span>
                </div>
            );
        }
        if (t === 'UZCARD') {
            return (
                <div className="flex flex-col items-end">
                    <span className="bg-gradient-to-r from-blue-400 to-sky-300 text-slate-900 font-extrabold text-[10px] px-2 py-0.5 rounded-md tracking-wider shadow-sm">
                        UZCARD
                    </span>
                    <span className="text-[7px] text-blue-200 mt-0.5 tracking-tight font-medium font-sans">NMPC</span>
                </div>
            );
        }
        if (t === 'VISA') {
            return (
                <span className="text-xl font-extrabold italic text-yellow-300 tracking-tight font-sans">
                    VISA
                </span>
            );
        }
        if (t === 'MASTERCARD') {
            return (
                <div className="flex items-center gap-1">
                    <div className="flex -space-x-2">
                        <div className="w-4 h-4 rounded-full bg-red-500 opacity-90"></div>
                        <div className="w-4 h-4 rounded-full bg-amber-500 opacity-90"></div>
                    </div>
                    <span className="text-[9px] font-bold text-white lowercase">mastercard</span>
                </div>
            );
        }
        return <span className="font-bold text-sm tracking-wide">{type}</span>;
    }

    return (
        <div className={`relative min-w-[300px] w-[300px] h-48 rounded-[24px] p-6 text-white overflow-hidden transition-all duration-300 select-none ${active ? 'scale-105 shadow-xl shadow-blue-500/25 ring-2 ring-blue-400/50' : 'opacity-70 hover:opacity-90 scale-100 border border-white/5'}`}>
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${getGradient()}`}></div>
            <div className="absolute inset-0 bg-black/15 backdrop-blur-[0.5px]"></div>

            {/* Glowing reflection overlay */}
            <div className="absolute top-[-30%] left-[-20%] w-[80%] h-[80%] bg-white/10 rounded-full rotate-45 pointer-events-none filter blur-2xl"></div>

            <div className="relative z-10 flex flex-col h-full justify-between">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                        <span className="font-semibold text-xs tracking-wider text-white/90">APEX BANK</span>
                        <span className="text-[7px] uppercase tracking-widest text-white/60">Premium Club</span>
                    </div>
                    {renderCardLogo()}
                </div>

                {/* Chip and contactless */}
                <div className="flex items-center justify-between my-1">
                    {/* Real Card Chip Graphic */}
                    <div className="w-8 h-6 bg-gradient-to-br from-yellow-300 via-amber-200 to-yellow-500 rounded-md relative overflow-hidden border border-amber-600/30 flex items-center justify-center p-0.5">
                        <div className="w-full h-full border-[0.5px] border-amber-800/40 rounded flex flex-wrap opacity-80">
                            <div className="w-1/2 h-1/3 border-b-[0.5px] border-r-[0.5px] border-amber-800/30"></div>
                            <div className="w-1/2 h-1/3 border-b-[0.5px] border-amber-800/30"></div>
                            <div className="w-1/3 h-1/3 border-b-[0.5px] border-r-[0.5px] border-amber-800/30"></div>
                            <div className="w-1/3 h-1/3 border-b-[0.5px] border-r-[0.5px] border-amber-800/30"></div>
                            <div className="w-1/3 h-1/3 border-b-[0.5px] border-amber-800/30"></div>
                            <div className="w-1/2 h-1/3 border-r-[0.5px] border-amber-800/30"></div>
                            <div className="w-1/2 h-1/3"></div>
                        </div>
                    </div>
                    <Wifi className="rotate-90 text-white/70" size={16} />
                </div>

                {/* Card Number */}
                <div>
                    <p className="text-base tracking-[3px] font-mono leading-none">{number}</p>
                </div>

                {/* Footer Balance & Expiry */}
                <div className="flex justify-between items-end">
                    <div className="space-y-0.5">
                        <p className="text-[8px] uppercase tracking-wider text-white/50">Balans</p>
                        <p className="text-lg font-bold font-sans tracking-tight">{formatBalance(balance)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[7px] uppercase tracking-wider text-white/50">Yaroqlilik</p>
                        <p className="text-xs font-mono font-medium">{expiry}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreditCard;
