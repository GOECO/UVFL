import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../App';
import { GoogleGenAI } from "@google/genai";

interface AIAgent {
  id: string;
  name: string;
  task: string;
  status: 'active' | 'learning' | 'processing';
  icon: string;
  color: string;
}

const AICommandCenter = () => {
  const { t } = useLanguage();
  const acc = t.aiCenter;
  
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'agent', text: string}[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  
  const terminalRef = useRef<HTMLDivElement>(null);

  const agents: AIAgent[] = [
    { id: 'AI-01', name: acc.agents["AI-01"].name, task: acc.agents["AI-01"].task, status: 'active', icon: 'architecture', color: 'bg-blue-500' },
    { id: 'AI-02', name: acc.agents["AI-02"].name, task: acc.agents["AI-02"].task, status: 'active', icon: 'palette', color: 'bg-pink-500' },
    { id: 'AI-03', name: acc.agents["AI-03"].name, task: acc.agents["AI-03"].task, status: 'learning', icon: 'smartphone', color: 'bg-emerald-500' },
    { id: 'AI-04', name: acc.agents["AI-04"].name, task: acc.agents["AI-04"].task, status: 'active', icon: 'web', color: 'bg-indigo-500' },
    { id: 'AI-05', name: acc.agents["AI-05"].name, task: acc.agents["AI-05"].task, status: 'processing', icon: 'settings_ethernet', color: 'bg-orange-500' },
    { id: 'AI-06', name: acc.agents["AI-06"].name, task: acc.agents["AI-06"].task, status: 'active', icon: 'receipt_long', color: 'bg-rose-500' },
    { id: 'AI-07', name: acc.agents["AI-07"].name, task: acc.agents["AI-07"].task, status: 'active', icon: 'public', color: 'bg-teal-500' },
    { id: 'AI-08', name: acc.agents["AI-08"].name, task: acc.agents["AI-08"].task, status: 'active', icon: 'security', color: 'bg-slate-700' },
    { id: 'AI-09', name: acc.agents["AI-09"].name, task: acc.agents["AI-09"].task, status: 'processing', icon: 'bar_chart', color: 'bg-amber-500' },
    { id: 'AI-10', name: acc.agents["AI-10"].name, task: acc.agents["AI-10"].task, status: 'active', icon: 'dns', color: 'bg-cyan-500' },
    { id: 'AI-11', name: acc.agents["AI-11"].name, task: acc.agents["AI-11"].task, status: 'active', icon: 'group_work', color: 'bg-purple-500' },
    { id: 'AI-12', name: acc.agents["AI-12"].name, task: acc.agents["AI-12"].task, status: 'active', icon: 'gavel', color: 'bg-red-600' },
    { id: 'AI-13', name: acc.agents["AI-13"].name, task: acc.agents["AI-13"].task, status: 'active', icon: 'policy', color: 'bg-emerald-700' },
    { id: 'AI-14', name: acc.agents["AI-14"].name, task: acc.agents["AI-14"].task, status: 'active', icon: 'account_balance', color: 'bg-amber-600' },
    { id: 'AI-15', name: acc.agents["AI-15"].name, task: acc.agents["AI-15"].task, status: 'active', icon: 'private_connectivity', color: 'bg-indigo-700' },
    { id: 'AI-16', name: acc.agents["AI-16"].name, task: acc.agents["AI-16"].task, status: 'learning', icon: 'trending_up', color: 'bg-orange-600' },
    { id: 'AI-17', name: acc.agents["AI-17"].name, task: acc.agents["AI-17"].task, status: 'active', icon: 'dynamic_form', color: 'bg-slate-600' },
    { id: 'AI-18', name: acc.agents["AI-18"].name, task: acc.agents["AI-18"].task, status: 'processing', icon: 'auto_mode', color: 'bg-violet-600' },
  ];

  useEffect(() => {
    // Simulate real-time logs
    const interval = setInterval(() => {
      const randomAgent = agents[Math.floor(Math.random() * agents.length)];
      const actions = [
        "scanning hash chains", 
        "optimizing tax rules", 
        "verifying node sync", 
        "analyzing KPI trends", 
        "updating audit log",
        "calculating payout ceilings",
        "encrypting decentralized shards",
        "evaluating growth vectors",
        "standardizing protocol ISO-20022",
        "simulating recursive rule evolution"
      ];
      const action = actions[Math.floor(Math.random() * actions.length)];
      const newLog = `[${new Date().toLocaleTimeString()}] ${randomAgent.id} (${randomAgent.name}): ${action}... OK`;
      setLogs(prev => [newLog, ...prev].slice(0, 15));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleConsult = async () => {
    if (!chatMessage || !selectedAgent || isThinking) return;
    
    const userMsg = chatMessage;
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatMessage('');
    setIsThinking(true);

    try {
      // Fix: Initialized GoogleGenAI using process.env.API_KEY directly as required by guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are ${selectedAgent.id}: ${selectedAgent.name}, a specialized member of the UVFL Global system. Your core task is: ${selectedAgent.task}. Respond to the user's inquiry in a professional, technical, and helpful manner according to your expertise. Use the current system context (Mainnet v4.2, Decentralized Value Flow, 18 Specialized Agents). Inquiry: ${userMsg}`,
      });
      
      const agentResponse = response.text || "I am processing your request through the logic gate.";
      setChatHistory(prev => [...prev, { role: 'agent', text: agentResponse }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'agent', text: "Error connecting to Agent logic core." }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Neural Network</span>
            <span className="text-slate-400 text-xs font-bold font-mono tracking-widest uppercase">STATUS: 18_AGENTS_SYNCHRONIZED</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-4">{acc.title}</h1>
          <p className="text-slate-500 max-w-xl font-medium">{acc.subtitle}</p>
        </div>
        
        <div className="hidden lg:flex items-center gap-4 bg-white border border-ivory-border p-4 rounded-3xl shadow-sm">
           <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest uppercase tracking-widest">Total Intelligence</p>
              <p className="text-xl font-black text-slate-900">1.8 PetaFLOPS</p>
           </div>
           <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">memory</span>
           </div>
        </div>
      </div>

      {/* Grid of Agents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {agents.map((agent) => (
          <button 
            key={agent.id}
            onClick={() => {
              setSelectedAgent(agent);
              setChatHistory([]);
            }}
            className={`group bg-white p-6 rounded-[32px] border transition-all relative overflow-hidden text-left hover:shadow-xl hover:-translate-y-1 ${selectedAgent?.id === agent.id ? 'border-primary ring-2 ring-primary/10 shadow-lg' : 'border-ivory-border'}`}
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${agent.color}`}>
                <span className="material-symbols-outlined text-2xl">{agent.icon}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`size-2 rounded-full ${agent.status === 'active' ? 'bg-emerald-500' : agent.status === 'learning' ? 'bg-amber-500' : 'bg-blue-500'} animate-pulse`}></span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest tracking-widest">
                  {agent.status === 'active' ? acc.status.active : agent.status === 'learning' ? acc.status.learning : acc.status.processing}
                </span>
              </div>
            </div>
            
            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{agent.id}</p>
            <h4 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-3 group-hover:text-primary transition-colors uppercase tracking-tight leading-none mb-3 group-hover:text-primary transition-colors">{agent.name}</h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed mb-4 line-clamp-2">{agent.task}</p>
            
            <div className="flex items-center gap-2 pt-4 border-t border-ivory-border/50">
               <span className="material-symbols-outlined text-xs text-slate-300">forum</span>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest tracking-widest">{acc.consult}</span>
            </div>

            <div className={`absolute -bottom-10 -right-10 w-24 h-24 rounded-full blur-3xl opacity-10 transition-opacity ${agent.color}`}></div>
          </button>
        ))}
      </div>

      {/* Terminal and Chat Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Real-time Logs */}
        <div className="bg-slate-900 rounded-[48px] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col h-[600px]">
           <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
              <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-emerald-400 uppercase tracking-widest flex items-center gap-2 text-emerald-400">
                <span className="material-symbols-outlined text-emerald-400">terminal</span>
                {acc.terminal}
              </h3>
              <div className="flex gap-1.5">
                <div className="size-2 bg-rose-500 rounded-full"></div>
                <div className="size-2 bg-amber-500 rounded-full"></div>
                <div className="size-2 bg-emerald-500 rounded-full"></div>
              </div>
           </div>
           
           <div className="flex-1 font-mono text-[11px] space-y-3 overflow-y-auto scrollbar-hide opacity-80" ref={terminalRef}>
              {logs.map((log, i) => (
                <div key={i} className="animate-in slide-in-from-left-2 duration-300">
                  {log}
                </div>
              ))}
           </div>
           
           <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-50"></div>
        </div>

        {/* Interaction Panel */}
        <div className="lg:col-span-2 bg-white border border-ivory-border rounded-[48px] shadow-sm flex flex-col h-[600px] overflow-hidden">
          {selectedAgent ? (
            <>
              <div className="px-8 py-6 border-b border-ivory-border flex items-center justify-between bg-ivory-surface/20">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md ${selectedAgent.color}`}>
                    <span className="material-symbols-outlined">{selectedAgent.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase tracking-tight">{selectedAgent.name}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest tracking-widest">UVFL CORE PROTOCOL EXPERT</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedAgent(null)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <span className="material-symbols-outlined text-slate-400">close</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
                {chatHistory.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-30">
                    <span className="material-symbols-outlined text-6xl mb-4">psychology</span>
                    <p className="text-sm font-bold uppercase tracking-widest">Initiate high-frequency consultation with {selectedAgent.id}.</p>
                  </div>
                ) : (
                  chatHistory.map((chat, i) => (
                    <div key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                      <div className={`max-w-[80%] px-6 py-4 rounded-3xl text-sm font-medium shadow-sm ${chat.role === 'user' ? 'bg-primary text-white' : 'bg-slate-50 text-slate-700 border border-ivory-border'}`}>
                        {chat.text}
                      </div>
                    </div>
                  ))
                )}
                {isThinking && (
                  <div className="flex justify-start">
                    <div className="bg-slate-50 border border-ivory-border px-6 py-4 rounded-3xl flex gap-2">
                      <div className="size-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="size-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                      <div className="size-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 bg-ivory-surface/30 border-t border-ivory-border">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder={`Hỏi ${selectedAgent.name}...`}
                    className="w-full bg-white border border-ivory-border rounded-2xl py-4 pl-6 pr-16 text-sm font-bold text-slate-800 focus:ring-4 ring-primary/10 outline-none shadow-inner"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleConsult()}
                    disabled={isThinking}
                  />
                  <button 
                    onClick={handleConsult}
                    disabled={!chatMessage || isThinking}
                    className="absolute right-2 top-2 bottom-2 aspect-square bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-lg">arrow_upward</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12">
               <div className="w-24 h-24 bg-ivory-surface rounded-[40px] flex items-center justify-center text-slate-300 mb-6 border border-ivory-border">
                  <span className="material-symbols-outlined text-5xl">smart_toy</span>
               </div>
               <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2 uppercase tracking-tight mb-2">Chọn một chuyên gia để bắt đầu</h3>
               <p className="text-sm text-slate-500 max-w-sm uppercase font-medium">Hội đồng 18 chuyên gia AI sẵn sàng hỗ trợ các quyết định quản trị phức tạp nhất của bạn.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AICommandCenter;