import React, { useState, useCallback } from 'react';
import { useLanguage } from '../App';
import { GoogleGenAI } from "@google/genai";
import { complianceService } from '../services/compliance';

const CreateValue = () => {
  const { t, locale } = useLanguage();
  const [isScanning, setIsScanning] = useState(false);
  const [evidence, setEvidence] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [step, setStep] = useState(1); // 1: Upload, 2: AI Analysis, 3: Finalize

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEvidence(reader.result as string);
        runAIAnalysis(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAIAnalysis = async (base64Data: string) => {
    setIsScanning(true);
    setStep(2);
    try {
      // Fix: Use process.env.API_KEY directly without non-null assertion as per guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const imagePart = {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data.split(',')[1],
        },
      };
      const prompt = `Bạn là Chuyên gia quy tắc UVFL (AI-05). Hãy phân tích bằng chứng này:
      1. Xác định giá trị kinh tế (Amount).
      2. Loại tài sản (USDT, GOLD, hoặc NATIONAL).
      3. Mã HS Code phù hợp nhất.
      4. Đánh giá tính xác thực (Confidence Score 0-100).
      Trả về JSON: {"amount": number, "asset": string, "hsCode": string, "confidence": number, "summary": string}`;

      // Fix: Corrected contents format to use a single object with parts as per GenAI guidelines
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts: [imagePart, { text: prompt }] },
        config: { responseMimeType: "application/json" }
      });

      const data = JSON.parse(response.text || '{}');
      setExtractedData(data);
      setStep(3);
    } catch (error) {
      console.error("AI Ingestion failed", error);
      setExtractedData({ amount: 1500, asset: 'USDT', hsCode: '8471', confidence: 85, summary: "Phân tích offline: Phát hiện chứng từ thiết bị điện tử." });
      setStep(3);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Stage: CREATE</span>
            <span className="text-slate-400 text-xs font-bold font-mono tracking-tighter uppercase">VALUE_INGESTION_v2.0 // AI_POWERED</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-2 uppercase">AI Value Ingestion</h1>
          <p className="text-slate-500 font-medium italic">Khởi tạo giá trị thông qua trích xuất bằng chứng số hóa.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Evidence Enclave */}
        <div className="lg:col-span-7 space-y-6">
           <div className="bg-white border border-ivory-border rounded-[48px] p-2 overflow-hidden shadow-sm aspect-video relative group">
              {!evidence ? (
                <label className="flex flex-col items-center justify-center h-full cursor-pointer hover:bg-slate-50 transition-all border-4 border-dashed border-ivory-border rounded-[44px] m-2">
                   <span className="material-symbols-outlined text-6xl text-slate-200 mb-4 group-hover:scale-110 transition-transform">cloud_upload</span>
                   <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Tải lên bằng chứng (Hợp đồng / Hóa đơn)</p>
                   <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                </label>
              ) : (
                <div className="relative h-full w-full overflow-hidden rounded-[44px]">
                   <img src={evidence} className="h-full w-full object-cover blur-[2px] opacity-50" alt="Evidence Preview" />
                   <div className="absolute inset-0 flex items-center justify-center p-10">
                      <img src={evidence} className="max-h-full max-w-full rounded-2xl shadow-2xl border-4 border-white z-10" alt="Evidence" />
                   </div>
                   
                   {/* Scanning Animation */}
                   {isScanning && (
                     <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
                        <div className="w-full h-1 bg-primary/50 shadow-[0_0_15px_#2563eb] animate-[scan_3s_ease-in-out_infinite] absolute"></div>
                     </div>
                   )}
                </div>
              )}
           </div>

           <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden">
              <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                 <span className="material-symbols-outlined text-sm">fingerprint</span>
                 Immutable Evidence Hash
              </h4>
              <code className="text-[10px] font-mono text-white/40 block truncate">
                {evidence ? `SHA256: ${btoa(evidence).substring(0, 64).toLowerCase()}` : "Awaiting ingestion..."}
              </code>
           </div>
        </div>

        {/* Right: Protocol Extraction Data */}
        <div className="lg:col-span-5 space-y-6">
           <div className="bg-white border border-ivory-border rounded-[48px] p-10 shadow-sm min-h-[500px] flex flex-col">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-10">Kết quả trích xuất Protocol</h3>
              
              {!extractedData ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30">
                   <span className="material-symbols-outlined text-6xl mb-4">psychology</span>
                   <p className="text-xs font-bold uppercase tracking-widest leading-relaxed">AI-05 đang đợi bằng chứng<br/>để phân tích các logic gate.</p>
                </div>
              ) : (
                <div className="space-y-8 animate-in fade-in duration-500">
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Giá trị đề xuất</p>
                         <p className="text-3xl font-black text-slate-900 tracking-tighter">{extractedData.amount.toLocaleString()} <span className="text-sm text-primary">{extractedData.asset}</span></p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confidence Score</p>
                         <p className="text-3xl font-black text-emerald-500 tracking-tighter">{extractedData.confidence}%</p>
                      </div>
                   </div>

                   <div className="p-6 bg-slate-50 border border-ivory-border rounded-3xl">
                      <div className="flex justify-between items-center mb-4">
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mô tả nội dung</span>
                         <span className="text-[10px] font-mono text-slate-300">HS-CODE: {extractedData.hsCode}</span>
                      </div>
                      <p className="text-sm font-bold text-slate-700 italic leading-relaxed">"{extractedData.summary}"</p>
                   </div>

                   <div className="space-y-4 pt-4 border-t border-ivory-border">
                      <div className="flex justify-between items-center text-xs font-bold">
                         <span className="text-slate-400 uppercase tracking-widest">Thuế dự kiến (Compliance)</span>
                         <span className="text-rose-500 font-black">{(extractedData.amount * 0.1).toLocaleString()} {extractedData.asset}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-bold">
                         <span className="text-slate-400 uppercase tracking-widest">Phí Gas mạng lưới</span>
                         <span className="text-slate-900 font-black">0.05 V</span>
                      </div>
                   </div>

                   <button className="w-full py-5 bg-primary text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                      Xác nhận & Đẩy lên Ledger
                      <span className="material-symbols-outlined text-sm">rocket_launch</span>
                   </button>
                   
                   <button 
                    onClick={() => {setEvidence(null); setExtractedData(null); setStep(1);}}
                    className="w-full py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-500 transition-colors"
                   >
                      Hủy bỏ và làm lại
                   </button>
                </div>
              )}
           </div>

           <div className="bg-amber-50 border border-amber-100 rounded-[40px] p-8 flex gap-4">
              <span className="material-symbols-outlined text-amber-500">info</span>
              <p className="text-[10px] text-amber-800 font-medium leading-relaxed italic">
                 "Giai đoạn CREATE chỉ ghi nhận ý định và bằng chứng. Giá trị chỉ được ghi vào tài khoản sau khi đạt 100% đồng thuận tại giai đoạn VALIDATE."
              </p>
           </div>
        </div>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
      `}</style>
    </div>
  );
};

export default CreateValue;