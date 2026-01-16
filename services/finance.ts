
import { GoogleGenAI } from "@google/genai";

export type RoleLevel = 'F1_CREATOR' | 'F2_OPERATOR' | 'F3_GUIDE';

export interface PayoutStructure {
  f1: number;
  f2: number;
  f3: number;
  system: number;
  total: number;
}

export interface NodeFinanceState {
  role: RoleLevel;
  directKPI: number;
  networkKPI: number;
  validationScore: number;
  projectedPayout: number;
}

export const financeService = {
  /**
   * Tính toán ma trận phân bổ dựa trên số tầng hiện diện
   */
  getDistributionMatrix(hasF1: boolean, hasF2: boolean, hasF3: boolean): PayoutStructure {
    if (hasF1 && hasF2 && hasF3) return { f1: 7, f2: 8, f3: 13, system: 2, total: 30 };
    if (hasF1 && hasF2) return { f1: 11, f2: 16, f3: 0, system: 3, total: 30 };
    if (hasF1) return { f1: 25, f2: 0, f3: 0, system: 5, total: 30 };
    return { f1: 0, f2: 0, f3: 0, system: 30, total: 30 }; // Dự phòng
  },

  /**
   * AI-14: Phân tích và dự báo thăng tiến vai trò
   */
  async analyzePromotion(data: NodeFinanceState): Promise<{ decision: string, roadmap: string[] }> {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        You are AI-14: Role & Financial Structure AI.
        Analyze this node financial state:
        ${JSON.stringify(data, null, 2)}
        
        Decision criteria:
        - F3 to F2: Network KPI > 5000, Validation > 95%
        - F2 to F1: Direct KPI > 2000, 2 active cycles
        
        Output JSON: { "decision": "PROMOTED" | "MAINTAINED" | "DEMOTED", "roadmap": ["step 1", "step 2"] }
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      return JSON.parse(response.text || '{}');
    } catch (error) {
      return { 
        decision: 'MAINTAINED', 
        roadmap: ['Increase direct value generation', 'Improve validation turnaround time'] 
      };
    }
  }
};
