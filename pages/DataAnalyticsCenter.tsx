
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../App';
import { analyticsService, AnalyticsMetric, RegionalData, CycleData } from '../services/analytics';

const MetricCard: React.FC<{ metric: AnalyticsMetric }> = ({ metric }) => (
  <div className="bg-white border border-ivory-border rounded-[32px] p-6 shadow-sm hover:shadow-lg transition-all group border-b-4" 
       style={{ borderBottomColor: metric.status === 'OPTIMAL' ? '#10b981' : metric.status === 'CRITICAL' ? '#f43f5e' : '#f59e0b' }}>
    <div className="flex justify-between items-start mb-4">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{metric.name}</p>
      <span className={`material-symbols-outlined text-sm ${
        metric.status === 'OPTIMAL' ? 'text-emerald-500' : 'text-amber-500'
      }`}>
        {metric.status === 'OPTIMAL' ? 'check_circle' : 'sensors'}
      </span>
    </div>
    <div className="flex items-baseline gap-2">
      <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{metric.value}</h3>
      <span className="text-xs font-bold text-slate-400">{metric.unit}</span>
    </div>
    <div className="mt-4 flex items-center gap-2">
      <span className={`material-symbols-outlined text-sm ${metric.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
        {metric.change >= 0 ? 'trending_up' : 'trending_down'}
      </span>
      <span className={`text-[10px] font-black ${metric.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
        {Math.abs(metric.change)}% <span className="text-slate-300 ml-1">vs Cycle</span>
      </span>
    </div>
  </div>
);

const DataAnalyticsCenter = () => {
  const { t } = useLanguage();
  const [metrics, setMetrics] = useState<AnalyticsMetric[]>([]);
  const [regionalData, setRegionalData] = useState<RegionalData[]>([]);
  const [cycleHistory, setCycleHistory] = useState<CycleData[]>([]);
  const [assetSpread, setAssetSpread] = useState<{asset: string, percentage: number}[]>([]);
  const [forecast, setForecast] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await analyticsService.getSystemHealthReport();
      setMetrics(data.metrics);
      setRegionalData(data.regionalPerformance);
      setCycleHistory(data.cycleHistory);
      setAssetSpread(data.assetSpread);
      setForecast(data.forecast);
      setIsLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-slate-900 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Macro Analytics</span>
            <span className="text-slate-400 text-xs font-bold font-mono tracking-tighter">AI_CORE_09 // SYSTEM_KPI</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">Trung tâm Phân tích Toàn cầu</h1>
          <p className="text-slate-500 mt-2 font-medium italic">"Dữ liệu minh bạch, vận hành thông thái."</p>
        </div>
        <div className="bg-white border border-ivory-border p-4 rounded-3xl flex items-center gap-4 shadow-sm">
           <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái Ledger</p>
              <p className="text-sm font-black text-emerald-600">SẴN SÀNG (REAL-TIME)</p>
           </div>
           <span className="material-symbols-outlined text-emerald-500 text-2xl animate-pulse">cloud_sync</span>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          [1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-[32px]"></div>)
        ) : (
          metrics.map(m => <MetricCard key={m.id} metric={m} />)
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Section: Regional & Cycle Analysis */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Regional Performance Table */}
          <div className="bg-white border border-ivory-border rounded-[48px] p-10 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">public</span>
                Hiệu suất theo Quốc gia (ISO)
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-ivory-border">
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Khu vực</th>
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Dòng giá trị (USDT)</th>
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tăng trưởng</th>
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Tình trạng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ivory-border">
                  {regionalData.map((reg, i) => (
                    <tr key={reg.iso} className="group hover:bg-slate-50 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-mono bg-slate-100 px-2 py-1 rounded font-bold">{reg.iso}</span>
                          <span className="text-sm font-bold text-slate-800">{reg.country}</span>
                        </div>
                      </td>
                      <td className="py-4 font-black text-slate-900">${reg.value.toLocaleString()}</td>
                      <td className={`py-4 text-xs font-black ${reg.growth >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {reg.growth >= 0 ? '+' : ''}{reg.growth}%
                      </td>
                      <td className="py-4 text-right">
                        <div className={`size-2 rounded-full inline-block ${reg.growth > 0 ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cycle Comparison Chart */}
          <div className="bg-slate-900 rounded-[48px] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-10">So sánh Hiệu suất Chu kỳ</h3>
              <div className="flex items-end gap-12 h-64">
                {cycleHistory.map((cy, i) => (
                  <div key={cy.cycleId} className="flex-1 flex flex-col items-center gap-4 group">
                    <div className="w-full flex gap-1 items-end justify-center h-full">
                       {/* Value Bar */}
                       <div 
                        className="w-12 bg-primary rounded-t-xl transition-all duration-700 hover:brightness-125 relative"
                        style={{ height: `${(cy.totalValue / 2000000) * 100}%` }}
                       >
                         <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                           ${(cy.totalValue / 1000000).toFixed(1)}M
                         </div>
                       </div>
                       {/* Efficiency Bar */}
                       <div 
                        className="w-4 bg-emerald-500 rounded-t-lg transition-all duration-700 opacity-60"
                        style={{ height: `${cy.efficiency}%` }}
                       ></div>
                    </div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{cy.cycleId}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex gap-6 border-t border-white/10 pt-6">
                <div className="flex items-center gap-2">
                  <div className="size-3 bg-primary rounded"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Tổng Giá trị</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-3 bg-emerald-500 opacity-60 rounded"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Hiệu suất (%)</span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-24 -right-24 size-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
          </div>
        </div>

        {/* Right Sidebar: Asset Spread & AI Intelligence */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Asset Spread Donut (SVG) */}
          <div className="bg-white border border-ivory-border rounded-[48px] p-8 shadow-sm">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">Phân bổ Tài sản Mạng lưới</h3>
            <div className="relative size-48 mx-auto mb-8">
              <svg viewBox="0 0 100 100" className="rotate-[-90deg]">
                {/* Simplified dynamic donut segments */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e5e2d1" strokeWidth="12" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#2563eb" strokeWidth="12" strokeDasharray="172 251" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f59e0b" strokeWidth="12" strokeDasharray="94 251" strokeDashoffset="-172" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-[10px] font-black text-slate-400">LIQUIDITY</p>
                <p className="text-xl font-black text-slate-900">HEALTHY</p>
              </div>
            </div>
            <div className="space-y-3">
              {assetSpread.map(a => (
                <div key={a.asset} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`size-2 rounded-full ${
                      a.asset === 'USDT' ? 'bg-primary' : a.asset === 'GOLD' ? 'bg-amber-500' : 'bg-slate-400'
                    }`}></div>
                    <span className="font-bold text-slate-600">{a.asset}</span>
                  </div>
                  <span className="font-black text-slate-900">{a.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Intelligence Forecast */}
          <div className="bg-ivory-surface border-2 border-primary/20 rounded-[48px] p-8 shadow-sm flex flex-col h-fit">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined">auto_awesome</span>
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Dự báo AI (Agent-09)</h3>
            </div>
            
            <div className="p-6 bg-white rounded-3xl border border-ivory-border relative mb-6">
              <div className="absolute -top-2.5 left-6 bg-emerald-500 text-white text-[8px] font-black px-2 py-0.5 rounded">HIGH CONFIDENCE</div>
              <p className="text-sm text-slate-600 font-medium leading-relaxed italic">
                "{isLoading ? "Đang chạy mô hình dự báo..." : forecast}"
              </p>
            </div>

            <div className="space-y-4">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Khuyến nghị Chiến lược</p>
               <div className="space-y-2">
                 <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                   <span className="size-1.5 bg-primary rounded-full"></span>
                   Tăng cường thanh khoản Fiat khu vực VN
                 </div>
                 <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                   <span className="size-1.5 bg-primary rounded-full"></span>
                   Tối ưu hóa thời gian xác thực khối Gold
                 </div>
               </div>
            </div>

            <button className="mt-8 w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
              Xuất Báo cáo Chiến lược
              <span className="material-symbols-outlined text-sm">download</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DataAnalyticsCenter;
