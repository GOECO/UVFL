
/**
 * UVFL Global Compliance Engine
 * Provides automated tax and customs estimates.
 */

export interface TaxBreakdown {
  vat: number;
  duties: number;
  withholding: number;
  totalTax: number;
  currency: string;
  isEstimate: boolean;
}

export interface CountryTaxConfig {
  vatRate: number;
  dutyRate: number;
  withholdingRate: number;
  customsThreshold: number;
  currency: string;
}

export const complianceService = {
  /**
   * Calculates estimated taxes based on amount, asset type, and country config.
   * STRICT RULE: This is an estimate only.
   */
  calculateEstimate(
    amount: number, 
    assetType: string, 
    countryConfig: CountryTaxConfig,
    hsCode?: string
  ): TaxBreakdown {
    let vat = 0;
    let duties = 0;
    let withholding = 0;

    // Mapping Asset Type to Tax Category
    switch (assetType) {
      case 'USDT':
      case 'REWARD':
        // Digital assets often subject to VAT/GST on service fee or full value depending on jurisdiction
        vat = amount * (countryConfig.vatRate / 100);
        break;
      
      case 'GOLD':
        // Commodities usually trigger Customs Duties if crossing borders
        duties = amount > countryConfig.customsThreshold ? amount * (countryConfig.dutyRate / 100) : 0;
        vat = (amount + duties) * (countryConfig.vatRate / 100);
        break;
      
      case 'NATIONAL':
        // Fiat transactions often trigger withholding or corporate tax mappings
        withholding = amount * (countryConfig.withholdingRate / 100);
        break;
      
      default:
        vat = amount * (countryConfig.vatRate / 100);
    }

    // HS Code Override for Duties
    if (hsCode && assetType === 'GOLD') {
      // Simplified: specialized HS codes might have different duty rates
      // In a real system, we would look up the specific rate for this HS code
      const hsDutyRate = this.getHSDutyRate(hsCode);
      duties = amount * (hsDutyRate / 100);
    }

    return {
      vat,
      duties,
      withholding,
      totalTax: vat + duties + withholding,
      currency: countryConfig.currency,
      isEstimate: true
    };
  },

  getHSDutyRate(hsCode: string): number {
    // Mock HS code mapping
    const mapping: Record<string, number> = {
      '7108': 5, // Gold
      '8471': 0, // Computers
      '8517': 2, // Smartphones
    };
    return mapping[hsCode.substring(0, 4)] ?? 0;
  },

  getDisclaimer(locale: 'vi' | 'en'): string {
    return locale === 'vi' 
      ? "Đây là kết quả ước tính dựa trên cấu hình hệ thống hiện tại. Kết quả này không thay thế cho lời khuyên pháp lý hoặc thông báo thuế chính thức từ cơ quan chức năng. Vui lòng tham khảo quy định địa phương."
      : "This is an estimate based on current system configurations. This result does not replace legal advice or official tax notices from authorities. Please consult local regulations.";
  }
};
