import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './components/Dashboard';
import TransferView from './components/TransferView';
import PaymentsView from './components/PaymentsView';
import AnalyticsView from './components/AnalyticsView';
import DepositsView from './components/DepositsView';
import CreditCard from './components/CreditCard';
import ProfileView from './components/ProfileView';
import { User, Smartphone, ShoppingBag, X, Plus } from 'lucide-react';
import './index.css';

// Central Locales Definition
const locales = {
  en: {
    cards: "My Cards",
    sendMoney: "Transfer Money",
    transferToCard: "Card to Card",
    recipientCard: "Recipient Card Number",
    currencyConverter: "Currency Converter",
    lastActivity: "Last Activity",
    balance: "Balance",
    income: "Incomes are up",
    thisMonth: "this month",
    transferBtn: "Transfer",
    payments: "Payments",
    searchPlaceholder: "Search for services...",
    reliable: "Reliable. Safe. Stability.",
    mobileApp: "Mobile Bank App",
    analytics: "Expense Analytics",
    deposits: "Deposits & Savings",
    home: "Home",
    today: "Today",
    yesterday: "Yesterday",
  },
  uz: {
    cards: "Mening kartalarim",
    sendMoney: "Pul o'tkazmalari",
    transferToCard: "Kartadan kartaga",
    recipientCard: "Qabul qiluvchining karta raqami",
    currencyConverter: "Valyuta konvertori",
    lastActivity: "Oxirgi amallar",
    balance: "Balans",
    income: "Daromadlar ko'tarildi",
    thisMonth: "shu oyda",
    transferBtn: "O'tkazish",
    payments: "Xizmatlar to'lovi",
    searchPlaceholder: "Xizmatlarni qidirish...",
    reliable: "Ishonchli. Xavfsiz. Barqaror.",
    mobileApp: "Mobil Bank ilovasi",
    analytics: "Harajatlar tahlili",
    deposits: "Omonatlar & Jamg'arma",
    home: "Bosh sahifa",
    today: "Bugun",
    yesterday: "Kecha",
  }
};

function App() {
  const [language, setLanguage] = useState('uz'); // Default language Uzbek
  const [activeMenu, setActiveMenu] = useState('Home');
  const [activeCard, setActiveCard] = useState(0);

  // User Profile State
  const [userProfile, setUserProfile] = useState({
    name: 'Shirin Karimova',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop'
  });

  // Start empty — user adds their own cards
  const [cards, setCards] = useState([]);

  // Start with empty activity feed
  const [activities, setActivities] = useState([]);

  // Navigate with option for prefilling transfer input data
  const [transferPrefill, setTransferPrefill] = useState(null);

  // Add Card Modal states
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [newCardType, setNewCardType] = useState('HUMO');
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardBalance, setNewCardBalance] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('');
  const [newCardColor, setNewCardColor] = useState('teal');
  const [newCardCurrency, setNewCardCurrency] = useState('UZS');
  const [addCardError, setAddCardError] = useState('');

  const handleNavigate = (menuKey, prefillData = null) => {
    setActiveMenu(menuKey);
    if (prefillData) {
      setTransferPrefill(prefillData);
    } else {
      setTransferPrefill(null);
    }
  };

  const handleAddActivity = (newAct) => {
    setActivities(prev => [newAct, ...prev]);
  };

  // Card formatting tools
  const handleNewCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 16) val = val.slice(0, 16);

    // Automatically guess card currency based on prefix
    if (val.startsWith('4') || val.startsWith('5')) {
      setNewCardCurrency('USD');
    } else {
      setNewCardCurrency('UZS');
    }

    // Attempt to guess card scheme
    if (val.startsWith('8600')) {
      setNewCardType('UZCARD');
      setNewCardColor('indigo');
    } else if (val.startsWith('9860')) {
      setNewCardType('HUMO');
      setNewCardColor('teal');
    } else if (val.startsWith('4')) {
      setNewCardType('VISA');
      setNewCardColor('gold');
    } else if (val.startsWith('5')) {
      setNewCardType('MASTERCARD');
      setNewCardColor('black');
    }

    const matches = val.match(/\d{1,4}/g);
    setNewCardNumber(matches ? matches.join(' ') : '');
  };

  const handleNewCardExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.slice(0, 4);
    if (val.length > 2) {
      setNewCardExpiry(val.slice(0, 2) + '/' + val.slice(2));
    } else {
      setNewCardExpiry(val);
    }
  };

  const submitNewCard = (e) => {
    e.preventDefault();
    setAddCardError('');

    const rawNumber = newCardNumber.replace(/\s/g, '');
    if (rawNumber.length !== 16) {
      setAddCardError(language === 'uz' ? "Karta raqami 16-xonali bo'lishi shart!" : "Card number must be 16 digits!");
      return;
    }

    if (newCardExpiry.length !== 5) {
      setAddCardError(language === 'uz' ? "Muddati noto'g'ri (Masalan: 12/29)" : "Invalid expiry date (Example: 12/29)");
      return;
    }

    const initialBal = parseFloat(newCardBalance) || 0;
    if (initialBal < 0) {
      setAddCardError(language === 'uz' ? "Balans manfiy bo'lishi mumkin emas!" : "Balance cannot be negative!");
      return;
    }

    const finalCard = {
      type: newCardType,
      number: newCardNumber,
      balance: initialBal.toFixed(2),
      expiry: newCardExpiry,
      color: newCardColor,
      currency: newCardCurrency
    };

    setCards(prev => [finalCard, ...prev]);
    setActiveCard(0);
    setIsAddCardOpen(false);

    // Reset fields
    setNewCardNumber('');
    setNewCardBalance('');
    setNewCardExpiry('');
    setNewCardType('HUMO');
    setNewCardColor('teal');
    setNewCardCurrency('UZS');
  };

  // Render the active view based on the selected tab
  const renderActiveView = () => {
    switch (activeMenu) {
      case 'Home':
        return (
          <Dashboard
            cards={cards}
            setCards={setCards}
            activeCard={activeCard}
            setActiveCard={setActiveCard}
            activities={activities}
            onAddActivity={handleAddActivity}
            language={language}
            locales={locales}
            onNavigate={handleNavigate}
            onOpenAddCard={() => setIsAddCardOpen(true)}
          />
        );
      case 'Transfer':
        return (
          <TransferView
            cards={cards}
            activities={activities}
            onUpdateCards={setCards}
            onAddActivity={handleAddActivity}
            language={language}
            locales={locales}
            prefill={transferPrefill}
          />
        );
      case 'Payments':
        return (
          <PaymentsView
            cards={cards}
            onUpdateCards={setCards}
            onAddActivity={handleAddActivity}
            language={language}
            locales={locales}
          />
        );
      case 'Income & Exp...':
        return (
          <AnalyticsView
            language={language}
            locales={locales}
          />
        );
      case 'Deposits':
        return (
          <DepositsView
            cards={cards}
            onUpdateCards={setCards}
            onAddActivity={handleAddActivity}
            language={language}
            locales={locales}
          />
        );
      case 'Profile':
        return (
          <ProfileView
            language={language}
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            activities={activities}
          />
        );
      default:
        return (
          <div className="text-center py-20 text-gray-500">
            {language === 'uz' ? "Tez orada taqdim etiladi!" : "Coming soon!"}
          </div>
        );
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#080d1a', color: '#f0f2f8' }}>
      {/* Sidebar navigation */}
      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        language={language}
        locales={locales}
      />

      {/* Main scrollable body */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', overflow: 'hidden' }}>
        <Topbar
          language={language}
          onChangeLanguage={setLanguage}
          locales={locales}
          userProfile={userProfile}
          onOpenProfile={() => handleNavigate('Profile')}
        />

        <main style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
          {renderActiveView()}
        </main>
      </div>

      {/* Modern Interactive virtual Card Creator Modal */}
      {isAddCardOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-[999] p-4 animate-fade-in">
          <div className="bg-[#0e1628] border border-white/10 rounded-3xl max-w-4xl w-full p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 relative shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setIsAddCardOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/5 transition-all cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Left side: Virtual Card Live Rendering Preview */}
            <div className="flex flex-col items-center justify-center space-y-6 bg-slate-950/40 p-6 rounded-2xl border border-white/5">
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 self-start">
                {language === 'uz' ? "Karta Ko'rinishi (Jonli)" : "Card Preview (Live)"}
              </h4>
              <div className="scale-95 sm:scale-100 transition-transform">
                <CreditCard
                  type={newCardType}
                  number={newCardNumber || '0000 0000 0000 0000'}
                  balance={newCardBalance || '0.00'}
                  expiry={newCardExpiry || 'MM/YY'}
                  color={newCardColor}
                  active={true}
                  currency={newCardCurrency}
                />
              </div>
              <p className="text-[10px] text-gray-500 italic max-w-xs text-center leading-relaxed">
                {language === 'uz' ? "Karta raqamining dastlabki sonlariga qarab tizim turi (Humo/Uzcard) va pul valyutasi (so'm/USD) o'zgaradi." : "Network types and currencies adjust automatically according to system digits."}
              </p>
            </div>

            {/* Right side: Input Fields */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-extrabold text-white">
                  {language === 'uz' ? "Yangi Karta Qo'shish" : "Add New Card"}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {language === 'uz' ? "O'z hisobingizdagi bank kartasini kiriting" : "Link any debit/credit card to your online account"}
                </p>
              </div>

              <form onSubmit={submitNewCard} className="space-y-4 text-left">
                {/* Custom Card Number */}
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{language === 'uz' ? "Karta Raqami" : "Card Number"}</label>
                  <input
                    type="text"
                    required
                    value={newCardNumber}
                    onChange={handleNewCardNumberChange}
                    placeholder="8600 0000 0000 0000"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm font-mono text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Custom Expiry */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{language === 'uz' ? "Muddati (Oy/Yil)" : "Expiry Date"}</label>
                    <input
                      type="text"
                      required
                      value={newCardExpiry}
                      onChange={handleNewCardExpiryChange}
                      placeholder="12/29"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm font-mono text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Initial Balance */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{language === 'uz' ? "Boshlang'ich Balans" : "Initial Balance"}</label>
                    <input
                      type="number"
                      required
                      value={newCardBalance}
                      onChange={(e) => setNewCardBalance(e.target.value)}
                      placeholder="1 000 000"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Select Type and Color overrides */}
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{language === 'uz' ? "Tizim turi" : "Network"}</label>
                    <select
                      value={newCardType}
                      onChange={(e) => setNewCardType(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-3 text-xs text-white focus:outline-none"
                    >
                      <option value="HUMO">HUMO (UZS)</option>
                      <option value="UZCARD">UZCARD (UZS)</option>
                      <option value="VISA">VISA (USD)</option>
                      <option value="MASTERCARD">MASTERCARD (USD)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{language === 'uz' ? "Karta Rangi" : "Card Theme"}</label>
                    <select
                      value={newCardColor}
                      onChange={(e) => setNewCardColor(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-3 text-xs text-white focus:outline-none"
                    >
                      <option value="teal">{language === 'uz' ? "Zangori (Teal)" : "Emerald Teal"}</option>
                      <option value="indigo">{language === 'uz' ? "To'q ko'k (Indigo)" : "Deep Indigo"}</option>
                      <option value="gold">{language === 'uz' ? "Tilla rang (Gold)" : "Gold Gradient"}</option>
                      <option value="black">{language === 'uz' ? "Qora (Premium Black)" : "Slate Black"}</option>
                      <option value="purple">{language === 'uz' ? "Binafsha range" : "Luxury Purple"}</option>
                    </select>
                  </div>
                </div>

                {addCardError && (
                  <p className="text-xs text-rose-400 leading-normal">{addCardError}</p>
                )}

                <div className="flex gap-4 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsAddCardOpen(false)}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3.5 rounded-xl text-xs transition-all cursor-pointer"
                  >
                    {language === 'uz' ? "Bekor qilish" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-xs shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
                  >
                    {language === 'uz' ? "Kartani Qo'shish" : "Add Card"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Premium Aesthetic Glowing Background Ornaments */}
      <div className="fixed top-[-10%] right-[-10%] w-[45%] h-[40%] rounded-full bg-blue-600/5 blur-[140px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[35%] h-[35%] rounded-full bg-purple-600/5 blur-[120px] pointer-events-none"></div>
    </div>
  );
}

export default App;
