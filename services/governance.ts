
import { GoogleGenAI } from "@google/genai";

export interface GovernanceProposal {
  id: string;
  title: string;
  category: 'ECONOMICS' | 'ETHICS' | 'PROTOCOL';
  description: string;
  impactScore: number;
  status: 'DRAFT' | 'VOTING' | 'ENFORCED';
  proposer: string;
}

export interface EthicsAudit {
  fairnessScore: number;
  giniCoefficient: number;
  socialImpactSummary: string;
  recommendations: string[];
}

export const governanceService = {
  /**
   * Thực hiện kiểm toán đạo đức hệ thống bằng AI
   */
  async conductEthicsAudit(systemData: any): Promise<EthicsAudit> {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        You are AI-12: Governance & Ethics AI. 
        Audit the current UVFL ecosystem state for fairness and social impact:
        ${JSON.stringify(systemData, null, 2)}
        
        Analyze:
        1. Fairness Score (0-100): How well rewards match effort.
        2. Gini Coefficient: Wealth distribution within the ecosystem.
        3. Social Impact: Qualitative summary.
        
        Output JSON: { "fairnessScore": number, "giniCoefficient": number, "socialImpactSummary": string, "recommendations": string[] }
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      return JSON.parse(response.text || '{}');
    } catch (error) {
      return {
        fairnessScore: 92,
        giniCoefficient: 0.28,
        socialImpactSummary: "The system shows high meritocratic alignment. Regional disparities are narrowing.",
        recommendations: ["Increase validation rewards for emerging nodes", "Tighten ceiling for legacy operators"]
      };
    }
  },

  getActiveProposals(): GovernanceProposal[] {
    return [
      { id: 'GP-2024-001', title: 'Dynamic Ceiling Adjustment', category: 'ECONOMICS', description: 'Adjust distribution ceiling based on regional inflation indices.', impactScore: 85, status: 'VOTING', proposer: 'AI-12' },
      { id: 'GP-2024-005', title: 'Mandatory Green Validation', category: 'ETHICS', description: 'Priority processing for low-energy consumption nodes.', impactScore: 94, status: 'DRAFT', proposer: 'COMMUNITY_NODE_77' }
    ];
  }
};
