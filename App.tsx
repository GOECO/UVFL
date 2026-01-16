
import React, { createContext, useContext, useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Explorer from './pages/Explorer';
import CreateValue from './pages/CreateValue';
import Dashboard from './pages/Dashboard';
import NetworkExplorer from './pages/NetworkExplorer';
import MobilePreview from './pages/MobilePreview';
import PublicLedger from './pages/PublicLedger';
import Rulebook from './pages/Rulebook';
import Analytics from './pages/Analytics';
import DataAnalyticsCenter from './pages/DataAnalyticsCenter';
import CommunityHub from './pages/CommunityHub';
import GovernanceHub from './pages/GovernanceHub';
import SecurityControlRoom from './pages/SecurityControlRoom';
import RoleFinancialCenter from './pages/RoleFinancialCenter';
import DataSovereigntyCenter from './pages/DataSovereigntyCenter';
import GrowthAdoptionCenter from './pages/GrowthAdoptionCenter';
import InteroperabilityCenter from './pages/InteroperabilityCenter';
import EvolutionCenter from './pages/EvolutionCenter';
import StandardEditor from './pages/StandardEditor';
import RuleSetManager from './pages/RuleSetManager';
import RoleSimulationCenter from './admin/pages/RoleSimulationCenter';
import CountryProfile from './admin/pages/CountryProfile';
import ComplianceDiffViewer from './admin/pages/ComplianceDiffViewer';
import FundGovernanceConsole from './pages/FundGovernanceConsole';
import DataRightsExportCenter from './admin/pages/DataRightsExportCenter';
import AIOversightPanel from './admin/pages/AIOversightPanel';
import EmergencyFreeze from './admin/pages/EmergencyFreeze';
import AssetConversionEngine from './admin/pages/AssetConversionEngine';
import PaymentGatewayManager from './admin/pages/PaymentGatewayManager'; // New Import
import ValidationCenter from './admin/pages/ValidationCenter';
import AICommandCenter from './admin/pages/AICommandCenter';
import AuditRiskDashboard from './admin/pages/AuditRiskDashboard';
import { translations } from './i18n';

const LanguageContext = createContext(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};

const NavItem = ({ to, icon, label, active }) => (
  <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${active ? 'bg-primary/10 text-primary border-r-4 border-primary shadow-sm font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'}`}>
    <span className="material-symbols-outlined">{icon}</span>
    <span className="text-sm tracking-wide">{label}</span>
  </Link>
);

const AppContent = () => {
  const { locale, setLocale, t, isDark, setIsDark } = useLanguage();
  const location = useLocation();

  return (
    <div className={`flex h-screen overflow-hidden ${isDark ? 'dark bg-slate-950 text-slate-100' : 'bg-ivory-bg text-slate-900'}`}>
      {/* Sidebar */}
      <aside className="w-64 border-r border-ivory-border dark:border-slate-800 p-4 flex flex-col gap-6 hidden lg:flex bg-ivory-surface/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="bg-primary p-1.5 rounded-lg shadow-md">
            <span className="material-symbols-outlined text-white">account_tree</span>
          </div>
          <div className="flex flex-col">
            <h3 className="text-slate-900 dark:text-white text-sm font-bold leading-none">UVFL Global</h3>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.15em] mt-1">Mainnet v4.4</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 overflow-y-auto scrollbar-hide">
          <NavItem to="/dashboard" icon="dashboard" label={t.nav.dashboard} active={location.pathname === '/dashboard'} />
          <NavItem to="/explorer" icon="pentagon" label={t.nav.explorer} active={location.pathname === '/explorer' || location.pathname === '/'} />
          <NavItem to="/create" icon="add_circle" label={t.nav.create} active={location.pathname === '/create'} />
          <NavItem to="/public-ledger" icon="list_alt" label={t.nav.publicLedger} active={location.pathname === '/public-ledger'} />
          <NavItem to="/network" icon="lan" label={t.nav.network} active={location.pathname === '/network'} />
          <NavItem to="/analytics" icon="monitoring" label={t.nav.analytics} active={location.pathname === '/analytics'} />
          
          <div className="my-4 h-px bg-ivory-border dark:bg-slate-800 mx-2"></div>
          <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Quản trị Hệ thống</p>
          <NavItem to="/admin/ruleset" icon="rule" label="Quản lý RuleSet" active={location.pathname === '/admin/ruleset'} />
          <NavItem to="/admin/fund" icon="account_balance" label="Quản trị Quỹ Fund" active={location.pathname === '/admin/fund'} />
          <NavItem to="/admin/payment-gateway" icon="payments" label="Cổng nạp/rút Ramp" active={location.pathname === '/admin/payment-gateway'} />
          <NavItem to="/admin/asset-exchange" icon="currency_exchange" label="Quy đổi & Tỷ giá" active={location.pathname === '/admin/asset-exchange'} />
          <NavItem to="/admin/ai-oversight" icon="visibility" label="AI Oversight" active={location.pathname === '/admin/ai-oversight'} />
          <NavItem to="/admin/freeze" icon="emergency" label="Emergency Freeze" active={location.pathname === '/admin/freeze'} />
          <NavItem to="/admin/data-rights" icon="key_visualizer" label="Quyền & Export Dữ liệu" active={location.pathname === '/admin/data-rights'} />
          <NavItem to="/admin/simulation" icon="monitoring" label="Mô phỏng & Dự báo" active={location.pathname === '/admin/simulation'} />
          <NavItem to="/admin/country" icon="settings_suggest" label={t.nav.country} active={location.pathname === '/admin/country'} />
          <NavItem to="/admin/compliance-diff" icon="difference" label="Compliance Diff" active={location.pathname === '/admin/compliance-diff'} />
          <NavItem to="/admin/validation" icon="verified_user" label={t.nav.validation} active={location.pathname === '/admin/validation'} />
          <NavItem to="/admin/audit-risk" icon="policy" label={t.nav.auditRisk} active={location.pathname === '/admin/audit-risk'} />
          <NavItem to="/admin/ai-center" icon="psychology" label={t.nav.aiCenter} active={location.pathname === '/admin/ai-center'} />
        </nav>

        <div className="mt-auto p-4 bg-white dark:bg-slate-800 rounded-xl border border-ivory-border dark:border-slate-700 shadow-sm">
          <p className="text-xs text-slate-500 mb-2">Trạng thái hệ thống</p>
          <div className="flex items-center gap-2">
            <span className="size-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            <span className="text-sm font-bold text-slate-800 dark:text-emerald-400 uppercase tracking-tighter">Đang hoạt động</span>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-ivory-border dark:border-slate-800 bg-ivory-bg/95 dark:bg-slate-950/95 backdrop-blur-lg px-6 py-3">
          <div className="flex items-center gap-4">
             <div className="relative group hidden sm:block">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <span className="material-symbols-outlined text-lg">search</span>
                </span>
                <input className="w-64 bg-white dark:bg-slate-900 border border-ivory-border dark:border-slate-800 rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary text-slate-900 dark:text-white placeholder-slate-400 outline-none" placeholder="Tìm kiếm quy tắc..."/>
              </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative flex items-center bg-white dark:bg-slate-900 border border-ivory-border dark:border-slate-800 rounded-lg px-2 py-1 gap-1">
              <span className="material-symbols-outlined text-lg text-slate-500">language</span>
              <select 
                value={locale}
                onChange={(e) => setLocale(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-700 dark:text-slate-300 border-none focus:ring-0 cursor-pointer pr-6 appearance-none outline-none"
              >
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
              </select>
            </div>
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-2 bg-white dark:bg-slate-900 border border-ivory-border dark:border-slate-800 rounded-lg text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-xl">{isDark ? 'light_mode' : 'dark_mode'}</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto geometric-bg pb-12 dark:bg-slate-950">
          <Routes>
            <Route path="/" element={<Explorer />} />
            <Route path="/explorer" element={<Explorer />} />
            <Route path="/create" element={<CreateValue />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/network" element={<NetworkExplorer />} />
            <Route path="/public-ledger" element={<PublicLedger />} />
            <Route path="/rulebook" element={<Rulebook />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/admin/ruleset" element={<RuleSetManager />} />
            <Route path="/admin/fund" element={<FundGovernanceConsole />} />
            <Route path="/admin/payment-gateway" element={<PaymentGatewayManager />} />
            <Route path="/admin/asset-exchange" element={<AssetConversionEngine />} />
            <Route path="/admin/ai-oversight" element={<AIOversightPanel />} />
            <Route path="/admin/freeze" element={<EmergencyFreeze />} />
            <Route path="/admin/data-rights" element={<DataRightsExportCenter />} />
            <Route path="/admin/simulation" element={<RoleSimulationCenter />} />
            <Route path="/admin/country" element={<CountryProfile />} />
            <Route path="/admin/compliance-diff" element={<ComplianceDiffViewer />} />
            <Route path="/admin/validation" element={<ValidationCenter />} />
            <Route path="/admin/ai-center" element={<AICommandCenter />} />
            <Route path="/admin/audit-risk" element={<AuditRiskDashboard />} />
          </Routes>
          
          <footer className="mt-12 border-t border-ivory-border dark:border-slate-800 px-8 py-6 flex flex-wrap gap-8 items-center justify-center lg:justify-start bg-ivory-surface/30 dark:bg-slate-900/30">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">TPS Toàn Cầu:</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">12,482</span>
            </div>
            <div className="w-px h-4 bg-ivory-border dark:bg-slate-800 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nút Xác Minh:</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">8,103</span>
            </div>
            <div className="w-px h-4 bg-ivory-border dark:bg-slate-800 hidden sm:block"></div>
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
  const [isDark, setIsDark] = useState(false);
  const t = translations[locale];

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, isDark, setIsDark }}>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </LanguageContext.Provider>
  );
};

export default App;
