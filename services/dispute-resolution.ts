
import { GoogleGenAI } from "@google/genai";

export type DisputeType = 'MATH_MISMATCH' | 'EVIDENCE_INVALID' | 'IDENTITY_FRAUD' | 'COMPLIANCE_BREACH';
export type DisputeStatus = 'OPEN' | 'IN_REVIEW' | 'RESOLVED' | 'VOIDED';

export interface Dispute {
  id: string;
  recordId: string;
  type: DisputeType;
  severity: 'MEDIUM' | 'HIGH' | 'CRITICAL';
  creatorId: string;
  amount: number;
  asset: string;
  flaggedBy: string; // ID của Agent (AI-13) hoặc User
  description: string;
  status: DisputeStatus;
  evidenceHashes: string[];
  createdAt: string;
  aiRecommendation?: string;
}

export interface ResolutionAction {
  disputeId: string;
  action: 'CONFIRM' | 'VOID' | 'ADJUST';
  reason: string;
  adjustmentAmount?: number;
  slashingTargetNodes: string[];
}

export const disputeService = {
  getDisputes(): Dispute[] {
    return [
      {
        id: 'DSP-8801', recordId: 'REC-0x81FA', type: 'MATH_MISMATCH', severity: 'CRITICAL',
        creatorId: 'USER-7782', amount: 1200, asset: 'USDT', flaggedBy: 'AI-13',
        description: 'Reconciliation error: Output payouts (1250) exceed input value (1200).',
        status: 'OPEN', evidenceHashes: ['sha256:7f8a...e91c', 'sha256:recalc_fail_v1'],
        createdAt: '2024-03-24 10:25'
      },
      {
        id: 'DSP-8802', recordId: 'REC-0x2B90', type: 'EVIDENCE_INVALID', severity: 'HIGH',
        creatorId: 'USER-1024', amount: 45.5, asset: 'GOLD', flaggedBy: 'Validator-09',
        description: 'Physical evidence image hash mismatch with uploaded metadata.',
        status: 'IN_REVIEW', evidenceHashes: ['sha256:a1b2...c3d4'],
        createdAt: '2024-03-24 11:00'
      }
    ];
  },

  async getAIRecommendation(dispute: Dispute): Promise<string> {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        You are AI-13: Security & Reconciliation Expert for UVFL Global.
        Review this dispute:
        Type: ${dispute.type}
        Description: ${dispute.description}
        Severity: ${dispute.severity}
        
        Analyze the risk. Should we VOID the record or ADJUST it? 
        If it's a math mismatch, suggest ADJUST. If fraud, suggest VOID.
        Output only a 1-sentence recommendation.
      `;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      return response.text || "Awaiting manual audit.";
    } catch (e) {
      return "Critical discrepancy detected. Recommended action: Suspension of payouts for this record.";
    }
  },

  calculateSlashing(vrs: number, severity: string): number {
    const penalty = severity === 'CRITICAL' ? 15 : severity === 'HIGH' ? 5 : 2;
    return Math.max(0, vrs - penalty);
  }
};
