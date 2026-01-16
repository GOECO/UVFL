
export type DataCategory = 'PRIVATE' | 'DERIVED' | 'PUBLIC';

export interface UserDataEntry {
  id: string;
  category: DataCategory;
  description: string;
  storage: 'TEE' | 'LOCAL_MESH' | 'MAINNET_HASH';
  owner: 'USER' | 'PROTOCOL';
  value: any;
}

export interface ExportLog {
  id: string;
  actor: string;
  userId: string;
  format: 'JSON' | 'CSV';
  purpose: string;
  timestamp: string;
}

export const dataRightsService = {
  getUserData(userId: string): UserDataEntry[] {
    return [
      { id: 'D-001', category: 'PRIVATE', description: 'Raw KYC Documents', storage: 'TEE', owner: 'USER', value: { name: 'Nguyen Van A', id_num: '********123' } },
      { id: 'D-002', category: 'PRIVATE', description: 'Evidence Uploads (Images/Files)', storage: 'LOCAL_MESH', owner: 'USER', value: '344 files' },
      { id: 'D-003', category: 'DERIVED', description: 'Cycle KPI Performance', storage: 'MAINNET_HASH', owner: 'PROTOCOL', value: '94.5%' },
      { id: 'D-004', category: 'DERIVED', description: 'Tax Estimate History', storage: 'LOCAL_MESH', owner: 'USER', value: '12 records' },
      { id: 'D-005', category: 'PUBLIC', description: 'Node Network Contribution', storage: 'MAINNET_HASH', owner: 'PROTOCOL', value: '1.2M V' },
    ];
  },

  getAuditLogs(): ExportLog[] {
    return [
      { id: 'LOG-881', actor: 'USER-7782', userId: 'USER-7782', format: 'JSON', purpose: 'Personal Data Backup', timestamp: '2024-03-24 10:15' },
      { id: 'LOG-882', actor: 'ADMIN-CORE', userId: 'USER-7782', format: 'CSV', purpose: 'Legal Audit Request', timestamp: '2024-03-25 09:00' },
    ];
  },

  async requestExport(userId: string, format: 'JSON' | 'CSV', purpose: string): Promise<string> {
    // Logic thực tế sẽ gọi backend để nén dữ liệu
    const logId = 'LOG-' + Math.random().toString(16).slice(2, 5).toUpperCase();
    console.log(`[DataRights] Export triggered for ${userId}. Format: ${format}. Purpose: ${purpose}`);
    return logId;
  },

  maskPII(data: any): any {
    const masked = { ...data };
    if (masked.name) masked.name = masked.name.split(' ').map((n: string) => n[0] + '***').join(' ');
    if (masked.id_num) masked.id_num = '***-***-***';
    return masked;
  }
};
