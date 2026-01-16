
export type Locale = 'vi' | 'en';

export const translations = {
  vi: {
    nav: {
      explorer: '5 Tiên đề UVFL',
      create: 'Tạo Giá Trị',
      dashboard: 'Bảng Điều Khiển',
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
      currentStage: 'Giai đoạn Hiện tại'
    },
    roles: {
      f1: 'F1 - Nhà Sáng tạo (Creator)',
      f2: 'F2 - Nhà Vận hành (Operator)',
      f3: 'F3 - Nhà Dẫn dắt (Guide)',
      royalty: 'Thù lao Truyền thừa (Royalty)'
    },
    analytics: {
      title: 'Trung tâm Phân tích & KPI',
      subtitle: 'Giám sát sức khỏe hệ sinh thái thông qua các chỉ số hạch toán thời gian thực.',
      distribution: 'Phân bổ Giá trị Toàn cầu',
      efficiency: 'Hiệu suất Xác thực',
      regional: 'Hiệu suất theo Khu vực',
      cycles: 'So sánh Chu kỳ',
      forecast: 'Dự báo AI'
    },
    publicLedger: {
      title: 'Sổ cái Giá trị Công khai',
      subtitle: 'Dòng chảy giá trị toàn cầu đã được ẩn danh hóa. Minh bạch tuyệt đối, danh tính bảo mật.',
      anonymized: 'Đã ẩn danh',
      hashChain: 'Chuỗi Băm Bằng chứng'
    },
    rulebook: {
      title: 'Thư viện Quy tắc & Pháp lý',
      subtitle: 'Cơ sở toán học và pháp lý định hình mọi giao dịch trong hệ sinh thái.',
      section1: 'Định nghĩa Giá trị',
      section2: 'Thuật toán Phân phối',
      section3: 'Cơ chế Đồng thuận'
    },
    mobile: {
      qrScan: 'Quét mã Xác thực',
      qrGen: 'Mã QR Bằng chứng',
      offlineSync: 'Đợi đồng bộ',
      auditLog: 'Sổ cái Băm',
      wallet: 'Ví Giá trị',
      syncSuccess: 'Đồng bộ Sổ cái thành công',
      scanError: 'Mã QR không hợp lệ hoặc đã hết hạn'
    },
    network: {
      title: 'Mạng lưới Nút Toàn cầu',
      subtitle: 'Theo dõi trạng thái các nút đồng thuận và độ trễ mạng Mainnet.',
      stats: { nodes: 'Nút Hoạt động', latency: 'Độ trễ Mạng', uptime: 'Thời gian Trực tuyến' },
      liveFeed: 'Trạng thái Nút thời gian thực',
      search: 'Tìm ID Nút hoặc Vị trí...'
    },
    aiCenter: {
      title: 'Trung tâm Điều hành AI',
      subtitle: 'Hệ thống 18 chuyên gia AI hỗ trợ quản trị, vận hành và bảo mật toàn diện.',
      status: { active: 'ĐANG HOẠT ĐỘNG', learning: 'ĐANG HỌC', processing: 'ĐANG XỬ LÝ' },
      terminal: 'Nhật ký suy luận của các Agent',
      consult: 'Tham vấn Chuyên gia',
      agents: {
        "AI-01": { name: "Kiến trúc sư Sản phẩm", task: "Cấu trúc hệ thống & Luồng logic" },
        "AI-02": { name: "Thiết kế UX/UI", task: "Thẩm mỹ & Trải nghiệm người dùng" },
        "AI-03": { name: "Kỹ sư Flutter", task: "Logic ứng dụng di động" },
        "AI-04": { name: "Kỹ sư Web", task: "Triển khai nền tảng Web" },
        "AI-05": { name: "Kỹ sư Quy tắc Backend", task: "Máy trạng thái & Quy tắc Cốt lõi" },
        "AI-06": { name: "Tuân thủ (Thuế & Hải quan)", task: "Tính toán Thuế & Hải quan" },
        "AI-07": { name: "Thống đốc Quốc gia AI", task: "Địa phương hóa & Quy tắc quốc gia" },
        "AI-08": { name: "Kiểm toán & Rủi ro AI", task: "Chuỗi Hash & Chống gian lận" },
        "AI-09": { name: "Dữ liệu & Phân tích AI", task: "Theo dõi KPI & Dự báo" },
        "AI-10": { name: "Vận hành & Triển khai AI", task: "Hạ tầng & Trạng thái hệ thống" },
        "AI-11": { name: "Cộng đồng & Ngoại tuyến AI", task: "Đồng bộ hóa & Mạng lưới" },
        "AI-12": { name: "Quản trị & Đạo đức AI", task: "Công bằng & Quản trị phi tập trung" },
        "AI-13": { name: "Bảo mật & Đối soát AI", task: "Bảo mật, Xác thực & Đối soát Sổ cái" },
        "AI-14": { name: "Vai trò & Cấu trúc Tài chính", task: "Mô hình thăng tiến & Cấu trúc thù lao" },
        "AI-15": { name: "Chủ quyền & Sở hữu Dữ liệu", task: "Chủ quyền dữ liệu & Quyền sở hữu số" },
        "AI-16": { name: "Tăng trưởng & Tiếp nhận", task: "Chiến lược mở rộng & Thu hút người dùng" },
        "AI-17": { name: "Khả năng Tương thích & Tiêu chuẩn", task: "Tương thích hệ thống & Chuẩn hóa ISO" },
        "AI-18": { name: "Tiến hóa & Học máy Hệ thống", task: "Tự tiến hóa giao thức & Học máy hệ thống" }
      }
    },
    explorer: {
      title: 'Khám phá Tiên đề UVFL',
      desc: 'UVFL Global - Hệ sinh thái phi tập trung để tạo và xác thực giá trị.',
      status: 'HỆ THỐNG HOẠT ĐỘNG',
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
      hero: 'Định nghĩa lại Giá trị',
      subHero: 'Thông qua sự Minh bạch.',
      desc: 'UVFL Global sử dụng chu trình Tạo - Xác thực - Phân phối - Gia hạn để đảm bảo mọi giá trị được tạo ra đều được xác minh và phân phối công bằng.',
      features: [
        { title: "Đa tài sản", desc: "USDT, Vàng, Tiền tệ Quốc gia và Token Thưởng" },
        { title: "Tuân thủ", desc: "Tự động ước tính Thuế & Hải quan" },
        { title: "Quản trị", desc: "Không ghi đè thủ công. Vận hành thuần mã nguồn." },
        { title: "Nhật ký Kiểm toán", desc: "Sổ cái chuỗi băm bất biến." }
      ]
    },
    create: {
      title: 'Tạo Bản ghi Giá trị',
      assetType: 'Loại Tài sản',
      amount: 'Số lượng Giá trị',
      taxEstimate: 'Ước tính Thuế',
      disclaimer: '"Đây là ước tính dựa trên cấu hình. Hãy tham khảo các quy định địa phương."',
      submit: 'Gửi để Xác thực'
    },
    dashboard: {
      title: 'Bảng Điều khiển Vận hành',
      welcome: 'Chào mừng trở lại',
      role: 'Vai trò Hiện tại',
      kpi: 'KPI Chu kỳ',
      activity: 'Hoạt động Gần đây',
      progress: 'Tiến trình Chu kỳ',
      recalc: 'Tính toán lại vai trò trong 4 ngày tới. Duy trì KPI >90% để giữ vai trò Vận hành.',
      recalcTitle: 'Tái tính toán Vai trò',
      threshold: 'Ngưỡng Duy trì',
      timeRemaining: 'Thời gian Còn lại',
      statusSafe: 'AN TOÀN',
      statusRisk: 'RỦI RO',
      nextRole: 'Vai trò Dự kiến',
    },
    validation: {
      title: 'Trung tâm Xác thực',
      subtitle: 'Quản lý quy trình kiểm chứng đa tầng và phê duyệt bản ghi giá trị.',
      stats: { pending: 'Chờ xử lý', validated: 'Đã xác thực', rejected: 'Từ chối' },
      filters: { status: 'Trạng thái', date: 'Ngày tạo', validator: 'Người xác thực', search: 'Tìm ID bản ghi...' },
      table: { record: 'Bản ghi', creator: 'Người tạo', value: 'Giá trị', proof: 'Bằng chứng', progress: 'Tiến độ', actions: 'Thao tác' }
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
    }
    // ... matching English translation
  }
};
