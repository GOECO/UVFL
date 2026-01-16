
export type Locale = 'vi' | 'en';

export const translations = {
  vi: {
    nav: {
      explorer: '5 Tiên đề UVFL',
      create: 'Tạo giá trị',
      dashboard: 'Bảng điều khiển',
      country: 'Cấu hình Quốc gia',
      validation: 'Trung tâm Xác thực',
      auditRisk: 'Kiểm toán & Rủi ro',
      aiCenter: 'Điều hành AI',
      network: 'Mạng lưới Nút',
      publicLedger: 'Sổ cái Công khai',
      rulebook: 'Quy tắc Tuân thủ',
      analytics: 'Báo cáo Hệ thống',
      mobilePreview: 'Bản xem trước Mobile'
    },
    cycle: {
      create: 'KHỞI TẠO',
      validate: 'XÁC THỰC',
      distribute: 'PHÂN PHỐI',
      renew: 'GIA HẠN',
      currentStage: 'Giai đoạn hiện tại'
    },
    roles: {
      f1: 'F1 - Nhà Sáng tạo (Creator)',
      f2: 'F2 - Nhà Vận hành (Operator)',
      f3: 'F3 - Nhà Dẫn dắt (Guide)',
      royalty: 'Thù lao Truyền thừa (Royalty)'
    },
    analytics: {
      title: 'Trung tâm Phân tích & KPI',
      subtitle: 'Theo dõi sức khỏe hệ sinh thái thông qua các chỉ số thời gian thực.',
      distribution: 'Phân bổ Giá trị Toàn cầu',
      efficiency: 'Hiệu suất Xác thực',
      regional: 'Hiệu suất theo Khu vực',
      cycles: 'So sánh Chu kỳ',
      forecast: 'Dự báo AI'
    },
    publicLedger: {
      title: 'Sổ cái Giá trị Công khai',
      subtitle: 'Dòng chảy giá trị toàn cầu được ẩn danh hóa. Minh bạch tuyệt đối, danh tính bảo mật.',
      anonymized: 'Đã ẩn danh',
      hashChain: 'Chuỗi băm bằng chứng'
    },
    rulebook: {
      title: 'Thư viện Quy tắc & Pháp lý',
      subtitle: 'Cơ sở toán học và pháp lý định hình mọi giao dịch trong hệ sinh thái.',
      section1: 'Định nghĩa Giá trị',
      section2: 'Thuật toán Phân phối',
      section3: 'Cơ chế Đồng thuận'
    },
    mobile: {
      qrScan: 'Quét mã xác thực',
      qrGen: 'Mã QR bằng chứng',
      offlineSync: 'Đợi đồng bộ',
      auditLog: 'Nhật ký băm',
      wallet: 'Ví giá trị',
      syncSuccess: 'Đồng bộ Ledger thành công',
      scanError: 'Mã QR không hợp lệ hoặc đã hết hạn'
    },
    network: {
      title: 'Mạng lưới Nút Toàn cầu',
      subtitle: 'Theo dõi trạng thái các Nút đồng thuận và độ trễ mạng Mainnet.',
      stats: { nodes: 'Nút hoạt động', latency: 'Độ trễ mạng', uptime: 'Thời gian trực tuyến' },
      liveFeed: 'Trạng thái Nút thời gian thực',
      search: 'Tìm ID Nút hoặc Vị trí...'
    },
    aiCenter: {
      title: 'Trung tâm Điều hành AI',
      subtitle: 'Hệ thống 18 chuyên gia AI hỗ trợ quản trị, vận hành và bảo mật toàn diện.',
      status: { active: 'ĐANG HOẠT ĐỘNG', learning: 'ĐANG HỌC', processing: 'ĐANG XỬ LÝ' },
      terminal: 'Nhật ký suy luận của các Agent',
      consult: 'Tham vấn chuyên gia',
      agents: {
        "AI-01": { name: "Product Architect", task: "Cấu trúc hệ thống & Luồng logic" },
        "AI-02": { name: "UX/UI Designer", task: "Thẩm mỹ & Trải nghiệm người dùng" },
        "AI-03": { name: "Flutter Engineer", task: "Logic ứng dụng di động" },
        "AI-04": { name: "Web Engineer", task: "Triển khai nền tảng Web" },
        "AI-05": { name: "Backend Rule Engineer", task: "Máy trạng thái & Quy tắc Core" },
        "AI-06": { name: "Compliance (Tax & Customs)", task: "Tính toán Thuế & Hải quan" },
        "AI-07": { name: "Country Governor AI", task: "Địa phương hóa & Quy tắc quốc gia" },
        "AI-08": { name: "Audit & Risk AI", task: "Chuỗi Hash & Chống gian lận" },
        "AI-09": { name: "Data & Analytics AI", task: "Theo dõi KPI & Dự báo" },
        "AI-10": { name: "Ops & Deployment AI", task: "Hạ tầng & Trạng thái hệ thống" },
        "AI-11": { name: "Community & Offline AI", task: "Đồng bộ hóa & Mạng lưới" },
        "AI-12": { name: "Governance & Ethics AI", task: "Công bằng & Quản trị phi tập trung" },
        "AI-13": { name: "Security & Reconciliation AI", task: "Bảo mật, Xác thực & Đối soát Ledger" },
        "AI-14": { name: "Role & Financial Structure", task: "Mô hình thăng tiến & Cấu trúc thù lao" },
        "AI-15": { name: "Data Sovereignty & Ownership", task: "Chủ quyền dữ liệu & Quyền sở hữu số" },
        "AI-16": { name: "Growth & Adoption", task: "Chiến lược mở rộng & Thu hút người dùng" },
        "AI-17": { name: "Interoperability & Standards", task: "Tương thích hệ thống & Chuẩn hóa ISO" },
        "AI-18": { name: "Evolution & System Learning", task: "Tự tiến hóa giao thức & Học máy hệ thống" }
      }
    },
    explorer: {
      title: 'Khám phá Tiên đề UVFL',
      desc: 'UVFL Global - Một hệ sinh thái phi tập trung để tạo và xác thực giá trị.',
      status: 'ĐANG HOẠT ĐỘNG',
      axioms: ['Tạo Giá Trị', 'Xác Thực', 'Minh Bạch', 'Niềm Tin', 'Thịnh Vượng'],
      share: 'Chia sẻ',
      shareInternal: 'Lên Mạng lưới',
      shareInternalDesc: 'Phát sóng tới tất cả các nút UVFL Global',
      shareCopy: 'Sao chép Liên kết',
      shareCopyDesc: 'Lưu liên kết vạn năng vào bộ nhớ tạm',
      shareSystem: 'Chia sẻ Hệ thống',
      shareSystemDesc: 'Mở bảng chia sẻ mặc định của thiết bị',
      recentBroadcasts: 'Phát sóng Mạng lưới gần đây',
      copied: 'Đã sao chép liên kết!',
      sharedInternal: 'Đã phát sóng lên Mạng lưới UVFL!'
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
      recalcTitle: 'Tính toán lại vai trò',
      threshold: 'Ngưỡng duy trì',
      timeRemaining: 'Thời gian còn lại',
      statusSafe: 'AN TOÀN',
      statusRisk: 'RỦI RO',
      nextRole: 'Vai trò dự kiến',
    },
    validation: {
      title: 'Trung tâm Xác thực',
      subtitle: 'Quản lý quy trình kiểm chứng đa tầng và phê duyệt bản ghi giá trị.',
      stats: { pending: 'Chờ xử lý', validated: 'Đã xác thực', rejected: 'Từ chối' },
      filters: { status: 'Trạng thái', date: 'Ngày tạo', validator: 'Người xác thực', search: 'Tìm ID bản ghi...' },
      table: { record: 'Bản ghi', creator: 'Người tạo', value: 'Giá trị', proof: 'Bằng chứng', progress: 'Tiến độ', actions: 'Thao tác' }
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
        reward: 'Hệ thống Reward Token',
        notes: 'Ghi chú chính sách',
        version: 'Phiên bản',
        effectiveFrom: 'Có hiệu lực từ'
      }
    }
  },
  en: {
    nav: {
      explorer: '5 UVFL Axioms',
      create: 'Create Value',
      dashboard: 'Dashboard',
      country: 'Country Profile',
      validation: 'Validation Center',
      auditRisk: 'Audit & Risk',
      aiCenter: 'AI Command',
      network: 'Node Network',
      publicLedger: 'Public Ledger',
      rulebook: 'Compliance Rules',
      analytics: 'System Reports',
      mobilePreview: 'Mobile Preview'
    },
    cycle: {
      create: 'CREATE',
      validate: 'VALIDATE',
      distribute: 'DISTRIBUTE',
      renew: 'RENEW',
      currentStage: 'Current Stage'
    },
    roles: {
      f1: 'F1 - Creator',
      f2: 'F2 - Operator',
      f3: 'F3 - Guide',
      royalty: 'Royalty Payout'
    },
    analytics: {
      title: 'Analytics & KPI Center',
      subtitle: 'Monitor ecosystem health through real-time metrics.',
      distribution: 'Global Value Distribution',
      efficiency: 'Validation Efficiency',
      regional: 'Regional Performance',
      cycles: 'Cycle Comparison',
      forecast: 'AI Forecast'
    },
    publicLedger: {
      title: 'Public Value Ledger',
      subtitle: 'Anonymized global value flow. Total transparency, secure identity.',
      anonymized: 'Anonymized',
      hashChain: 'Proof Hash Chain'
    },
    rulebook: {
      title: 'Rules & Legal Library',
      subtitle: 'Mathematical and legal foundations shaping every transaction in the ecosystem.',
      section1: 'Value Definition',
      section2: 'Distribution Algorithm',
      section3: 'Consensus Mechanism'
    },
    mobile: {
      qrScan: 'Scan Validation QR',
      qrGen: 'Evidence QR Code',
      offlineSync: 'Pending Sync',
      auditLog: 'Hash Ledger',
      wallet: 'Value Wallet',
      syncSuccess: 'Ledger Sync Successful',
      scanError: 'Invalid or expired QR code'
    },
    network: {
      title: 'Global Node Network',
      subtitle: 'Monitor consensus node status and Mainnet network latency.',
      stats: { nodes: 'Active Nodes', latency: 'Net Latency', uptime: 'System Uptime' },
      liveFeed: 'Live Node Status',
      search: 'Search Node ID or Location...'
    },
    aiCenter: {
      title: 'AI Command Center',
      subtitle: 'A system of 18 AI specialists supporting governance, operation, and security.',
      status: { active: 'ACTIVE', learning: 'LEARNING', processing: 'PROCESSING' },
      terminal: 'Agent Inference Logs',
      consult: 'Consult Expert',
      agents: {
        "AI-01": { name: "Product Architect", task: "System Structure & Logic Flow" },
        "AI-02": { name: "UX/UI Designer", task: "Aesthetics & User Experience" },
        "AI-03": { name: "Flutter Engineer", task: "Mobile App Logic" },
        "AI-04": { name: "Web Engineer", task: "Web Platform Implementation" },
        "AI-05": { name: "Backend Rule Engineer", task: "State Machines & Core Rules" },
        "AI-06": { name: "Compliance (Tax & Customs)", task: "Tax & Customs Calculations" },
        "AI-07": { name: "Country Governor AI", task: "Localization & National Rules" },
        "AI-08": { name: "Audit & Risk AI", task: "Hash Chains & Fraud Prevention" },
        "AI-09": { name: "Data & Analytics AI", task: "KPI Monitoring & Forecasting" },
        "AI-10": { name: "Ops & Deployment AI", task: "Infrastructure & System Health" },
        "AI-11": { name: "Community & Offline AI", task: "Sync & Network" },
        "AI-12": { name: "Governance & Ethics AI", task: "Fairness & Decentralized Governance" },
        "AI-13": { name: "Security & Reconciliation AI", task: "Security, Auth & Ledger Reconciliation" },
        "AI-14": { name: "Role & Financial Structure", task: "Promotion Models & Payout Structures" },
        "AI-15": { name: "Data Sovereignty & Ownership", task: "Data Sovereignty & Digital Ownership" },
        "AI-16": { name: "Growth & Adoption", task: "Expansion Strategies & User Acquisition" },
        "AI-17": { name: "Interoperability & Standards", task: "System Compatibility & ISO Standardization" },
        "AI-18": { name: "Evolution & System Learning", task: "Protocol Self-Evolution & System ML" }
      }
    },
    explorer: {
      title: 'Explore UVFL Axioms',
      desc: 'UVFL Global - A decentralized ecosystem to create and validate value.',
      status: 'SYSTEM ACTIVE',
      axioms: ['Value Creation', 'Validation', 'Transparency', 'Trust', 'Prosperity'],
      share: 'Share',
      shareInternal: 'To Network',
      shareInternalDesc: 'Broadcast to all UVFL Global nodes',
      shareCopy: 'Copy Link',
      shareCopyDesc: 'Save universal link to your clipboard',
      shareSystem: 'System Share',
      shareSystemDesc: 'Open native device share options',
      recentBroadcasts: 'Recent Network Broadcasts',
      copied: 'Link copied!',
      sharedInternal: 'Shared to UVFL Global network!'
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
      recalcTitle: 'Role Recalculation',
      threshold: 'Maintenance Threshold',
      timeRemaining: 'Time Remaining',
      statusSafe: 'SAFE',
      statusRisk: 'AT RISK',
      nextRole: 'Projected Role',
    },
    validation: {
      title: 'Validation Center',
      subtitle: 'Manage multi-layer verification processes and approve value records.',
      stats: { pending: 'Pending', validated: 'Validated', rejected: 'Rejected' },
      filters: { status: 'Status', date: 'Creation Date', validator: 'Validator', search: 'Search Record ID...' },
      table: { record: 'Record', creator: 'Creator', value: 'Value', proof: 'Proof', progress: 'Progress', actions: 'Actions' }
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
        reward: 'Reward Token System',
        notes: 'Policy Notes',
        version: 'Version',
        effectiveFrom: 'Effective From'
      }
    }
  }
};
