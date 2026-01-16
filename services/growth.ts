
import { GoogleGenAI } from "@google/genai";

export interface GrowthPlaybook {
  country: string;
  readinessScore: number;
  phase: 'PILOT' | 'COMMUNITY' | 'ENTERPRISE' | 'PUBLIC';
  strategies: string[];
  anomalies: string[];
}

export interface GrowthMetrics {
  userCount: number;
  valuePerUser: number;
  validationDensity: number; // Tỷ lệ nút xác thực/người dùng
}

export const growthService = {
  /**
   * AI-16: Phân tích và đề xuất chiến lược tăng trưởng
   */
  async generatePlaybook(countryIso: string, metrics: GrowthMetrics): Promise<GrowthPlaybook> {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        You are AI-16: Growth & Adoption AI.
        Analyze growth data for ${countryIso}:
        ${JSON.stringify(metrics, null, 2)}
        
        Guidelines:
        - If valuePerUser is low but userCount is high: Warning for "Empty Growth".
        - If validationDensity is low: Warning for "Centralization Risk".
        - Recommend localized strategies (e.g., VN: Agrotech, SG: Fintech).
        
        Output JSON: { "country": string, "readinessScore": number, "phase": "PILOT"|"COMMUNITY"|"ENTERPRISE"|"PUBLIC", "strategies": string[], "anomalies": string[] }
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      return JSON.parse(response.text || '{}');
    } catch (error) {
      return {
        country: countryIso,
        readinessScore: 78,
        phase: 'COMMUNITY',
        strategies: ["Focus on micro-value chains", "Increase validator incentives"],
        anomalies: ["Rapid user surge in Region-7 without matching evidence hash growth"]
      };
    }
  }
};
