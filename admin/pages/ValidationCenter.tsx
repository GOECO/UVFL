
import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../App';

interface ValueRecord {
  id: string;
  creator: string;
  creatorRole: string;
  asset: string;
  amount: string;
  tax: string;
  timestamp: string;
  status: 'pending' | 'validated' | 'rejected';
  validations: number;
  requiredValidations: number;
  proofHash: string;
  validatorIds: string[];
}

const ValidationCenter = () => {
  const { t } = useLanguage();
  const vc = t.validation;

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchId, setSearchId] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<ValueRecord | null>(null);

  // Mock Data
  const [records, setRecords] = useState<ValueRecord[]>([
    {
      id: 'REC-0x81FA',
      creator: 'Nguyen Van A',
      creatorRole: 'CREATOR',
      asset: 'USDT',
      amount: '1,200.00',
      tax: '60.00',
      timestamp: '2024-03-24 10:20',
      status: 'pending',
      validations: 1,
      requiredValidations: 3,
      proofHash: '7f8a...e91c',
      validatorIds: ['V-001']
    },
    {
      id: 'REC-0x2B90',
      creator: 'Tran Thi B',
      creatorRole: 'OPERATOR',
      asset: 'GOLD',
      amount: '45.50',
      tax: '0.91',
      timestamp: '2024-03-24 09:15',
      status: 'pending',
      validations: 2,
      requiredValidations: 3,
      proofHash: 'a1b2...c3d4',
      validatorIds: ['V-002', 'V-005']
    },
    {
      id: 'REC-0xFD12',
      creator: 'John Smith',
      creatorRole: 'CREATOR',
      asset: 'USDT',
      amount: '500.00',
      tax: '25.00',
      timestamp: '2024-03-23 16:45',
      status: 'validated',
      validations: 3,
      requiredValidations: 3,
      proofHash: 'e5f6...g7h8',
      validatorIds: ['V-001', 'V-003', 'V-004']
    },
    {
      id: 'REC-0xCC81',
      creator: 'Lê Minh',
      creatorRole: 'CREATOR',
      asset: 'NATIONAL',
      amount: '15,000,000',
      tax: '1,500,000',
      timestamp: '2024-03-23 11:30',
      status: 'rejected',
      validations: 0,
      requiredValidations: 3,
      proofHash: 'i9j0...k1l2',
      validatorIds: []
    }
  ]);

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
      const matchesSearch = r.id.toLowerCase().includes(searchId.toLowerCase()) || r.creator.toLowerCase().includes(searchId.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [records, filterStatus, searchId]);

  const stats = useMemo(() => ({
    pending: records.filter(r => r.status === 'pending').length,
    validated: records.filter(r => r.status === 'validated').length,
    rejected: records.filter(r => r.status === 'rejected').length,
  }), [records]);

  const handleAction = (id: string, newStatus: 'validated' | 'rejected') => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: newStatus, validations: newStatus === 'validated' ? r.requiredValidations : r.validations } : r));
    setSelectedRecord(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8 animate-in fade-in duration-500">
      
      {/* Header & Stats Dashboard */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-4">{vc.title}</h1>
          <p className="text-slate-500 max-w-xl font-medium">{vc.subtitle}</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-white border border-ivory-border rounded-2xl px-6 py-4 shadow-sm flex items-center gap-4">
            <div className="size-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">pending_actions</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{vc.stats.pending}</p>
              <p className="text-xl font-black text-slate-900">{stats.pending}</p>
            </div>
          </div>
          <div className="bg-white border border-ivory-border rounded-2xl px-6 py-4 shadow-sm flex items-center gap-4">
            <div className="size-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">verified</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{vc.stats.validated}</p>
              <p className="text-xl font-black text-slate-900">{stats.validated}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-ivory-border rounded-3xl p-4 shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[300px] relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">search</span>
          <input 
            type="text" 
            placeholder={vc.filters.search}
            className="w-full bg-slate-50 border border-ivory-border rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{vc.filters.status}</span>
          <select 
            className="bg-white border border-ivory-border rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="pending">{vc.stats.pending}</option>
            <option value="validated">{vc.stats.validated}</option>
            <option value="rejected">{vc.stats.rejected}</option>
          </select>
        </div>
        <button className="bg-white border border-ivory-border text-slate-500 p-3 rounded-xl hover:text-primary transition-colors">
          <span className="material-symbols-outlined">filter_list</span>
        </button>
      </div>

      {/* Record Table */}
      <div className="bg-white border border-ivory-border rounded-[32px] overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-ivory-surface/50 border-b border-ivory-border">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{vc.table.record}</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{vc.table.creator}</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{vc.table.value}</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{vc.table.proof}</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{vc.table.progress}</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">{vc.table.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ivory-border">
            {filteredRecords.map((r) => (
              <tr key={r.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-900 tracking-tight">{r.id}</span>
                    <span className="text-[10px] font-mono text-slate-400 mt-0.5">{r.timestamp}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                      {r.creator.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800">{r.creator}</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{r.creatorRole}</span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-900">{r.amount} <span className="text-xs text-slate-400">{r.asset}</span></span>
                    <span className="text-[10px] text-rose-500 font-bold tracking-tight">Tax: {r.tax}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2 px-2 py-1 bg-slate-100 rounded-lg w-fit border border-ivory-border">
                    <span className="material-symbols-outlined text-xs text-slate-500">fingerprint</span>
                    <span className="text-[10px] font-mono font-bold text-slate-600">{r.proofHash}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 min-w-[80px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-700 ${r.status === 'rejected' ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${(r.validations / r.requiredValidations) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-black text-slate-400">{r.validations}/{r.requiredValidations}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <button 
                    onClick={() => setSelectedRecord(r)}
                    className="p-2 hover:bg-white hover:shadow-md border border-transparent hover:border-ivory-border rounded-xl transition-all text-slate-400 hover:text-primary"
                  >
                    <span className="material-symbols-outlined">visibility</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Record Detail Overlay / Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-10 py-8 border-b border-ivory-border flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Chi tiết xác thực bản ghi</h2>
                <p className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-widest">{selectedRecord.id}</p>
              </div>
              <button onClick={() => setSelectedRecord(null)} className="size-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-10 grid grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Người yêu cầu</label>
                  <p className="text-lg font-black text-slate-800">{selectedRecord.creator}</p>
                  <p className="text-xs text-slate-500 font-medium">Vai trò hệ thống: {selectedRecord.creatorRole}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Thông tin giá trị</label>
                  <p className="text-3xl font-black text-primary tracking-tighter">{selectedRecord.amount} {selectedRecord.asset}</p>
                  <p className="text-xs text-slate-500 font-medium mt-1 italic">Thuế dự kiến: {selectedRecord.tax} {selectedRecord.asset}</p>
                </div>
              </div>

              <div className="bg-slate-50 border border-ivory-border rounded-[32px] p-6">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Trạng thái đa chữ ký</label>
                <div className="space-y-4">
                  {['V-001', 'V-002', 'V-003'].map((vid, idx) => (
                    <div key={vid} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`size-2 rounded-full ${selectedRecord.validatorIds.includes(vid) ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                        <span className="text-[11px] font-mono font-bold text-slate-600">Validator {vid}</span>
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-tighter ${selectedRecord.validatorIds.includes(vid) ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {selectedRecord.validatorIds.includes(vid) ? 'ĐÃ XÁC NHẬN' : 'CHỜ DUYỆT'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="col-span-2 bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden">
                <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-3">Evidence Hash Chain</label>
                <code className="text-[11px] font-mono text-white/60 block truncate">SHA256: {selectedRecord.proofHash}...9b0c...{selectedRecord.id.split('-')[1]}</code>
                <div className="mt-4 flex gap-2">
                  <div className="px-3 py-1 rounded-lg bg-white/10 text-[10px] font-black uppercase tracking-widest text-white/40">Immutable</div>
                  <div className="px-3 py-1 rounded-lg bg-white/10 text-[10px] font-black uppercase tracking-widest text-white/40">Audit Ready</div>
                </div>
              </div>
            </div>

            <div className="px-10 py-8 bg-ivory-surface/50 border-t border-ivory-border flex gap-4">
              <button 
                onClick={() => handleAction(selectedRecord.id, 'rejected')}
                className="flex-1 py-4 bg-white border border-rose-200 text-rose-600 font-black rounded-2xl shadow-sm hover:bg-rose-50 transition-colors uppercase tracking-widest text-xs"
              >
                Từ chối bản ghi
              </button>
              <button 
                onClick={() => handleAction(selectedRecord.id, 'validated')}
                className="flex-1 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
              >
                Xác thực Ngay
                <span className="material-symbols-outlined text-sm">verified</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidationCenter;
