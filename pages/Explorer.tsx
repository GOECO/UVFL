
import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../App';
import { GoogleGenAI } from "@google/genai";

interface AxiomHealth {
  id: string;
  name: string;
  score: number;
  status: 'STABLE' | 'OPTIMIZING' | 'ATTENTION';
  metric: string;
  icon: string;
}

const Explorer = () => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [strategicDirective, setStrategicDirective] = useState('');
  const [pulsePhase, setPulsePhase] = useState(0);

  const axiomHealths: AxiomHealth[] = [
    { id: 'AX-01', name: 'Tạo Giá Trị', score: 98, status: 'STABLE', metric: '2.1M V/hr', icon: 'bolt' },
    { id: 'AX-02', name: 'Xác Thực', score: 92, status: 'OPTIMIZING', metric: '1.2m Latency', icon: 'verified_user' },
    { id: 'AX-03', name: 'Minh Bạch', score: 100, status: 'STABLE', metric: 'Zero Overrides', icon: 'visibility' },
    { id: 'AX-04', name: 'Niềm Tin', score: 88, status: 'ATTENTION', metric: '3 Node Discrepancies', icon: 'hub' },
    { id: 'AX-05', name: 'Thịnh Vượng', score: 95, status: 'STABLE', metric: '+12% Growth', icon: 'payments' },
  ];

  useEffect(() => {
    const fetchDirective = async () => {
      try {
        // Fix: Removed non-null assertion from API key and simplified contents format as per GenAI guidelines
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Bạn là UVFL Master Sentry. Hãy phân tích trạng thái giả lập của 5 Tiên đề UVFL: 
        1. Tạo giá trị: 98%
        2. Xác thực: 92% (đang tối ưu)
        3. Minh bạch: 100%
        4. Niềm tin: 88% (cần chú ý do sai lệch nút)
        5. Thịnh vượng: 95%
        Hãy đưa ra một "Mệnh lệnh chiến lược" (Strategic Directive) ngắn gọn, chuyên nghiệp (tối đa 30 từ) để cộng đồng tối ưu hóa mạng lưới trong chu kỳ này.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
        });

        setStrategicDirective(response.text || "Duy trì sự đồng thuận toàn cầu. Ưu tiên xử lý sai lệch tại các nút nhánh.");
      } catch (e) {
        setStrategicDirective("Tăng cường giao thức xác thực chéo để củng cố Tiên đề Niềm Tin.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDirective();
    const interval = setInterval(() => setPulsePhase(p => (p + 1) % 100), 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Protocol Pulse</span>
            <span className="text-slate-400 text-xs font-bold font-mono tracking-tighter uppercase tracking-tighter uppercase">STRATEGIC_OS_v4.4 // REAL_TIME_AXIOMS</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-2 uppercase uppercase">Strategic Pulse Center</h1>
          <p className="text-slate-500 font-medium italic">Giám sát sự thực thi các Tiên đề UVFL trong dòng chảy giá trị thực.</p>
        </div>
      </div>

      {/* Main Pulse Visualizer */}
      <div className="bg-slate-950 rounded-[48px] p-12 shadow-2xl relative overflow-hidden h-[400px] flex flex-col justify-between border border-white/5">
         <div className="relative z-10">
            <div className="flex justify-between items-start">
               <h3 className="text-sm font-black uppercase tracking-[0.3em] text-primary">Global Consensus Frequency</h3>
               <div className="text-right">
                  <p className="text-[10px] font-black text-white/30 uppercase">Network State</p>
                  <p className="text-xl font-black text-emerald-400 uppercase">Resonant</p>
               </div>
            </div>
         </div>

         {/* Waveform Animation */}
         <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
            <svg viewBox="0 0 1000 200" className="w-full h-64">
               <path 
                d={`M 0 100 ${Array.from({length: 20}).map((_, i) => {
                  const x = (i + 1) * 50;
                  const y = 100 + Math.sin((i + pulsePhase/10)) * 40;
                  return `L ${x} ${y}`;
                }).join(' ')} L 1000 100`} 
                fill="none" 
                stroke="#2563eb" 
                strokeWidth="4" 
                className="animate-pulse"
               />
            </svg>
         </div>

         <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-12">
            <div>
               <p className="text-[10px] font-black text-white/40 uppercase mb-2">Atomic Velocity</p>
               <p className="text-3xl font-black text-white">1,482 <span className="text-xs text-primary">tx/s</span></p>
            </div>
            <div>
               <p className="text-[10px] font-black text-white/40 uppercase mb-2">Validation Gap</p>
               <p className="text-3xl font-black text-white">0.02<span className="text-xs text-primary">ms</span></p>
            </div>
            <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-[32px] p-6 backdrop-blur-md">
               <p className="text-[10px] font-black text-primary uppercase mb-3">AI Strategic Directive (Agent-00)</p>
               <p className="text-sm font-bold text-white/80 italic leading-relaxed">
                  "{isLoading ? 'Đang trích xuất mệnh lệnh...' : strategicDirective}"
               </p>
            </div>
         </div>
      </div>

      {/* Axiom Health Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
         {axiomHealths.map((ax) => (
           <div key={ax.id} className="bg-white border border-ivory-border rounded-[40px] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="flex justify-between items-start mb-6">
                 <div className="size-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                    <span className="material-symbols-outlined text-2xl">{ax.icon}</span>
                 </div>
                 <span className={`text-[8px] font-black px-2 py-1 rounded-lg border ${
                    ax.status === 'STABLE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    ax.status === 'OPTIMIZING' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                    'bg-rose-50 text-rose-600 border-rose-100 animate-pulse'
                 }`}>
                    {ax.status}
                 </span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{ax.id}</p>
              <h4 className="text-lg font-black text-slate-900 mb-4 uppercase">{ax.name}</h4>
              
              <div className="space-y-4">
                 <div className="flex justify-between items-end">
                    <span className="text-2xl font-black text-slate-900">{ax.score}%</span>
                    <span className="text-[10px] font-mono font-bold text-slate-400">{ax.metric}</span>
                 </div>
                 <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${ax.score > 95 ? 'bg-emerald-500' : ax.score > 90 ? 'bg-primary' : 'bg-rose-500'}`}
                      style={{ width: `${ax.score}%` }}
                    />
                 </div>
              </div>
           </div>
         ))}
      </div>

      {/* Logic Flow Documentation (Secondary) */}
      <div className="bg-ivory-surface border border-ivory-border rounded-[48px] p-12 flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="flex items-center gap-8">
            <div className="size-20 rounded-[32px] bg-white border border-ivory-border flex items-center justify-center text-slate-300 shadow-sm">
               <span className="material-symbols-outlined text-4xl">account_tree</span>
            </div>
            <div>
               <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase">Tìm hiểu sâu về Protocol Logic</h4>
               <p className="text-sm text-slate-500 font-medium">Khám phá mã nguồn và các hằng số toán học định hình nên 5 Tiên đề UVFL.</p>
            </div>
         </div>
         <button className="px-10 py-4 bg-white border border-ivory-border text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-3">
            Mở Thư viện Quy tắc (Rulebook)
            <span className="material-symbols-outlined text-sm">open_in_new</span>
         </button>
      </div>

    </div>
  );
};

export default Explorer;
