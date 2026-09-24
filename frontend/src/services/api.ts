import axios from 'axios';
import {
  SystemStatus, PrivacyStatus, AnalysisResult,
  HistoryItem, DemoExample
} from '../types';

const API_BASE = '/api';

export const api = {
  getSystemStatus: async (): Promise<SystemStatus> => {
    const res = await axios.get(`${API_BASE}/system/status`);
    return res.data;
  },

  getPrivacyStatus: async (): Promise<PrivacyStatus> => {
    const res = await axios.get(`${API_BASE}/privacy/status`);
    return res.data;
  },

  toggleStorageSetting: async (enabled: boolean): Promise<any> => {
    const res = await axios.post(`${API_BASE}/privacy/toggle-storage?enabled=${enabled}`);
    return res.data;
  },

  analyzeMessage: async (content: string): Promise<AnalysisResult> => {
    const res = await axios.post(`${API_BASE}/analyze/message`, { content });
    return res.data;
  },

  analyzeUrl: async (url: string): Promise<AnalysisResult> => {
    const res = await axios.post(`${API_BASE}/analyze/url`, { url });
    return res.data;
  },

  analyzeImage: async (file: File): Promise<AnalysisResult> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axios.post(`${API_BASE}/analyze/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  getHistory: async (): Promise<HistoryItem[]> => {
    const res = await axios.get(`${API_BASE}/history`);
    return res.data;
  },

  getHistoryDetail: async (id: string): Promise<AnalysisResult> => {
    const res = await axios.get(`${API_BASE}/history/${id}`);
    return res.data;
  },

  deleteHistoryItem: async (id: string): Promise<any> => {
    const res = await axios.delete(`${API_BASE}/history/${id}`);
    return res.data;
  },

  clearHistory: async (): Promise<any> => {
    const res = await axios.delete(`${API_BASE}/history`);
    return res.data;
  },

  getDemoExamples: async (): Promise<DemoExample[]> => {
    const res = await axios.get(`${API_BASE}/demo/examples`);
    return res.data;
  },

  downloadPdfReport: async (id: string) => {
    const response = await axios.post(
      `${API_BASE}/export/pdf`,
      { analysis_id: id, format: 'pdf', include_evidence: true },
      { responseType: 'blob' }
    );
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SnapGuard_Security_Report_${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};
