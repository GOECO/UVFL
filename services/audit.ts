
import { GoogleGenAI } from "@google/genai";

export interface RiskIndicator {
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  label: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
}

export interface FraudSignal {
  id: string;
  type: string;
  probability: number;
  description: string;
  suggestedAction: string;
}

export const auditService = {
  /**
   * Phân tích một tập hợp các giao dịch để tìm điểm bất thường
   */
  async analyzeLedger(ledgerData: any[]): Promise<{ signals: FraudSignal[], integrityScore: number, report: string }> {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        You are AI-08: Audit & Risk AI for UVFL Global.
        Analyze the following transaction batch for signs of fraud or systemic risk:
        ${JSON.stringify(ledgerData, null, 2)}
        
        Look for:
        1. Wash Trading (same users trading back and forth).
        2. Sudden spikes in value creation without adequate proof.
        3. Geographical anomalies (impossible travel between transactions).
        4. Hash chain inconsistencies.
        
        Output format: JSON with:
        - "signals": Array of {id, type, probability (0-1), description, suggestedAction}
        - "integrityScore": Number 0-100
        - "report": A concise 2-sentence summary of the batch integrity.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const result = JSON.parse(response.text || '{"signals":[], "integrityScore": 100, "report": "Analysis pending."}');
      return result;
    } catch (error) {
      console.error("Audit Analysis failed:", error);
      return { 
        signals: [], 
        integrityScore: 0, 
        report: "AI Audit Core is offline. System operating on manual verification protocols." 
      };
    }
  }
};
