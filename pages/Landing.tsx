
import React from 'react';
import { useLanguage } from '../App';

const Landing = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-6xl mx-auto px-4 py-24">
      <div className="text-center mb-20">
        <h1 className="text-6xl md:text-7xl font-black text-slate-900 mb-6 tracking-tighter leading-none">
          {t.landing.hero} <br/>
          <span className="text-emerald-600 italic font-serif">{t.landing.subHero}</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
          {t.landing.desc}
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        {t.landing.features.map((item, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 hover:shadow-xl hover:border-emerald-100 transition-all group">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <span className="text-xl font-bold">{idx + 1}</span>
            </div>
            <h3 className="font-black text-slate-900 mb-3 tracking-tight">{item.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Landing;
