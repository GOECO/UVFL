
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useLanguage } from '../App';
import { GoogleGenAI } from "@google/genai";

interface Broadcast {
  id: string;
  node: string;
  axiomId: string;
  message: string;
  timestamp: string;
}

const Explorer = () => {
  const { t } = useLanguage();
  const ex = t.explorer;
  
  const [activeTab, setActiveTab] = useState(0);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);
  const [showInternalFeedback, setShowInternalFeedback] = useState(false);
  const [isSharingInternal, setIsSharingInternal] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [networkBroadcasts, setNetworkBroadcasts] = useState<Broadcast[]>([
    { id: '1', node: 'JP-NODE-08', axiomId: '02', message: 'Shield node validation protocol updated for Axiom 02.', timestamp: '2 mins ago' },
    { id: '2', node: 'DE-NODE-12', axiomId: '05', message: 'Prosperity multiplier synchronized globally.', timestamp: '5 mins ago' }
  ]);
  
  const menuRef = useRef<HTMLDivElement>(null);

  const axiomData = useMemo(() => [
    {
      id: '01',
      title: ex.axioms[0],
      desc: 'Mọi giá trị phải được định lượng hóa thông qua các bằng chứng số hóa không thể chối bỏ.',
      engine: 'BOLT_CORE',
      color: 'bg-primary'
    },
    {
      id: '02',
      title: ex.axioms[1],
      desc: 'Xác thực đa tầng từ cộng đồng đảm bảo tính trung thực trước khi lan truyền giá trị.',
      engine: 'SHIELD_NODE',
      color: 'bg-emerald-600'
    },
    {
      id: '03',
      title: ex.axioms[2],
      desc: 'Sổ cái hash-chain ghi lại mọi biến động, không ai có quyền ghi đè thủ công.',
      engine: 'LEDGER_SYNC',
      color: 'bg-amber-600'
    },
    {
      id: '04',
      title: ex.axioms[3],
      desc: 'Niềm tin được xây dựng từ thuật toán, không phụ thuộc vào cá nhân hay tổ chức tập quyền.',
      engine: 'TRUST_LAYER',
      color: 'bg-indigo-600'
    },
    {
      id: '05',
      title: ex.axioms[4],
      desc: 'Gia tăng giá trị mạng lưới dẫn đến sự thăng tiến vai trò và thù lao xứng đáng.',
      engine: 'PROSPERITY_HUB',
      color: 'bg-rose-600'
    }
  ], [ex.axioms]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsShareMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getShareContent = () => {
    const currentAxiom = axiomData[activeTab];
    const text = `UVFL Global Axiom ${currentAxiom.id}: ${currentAxiom.title}\n${currentAxiom.desc}`;
    const url = `${window.location.origin}${window.location.pathname}#/explorer?id=${currentAxiom.id}`;
    return { title: `UVFL Axiom ${currentAxiom.id}`, text, url };
  };

  const handleSystemShare = async () => {
    const content = getShareContent();
    if (navigator.share) {
      try {
        await navigator.share(content);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') console.error('Share failed:', err);
      }
    } else {
      copyToClipboard(`${content.text}\n${content.url}`);
    }
    setIsShareMenuOpen(false);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setShowCopyFeedback(true);
      setTimeout(() => setShowCopyFeedback(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
    setIsShareMenuOpen(false);
  };

  const handleInternalShare = async () => {
    setIsSharingInternal(true);
    setIsShareMenuOpen(false);
    setBroadcastMessage('Synchronizing neural logic gates...');

    try {
      const currentAxiom = axiomData[activeTab];
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are the UVFL Global Protocol Dispatcher. Generate a highly technical, futuristic broadcast message (max 100 chars) for Axiom ${currentAxiom.id}: "${currentAxiom.title}". Include terms like "hash chain", "synchronized", or "consensus". Output only the message.`,
      });
      
      const generatedMsg = response.text || `Axiom ${currentAxiom.id} logic state synchronized with global mainnet.`;
      setBroadcastMessage(generatedMsg);
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Add to simulated history
      const newBroadcast: Broadcast = {
        id: Date.now().toString(),
        node: 'VN-USER-71',
        axiomId: currentAxiom.id,
        message: generatedMsg,
        timestamp: 'Just now'
      };
      setNetworkBroadcasts(prev => [newBroadcast, ...prev].slice(0, 5));

      setIsSharingInternal(false);
      setShowInternalFeedback(true);
      setTimeout(() => setShowInternalFeedback(false), 4000);
    } catch (error) {
      console.error("Broadcast generation failed", error);
      setIsSharingInternal(false);
    }
  };

  const codeString = JSON.stringify({
    axiom_id: axiomData[activeTab].id,
    engine: axiomData[activeTab].engine,
    status: isSharingInternal ? 'BROADCASTING' : 'STABLE',
    consensus_met: true,
    nodes_active: 8103
  }, null, 2);

  return (
    <div className="min-h-full relative geometric-bg pb-12">
      {/* Breadcrumbs */}
      <div className="px-8 pt-6 flex items-center gap-2 text-sm">
        <span className="text-slate-500 font-medium">Khám phá</span>
        <span className="text-ivory-border">/</span>
        <span className="text-slate-900 font-black tracking-tight uppercase">Hệ thống Tiên đề</span>
      </div>

      {/* Hero Header */}
      <div className="px-8 py-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-none mb-4 tracking-tight uppercase">{ex.title}</h1>
          <p className="text-slate-500 text-lg font-medium">{ex.desc}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-8 pb-8 sticky top-[60px] z-40 bg-ivory-bg/80 backdrop-blur-md pt-2">
        <div className="flex border-b border-ivory-border gap-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {axiomData.map((ax, i) => (
            <button 
              key={ax.id}
              onClick={() => setActiveTab(i)}
              className={`flex items-center gap-2 border-b-2 pb-3 font-bold text-sm tracking-wide transition-all ${
                activeTab === i ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <span className="text-[10px] font-black opacity-50 font-mono">{ax.id}</span> {ax.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="px-8">
        <div className="grid grid-cols-12 gap-8">
          
          {/* Axiom Visualizer (Bento-styled) */}
          <div className="col-span-12 lg:col-span-8 bg-white border border-ivory-border rounded-[48px] p-10 relative overflow-hidden flex flex-col items-center justify-center min-h-[500px] shadow-sm">
            
            {/* Contextual Sharing Menu */}
            <div className="absolute top-8 right-8 z-30" ref={menuRef}>
              <button 
                onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
                className={`flex items-center gap-3 px-6 py-3 bg-white border-2 border-ivory-border rounded-2xl text-xs font-black text-slate-900 hover:border-primary hover:text-primary transition-all shadow-sm active:scale-95 ${isShareMenuOpen ? 'border-primary ring-4 ring-primary/10' : ''}`}
              >
                <span className="material-symbols-outlined text-xl">share</span>
                {ex.share}
              </button>

              {isShareMenuOpen && (
                <div className="absolute right-0 mt-4 w-80 bg-white border border-ivory-border rounded-3xl shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-3 border-b border-ivory-border/50 mb-1 flex justify-between items-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Distribution</p>
                    <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded">AX-{axiomData[activeTab].id}</span>
                  </div>
                  
                  <button 
                    onClick={handleInternalShare}
                    className="w-full flex items-center gap-4 px-3 py-3 hover:bg-emerald-50 text-emerald-700 rounded-2xl transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                      <span className="material-symbols-outlined">wifi_tethering</span>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-black leading-none mb-1">{ex.shareInternal}</p>
                      <p className="text-[10px] font-bold opacity-60 leading-tight">{ex.shareInternalDesc}</p>
                    </div>
                  </button>

                  <div className="h-px bg-ivory-border/50 my-1 mx-2" />

                  <button 
                    onClick={() => copyToClipboard(getShareContent().url)}
                    className="w-full flex items-center gap-4 px-3 py-3 hover:bg-slate-50 text-slate-800 rounded-2xl transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-primary group-hover:text-white transition-all">
                      <span className="material-symbols-outlined">link</span>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-black leading-none mb-1">{ex.shareCopy}</p>
                      <p className="text-[10px] font-bold opacity-60 leading-tight">{ex.shareCopyDesc}</p>
                    </div>
                  </button>

                  <button 
                    onClick={handleSystemShare}
                    className="w-full flex items-center gap-4 px-3 py-3 hover:bg-slate-50 text-slate-800 rounded-2xl transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-all">
                      <span className="material-symbols-outlined">ios_share</span>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-black leading-none mb-1">{ex.shareSystem}</p>
                      <p className="text-[10px] font-bold opacity-60 leading-tight">{ex.shareSystemDesc}</p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Broadcast HUD */}
            {isSharingInternal && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-ivory-bg/60 backdrop-blur-sm p-10 text-center animate-in fade-in duration-500">
                <div className="relative mb-12">
                   <div className="size-32 border-4 border-emerald-500 rounded-full animate-ping absolute inset-0 opacity-20"></div>
                   <div className="size-32 border-4 border-emerald-500 rounded-full animate-pulse absolute inset-0"></div>
                   <div className="size-32 rounded-full flex items-center justify-center text-emerald-600 bg-emerald-50 relative z-10 border border-emerald-200">
                      <span className="material-symbols-outlined text-6xl">sensors</span>
                   </div>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Protocol Broadcast in Progress</h3>
                <p className="text-emerald-600 font-mono text-sm max-w-md bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
                  {broadcastMessage}
                </p>
              </div>
            )}

            {/* Axiom Core Visual */}
            <div className="relative z-10 w-full max-w-sm aspect-square flex items-center justify-center">
              <div className={`relative w-full h-full border-2 border-primary/10 rounded-full flex items-center justify-center transition-all duration-700 ${isSharingInternal ? 'scale-90 blur-sm' : 'scale-100'}`}>
                <div className="absolute inset-0 border-t-2 border-primary/20 rounded-full animate-spin-slow"></div>
                <div className={`w-3/4 h-3/4 ${axiomData[activeTab].color}/5 border border-primary/10 rounded-full flex items-center justify-center backdrop-blur-sm`}>
                  <div className={`w-1/2 h-1/2 ${axiomData[activeTab].color} rounded-[40px] rotate-45 flex items-center justify-center shadow-2xl transition-all duration-500`}>
                    <span className="material-symbols-outlined text-white text-6xl -rotate-45">
                      {activeTab === 0 ? 'bolt' : activeTab === 1 ? 'verified_user' : activeTab === 2 ? 'database' : activeTab === 3 ? 'hub' : 'payments'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-10 text-center relative z-10 max-w-lg">
              <p className="text-[11px] font-black text-primary uppercase tracking-[0.3em] mb-3">Engine Core: {axiomData[activeTab].engine}</p>
              <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter leading-none">{axiomData[activeTab].title}</h3>
              <p className="text-slate-500 font-medium text-lg leading-relaxed">{axiomData[activeTab].desc}</p>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            
            {/* Live Feed Section */}
            <div className="bg-white border border-ivory-border rounded-[48px] p-8 shadow-sm">
               <div className="flex items-center justify-between mb-8">
                  <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">{ex.recentBroadcasts}</h4>
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
               </div>
               <div className="space-y-4">
                  {networkBroadcasts.map((b) => (
                    <div key={b.id} className="p-4 bg-slate-50 border border-ivory-border rounded-[24px] hover:bg-white hover:shadow-md transition-all group">
                       <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-black text-primary font-mono">{b.node}</span>
                          <span className="text-[10px] text-slate-400 font-bold">{b.timestamp}</span>
                       </div>
                       <p className="text-xs text-slate-700 font-medium leading-relaxed italic mb-2">"{b.message}"</p>
                       <div className="flex items-center gap-1">
                          <span className="text-[9px] font-black uppercase tracking-tighter bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded">AXIOM {b.axiomId}</span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Tech Specs */}
            <div className="bg-slate-900 text-white rounded-[48px] p-8 shadow-xl overflow-hidden relative group">
               <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <span className="material-symbols-outlined text-primary text-2xl">terminal</span>
                    <h4 className="text-sm font-black uppercase tracking-widest">Axiom Node Telemetry</h4>
                  </div>
                  <pre className="font-mono text-[11px] text-emerald-400/80 leading-relaxed bg-black/40 p-6 rounded-3xl border border-white/5 shadow-inner h-48 overflow-y-auto scrollbar-hide">
                    <code>{codeString}</code>
                  </pre>
               </div>
               <div className="absolute -bottom-24 -right-24 size-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
            </div>

          </div>
        </div>
      </div>

      {/* Floating Notifications */}
      <div className="fixed bottom-10 right-10 z-[100] flex flex-col gap-3 pointer-events-none">
        {showCopyFeedback && (
          <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-10 fade-in duration-300">
            <span className="material-symbols-outlined text-emerald-400">check_circle</span>
            <span className="text-xs font-black uppercase tracking-widest">{ex.copied}</span>
          </div>
        )}
        {showInternalFeedback && (
          <div className="bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-10 fade-in duration-300">
            <span className="material-symbols-outlined">wifi_tethering</span>
            <span className="text-xs font-black uppercase tracking-widest">{ex.sharedInternal}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explorer;
