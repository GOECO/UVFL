
import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';

@Injectable()
export class LedgerService {
  private mockLedger: any[] = [];

  /**
   * Append-only implementation with RuleSet Metadata
   */
  async append(userId: string, action: string, data: any, rulesetVersion: string = '4.4.0') {
    const prevEntry = this.mockLedger[this.mockLedger.length - 1];
    const prevHash = prevEntry ? prevEntry.currentHash : '0'.repeat(64);
    
    // Đóng gói dữ liệu bao gồm cả phiên bản quy tắc áp dụng
    const entryData = JSON.stringify({ 
      userId, 
      action, 
      data, 
      prevHash, 
      rulesetVersion,
      systemTime: new Date().toISOString()
    });
    
    const currentHash = createHash('sha256').update(entryData).digest('hex');

    const newEntry = {
      id: this.mockLedger.length + 1,
      userId,
      action,
      rulesetVersion,
      data,
      prevHash,
      currentHash,
      timestamp: new Date(),
    };

    this.mockLedger.push(newEntry);
    console.log(`[Ledger v${rulesetVersion}] New Entry: ${currentHash.substring(0, 10)}...`);
    return newEntry;
  }

  /**
   * Kiểm tra tính toàn vẹn của chuỗi (Audit check)
   */
  async verifyChain() {
    for (let i = 1; i < this.mockLedger.length; i++) {
      const prev = this.mockLedger[i-1];
      const curr = this.mockLedger[i];
      if (curr.prevHash !== prev.currentHash) {
        console.error(`[Ledger] Discrepancy detected at index ${i}`);
        return false;
      }
    }
    return true;
  }

  getEntryByHash(hash: string) {
    return this.mockLedger.find(e => e.currentHash === hash);
  }
}
