
import React from 'react';
import { useLanguage } from '../App';

const Rulebook = () => {
  const { t } = useLanguage();
  const rb = t.rulebook;

  const sections = [
    { title: rb.section1, icon: 'list_alt', desc: 'Quy trình xác định giá trị đầu vào dựa trên bằng chứng vật lý và kỹ thuật số.' },
    { title: rb.section2, icon: 'functions', desc: 'Mô hình phân chia lợi ích tự động cho các vai trò Creator, Operator, Guide.' },
    { title: rb.section3, icon: 'groups', desc: 'Các quy tắc đạt được sự đồng thuận trong mạng lưới Validator phi tập trung.' }
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
      <div className="space-y-4">
        <h1 className="text-5xl font-black tracking-tighter uppercase">{rb.title}</h1>
        <p className="text-xl text-slate-500 font-medium">{rb.subtitle}</p>
      </div>

      <div className="grid gap-8">
        {sections.map((s, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-ivory-border dark:border-slate-800 shadow-sm flex items-start gap-8 group hover:border-primary transition-all">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
              <span className="material-symbols-outlined text-3xl">{s.icon}</span>
            </div>
            <div>
              <h3 className="text-2xl font-black mb-2 tracking-tight">{s.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{s.desc}</p>
              <button className="mt-6 text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                Đọc tài liệu chi tiết <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rulebook;
