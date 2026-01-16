
import React, { useState } from 'react';
import { useLanguage } from '../App';

const MobilePreview = () => {
  const { t } = useLanguage();
  const [screen, setScreen] = useState('home');

  return (
    <div className="flex items-center justify-center min-h-[800px] p-10 bg-slate-100">
      <div className="relative w-[375px] h-[812px] bg-white rounded-[60px] border-[12px] border-slate-900 shadow-2xl overflow-hidden flex flex-col">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-8 bg-slate-900 rounded-b-3xl z-50" />
        
        {/* Mobile Header */}
        <header className="pt-12 pb-4 px-6 flex justify-between items-center bg-ivory-bg">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-900">
            {screen === 'home' ? 'Dashboard' : screen === 'qr' ? 'Xác thực Peer' : 'Ví giá trị'}
          </h2>
          <div className="flex gap-1">
            <div className="size-1.5 bg-slate-300 rounded-full"></div>
            <div className="size-1.5 bg-emerald-500 rounded-full"></div>
          </div>
        </header>

        {/* Dynamic Screen Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {screen === 'home' && (
            <div className="animate-in fade-in duration-300">
              <div className="bg-primary text-white p-6 rounded-[32px] shadow-lg shadow-primary/20 mb-6">
                <p className="text-[10px] font-bold opacity-60 mb-1">VAI TRÒ</p>
                <h3 className="text-2xl font-black mb-4">OPERATOR</h3>
                <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-[94.5%]" />
                </div>
                <p className="text-[10px] font-bold mt-2">KPI: 94.5% (An toàn)</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-ivory-border p-4 rounded-2xl text-center">
                   <span className="material-symbols-outlined text-primary mb-2">payments</span>
                   <p className="text-[9px] font-black text-slate-400">USDT</p>
                   <p className="font-black">1,240</p>
                </div>
                <div className="bg-white border border-ivory-border p-4 rounded-2xl text-center">
                   <span className="material-symbols-outlined text-amber-500 mb-2">conditions</span>
                   <p className="text-[9px] font-black text-slate-400">GOLD</p>
                   <p className="font-black">42.15g</p>
                </div>
              </div>

              <button 
                onClick={() => setScreen('qr')}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">qr_code_scanner</span>
                Xác thực Peer-to-Peer
              </button>
            </div>
          )}

          {screen === 'qr' && (
            <div className="animate-in slide-in-from-right-10 duration-300 flex flex-col items-center justify-center h-full text-center space-y-8">
              <div className="size-48 bg-slate-50 border-4 border-dashed border-ivory-border rounded-[40px] flex items-center justify-center">
                <span className="material-symbols-outlined text-8xl text-slate-200">photo_camera</span>
              </div>
              <div>
                <h4 className="font-black text-slate-900 mb-2">Đang tìm mã QR...</h4>
                <p className="text-xs text-slate-500">Giữ camera ổn định để quét bằng chứng giá trị từ người dùng khác.</p>
              </div>
              <button onClick={() => setScreen('home')} className="text-xs font-black text-primary uppercase">Hủy bỏ</button>
            </div>
          )}
        </main>

        {/* Tab Bar */}
        <nav className="h-20 bg-white border-t border-ivory-border flex items-center justify-around px-4">
          <button onClick={() => setScreen('home')} className={`flex flex-col items-center gap-1 ${screen === 'home' ? 'text-primary' : 'text-slate-400'}`}>
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-[8px] font-black uppercase">Home</span>
          </button>
          <div className="bg-primary size-12 rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/20 -mt-8 border-4 border-white">
            <span className="material-symbols-outlined">add</span>
          </div>
          <button onClick={() => setScreen('wallet')} className={`flex flex-col items-center gap-1 ${screen === 'wallet' ? 'text-primary' : 'text-slate-400'}`}>
            <span className="material-symbols-outlined">account_balance_wallet</span>
            <span className="text-[8px] font-black uppercase">Wallet</span>
          </button>
        </nav>

        {/* Bottom Bar */}
        <div className="w-32 h-1 bg-slate-900 mx-auto mb-2 rounded-full" />
      </div>
    </div>
  );
};

export default MobilePreview;
