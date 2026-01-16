
import React, { createContext, useContext, useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Explorer from './pages/Explorer';
import CreateValue from './pages/CreateValue';
import Dashboard from './pages/Dashboard';
import NetworkExplorer from './pages/NetworkExplorer';
import PublicLedger from './pages/PublicLedger';
import Rulebook from './pages/Rulebook';
import Analytics from './pages/Analytics';
import DataAnalyticsCenter from './pages/DataAnalyticsCenter';
import ProfileManagementCenter from './pages/ProfileManagementCenter';
import SandboxIdentityCenter from './pages/SandboxIdentityCenter';
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
import PaymentGatewayManager from './admin/pages/PaymentGatewayManager';
import WalletNAVManager from './admin/pages/WalletNAVManager';
import DisputeResolutionCenter from './admin/pages/DisputeResolutionCenter';
import APIKeyManager from './admin/pages/APIKeyManager';
import AIGatewayManager from './admin/pages/AIGatewayManager';
import DeveloperPlatform from './admin/pages/DeveloperPlatform';
import RoleManagementCenter from './admin/pages/RoleManagementCenter';
import ValidationCenter from './admin/pages/ValidationCenter';
import AICommandCenter from './admin/pages/AICommandCenter';
import AuditRiskDashboard from './admin/pages/AuditRiskDashboard';
import { translations } from './i18n';

const AccessibilityContext = createContext<any>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error("useAccessibility must be used within AccessibilityProvider");
  return context;
};

// Fix: Exported useLanguage as an alias for useAccessibility to resolve multi-file import errors
export const useLanguage = useAccessibility;

const NavItem = ({ to, icon, label, active }: { to: string, icon: string, label: string, active: boolean }) => (
  <Link to={to} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${active ? 'bg-primary text-white shadow-lg shadow-primary/20 font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'}`}>
    <span className={`material-symbols-outlined text-[20px] ${active ? 'text-white' : 'text-slate-400 group-hover:text-primary'}`}>{icon}</span>
    <span className="text-xs tracking-tight">{label}</span>
  </Link>
);

const NavSection = ({ title, children }: { title: string, children?: React.ReactNode }) => (
  <div className="mt-6 mb-2">
    <p className="px-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3">{title}</p>
    <div className="flex flex-col gap-1">
      {children}
    </div>
  </div>
);

const AppContent = () => {
  const { locale, setLocale, t, isDark, setIsDark, fontSize, setFontSize, textColor, setTextColor } = useAccessibility();
  const location = useLocation();

  return (
    <div 
      className={`flex h-screen overflow-hidden ${isDark ? 'dark bg-slate-950 text-slate-100' : 'bg-ivory-bg text-slate-900'}`}
      style={{ fontSize: `${fontSize}px`, color: textColor !== 'default' ? textColor : undefined }}
    >
      {/* Sidebar */}
      <aside className="w-72 border-r border-ivory-border dark:border-slate-800 flex flex-col hidden lg:flex bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
        <div className="p-6 border-b border-ivory-border dark:border-slate-800 flex items-center gap-3">
          <div className="bg-primary p-2 rounded-xl shadow-lg">
            <span className="material-symbols-outlined text-white text-xl">account_tree</span>
          </div>
          <div className="flex flex-col">
            <h3 className="text-slate-900 dark:text-white text-sm font-black tracking-tight leading-none">UVFL GLOBAL</h3>
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mt-1">Sovereign OS v4.4</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-4 scrollbar-hide">
          <NavSection title="Dịch vụ Cốt lõi">
            <NavItem to="/dashboard" icon="dashboard" label="Bảng điều khiển" active={location.pathname === '/dashboard'} />
            <NavItem to="/profile" icon="person" label="Hồ sơ danh tính" active={location.pathname === '/profile'} />
            <NavItem to="/create" icon="add_box" label="Tạo giá trị mới" active={location.pathname === '/create'} />
            <NavItem to="/sandbox" icon="factory" label="Identity Sandbox" active={location.pathname === '/sandbox'} />
          </NavSection>

          <NavSection title="Dữ liệu & Mạng lưới">
            <NavItem to="/explorer" icon="vital_signs" label="Nhịp đập Chiến lược" active={location.pathname === '/explorer' || location.pathname === '/'} />
            <NavItem to="/public-ledger" icon="list_alt" label="Sổ cái Công khai" active={location.pathname === '/public-ledger'} />
            <NavItem to="/network" icon="hub" label="Mạng lưới Nút" active={location.pathname === '/network'} />
            <NavItem to="/admin/analytics" icon="analytics" label="Báo cáo Toàn cầu" active={location.pathname === '/admin/analytics'} />
            <NavItem to="/community" icon="diversity_3" label="Trung tâm Cộng đồng" active={location.pathname === '/community'} />
          </NavSection>

          <NavSection title="Quản trị Giao thức">
            <NavItem to="/admin/roles" icon="shield_person" label="Vai trò & Phân quyền" active={location.pathname === '/admin/roles'} />
            <NavItem to="/admin/ruleset" icon="rule" label="Quản lý RuleSet" active={location.pathname === '/admin/ruleset'} />
            <NavItem to="/admin/fund" icon="account_balance" label="Quản trị Quỹ Fund" active={location.pathname === '/admin/fund'} />
            <NavItem to="/admin/governance" icon="gavel" label="Hội đồng Quản trị" active={location.pathname === '/admin/governance'} />
            <NavItem to="/admin/country" icon="public" label="Hồ sơ Quốc gia" active={location.pathname === '/admin/country'} />
            <NavItem to="/admin/standards" icon="menu_book" label="Tiêu chuẩn UVFL" active={location.pathname === '/admin/standards'} />
          </NavSection>

          <NavSection title="Bảo mật & Kiểm soát">
            <NavItem to="/admin/security" icon="admin_panel_settings" label="Trung tâm Bảo mật" active={location.pathname === '/admin/security'} />
            <NavItem to="/admin/audit-risk" icon="policy" label="Kiểm toán & Rủi ro" active={location.pathname === '/admin/audit-risk'} />
            <NavItem to="/admin/disputes" icon="balance" label="Phân xử Tranh chấp" active={location.pathname === '/admin/disputes'} />
            <NavItem to="/admin/emergency" icon="emergency" label="Đóng băng Khẩn cấp" active={location.pathname === '/admin/emergency'} />
          </NavSection>

          <NavSection title="Hạ tầng & AI">
            <NavItem to="/admin/ai-center" icon="psychology" label="Điều hành AI" active={location.pathname === '/admin/ai-center'} />
            <NavItem to="/admin/ai-gateway" icon="router" label="AI Gateway Manager" active={location.pathname === '/admin/ai-gateway'} />
            <NavItem to="/admin/api-keys" icon="key" label="API Key Vault" active={location.pathname === '/admin/api-keys'} />
            <NavItem to="/admin/developer" icon="code" label="Nền tảng Developer" active={location.pathname === '/admin/developer'} />
            <NavItem to="/admin/asset-engine" icon="currency_exchange" label="Asset Engine" active={location.pathname === '/admin/asset-engine'} />
          </NavSection>
        </nav>

        <div className="p-4 border-t border-ivory-border dark:border-slate-800 bg-ivory-surface/30 dark:bg-slate-900/30">
          <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-ivory-border dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mainnet Pulse</span>
              <span className="size-2 bg-emerald-500 rounded-full animate-pulse"></span>
            </div>
            <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Đã đạt đồng thuận</p>
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
                <input className="w-64 bg-white dark:bg-slate-900 border border-ivory-border dark:border-slate-800 rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary text-slate-900 dark:text-white placeholder-slate-400 outline-none" placeholder="Tìm kiếm giao dịch, băm, nút..."/>
              </div>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Accessibility Controls */}
            <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 dark:bg-slate-900 border border-ivory-border dark:border-slate-800 rounded-2xl">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Trợ năng:</span>
              
              {/* Zoom Controls */}
              <div className="flex items-center gap-1 border-r border-ivory-border dark:border-slate-800 pr-4 mr-2">
                <button onClick={() => setFontSize(Math.max(12, fontSize - 1))} className="p-1 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-sm">text_decrease</span>
                </button>
                <span className="text-[10px] font-black min-w-[3ch] text-center">{fontSize}</span>
                <button onClick={() => setFontSize(Math.min(24, fontSize + 1))} className="p-1 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-sm">text_increase</span>
                </button>
              </div>

              {/* Color Themes */}
              <div className="flex items-center gap-2">
                {[
                  { name: 'default', color: '#334155' },
                  { name: 'indigo', color: '#4f46e5' },
                  { name: 'emerald', color: '#059669' },
                  { name: 'sepia', color: '#78350f' }
                ].map(theme => (
                  <button 
                    key={theme.name}
                    onClick={() => setTextColor(theme.color)}
                    className={`size-4 rounded-full border-2 transition-all ${textColor === theme.color ? 'border-primary scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: theme.color }}
                    title={`Chế độ ${theme.name}`}
                  />
                ))}
              </div>
            </div>

            <div className="h-6 w-px bg-ivory-border dark:bg-slate-800" />

            <Link to="/profile" className="flex items-center gap-2 p-1 pr-3 bg-white dark:bg-slate-900 border border-ivory-border dark:border-slate-800 rounded-full hover:shadow-md transition-all">
               <div className="size-8 rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-xs">N</div>
               <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Nguyễn Văn A</span>
            </Link>
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
            <Route path="/profile" element={<ProfileManagementCenter />} />
            <Route path="/sandbox" element={<SandboxIdentityCenter />} />
            <Route path="/network" element={<NetworkExplorer />} />
            <Route path="/public-ledger" element={<PublicLedger />} />
            <Route path="/community" element={<CommunityHub />} />
            <Route path="/admin/analytics" element={<DataAnalyticsCenter />} />
            <Route path="/admin/roles" element={<RoleManagementCenter />} />
            <Route path="/admin/ruleset" element={<RuleSetManager />} />
            <Route path="/admin/fund" element={<FundGovernanceConsole />} />
            <Route path="/admin/governance" element={<GovernanceHub />} />
            <Route path="/admin/country" element={<CountryProfile />} />
            <Route path="/admin/standards" element={<StandardEditor />} />
            <Route path="/admin/security" element={<SecurityControlRoom />} />
            <Route path="/admin/audit-risk" element={<AuditRiskDashboard />} />
            <Route path="/admin/disputes" element={<DisputeResolutionCenter />} />
            <Route path="/admin/emergency" icon="emergency" label="Đóng băng Khẩn cấp" active={location.pathname === '/admin/emergency'} />
            <Route path="/admin/ai-center" element={<AICommandCenter />} />
            <Route path="/admin/ai-gateway" element={<AIGatewayManager />} />
            <Route path="/admin/api-keys" element={<APIKeyManager />} />
            <Route path="/admin/developer" element={<DeveloperPlatform />} />
            <Route path="/admin/asset-engine" element={<AssetConversionEngine />} />
          </Routes>
          
          <footer className="mt-12 border-t border-ivory-border dark:border-slate-800 px-8 py-6 flex flex-wrap gap-8 items-center justify-center lg:justify-start bg-ivory-surface/30 dark:bg-slate-900/30">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Định danh UVFL Core:</span>
              <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">NÚT_XÁC_THỰC_BẢO_MẬT</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Khu vực:</span>
              <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">CỤM_VIỆT_NAM</span>
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
  const [fontSize, setFontSize] = useState(14);
  const [textColor, setTextColor] = useState('default');
  const t = translations[locale];

  return (
    <AccessibilityContext.Provider value={{ 
      locale, setLocale, t, isDark, setIsDark, 
      fontSize, setFontSize, textColor, setTextColor 
    }}>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AccessibilityContext.Provider>
  );
};

export default App;
