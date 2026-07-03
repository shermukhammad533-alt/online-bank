import React, { useState } from 'react';
import { User, Camera, Check, Clock, TrendingUp, TrendingDown } from 'lucide-react';

const ProfileView = ({ language, userProfile, setUserProfile, activities }) => {
    const isUz = language === 'uz';

    const nameParts = userProfile.name.split(' ');
    const [editFirstName, setEditFirstName] = useState(nameParts[0] || '');
    const [editLastName, setEditLastName] = useState(nameParts.slice(1).join(' ') || '');
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = (e) => {
        e.preventDefault();
        const newFullName = `${editFirstName} ${editLastName}`.trim();
        setUserProfile({ name: newFullName || 'Foydalanuvchi', avatar: userProfile.avatar });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    return (
        <div className="flex flex-col gap-12 animate-fade-in w-full">

            {/* Top: Profile Settings */}
            <div style={{
                background: 'rgba(13,20,37,0.8)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 24,
                padding: '36px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-blue-500/10 rounded-full blur-[40px] pointer-events-none"></div>
                <div className="absolute bottom-[-50px] left-[-50px] w-40 h-40 bg-purple-500/10 rounded-full blur-[40px] pointer-events-none"></div>

                <h2 className="text-3xl font-black text-white mb-8 tracking-wide font-outfit text-center sm:text-left">
                    {isUz ? "Shaxsiy Profil" : "Personal Profile"}
                </h2>

                <form onSubmit={handleSave} className="space-y-6 w-full">
                    <div className="flex flex-col gap-6">

                        {/* First Name */}
                        <div className="space-y-3">
                            <label className="text-sm text-[#8891a8] uppercase font-bold tracking-widest flex items-center gap-3">
                                <User size={16} className="text-blue-400" />
                                {isUz ? "Ism" : "First Name"}
                            </label>
                            <input
                                type="text"
                                required
                                value={editFirstName}
                                onChange={e => setEditFirstName(e.target.value)}
                                className="w-full bg-[#111928] border border-white/10 rounded-md py-6 px-5 text-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium placeholder-gray-600 tracking-wide"
                                placeholder={isUz ? "Ismingiz" : "First Name"}
                            />
                        </div>

                        {/* Last Name */}
                        <div className="space-y-3">
                            <label className="text-sm text-[#8891a8] uppercase font-bold tracking-widest flex items-center gap-3">
                                <User size={16} className="text-purple-400" />
                                {isUz ? "Familiya" : "Last Name"}
                            </label>
                            <input
                                type="text"
                                required
                                value={editLastName}
                                onChange={e => setEditLastName(e.target.value)}
                                className="w-full bg-[#111928] border border-white/10 rounded-md py-6 px-5 text-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium placeholder-gray-600 tracking-wide"
                                placeholder={isUz ? "Familiyangiz" : "Last Name"}
                            />
                        </div>

                        <button
                            type="submit"
                            className={`w-full h-16 rounded-md text-base font-extrabold tracking-wide flex items-center justify-center gap-3 transition-all duration-300 shadow-lg mt-2 ${isSaved
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-emerald-500/10'
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/30 hover:-translate-y-0.5'
                                }`}
                        >
                            {isSaved ? (
                                <>
                                    <Check size={18} />
                                    {isUz ? "Saqlandi!" : "Saved!"}
                                </>
                            ) : (
                                isUz ? "O'zgarishlarni saqlash" : "Save Changes"
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Bottom: History View */}
            <div className="flex-1 flex flex-col gap-6">
                <div style={{
                    background: 'rgba(13,20,37,0.8)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 24,
                    padding: '36px',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-white tracking-tight font-outfit mb-1">
                                {isUz ? "To'lovlar va o'tkazmalar tarixi" : "Transaction History"}
                            </h2>
                            <p className="text-sm text-gray-400">
                                {isUz ? "Barcha kirim va chiqim operatsiyalari" : "All income and expense operations"}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                            <Clock size={24} />
                        </div>
                    </div>

                    {activities.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center opacity-70 p-10">
                            <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-state-2130362-1800926.png" alt="Empty" className="w-48 h-48 object-contain mb-4 filter opacity-50 grayscale" />
                            <h3 className="text-lg font-bold text-gray-300">
                                {isUz ? "Tarix bo'sh" : "History is empty"}
                            </h3>
                            <p className="text-sm text-gray-500 mt-2 text-center max-w-sm">
                                {isUz ? "Hozircha hech qanday o'tkazma yoki to'lov amalga oshirmadingiz. Operatsiyalar bu yerda ko'rinadi." : "You haven't made any transfers or payments yet. They will appear here."}
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 overflow-y-auto pr-2 no-scrollbar" style={{ maxHeight: '600px' }}>
                            {activities.map((item, index) => {
                                const Icon = item.icon || User;
                                const val = parseFloat(item.amount.replace(/\s/g, ''));
                                const isExpense = item.amount.startsWith('-');
                                const amountStr = item.currency === 'USD'
                                    ? (isExpense ? '-$' : '+$') + Math.abs(val).toFixed(2)
                                    : (isExpense ? '-' : '+') + Math.abs(val).toLocaleString('uz-UZ') + " so'm";

                                return (
                                    <div key={index} className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-default">
                                        <div className="flex items-center gap-5">
                                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center border shadow-sm ${isExpense
                                                ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                                                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                                }`}>
                                                {isExpense ? <TrendingDown size={24} /> : <TrendingUp size={24} />}
                                            </div>
                                            <div>
                                                <div className="text-lg font-bold text-white mb-2">{item.name}</div>
                                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                                    <span className="font-medium px-2 py-1 rounded-md bg-white/5">{item.type}</span>
                                                    <span>•</span>
                                                    <span>{item.time}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-xl font-extrabold ${isExpense ? 'text-white' : 'text-emerald-400'}`}>
                                                {amountStr}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-2 uppercase tracking-wider font-semibold">
                                                {isUz ? 'Muvaffaqiyatli' : 'Success'}
                                            </div>
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

export default ProfileView;
