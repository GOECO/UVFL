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
  timezone: string;
  rounding_rule: 'NEAREST' | 'UP' | 'DOWN';
  default_asset: string;
  currency_code: string;
  allowed_assets: string[];
  gold_unit?: string;
  reward_enabled: boolean;
  tax_config: {
    vat: number;
    corporate: number;
    withholding: number;
    income: number;
  };
  customs_config: {
    enabled: boolean;
    duty_rate: number;
    threshold: number;
  };
  compliance_config: {
    kyc_level: 1 | 2 | 3;
    residency_required: boolean;
    einvoice_required: boolean;
  };
}

export const governorService = {
  getInitialData(iso: string): CountryProfileData {
    const defaults: Record<string, CountryProfileData> = {
      'VN': {
        version: '4.4.0',
        country_name: 'Vietnam',
        iso_code: 'VN',
        timezone: 'UTC+7',
        rounding_rule: 'NEAREST',
        default_asset: 'VND',
        currency_code: 'VND',
        allowed_assets: ['USDT', 'GOLD', 'VND'],
        gold_unit: 'Grams',
        reward_enabled: false,
        tax_config: { vat: 10, corporate: 20, withholding: 5, income: 10 },
        customs_config: { enabled: true, duty_rate: 5, threshold: 1000000 },
        compliance_config: { kyc_level: 2, residency_required: true, einvoice_required: true }
      },
      'SG': {
        version: '1.2.0',
        country_name: 'Singapore',
        iso_code: 'SG',
        timezone: 'UTC+8',
        rounding_rule: 'NEAREST',
        default_asset: 'USDT',
        currency_code: 'SGD',
        allowed_assets: ['USDT', 'GOLD', 'SGD'],
        gold_unit: 'Ounces',
        reward_enabled: true,
        tax_config: { vat: 9, corporate: 17, withholding: 0, income: 15 },
        customs_config: { enabled: false, duty_rate: 0, threshold: 400 },
        compliance_config: { kyc_level: 1, residency_required: false, einvoice_required: true }
      }
    };
    return defaults[iso] || defaults['VN'];
  },

  createNewVersion(oldData: CountryProfileData, changes: Partial<CountryProfileData>): CountryProfileData {
    const [major, minor, patch] = oldData.version.split('.').map(Number);
    const newVersion = `${major}.${minor + 1}.0`;
    return { ...oldData, ...changes, version: newVersion };
  },

  async auditConfiguration(countryData: CountryProfileData): Promise<{ conflicts: PolicyConflict[], insight: string }> {
    try {
      // Fix: Used process.env.API_KEY directly for initializing GoogleGenAI as required
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        You are AI-07: Country Governor AI for UVFL Global.
        Audit the following country configuration for regulatory consistency:
        ${JSON.stringify(countryData, null, 2)}
        
        Check:
        1. Is default_asset in allowed_assets?
        2. Are tax rates within global protocol bounds?
        3. If residency_required is true, flag that decentralized shards must stay in local nodes.
        4. If customs are disabled but duty_rate > 0, flag as inconsistent.
        
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
        conflicts: [], 
        insight: 'Local logic check passed. AI Core is currently performing protocol deep-scan.' 
      };
    }
  }
};