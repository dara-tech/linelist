import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
});

export async function fetchHierarchy() {
  const { data } = await api.get('/hierarchy');
  return data.data;
}

export async function fetchMetadata() {
  const { data } = await api.get('/metadata');
  return data.data;
}

export async function fetchVCCTLineList(params) {
  const { data } = await api.get('/linelist/vcct', { params });
  return data;
}

export async function fetchVCCTRecordDetail(siteCode, vcctId) {
  const { data } = await api.get(`/linelist/vcct/${siteCode}/${vcctId}`);
  return data.data;
}

export async function fetchAnalysisMetrics(params) {
  const { data } = await api.get('/analysis/metrics', { params });
  return data.data;
}

export function getExcelExportUrl(params) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      query.append(k, v);
    }
  });
  return `/api/linelist/vcct-export/excel?${query.toString()}`;
}

export async function fetchArtVcctSummaryReport(params = {}) {
  const { data } = await api.get('/reports/art-vcct-summary', { params });
  return data;
}

export async function fetchArtVcctSiteReport(params = {}) {
  const { data } = await api.get('/reports/art-vcct-sites', { params });
  return data;
}

export function getArtVcctExcelExportUrl(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      query.append(k, v);
    }
  });
  return `/api/reports/art-vcct-summary/excel?${query.toString()}`;
}

export function getArtVcctSiteExcelExportUrl(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      query.append(k, v);
    }
  });
  return `/api/reports/art-vcct-sites/excel?${query.toString()}`;
}

export async function fetchDataQualitySummary(params = {}) {
  const { data } = await api.get('/data-quality/summary', { params });
  return data;
}

export async function fetchDataQualityConsistencyYoY(params = {}) {
  const { data } = await api.get('/data-quality/consistency/yoy', { params });
  return data;
}

export async function fetchDataQualityRecords(params = {}) {
  const { data } = await api.get('/data-quality/records', { params });
  return data;
}

export function getDataQualityExcelExportUrl(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      query.append(k, v);
    }
  });
  return `/api/data-quality/export/excel?${query.toString()}`;
}

export async function triggerFileDownload(url, filename) {
  const res = await fetch(url);
  if (!res.ok) {
    let errMsg = `Export failed with HTTP ${res.status}`;
    try {
      const errData = await res.json();
      if (errData?.error) errMsg = errData.error;
    } catch (_) {}
    throw new Error(errMsg);
  }
  const blob = await res.blob();
  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  if (filename) {
    link.setAttribute('download', filename);
  }
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    if (document.body.contains(link)) {
      document.body.removeChild(link);
    }
    window.URL.revokeObjectURL(blobUrl);
  }, 1000);
}

export async function fetchActiveArtCurrent(params = {}) {
  const { data } = await api.get('/reports/active-art-current', { params });
  return data;
}

export default api;

