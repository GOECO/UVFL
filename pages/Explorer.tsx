
import React from 'react';
import { useLanguage } from '../App';

const Explorer = () => {
  const { t } = useLanguage();

  const codeString = `{
  "tien_de": "01_TAO_GIA_TRI",
  "logic": "IF delta_dong_gop > 0 THEN xac_thuc()",
  "quy_tac": [
    "diem_tien_ich_min: 0.85",
    "nguong_dong_thuan: 0.66",
    "tre_lan_truyen_ms: < 200"
  ],
  "trang_thai": "DANG_HOAT_DONG"
}`;

  return (
    <div className="min-h-full">
      {/* Breadcrumb */}
      <div className="px-8 pt-6 flex items-center gap-2 text-sm">
        <span className="text-slate-500">Khám phá</span>
        <span className="text-ivory-border">/</span>
        <span className="text-slate-900 font-bold tracking-tight">5 Tiên đề UVFL</span>
      </div>

      {/* Hero Section */}
      <div className="px-8 py-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-none mb-4 tracking-tight">Khám phá Tiên đề UVFL</h1>
          <p className="text-slate-600 text-lg">UVFL Global - Một hệ sinh thái phi tập trung để tạo và xác thực giá trị. Tìm hiểu các nguyên tắc cốt lõi vận hành giao thức.</p>
        </div>
        <button className="px-6 py-3 bg-primary text-white font-bold rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-primary/20">
          <span>Tài liệu kỹ thuật</span>
          <span className="material-symbols-outlined">open_in_new</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="px-8 pb-8">
        <div className="flex border-b border-ivory-border gap-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <button className="flex items-center gap-2 border-b-2 border-primary text-primary pb-3 font-bold text-sm tracking-wide">
            <span className="text-xs opacity-50">01</span> {t.explorer.axioms ? t.explorer.axioms[0] : 'Tạo Giá Trị'}
          </button>
          {['Xác Thực Phi Tập Trung', 'Minh Bạch Bất Biến', 'Niềm Tin Mở Rộng', 'Thịnh Vượng Chung'].map((name, i) => (
            <button key={i} className="flex items-center gap-2 border-b-2 border-transparent text-slate-500 hover:text-slate-800 pb-3 font-bold text-sm tracking-wide transition-all">
              <span className="text-xs opacity-50">0{i+2}</span> {name}
            </button>
          ))}
        </div>
      </div>

      {/* Bento Grid */}
      <div className="px-8 pb-12">
        <div className="bento-grid">
          {/* Main Visualization */}
          <div className="col-span-12 lg:col-span-8 bg-white border border-ivory-border rounded-xl p-8 relative overflow-hidden flex flex-col items-center justify-center min-h-[440px] shadow-sm">
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="h-full w-full bg-[radial-gradient(circle_at_center,_#2563eb_0%,_transparent_70%)]"></div>
            </div>
            
            <div className="relative z-10 w-full max-w-md aspect-square flex items-center justify-center">
              <div className="relative w-full h-full border-[2px] border-primary/20 rounded-full flex items-center justify-center">
                <div className="absolute inset-4 border border-dashed border-primary/20 rounded-full"></div>
                <div className="w-3/4 h-3/4 bg-blue-50/50 border border-primary/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <div className="w-1/2 h-1/2 bg-primary rounded-2xl rotate-45 flex items-center justify-center shadow-xl animate-pulse">
                    <span className="material-symbols-outlined text-white text-5xl -rotate-45">bolt</span>
                  </div>
                </div>
                {/* Validator Points */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white border border-primary/40 px-3 py-1 rounded text-[10px] text-primary font-bold shadow-md">ĐIỂM_XÁC_THỰC_01</div>
                <div className="absolute top-1/2 -left-12 -translate-y-1/2 bg-white border border-primary/40 px-3 py-1 rounded text-[10px] text-primary font-bold shadow-md">ĐIỂM_XÁC_THỰC_02</div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white border border-primary/40 px-3 py-1 rounded text-[10px] text-primary font-bold shadow-md">ĐIỂM_XÁC_THỰC_03</div>
                <div className="absolute top-1/2 -right-12 -translate-y-1/2 bg-white border border-primary/40 px-3 py-1 rounded text-[10px] text-primary font-bold shadow-md">ĐIỂM_XÁC_THỰC_04</div>
              </div>
            </div>
            <div className="mt-8 text-center relative z-10">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Động cơ của Tiện ích</h3>
              <p className="text-slate-600 text-sm max-w-sm">Mọi tương tác trên UVFL phải tạo ra tiện ích mạng hữu hình, được xác thực bởi sự đồng thuận tập thể.</p>
            </div>
          </div>

          {/* Axiom Cards */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
            <div className="bg-primary text-white p-6 rounded-xl flex flex-col justify-between h-48 relative overflow-hidden shadow-xl">
              <div className="relative z-10">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Định nghĩa Tiên đề 1</p>
                <h4 className="text-xl font-bold leading-tight uppercase">Giá trị phải có khả năng chứng minh, định lượng và chuyển nhượng.</h4>
              </div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="text-sm font-medium opacity-90">Tuân thủ Giao thức</div>
                <div className="text-2xl font-black">99.9%</div>
              </div>
              <div className="absolute -bottom-10 -right-10 size-48 bg-white/10 rounded-full blur-3xl"></div>
            </div>

            <div className="bg-white border border-ivory-border p-6 rounded-xl flex flex-col gap-4 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Chu kỳ Xác thực Hiện tại</p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">Bằng chứng Đóng góp</span>
                    <span className="text-sm font-mono text-primary font-bold">ACT_482</span>
                  </div>
                  <div className="w-full bg-ivory-surface h-2 rounded-full overflow-hidden border border-ivory-border">
                    <div className="bg-primary h-full w-[72%]"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">Lan truyền Giá trị</span>
                    <span className="text-sm font-mono text-primary font-bold">SEQ_910</span>
                  </div>
                  <div className="w-full bg-ivory-surface h-2 rounded-full overflow-hidden border border-ivory-border">
                    <div className="bg-primary h-full w-[45%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Practical Application */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-white border border-ivory-border p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary">psychology</span>
              <h5 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Ứng dụng Thực tế</h5>
            </div>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">Trong một nhóm tính toán phân tán, Tiên đề 1 đảm bảo rằng các chu kỳ không chỉ bị đốt cháy mà được quy cho các kết quả đầu ra đã xác minh phục vụ lớp mạng toàn cầu.</p>
            <div className="flex items-center justify-between pt-4 border-t border-ivory-border">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ví dụ: Suy luận AI</span>
              <span className="material-symbols-outlined text-slate-400 text-sm">arrow_forward</span>
            </div>
          </div>

          {/* JSON Rules */}
          <div className="col-span-12 md:col-span-6 lg:col-span-8 bg-white border border-ivory-border p-6 rounded-xl font-mono text-sm shadow-md overflow-hidden">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-ivory-border">
              <div className="flex gap-1.5">
                <div className="size-2.5 rounded-full bg-slate-200"></div>
                <div className="size-2.5 rounded-full bg-slate-200"></div>
                <div className="size-2.5 rounded-full bg-slate-200"></div>
              </div>
              <span className="text-[10px] uppercase text-slate-400 tracking-[0.2em] font-bold">Quy_Tac_Xac_Thuc.json</span>
            </div>
            <pre className="overflow-x-auto text-slate-700 leading-relaxed whitespace-pre-wrap p-4 bg-slate-50 rounded-lg border border-slate-100">
               <code>{codeString}</code>
            </pre>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-12 flex justify-between items-center border-t border-ivory-border pt-8">
          <button className="flex items-center gap-2 text-slate-300 cursor-not-allowed transition-colors">
            <span className="material-symbols-outlined">west</span>
            <span className="font-bold text-sm uppercase tracking-wider">Tiên đề trước</span>
          </button>
          <div className="flex gap-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className={`size-2 rounded-full ${i === 1 ? 'bg-primary' : 'bg-ivory-border'}`}></div>
            ))}
          </div>
          <button className="flex items-center gap-2 text-primary hover:text-blue-700 transition-colors group">
            <span className="font-bold text-sm uppercase tracking-wider">Tiếp: Xác thực phi tập trung</span>
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">east</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Explorer;
