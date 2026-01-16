
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../App';
import { auditService, FraudSignal, RiskIndicator } from '../../services/audit';

const StatCard = ({ label, value, indicator, trend }) => (
  <div className="bg-white border border-ivory-border rounded-[32px] p-6 shadow-sm hover:shadow-md transition-all">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p>
    <div className="flex items-end justify-between">
      <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h3>
      <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black ${
        indicator === 'safe' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
      }`}>
        <span className="material-symbols-outlined text-xs">
          {trend === 'up' ? 'trending_up' : 'trending_down'}
        </span>
        {indicator.toUpperCase()}
      </div>
    </div>
  </div>
);

const AuditRiskDashboard = () => {
  const { t } = useLanguage();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [signals, setSignals] = useState<FraudSignal[]>([]);
  const [score, setScore] = useState(98.4);
  const [report, setReport] = useState('System integrity verified on block 1,482,000.');

  const mockLedgerBatch = [
    { id: 'TX-1', from: 'UserA', to: 'UserB', amount: 5000, asset: 'USDT', hash: 'abc...' },
    { id: 'TX-2', from: 'UserB', to: 'UserA', amount: 4950, asset: 'USDT', hash: 'def...' },
    { id: 'TX-3', from: 'UserC', to: 'UserD', amount: 100000, asset: 'GOLD', hash: 'ghi...' }
  ];

  const runFullAudit = async () => {
    setIsAnalyzing(true);
    const result = await auditService.analyzeLedger(mockLedgerBatch);
    setSignals(result.signals);
    setScore(result.integrityScore);
    setReport(result.report);
    setIsAnalyzing(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Security Core</span>
            <span className="text-slate-400 text-xs font-bold font-mono">PROTOCOL: HASH_SENTRY_08</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">Kiểm toán & Rủi ro</h1>
          <p className="text-slate-500 mt-2 font-medium">Giám sát tính toán học của sổ cái và phát hiện gian lận tự động.</p>
        </div>
        <button 
          onClick={runFullAudit}
          disabled={isAnalyzing}
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
        >
          {isAnalyzing ? 'Đang phân tích...' : 'Chạy kiểm toán AI'}
          <span className={`material-symbols-outlined ${isAnalyzing ? 'animate-spin' : ''}`}>
            {isAnalyzing ? 'sync' : 'security'}
          </span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Điểm tin cậy Ledger" value={`${score}%`} indicator={score > 90 ? 'safe' : 'risk'} trend="up" />
        <StatCard label="Tỷ lệ bất thường" value="0.24%" indicator="safe" trend="down" />
        <StatCard label="Nút tham gia kiểm toán" value="2,104" indicator="safe" trend="up" />
        <StatCard label="Cảnh báo cấp độ 1" value={signals.length.toString()} indicator={signals.length > 0 ? 'risk' : 'safe'} trend="stable" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Fraud Signal Terminal */}
        <div className="lg:col-span-8 bg-slate-900 rounded-[48px] p-8 text-white shadow-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-rose-400">
              <span className="material-symbols-outlined text-rose-400">gavel</span>
              Tín hiệu rủi ro từ Agent AI-08
            </h3>
            <span className="text-[10px] font-mono text-white/30">BATCH_ID: UVFL_SEC_2024_01</span>
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto scrollbar-hide pr-2">
            {signals.length === 0 ? (
              <div className="py-20 text-center opacity-30">
                <span className="material-symbols-outlined text-6xl mb-4">shield_check</span>
                <p className="text-sm font-bold uppercase tracking-widest">Không phát hiện rủi ro tức thì</p>
                <p className="text-xs font-medium mt-2">Mọi chuỗi băm đều khớp với dữ liệu gốc.</p>
              </div>
            ) : (
              signals.map((s, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all border-l-4 border-l-rose-500">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-black text-rose-400 uppercase tracking-tight">{s.type}</p>
                    <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-1 rounded-lg font-black">
                      Xác suất: {(s.probability * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-xs text-white/70 font-medium leading-relaxed mb-4">{s.description}</p>
                  <div className="flex items-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-widest">
                    <span className="material-symbols-outlined text-sm">lightbulb</span>
                    Đề xuất: {s.suggestedAction}
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-rose-500/10 rounded-full blur-[100px] pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
        </div>

        {/* Audit Report Template / Integrity Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-ivory-border rounded-[48px] p-8 shadow-sm">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Báo cáo tóm lược AI</h4>
            <div className="p-6 bg-ivory-surface/50 rounded-3xl border border-ivory-border italic text-sm text-slate-600 font-medium leading-relaxed">
              "{report}"
            </div>
            
            <div className="mt-8 space-y-4">
               <div className="flex justify-between items-center text-xs">
                 <span className="text-slate-400 font-bold uppercase tracking-widest">Trạng thái Hash Chain</span>
                 <span className="text-emerald-500 font-black">CONSISTENT</span>
               </div>
               <div className="flex justify-between items-center text-xs">
                 <span className="text-slate-400 font-bold uppercase tracking-widest">Kiểm tra Zero-Knowledge</span>
                 <span className="text-emerald-500 font-black">PASSED</span>
               </div>
               <div className="flex justify-between items-center text-xs">
                 <span className="text-slate-400 font-bold uppercase tracking-widest">Độ trễ kiểm toán</span>
                 <span className="text-slate-900 font-black">0.85s</span>
               </div>
            </div>
          </div>

          <div className="bg-emerald-600 text-white rounded-[48px] p-8 shadow-xl shadow-emerald-600/20 group relative overflow-hidden">
            <div className="relative z-10">
              <span className="material-symbols-outlined text-4xl mb-4">verified_user</span>
              <h4 className="text-lg font-black tracking-tight mb-2">Hệ thống an toàn</h4>
              <p className="text-xs text-white/70 font-medium leading-relaxed">
                Tất cả các tiên đề UVFL đang được thực thi một cách chính xác. AI-08 không phát hiện dấu hiệu xâm nhập hoặc gian lận có chủ đích.
              </p>
            </div>
            <div className="absolute -bottom-10 -right-10 size-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditRiskDashboard;
