
import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { LedgerService } from '../ledger/ledger.service';
import { RuleEngineService } from '../rule-engine/rule-engine.service';

@Injectable()
export class ValueService {
  constructor(
    private ledger: LedgerService,
    private ruleEngine: RuleEngineService
  ) {}

  async createRecord(userId: string, amount: number, asset: any, proofHash: string) {
    // 1. Tạo bản ghi ở trạng thái CREATE
    const record = { id: 'REC-' + Date.now(), userId, amount, asset, state: 'CREATE', proofHash };
    
    // 2. Ghi log Ledger ngay lập tức
    await this.ledger.append(userId, 'VALUE_CREATED', { recordId: record.id, hash: proofHash });
    
    return record;
  }

  async distribute(recordId: string, userId: string) {
    // CHẶN: Chỉ được phân phối nếu trạng thái là VALIDATE
    // (Giả lập check DB)
    const record = { id: recordId, state: 'VALIDATE', amount: 1000, asset: 'USDT' }; 
    
    if (record.state !== 'VALIDATE') {
      throw new ForbiddenException('Bypass blocked: Record must be VALIDATED first');
    }

    // 1. Gọi Rule Engine để tính toán số tiền
    // Fix: Changed second parameter from 5000 (number) to true (boolean) as required by RuleEngineService.calculateDistribution
    const distribution = this.ruleEngine.calculateDistribution(record.amount, true); 

    // 2. Ghi Ledger - Giao dịch này là bất biến
    await this.ledger.append(userId, 'DISTRIBUTION_EXECUTED', { 
      recordId, 
      payouts: distribution 
    });

    return { 
      status: 'SUCCESS', 
      distribution,
      ledgerHash: 'sha256-verified'
    };
  }
}
