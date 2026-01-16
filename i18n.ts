
export type Locale = 'vi' | 'en';

export const translations = {
  vi: {
    nav: {
      explorer: '5 Tiên đề UVFL',
      create: 'Tạo giá trị',
      dashboard: 'Bảng điều khiển',
      country: 'Cấu hình Quốc gia'
    },
    explorer: {
      title: 'Khám phá Tiên đề UVFL',
      desc: 'UVFL Global - Một hệ sinh thái phi tập trung để tạo và xác thực giá trị.',
      status: 'ĐANG HOẠT ĐỘNG',
      axioms: ['Tạo Giá Trị', 'Xác Thực', 'Minh Bạch', 'Niềm Tin', 'Thịnh Vượng']
    },
    landing: {
      hero: 'Định nghĩa lại giá trị',
      subHero: 'Thông qua sự minh bạch.',
      desc: 'UVFL Global sử dụng chu trình Tạo - Xác thực - Phân phối - Gia hạn để đảm bảo mọi giá trị được tạo ra đều được xác minh và phân phối công bằng.',
      features: [
        { title: "Đa tài sản", desc: "USDT, Vàng, Tiền tệ quốc gia và Token" },
        { title: "Tuân thủ", desc: "Tự động ước tính Thuế & Hải quan" },
        { title: "Quản trị", desc: "Không ghi đè thủ công. Thuần mã nguồn." },
        { title: "Nhật ký kiểm toán", desc: "Sổ cái chuỗi hash bất biến." }
      ]
    },
    create: {
      title: 'Tạo bản ghi giá trị',
      assetType: 'Loại tài sản',
      amount: 'Số lượng giá trị',
      taxEstimate: 'Ước tính thuế',
      disclaimer: '"Đây là ước tính dựa trên cấu hình. Hãy tham khảo các quy định địa phương."',
      submit: 'Gửi để xác thực'
    },
    dashboard: {
      title: 'Bảng điều khiển vận hành',
      welcome: 'Chào mừng trở lại',
      role: 'Vai trò hiện tại',
      kpi: 'KPI Chu kỳ',
      activity: 'Hoạt động gần đây',
      progress: 'Tiến trình chu kỳ',
      recalc: 'Tính toán lại vai trò trong 4 ngày tới. Duy trì KPI >90% để giữ vai trò Vận hành.',
    },
    country: {
      title: 'Cấu hình Hồ sơ Quốc gia',
      subtitle: 'Thiết lập các tham số pháp lý, thuế và quy tắc vận hành cho từng quốc gia.',
      sections: {
        general: 'Thông tin Chung',
        assets: 'Tài sản & Tiền tệ',
        tax: 'Cấu hình Thuế',
        customs: 'Hải quan & Thuế nhập khẩu',
        invoice: 'Hóa đơn & Chứng từ',
        compliance: 'Tuân thủ & Bảo mật',
        version: 'Phiên bản & Hiệu lực'
      },
      fields: {
        name: 'Tên Quốc gia',
        iso: 'Mã ISO',
        lang: 'Ngôn ngữ mặc định',
        timezone: 'Múi giờ',
        rounding: 'Quy tắc làm tròn',
        defaultAsset: 'Tài sản mặc định',
        currency: 'Mã tiền tệ nội tệ',
        allowedAssets: 'Tài sản được phép',
        goldUnit: 'Đơn vị vàng',
        vat: 'Thuế VAT/GST (%)',
        incomeTax: 'Thuế Thu nhập (%)',
        corporateTax: 'Thuế Doanh nghiệp (%)',
        withholding: 'Thuế Nhà thầu (%)',
        customsEnabled: 'Kích hoạt Hải quan',
        dutyRate: 'Thuế suất mặc định (%)',
        threshold: 'Ngưỡng De-minimis',
        einvoice: 'Yêu cầu hóa đơn điện tử',
        kyc: 'Cấp độ KYC/AML',
        residency: 'Yêu cầu lưu trữ dữ liệu tại chỗ',
        reward: 'Kích hoạt Reward Token',
        notes: 'Ghi chú',
        version: 'Phiên bản',
        effectiveFrom: 'Hiệu lực từ'
      }
    }
  },
  en: {
    nav: {
      explorer: '5 UVFL Axioms',
      create: 'Create Value',
      dashboard: 'Dashboard',
      country: 'Country Profile'
    },
    explorer: {
      title: 'Explore UVFL Axioms',
      desc: 'UVFL Global - A decentralized ecosystem to create and validate value.',
      status: 'SYSTEM ACTIVE',
      axioms: ['Value Creation', 'Validation', 'Transparency', 'Trust', 'Prosperity']
    },
    landing: {
      hero: 'Redefining Value',
      subHero: 'Through Transparency.',
      desc: 'UVFL Global uses the Create-Validate-Distribute-Renew cycle to ensure that every ounce of value created is verified and fairly distributed.',
      features: [
        { title: "Multi-Asset", desc: "USDT, Gold, Fiat, and Tokens" },
        { title: "Compliance", desc: "Automated Tax & Customs Estimation" },
        { title: "Governance", desc: "No manual overrides. Pure code." },
        { title: "Audit Log", desc: "Immutable hash-chained ledger." }
      ]
    },
    create: {
      title: 'Create Value Record',
      assetType: 'Asset Type',
      amount: 'Value Amount',
      taxEstimate: 'Tax Estimate',
      disclaimer: '"This is an estimate based on configuration. Consult local regulations."',
      submit: 'Submit for Validation'
    },
    dashboard: {
      title: 'Operator Dashboard',
      welcome: 'Welcome back',
      role: 'Current Role',
      kpi: 'Cycle KPI',
      activity: 'Recent Activity',
      progress: 'Cycle Progress',
      recalc: 'Next role recalculation in 4 days. Maintain 90%+ KPI to retain Operator status.',
    },
    country: {
      title: 'Country Profile Configuration',
      subtitle: 'Set legal parameters, taxes, and operational rules for specific jurisdictions.',
      sections: {
        general: 'General Information',
        assets: 'Assets & Currency',
        tax: 'Tax Configuration',
        customs: 'Customs & Duties',
        invoice: 'Invoicing & Documents',
        compliance: 'Compliance & Security',
        version: 'Version & Validity'
      },
      fields: {
        name: 'Country Name',
        iso: 'ISO Code',
        lang: 'Default Language',
        timezone: 'Timezone',
        rounding: 'Rounding Rule',
        defaultAsset: 'Default Asset Type',
        currency: 'National Currency Code',
        allowedAssets: 'Allowed Assets',
        goldUnit: 'Gold Unit',
        vat: 'VAT/GST Rate (%)',
        incomeTax: 'Income Tax Rate (%)',
        corporateTax: 'Corporate Tax Rate (%)',
        withholding: 'Withholding Rate (%)',
        customsEnabled: 'Customs Enabled',
        dutyRate: 'Default Duty Rate (%)',
        threshold: 'De-minimis Threshold',
        einvoice: 'E-invoice Required',
        kyc: 'KYC/AML Level',
        residency: 'Data Residency Required',
        reward: 'Reward Token Enabled',
        notes: 'Notes',
        version: 'Version',
        effectiveFrom: 'Effective From'
      }
    }
  }
};
