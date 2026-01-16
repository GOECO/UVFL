
import { GoogleGenAI } from "@google/genai";

export interface StandardSection {
  id: number;
  title: string;
  content: string;
}

export interface ChangeEntry {
  version: string;
  date: string;
  change: string;
  reason: string;
  impact: string;
}

export const standardService = {
  /**
   * AI-18: Tạo bản tóm tắt tiêu chuẩn cho đối tác Chính phủ
   */
  async generateGovSummary(version: string): Promise<string> {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        You are the UVFL Standards Editor. 
        Generate a 1-page executive summary for a Government Finance Minister regarding UVFL Standard ${version}.
        Focus on:
        - Sovereignty & Compliance.
        - Tax automation (AI-06).
        - Interoperability with Central Bank systems (AI-17).
        - Stability and non-manipulation (AI-12).
        
        Language: Vietnamese.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });

      return response.text || "Bản tóm tắt đang được xử lý...";
    } catch (error) {
      return "UVFL Standard v4.3: Hệ thống giá trị phi tập trung hỗ trợ chủ quyền dữ liệu và minh bạch tài chính toàn cầu.";
    }
  },

  getChangeLog(): ChangeEntry[] {
    return [
      { version: 'v4.3.0', date: '2024-03-25', change: 'Integration of Interoperability (AI-17) & Evolution (AI-18)', reason: 'Scale for global ERP systems and long-term system health.', impact: 'High: Enabled ISO-20022 and recursive rule tuning.' },
      { version: 'v4.2.0', date: '2024-01-10', change: 'Multi-Asset support & Tax Engine v2', reason: 'Gold and National Currency requirements.', impact: 'Medium: Migration of legacy records required.' },
      { version: 'v1.0.0', date: '2023-08-15', change: 'Initial Release', reason: 'Protocol Genesis', impact: 'Base' }
    ];
  },

  getStandardSections(): StandardSection[] {
    return [
      { id: 1, title: 'Định nghĩa & Phạm vi', content: 'Tiêu chuẩn này định nghĩa các giao thức tạo, xác thực và phân phối giá trị...' },
      { id: 2, title: 'Cơ chế Đồng thuận Mesh', content: 'Sử dụng P2P Mesh để xác thực ngoại tuyến trước khi đồng bộ Mainnet...' },
      { id: 13, title: 'Tính Tương thích Toàn cầu (AI-17)', content: 'Mọi giao dịch chuyển biên phải đóng gói theo chuẩn ISO-20022...' },
      { id: 14, title: 'Học máy & Tiến hóa (AI-18)', content: 'Quy tắc hệ thống tự điều chỉnh tham số dựa trên dữ liệu thực tế mỗi 12 chu kỳ...' }
    ];
  }
};
