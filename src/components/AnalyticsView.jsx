import React, { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, ArrowRight, Calendar, PieChart, ShoppingBag, Utensils, Zap, Car, Film } from 'lucide-react';

const categoryDetails = [
    { nameUz: 'Oziq-ovqat', nameEn: 'Food / Groceries', percentage: 35, amountUzs: 1850000, icon: Utensils, color: 'bg-emerald-500 text-emerald-400', colorCode: '#10b981' },
    { nameUz: 'Kommunal to\'lovlar', nameEn: 'Utilities', percentage: 20, amountUzs: 1050000, icon: Zap, color: 'bg-yellow-500 text-yellow-400', colorCode: '#eab308' },
    { nameUz: 'Ko\'ngilochar xizmatlar', nameEn: 'Entertainment', percentage: 15, amountUzs: 790000, icon: Film, color: 'bg-purple-500 text-purple-400', colorCode: '#a855f7' },
    { nameUz: 'Transport / Taksi', nameEn: 'Transport / Taxi', percentage: 18, amountUzs: 950000, icon: Car, color: 'bg-blue-500 text-blue-400', colorCode: '#3b82f6' },
    { nameUz: 'Savdo-sotiq', nameEn: 'Shopping', percentage: 12, amountUzs: 630000, icon: ShoppingBag, color: 'bg-pink-500 text-pink-400', colorCode: '#ec4899' },
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
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-600/20 rounded-2xl text-indigo-400">
                        <BarChart3 size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold font-sans">{language === 'uz' ? "Harajatlar Tahlili" : "Expense Analytics"}</h2>
                        <p className="text-sm text-gray-400">{language === 'uz' ? "Moliyaviy harakatlaringiz boyicha hisobotlar" : "Visual breakdown of your financial activities"}</p>
                    </div>
                </div>

                <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 text-xs">
                    <button
                        onClick={() => setTimeframe('weekly')}
                        className={`px-4 py-2 rounded-lg font-bold transition-all ${timeframe === 'weekly' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        {language === 'uz' ? 'Haftalik' : 'Weekly'}
                    </button>
                    <button
                        onClick={() => setTimeframe('monthly')}
                        className={`px-4 py-2 rounded-lg font-bold transition-all ${timeframe === 'monthly' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        {language === 'uz' ? 'Oylik' : 'Monthly'}
                    </button>
                </div>
            </div>

            {/* TOP STATS ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="glass p-6 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-widest">{language === 'uz' ? "Umumiy harajatlar" : "Total Expenses"}</p>
                        <p className="text-xl font-extrabold text-white mt-1">{totalExpensesUzs.toLocaleString('uz-UZ')} so'm</p>
                    </div>
                    <div className="p-3 rounded-xl bg-red-500/10 text-red-400">
                        <TrendingDown size={20} />
                    </div>
                </div>

                <div className="glass p-6 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-widest">{language === 'uz' ? "Oylik o'rtacha" : "Monthly Average"}</p>
                        <p className="text-xl font-extrabold text-white mt-1">
                            {Math.round(monthData.reduce((acc, m) => acc + m.val, 0) / monthData.length).toLocaleString('uz-UZ')} so'm
                        </p>
                    </div>
                    <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                        <TrendingUp size={20} />
                    </div>
                </div>

                <div className="glass p-6 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-widest">{language === 'uz' ? "Budjet limit koeffitsiyenti" : "Budget Status"}</p>
                        <div className="flex items-baseline gap-1.5 mt-1">
                            <p className="text-xl font-extrabold text-emerald-400">72%</p>
                            <span className="text-[10px] text-gray-400 font-medium">({language === 'uz' ? "barqaror" : "stable"})</span>
                        </div>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                        <Zap size={20} />
                    </div>
                </div>
            </div>

            {/* CHARTS CONTAINER */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* SVG Bar Chart */}
                <div className="md:col-span-8 glass p-6 space-y-6">
                    <h3 className="text-base font-bold text-white mb-4">
                        {language === 'uz' ? "Chiqimlar taqvimi (so'm)" : "Expense Calendar (UZS)"}
                    </h3>

                    {/* SVG Chart Render */}
                    <div className="h-64 flex items-end justify-between gap-4 pt-6 border-b border-white/5 border-l border-white/5 pl-4 pb-2 relative">
                        {monthData.map((d, index) => {
                            const barHeightPercent = (d.val / maxMonthData) * 80; // scale to 80% max height

                            return (
                                <div key={index} className="flex-1 flex flex-col items-center group relative h-full justify-end cursor-pointer">
                                    {/* Tooltip */}
                                    <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-white/10 text-[10px] p-2 rounded-lg -top-12 z-20 text-white shadow-xl pointer-events-none whitespace-nowrap">
                                        <strong>{d.val.toLocaleString('uz-UZ')} UZS</strong>
                                    </div>

                                    {/* Animated Bar */}
                                    <div
                                        style={{ height: `${barHeightPercent}%` }}
                                        className="w-full bg-gradient-to-t from-blue-600 to-indigo-400 group-hover:from-blue-500 group-hover:to-cyan-400 rounded-t-lg transition-all duration-700 ease-out shadow-lg shadow-blue-500/10 hover:shadow-cyan-400/20"
                                    ></div>

                                    {/* Label */}
                                    <span className="text-xs text-gray-500 group-hover:text-white mt-2 transition-colors font-medium">
                                        {d.label}
                                    </span>
                                </div>
                            );
                        })}

                        {/* Chart Grid Lines */}
                        <div className="absolute left-0 right-0 top-[20%] border-t border-white/[0.02] pointer-events-none"></div>
                        <div className="absolute left-0 right-0 top-[50%] border-t border-white/[0.02] pointer-events-none"></div>
                        <div className="absolute left-0 right-0 top-[80%] border-t border-white/[0.02] pointer-events-none"></div>
                    </div>
                </div>

                {/* Categories List */}
                <div className="md:col-span-4 glass p-6 space-y-6">
                    <h3 className="text-base font-bold text-white mb-4">
                        {language === 'uz' ? "Kategoriyalar yig'indisi" : "Breakdown by Category"}
                    </h3>

                    <div className="space-y-4">
                        {categoryDetails.map((cat, idx) => {
                            const Icon = cat.icon;
                            return (
                                <div key={idx} className="space-y-2">
                                    <div className="flex items-center justify-between text-xs font-semibold">
                                        <div className="flex items-center gap-2">
                                            <div className={`p-1.5 rounded-lg ${cat.color.split(' ')[0]} bg-opacity-20 ${cat.color.split(' ')[1]}`}>
                                                <Icon size={14} />
                                            </div>
                                            <span className="text-gray-300">{language === 'uz' ? cat.nameUz : cat.nameEn}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-white block">{cat.amountUzs.toLocaleString('uz-UZ')} so'm</span>
                                            <span className="text-[10px] text-gray-500">{cat.percentage}%</span>
                                        </div>
                                    </div>
                                    {/* Progress track */}
                                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-1000"
                                            style={{
                                                width: `${cat.percentage}%`,
                                                backgroundColor: cat.colorCode
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
