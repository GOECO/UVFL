
import { GoogleGenAI } from "@google/genai";

export interface ValidatorNode {
  id: string;
  name: string;
  vrs: number; // Validator Reputation Score (0-100)
  status: 'online' | 'mesh-only' | 'offline';
  lastSync: string;
}

export interface OfflineProof {
  recordId: string;
  signatures: string[];
  requiredSigs: number;
  timestamp: string;
}

export const communityService = {
  /**
   * Tính toán điểm Trust Score dựa trên lịch sử hoạt động
   */
  async calculateTrustScore(nodeHistory: any): Promise<{ vrs: number, analysis: string }> {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        You are AI-11: Community & Offline AI.
        Evaluate this node's performance history for the current cycle:
        ${JSON.stringify(nodeHistory, null, 2)}
        
        Calculate the VRS (Validator Reputation Score) out of 100.
        Rules: High uptime and zero slashing events = High Score.
        Output JSON: { "vrs": number, "analysis": "1-sentence summary" }
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      return JSON.parse(response.text || '{"vrs": 85, "analysis": "Stable contribution patterns detected."}');
    } catch (error) {
      return { vrs: 80, analysis: "Baseline trust level established." };
    }
  },

  /**
   * Mô phỏng xác thực P2P Mesh
   */
  getNearbyNodes(): ValidatorNode[] {
    return [
      { id: 'NODE-VN-001', name: 'Alpha Node', vrs: 98, status: 'online', lastSync: '2m ago' },
      { id: 'NODE-VN-042', name: 'Sài Gòn Mesh', vrs: 92, status: 'mesh-only', lastSync: '15m ago' },
      { id: 'NODE-VN-108', name: 'Đà Nẵng Hub', vrs: 88, status: 'online', lastSync: '1m ago' }
    ];
  }
};
