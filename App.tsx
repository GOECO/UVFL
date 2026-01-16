
import React, { createContext, useContext, useState } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Explorer from './pages/Explorer';
import CreateValue from './pages/CreateValue';
import Dashboard from './pages/Dashboard';
import CountryProfile from './admin/pages/CountryProfile';
import { translations } from './i18n';

const LanguageContext = createContext(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};

const NavItem = ({ to, icon, label, active }) => (
  <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${active ? 'bg-primary/10 text-primary border-r-4 border-primary shadow-sm font-bold' : 'text-slate-600 hover:bg-white'}`}>
    <span className="material-symbols-outlined">{icon}</span>
    <span className="text-sm tracking-wide">{label}</span>
  </Link>
);

const AppContent = () => {
  const { locale, setLocale, t } = useLanguage();
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-ivory-border p-4 flex flex-col gap-6 hidden lg:flex bg-ivory-surface/50">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="bg-primary p-1.5 rounded-lg shadow-md">
            <span className="material-symbols-outlined text-white">account_tree</span>
          </div>
          <div className="flex flex-col">
            <h3 className="text-slate-900 text-sm font-bold leading-none">UVFL Global</h3>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.15em] mt-1">Mainnet v4.2</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          <NavItem to="/dashboard" icon="dashboard" label={t.nav.dashboard} active={location.pathname === '/dashboard'} />
          <NavItem to="/explorer" icon="pentagon" label={t.nav.explorer} active={location.pathname === '/explorer' || location.pathname === '/'} />
          <NavItem to="/create" icon="add_circle" label={t.nav.create} active={location.pathname === '/create'} />
          <NavItem to="/admin/country" icon="settings_suggest" label={t.nav.country} active={location.pathname === '/admin/country'} />
          <NavItem to="#" icon="verified_user" label="Xác thực" active={false} />
          <NavItem to="#" icon="gavel" label="Quản trị" active={false} />
        </nav>

        <div className="mt-auto p-4 bg-white rounded-xl border border-ivory-border shadow-sm">
          <p className="text-xs text-slate-500 mb-2">Trạng thái hệ thống</p>
          <div className="flex items-center gap-2">
            <span className="size-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            <span className="text-sm font-bold text-slate-800 uppercase tracking-tighter">Đang hoạt động</span>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-ivory-border bg-ivory-bg/95 backdrop-blur-lg px-6 py-3">
          <div className="flex items-center gap-4">
             <div className="relative group hidden sm:block">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <span className="material-symbols-outlined text-lg">search</span>
                </span>
                <input className="w-64 bg-white border border-ivory-border rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary text-slate-900 placeholder-slate-400 outline-none" placeholder="Tìm kiếm quy tắc..."/>
              </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative flex items-center bg-white border border-ivory-border rounded-lg px-2 py-1 gap-1">
              <span className="material-symbols-outlined text-lg text-slate-500">language</span>
              <select 
                value={locale}
                onChange={(e) => setLocale(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-700 border-none focus:ring-0 cursor-pointer pr-6 appearance-none outline-none"
              >
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
              </select>
            </div>
            <button className="p-2 bg-white border border-ivory-border rounded-lg text-slate-600 hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-xl">light_mode</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto geometric-bg pb-12">
          <Routes>
            <Route path="/" element={<Explorer />} />
            <Route path="/explorer" element={<Explorer />} />
            <Route path="/create" element={<CreateValue />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin/country" element={<CountryProfile />} />
          </Routes>
          
          <footer className="mt-12 border-t border-ivory-border px-8 py-6 flex flex-wrap gap-8 items-center justify-center lg:justify-start bg-ivory-surface/30">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">TPS Toàn Cầu:</span>
              <span className="text-sm font-bold text-slate-900">12,482</span>
            </div>
            <div className="w-px h-4 bg-ivory-border hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nút Xác Minh:</span>
              <span className="text-sm font-bold text-slate-900">8,103</span>
            </div>
            <div className="w-px h-4 bg-ivory-border hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tổng Giá Trị Khóa:</span>
              <span className="text-sm font-bold text-primary tracking-tighter">$4.2B</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  const [locale, setLocale] = useState('vi');
  const t = translations[locale];

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </LanguageContext.Provider>
  );
};

export default App;
