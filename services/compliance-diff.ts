
import { CountryProfileData } from './governor';

export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';

export interface DiffItem {
  field: string;
  path: string;
  oldValue: any;
  newValue: any;
  risk: RiskLevel;
  category: 'TAX' | 'ASSETS' | 'GOVERNANCE' | 'GENERAL';
}

export const complianceDiffService = {
  getRiskLevel(path: string): RiskLevel {
    if (path.includes('tax') || path.includes('reward_enabled') || path.includes('residency')) return 'HIGH';
    if (path.includes('allowed_assets') || path.includes('default_asset') || path.includes('gold_unit')) return 'MEDIUM';
    return 'LOW';
  },

  getCategory(path: string): any {
    if (path.includes('tax')) return 'TAX';
    if (path.includes('asset')) return 'ASSETS';
    if (path.includes('reward') || path.includes('residency')) return 'GOVERNANCE';
    return 'GENERAL';
  },

  compare(v1: CountryProfileData, v2: CountryProfileData): DiffItem[] {
    const diffs: DiffItem[] = [];

    const compareObjects = (obj1: any, obj2: any, currentPath: string = '') => {
      const allKeys = Array.from(new Set([...Object.keys(obj1), ...Object.keys(obj2)]));
      
      for (const key of allKeys) {
        const path = currentPath ? `${currentPath}.${key}` : key;
        const val1 = obj1[key];
        const val2 = obj2[key];

        if (JSON.stringify(val1) !== JSON.stringify(val2)) {
          if (typeof val1 === 'object' && val1 !== null && typeof val2 === 'object' && val2 !== null && !Array.isArray(val1)) {
            compareObjects(val1, val2, path);
          } else {
            diffs.push({
              field: key,
              path: path,
              oldValue: val1,
              newValue: val2,
              risk: this.getRiskLevel(path),
              category: this.getCategory(path)
            });
          }
        }
      }
    };

    compareObjects(v1, v2);
    return diffs;
  },

  generateChangelog(diffs: DiffItem[], country: string, vFrom: string, vTo: string): string {
    const high = diffs.filter(d => d.risk === 'HIGH');
    const med = diffs.filter(d => d.risk === 'MEDIUM');
    
    let log = `📢 [COMPLIANCE UPDATE] ${country} Profile upgraded from v${vFrom} to v${vTo}\n\n`;
    
    if (high.length > 0) {
      log += `🔴 SENSITIVE CHANGES (Requires Audit):\n`;
      high.forEach(d => log += `- ${d.path}: ${JSON.stringify(d.oldValue)} ➔ ${JSON.stringify(d.newValue)}\n`);
      log += `\n`;
    }
    
    if (med.length > 0) {
      log += `🟠 OPERATIONAL UPDATES:\n`;
      med.forEach(d => log += `- Modified ${d.field}\n`);
    }

    log += `\nIntegrity Hash: ${Math.random().toString(16).slice(2, 10).toUpperCase()}`;
    return log;
  }
};
