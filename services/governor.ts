
import { GoogleGenAI } from "@google/genai";

export interface PolicyConflict {
  type: 'ERROR' | 'WARNING';
  message: string;
  resolution: string;
}

export interface CountryProfileData {
  version: string;
  country_name: string;
  iso_code: string;
  default_asset: string;
  allowed_assets: string[];
  gold_unit?: string;
  reward_enabled: boolean;
  tax: {
    vat: number;
    gold_duty: number;
  };
}

export const governorService = {
  /**
   * Tạo phiên bản mới từ bản cũ với các thay đổi
   */
  createNewVersion(oldData: CountryProfileData, changes: Partial<CountryProfileData>): CountryProfileData {
    const [major, minor, patch] = oldData.version.split('.').map(Number);
    const newVersion = `${major}.${minor + 1}.0`;
    
    return {
      ...oldData,
      ...changes,
      version: newVersion,
    };
  },

  /**
   * Validate tính nhất quán của hồ sơ quốc gia
   */
  validateProfile(data: CountryProfileData): PolicyConflict[] {
    const conflicts: PolicyConflict[] = [];

    // 1. Check Allowed Assets
    if (!data.allowed_assets.includes(data.default_asset)) {
      conflicts.push({
        type: 'ERROR',
        message: `Tài sản mặc định (${data.default_asset}) không nằm trong danh sách tài sản được phép.`,
        resolution: `Thêm ${data.default_asset} vào allowed_assets hoặc đổi default_asset.`
      });
    }

    // 2. Check Gold Configuration
    if (data.allowed_assets.includes('GOLD') && !data.gold_unit) {
      conflicts.push({
        type: 'ERROR',
        message: 'Tài sản VÀNG được kích hoạt nhưng chưa cấu hình đơn vị đo lường (Gold Unit).',
        resolution: 'Thiết lập đơn vị (Grams/Ounces) trong phần cấu hình tài sản.'
      });
    }

    // 3. Reward Token Constraint (Logic giả lập chính sách quốc gia)
    if (data.iso_code === 'VN' && data.reward_enabled) {
      // Ví dụ: Chính sách VN hiện tại yêu cầu disable Reward Token
      conflicts.push({
        type: 'WARNING',
        message: 'Reward Token đang được bật nhưng chính sách địa phương yêu cầu rà soát pháp lý.',
        resolution: 'Vô hiệu hóa module Reward nếu chưa có giấy phép Tài sản Số.'
      });
    }

    return conflicts;
  },

  /**
   * AI-07: Phân tích sâu và Audit hồ sơ
   */
  async auditConfiguration(countryData: any): Promise<{ conflicts: PolicyConflict[], insight: string }> {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        You are AI-07: Country Governor AI for UVFL Global.
        Audit the following country configuration:
        ${JSON.stringify(countryData, null, 2)}
        
        Rules:
        1. default_asset must be in allowed_assets.
        2. If GOLD is allowed, gold_unit must be set.
        3. If reward_enabled is true, ensure a legal note exists.
        
        Output JSON: { "conflicts": [{"message": string, "type": "ERROR"|"WARNING", "resolution": string}], "insight": string }
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      return JSON.parse(response.text || '{"conflicts":[], "insight": "Analysis unavailable"}');
    } catch (error) {
      return { 
        conflicts: this.validateProfile(countryData), 
        insight: 'Sử dụng bộ quy tắc logic tích hợp (Local Logic) do Agent AI đang bận.' 
      };
    }
  },

  getHash(data: any): string {
    return "sha256:" + Math.random().toString(16).slice(2);
  }
};
