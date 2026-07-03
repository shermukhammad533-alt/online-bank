import React, { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, ArrowRight, Calendar, PieChart, ShoppingBag, Utensils, Zap, Car, Film } from 'lucide-react';

const categoryDetails = [
    { nameUz: 'Oziq-ovqat', nameEn: 'Food / Groceries', percentage: 35, amountUzs: 1850000, icon: Utensils, color: 'text-emerald-400', bg: 'bg-emerald-500/20', colorCode: '#10b981' },
    { nameUz: 'Kommunal to\'lovlar', nameEn: 'Utilities', percentage: 20, amountUzs: 1050000, icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/20', colorCode: '#eab308' },
    { nameUz: 'Ko\'ngilochar xizmatlar', nameEn: 'Entertainment', percentage: 15, amountUzs: 790000, icon: Film, color: 'text-purple-400', bg: 'bg-purple-500/20', colorCode: '#a855f7' },
    { nameUz: 'Transport / Taksi', nameEn: 'Transport / Taxi', percentage: 18, amountUzs: 950000, icon: Car, color: 'text-blue-400', bg: 'bg-blue-500/20', colorCode: '#3b82f6' },
    { nameUz: 'Savdo-sotiq', nameEn: 'Shopping', percentage: 12, amountUzs: 630000, icon: ShoppingBag, color: 'text-pink-400', bg: 'bg-pink-500/20', colorCode: '#ec4899' },
];

const monthData = [
    { label: 'Yan', val: 5600000 },
    { label: 'Fev', val: 4200000 },
    { label: 'Mar', val: 6800000 },
    { label: 'Apr', val: 5100000 },
    { label: 'May', val: 8200000 },
    { label: 'Iyun', val: 5270000 }, // Matches total current month UZS expenses approx
];

const AnalyticsView = ({ language, locales }) => {
    const t = locales[language];
    const [timeframe, setTimeframe] = useState('monthly'); // weekly or monthly

    const totalExpensesUzs = categoryDetails.reduce((acc, cat) => acc + cat.amountUzs, 0);
    const maxMonthData = Math.max(...monthData.map(d => d.val));

    return (
        <div className="max-w-[1200px] mx-auto space-y-8 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/10 flex-shrink-0">
                        <BarChart3 size={28} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-white font-sans tracking-tight mb-1">{language === 'uz' ? "Xarajatlar Tahlili" : "Expense Analytics"}</h2>
                        <p className="text-gray-400 text-sm">{language === 'uz' ? "Moliyaviy harakatlaringiz bo'yicha hisobotlar" : "Visual breakdown of your financial activities"}</p>
                    </div>
                </div>

                <div className="flex bg-[#0a0f1c] p-1.5 rounded-xl border border-white/10 shadow-inner">
                    <button
                        onClick={() => setTimeframe('weekly')}
                        className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 ${timeframe === 'weekly' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        {language === 'uz' ? 'Haftalik' : 'Weekly'}
                    </button>
                    <button
                        onClick={() => setTimeframe('monthly')}
                        className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 ${timeframe === 'monthly' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        {language === 'uz' ? 'Oylik' : 'Monthly'}
                    </button>
                </div>
            </div>

            {/* TOP STATS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass border border-white/5 rounded-3xl p-6 flex items-center justify-between shadow-xl shadow-black/20 hover:-translate-y-1 transition-transform cursor-default group">
                    <div>
                        <p className="text-[11px] text-gray-500 uppercase tracking-widest font-bold mb-2">{language === 'uz' ? "Umumiy xarajatlar" : "Total Expenses"}</p>
                        <p className="text-2xl font-black text-white font-mono">{totalExpensesUzs.toLocaleString('uz-UZ')} <span className="text-sm text-gray-400 font-bold ml-1">so'm</span></p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 group-hover:bg-red-500/20 group-hover:scale-110 transition-all">
                        <TrendingDown size={24} />
                    </div>
                </div>

                <div className="glass border border-white/5 rounded-3xl p-6 flex items-center justify-between shadow-xl shadow-black/20 hover:-translate-y-1 transition-transform cursor-default group">
                    <div>
                        <p className="text-[11px] text-gray-500 uppercase tracking-widest font-bold mb-2">{language === 'uz' ? "Oylik o'rtacha" : "Monthly Average"}</p>
                        <p className="text-2xl font-black text-white font-mono">
                            {Math.round(monthData.reduce((acc, m) => acc + m.val, 0) / monthData.length).toLocaleString('uz-UZ')} <span className="text-sm text-gray-400 font-bold ml-1">so'm</span>
                        </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 group-hover:scale-110 transition-all">
                        <TrendingUp size={24} />
                    </div>
                </div>

                <div className="glass border border-white/5 rounded-3xl p-6 flex items-center justify-between shadow-xl shadow-black/20 hover:-translate-y-1 transition-transform cursor-default group">
                    <div>
                        <p className="text-[11px] text-gray-500 uppercase tracking-widest font-bold mb-2">{language === 'uz' ? "Budjet limit koeffitsiyenti" : "Budget Status"}</p>
                        <div className="flex items-baseline gap-2 mt-1">
                            <p className="text-2xl font-black text-emerald-400">72%</p>
                            <span className="text-xs text-emerald-500/70 font-bold uppercase tracking-wider">({language === 'uz' ? "barqaror" : "stable"})</span>
                        </div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all">
                        <Zap size={24} />
                    </div>
                </div>
            </div>

            {/* CHARTS CONTAINER */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* SVG Bar Chart */}
                <div className="lg:col-span-8 glass border border-white/5 rounded-3xl p-8 space-y-6 relative overflow-hidden shadow-2xl">
                    <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
                    <h3 className="text-xl font-bold text-white tracking-tight border-b border-white/5 pb-4 relative z-10">
                        {language === 'uz' ? "Chiqimlar taqvimi (so'm)" : "Expense Calendar (UZS)"}
                    </h3>

                    {/* SVG Chart Render */}
                    <div className="h-72 flex items-end justify-between gap-4 sm:gap-8 pt-8 border-b-2 border-white/5 border-l-2 border-white/5 pl-4 sm:pl-6 pb-2 relative z-10">
                        {monthData.map((d, index) => {
                            const barHeightPercent = (d.val / maxMonthData) * 85; // scale to 85% max height

                            return (
                                <div key={index} className="flex-1 flex flex-col items-center group relative h-full justify-end cursor-pointer">
                                    {/* Tooltip */}
                                    <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 border border-white/10 text-xs font-bold p-3 rounded-xl -top-14 z-20 text-white shadow-xl shadow-black/50 pointer-events-none whitespace-nowrap transform -translate-y-2 group-hover:translate-y-0 duration-200">
                                        <span className="text-blue-400">{d.val.toLocaleString('uz-UZ')}</span> UZS
                                    </div>

                                    {/* Animated Bar */}
                                    <div
                                        style={{ height: `${barHeightPercent}%` }}
                                        className="w-full max-w-[3rem] bg-gradient-to-t from-blue-700/80 to-indigo-400 group-hover:from-blue-600 group-hover:to-cyan-400 rounded-t-xl transition-all duration-500 ease-out shadow-lg shadow-blue-500/20 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                                    ></div>

                                    {/* Label */}
                                    <span className="text-xs text-gray-500 group-hover:text-blue-400 mt-4 transition-colors font-bold uppercase tracking-widest">
                                        {d.label}
                                    </span>
                                </div>
                            );
                        })}

                        {/* Chart Grid Lines */}
                        <div className="absolute left-0 right-0 top-[20%] border-t border-white/[0.03] pointer-events-none border-dashed"></div>
                        <div className="absolute left-0 right-0 top-[50%] border-t border-white/[0.03] pointer-events-none border-dashed"></div>
                        <div className="absolute left-0 right-0 top-[80%] border-t border-white/[0.03] pointer-events-none border-dashed"></div>
                    </div>
                </div>

                {/* Categories List */}
                <div className="lg:col-span-4 glass border border-white/5 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
                    <h3 className="text-xl font-bold text-white tracking-tight border-b border-white/5 pb-4 relative z-10">
                        {language === 'uz' ? "Kategoriyalar" : "Breakdown by Category"}
                    </h3>

                    <div className="space-y-6 relative z-10">
                        {categoryDetails.map((cat, idx) => {
                            const Icon = cat.icon;
                            return (
                                <div key={idx} className="space-y-3 group cursor-default">
                                    <div className="flex items-center justify-between text-sm font-semibold">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-xl ${cat.bg} ${cat.color} group-hover:scale-110 transition-transform`}>
                                                <Icon size={16} />
                                            </div>
                                            <span className="text-gray-300 group-hover:text-white transition-colors">{language === 'uz' ? cat.nameUz : cat.nameEn}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-white font-bold block font-mono">{cat.amountUzs.toLocaleString('uz-UZ')}</span>
                                            <span className="text-[11px] text-gray-500 font-bold">{cat.percentage}%</span>
                                        </div>
                                    </div>
                                    {/* Progress track */}
                                    <div className="w-full h-2 bg-[#0a0f1c] rounded-full overflow-hidden shadow-inner border border-white/5">
                                        <div
                                            className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_currentColor]"
                                            style={{
                                                width: `${cat.percentage}%`,
                                                backgroundColor: cat.colorCode,
                                                color: cat.colorCode
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsView;
