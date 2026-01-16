
import { GoogleGenAI } from "@google/genai";

export type AlertSeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export interface SecuritySignal {
  id: string;
  type: 'FRAUD' | 'INTEGRITY' | 'IDENTITY';
  severity: AlertSeverity;
  description: string;
  timestamp: string;
  reconciliationDelta?: number;
}

export interface SystemIntegrityReport {
  overallScore: number;
  reconciliationStatus: 'BALANCED' | 'DISCREPANCY';
  signals: SecuritySignal[];
}

export const securityService = {
  /**
   * Thực hiện đối soát dòng tiền (Reconciliation)
   * Σ(Value) must equal Σ(Distributions) + Σ(Fees)
   */
  async reconcileFlow(batchData: any): Promise<{ isBalanced: boolean, delta: number, report: string }> {
    // Logic giả lập đối soát con số
    const inputAmount = batchData.totalCreated || 1000000;
    const outputAmount = batchData.totalDistributed || 999950; // Giả lập lệch 50 đơn vị
    const delta = inputAmount - outputAmount;
    
    return {
      isBalanced: delta === 0,
      delta: delta,
      report: delta === 0 ? "Ledger balanced perfectly." : `Discrepancy of ${delta} units detected between Creation and Distribution layers.`
    };
  },

  /**
   * AI-13 Quét tìm các hành vi bất thường và vi phạm bảo mật
   */
  async scanSecurityThreats(logs: any[]): Promise<SystemIntegrityReport> {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        You are AI-13: Security & Reconciliation AI. 
        Analyze these system logs for security breaches, identity fraud, and ledger discrepancies:
        ${JSON.stringify(logs, null, 2)}
        
        Focus on:
        - Wash trading patterns (User A -> User B -> User A)
        - Validation speed anomalies
        - Reconciliation errors (Money out > Money in)
        
        Output JSON: { "overallScore": number, "reconciliationStatus": "BALANCED"|"DISCREPANCY", "signals": [{id, type, severity, description, timestamp}] }
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      return JSON.parse(response.text || '{}');
    } catch (error) {
      // Fallback signals
      return {
        overallScore: 94,
        reconciliationStatus: 'DISCREPANCY',
        signals: [
          { id: 'SEC-001', type: 'INTEGRITY', severity: 'CRITICAL', description: 'Reconciliation mismatch detected in Block #148201. Delta: -50 USDT', timestamp: '2m ago' },
          { id: 'SEC-002', type: 'FRAUD', severity: 'WARNING', description: 'Possible Cluster Validation detected in VN-Node-Region-7', timestamp: '15m ago' }
        ]
      };
    }
  }
};
