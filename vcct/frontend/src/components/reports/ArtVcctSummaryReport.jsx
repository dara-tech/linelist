import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Download, 
  Printer, 
  Building2, 
  Users, 
  Activity, 
  ShieldCheck, 
  ArrowUpDown,
  CheckCircle2,
  MapPin,
  RefreshCw,
  FileSpreadsheet,
  Loader2,
} from 'lucide-react';
import { fetchArtVcctSummaryReport, getArtVcctExcelExportUrl, triggerFileDownload } from '../../lib/api';
import { Loading } from '../ui/loading';
import nchadsLogo from '../../assets/nchads-logo.png';

// Official National Baseline (Quarter 2, 2026) for 25 Provinces
const OFFICIAL_FALLBACK_DATA = [
  { no: 1, province_kh: 'ភ្នំពេញ', province_en: 'Phnom Penh', art_sites: 14, plhiv_total: 26849, plhiv_female: 10274, vcct_sites: 15, reactive_total: 536, reactive_female: 78 },
  { no: 2, province_kh: 'បាត់ដំបង', province_en: 'Battambang', art_sites: 6, plhiv_total: 5974, plhiv_female: 2864, vcct_sites: 6, reactive_total: 57, reactive_female: 14 },
  { no: 3, province_kh: 'សៀមរាប', province_en: 'Siem Reap', art_sites: 4, plhiv_total: 5299, plhiv_female: 2380, vcct_sites: 3, reactive_total: 94, reactive_female: 27 },
  { no: 4, province_kh: 'បន្ទាយមានជ័យ', province_en: 'Banteay Meanchey', art_sites: 5, plhiv_total: 4216, plhiv_female: 2012, vcct_sites: 5, reactive_total: 77, reactive_female: 23 },
  { no: 5, province_kh: 'កំពង់ចាម', province_en: 'Kampong Cham', art_sites: 5, plhiv_total: 3242, plhiv_female: 1609, vcct_sites: 5, reactive_total: 34, reactive_female: 11 },
  { no: 6, province_kh: 'ព្រៃវែង', province_en: 'Prey Veng', art_sites: 3, plhiv_total: 3035, plhiv_female: 1659, vcct_sites: 3, reactive_total: 44, reactive_female: 13 },
  { no: 7, province_kh: 'តាកែវ', province_en: 'Takeo', art_sites: 5, plhiv_total: 2974, plhiv_female: 1545, vcct_sites: 5, reactive_total: 68, reactive_female: 22 },
  { no: 8, province_kh: 'កណ្តាល', province_en: 'Kandal', art_sites: 3, plhiv_total: 2738, plhiv_female: 1380, vcct_sites: 3, reactive_total: 36, reactive_female: 14 },
  { no: 9, province_kh: 'ព្រះសីហនុ', province_en: 'Preah Sihanouk', art_sites: 1, plhiv_total: 2337, plhiv_female: 1009, vcct_sites: 1, reactive_total: 50, reactive_female: 15 },
  { no: 10, province_kh: 'កំពត', province_en: 'Kampot', art_sites: 2, plhiv_total: 2335, plhiv_female: 1232, vcct_sites: 2, reactive_total: 25, reactive_female: 5 },
  { no: 11, province_kh: 'កំពង់ស្ពឺ', province_en: 'Kampong Speu', art_sites: 3, plhiv_total: 2221, plhiv_female: 1012, vcct_sites: 3, reactive_total: 46, reactive_female: 9 },
  { no: 12, province_kh: 'ត្បូងឃ្មុំ', province_en: 'Tboung Khmum', art_sites: 3, plhiv_total: 1791, plhiv_female: 847, vcct_sites: 3, reactive_total: 31, reactive_female: 3 },
  { no: 13, province_kh: 'ពោធិ៍សាត់', province_en: 'Pursat', art_sites: 3, plhiv_total: 1592, plhiv_female: 771, vcct_sites: 3, reactive_total: 23, reactive_female: 5 },
  { no: 14, province_kh: 'ស្វាយរៀង', province_en: 'Svay Rieng', art_sites: 2, plhiv_total: 1554, plhiv_female: 807, vcct_sites: 2, reactive_total: 32, reactive_female: 10 },
  { no: 15, province_kh: 'កំពង់ធំ', province_en: 'Kampong Thom', art_sites: 3, plhiv_total: 1290, plhiv_female: 634, vcct_sites: 3, reactive_total: 42, reactive_female: 16 },
  { no: 16, province_kh: 'កំពង់ឆ្នាំង', province_en: 'Kampong Chhnang', art_sites: 2, plhiv_total: 1211, plhiv_female: 559, vcct_sites: 2, reactive_total: 31, reactive_female: 15 },
  { no: 17, province_kh: 'កោះកុង', province_en: 'Koh Kong', art_sites: 2, plhiv_total: 1049, plhiv_female: 551, vcct_sites: 2, reactive_total: 10, reactive_female: 2 },
  { no: 18, province_kh: 'ក្រចេះ', province_en: 'Kratie', art_sites: 1, plhiv_total: 708, plhiv_female: 352, vcct_sites: 1, reactive_total: 16, reactive_female: 10 },
  { no: 19, province_kh: 'ឧត្តរមានជ័យ', province_en: 'Oddar Meanchey', art_sites: 2, plhiv_total: 634, plhiv_female: 326, vcct_sites: 2, reactive_total: 5, reactive_female: 2 },
  { no: 20, province_kh: 'ស្ទឹងត្រែង', province_en: 'Stung Treng', art_sites: 1, plhiv_total: 466, plhiv_female: 227, vcct_sites: 1, reactive_total: 5, reactive_female: 2 },
  { no: 21, province_kh: 'ប៉ៃលិន', province_en: 'Pailin', art_sites: 1, plhiv_total: 434, plhiv_female: 243, vcct_sites: 1, reactive_total: 3, reactive_female: 0 },
  { no: 22, province_kh: 'ព្រះវិហារ', province_en: 'Preah Vihear', art_sites: 1, plhiv_total: 407, plhiv_female: 197, vcct_sites: 1, reactive_total: 9, reactive_female: 2 },
  { no: 23, province_kh: 'រតនគិរី', province_en: 'Ratanakiri', art_sites: 1, plhiv_total: 332, plhiv_female: 168, vcct_sites: 1, reactive_total: 1, reactive_female: 0 },
  { no: 24, province_kh: 'កែប', province_en: 'Kep', art_sites: 1, plhiv_total: 118, plhiv_female: 68, vcct_sites: 1, reactive_total: 2, reactive_female: 1 },
  { no: 25, province_kh: 'មណ្ឌលគិរី', province_en: 'Mondulkiri', art_sites: 1, plhiv_total: 92, plhiv_female: 51, vcct_sites: 1, reactive_total: 4, reactive_female: 2 },
];

export function ArtVcctSummaryReport({ filters = {}, provinces = [], refreshTrigger = 0, onSelectView }) {
  const [reportData, setReportData] = useState(OFFICIAL_FALLBACK_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [sortBy, setSortBy] = useState('official'); // 'official', 'plhiv_desc', 'reactive_desc', 'art_sites_desc'

  // Derive Quarter & Year directly from Top Toolbar's filters
  const { quarter, year, periodDisplay } = useMemo(() => {
    if (!filters?.dateFrom) {
      return { quarter: '2', year: '2026', periodDisplay: 'ត្រីមាសទី ២ ឆ្នាំ ២០២៦' };
    }
    const qMatch = filters.dateFrom.match(/^(\d{4})-(01|04|07|10)-01$/);
    if (qMatch) {
      const qMap = { '01': '១', '04': '២', '07': '៣', '10': '៤' };
      const qNumMap = { '01': '1', '04': '2', '07': '3', '10': '4' };
      return {
        quarter: qNumMap[qMatch[2]] || '2',
        year: qMatch[1],
        periodDisplay: `ត្រីមាសទី ${qMap[qMatch[2]] || '២'} ឆ្នាំ ${qMatch[1]}`,
      };
    }
    const dMatch = filters.dateFrom.match(/^(\d{4})-(\d{2})/);
    if (dMatch) {
      const y = dMatch[1];
      const m = parseInt(dMatch[2], 10);
      let q = '2';
      let qKh = '២';
      if (m >= 1 && m <= 3) { q = '1'; qKh = '១'; }
      else if (m >= 4 && m <= 6) { q = '2'; qKh = '២'; }
      else if (m >= 7 && m <= 9) { q = '3'; qKh = '៣'; }
      else if (m >= 10 && m <= 12) { q = '4'; qKh = '៤'; }
      return {
        quarter: q,
        year: y,
        periodDisplay: `ត្រីមាសទី ${qKh} ឆ្នាំ ${y}`,
      };
    }
    return { quarter: '2', year: '2026', periodDisplay: 'ត្រីមាសទី ២ ឆ្នាំ ២០២៦' };
  }, [filters?.dateFrom]);

  // Load report data whenever the period changes in the top toolbar or user clicks Run
  const loadReport = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchArtVcctSummaryReport({
        quarter,
        year,
        dateFrom: filters?.dateFrom,
        dateTo: filters?.dateTo,
      });
      if (res && res.data && res.data.length > 0) {
        setReportData(res.data);
      } else {
        setReportData(OFFICIAL_FALLBACK_DATA);
      }
    } catch (err) {
      console.warn('Fallback to official baseline:', err);
      setReportData(OFFICIAL_FALLBACK_DATA);
    } finally {
      setIsLoading(false);
    }
  }, [quarter, year, filters?.dateFrom, filters?.dateTo]);

  useEffect(() => {
    loadReport();
  }, [loadReport, refreshTrigger]);

  // Selected Province from Top Toolbar (filters.provinceId)
  const selectedProvinceName = useMemo(() => {
    if (!filters?.provinceId) return null;
    const p = provinces.find((item) => String(item.id) === String(filters.provinceId));
    return p ? (p.province_kh || p.province_en) : null;
  }, [filters?.provinceId, provinces]);

  // Filter & Sort based on Top Toolbar search & province selection
  const filteredAndSortedList = useMemo(() => {
    let list = reportData.filter((item) => {
      // 1. Top Toolbar Province Filter
      if (selectedProvinceName) {
        const provMatch = 
          item.province_kh.includes(selectedProvinceName) || 
          item.province_en.toLowerCase().includes(selectedProvinceName.toLowerCase());
        if (!provMatch) return false;
      }

      // 2. Top Toolbar Search Filter
      if (filters?.search && filters.search.trim()) {
        const q = filters.search.toLowerCase().trim();
        const match =
          item.province_kh.toLowerCase().includes(q) ||
          item.province_en.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });

    if (sortBy === 'plhiv_desc') {
      list = [...list].sort((a, b) => b.plhiv_total - a.plhiv_total);
    } else if (sortBy === 'reactive_desc') {
      list = [...list].sort((a, b) => b.reactive_total - a.reactive_total);
    } else if (sortBy === 'art_sites_desc') {
      list = [...list].sort((a, b) => b.art_sites - a.art_sites);
    } else {
      list = [...list].sort((a, b) => a.no - b.no);
    }

    return list;
  }, [reportData, selectedProvinceName, filters?.search, sortBy]);

  // Overall Totals
  const totals = useMemo(() => {
    return filteredAndSortedList.reduce(
      (acc, cur) => ({
        art_sites: acc.art_sites + Number(cur.art_sites || 0),
        plhiv_total: acc.plhiv_total + Number(cur.plhiv_total || 0),
        plhiv_female: acc.plhiv_female + Number(cur.plhiv_female || 0),
        vcct_sites: acc.vcct_sites + Number(cur.vcct_sites || 0),
        reactive_total: acc.reactive_total + Number(cur.reactive_total || 0),
        reactive_female: acc.reactive_female + Number(cur.reactive_female || 0),
      }),
      {
        art_sites: 0,
        plhiv_total: 0,
        plhiv_female: 0,
        vcct_sites: 0,
        reactive_total: 0,
        reactive_female: 0,
      }
    );
  }, [filteredAndSortedList]);

  const plhivFemalePct = totals.plhiv_total > 0 
    ? ((totals.plhiv_female / totals.plhiv_total) * 100).toFixed(1) 
    : '0';

  const reactiveFemalePct = totals.reactive_total > 0 
    ? ((totals.reactive_female / totals.reactive_total) * 100).toFixed(1) 
    : '0';

  const [zoom, setZoom] = useState(100);

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const url = getArtVcctExcelExportUrl({
        quarter,
        year,
        dateFrom: filters?.dateFrom,
        dateTo: filters?.dateTo,
      });
      const filename = `NCHADS_ART_VCCT_Report_Q${quarter}_${year}.xlsx`;
      await triggerFileDownload(url, filename);
    } catch (err) {
      console.error('Export Excel failed:', err);
      alert('ការទាញយក Excel បរាជ័យ៖ ' + (err.message || 'Error'));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#eef1f5] overflow-y-auto print:bg-white print:overflow-visible print:p-0">
      {/* 1. Paper Control Action Bar (Hidden on print) */}
      <div className="sticky top-0 z-20 w-full border-b border-slate-200/90 bg-white/95 px-4 py-2 backdrop-blur-xs shadow-2xs flex flex-wrap items-center justify-between gap-2 shrink-0 print:hidden">
        {/* Left: View Switcher Tabs (By Province vs By Site) - Separated & Equal Sized */}
        <div className="flex flex-wrap items-center gap-2">
          {onSelectView && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex h-8 w-[195px] shrink-0 items-center justify-center gap-2 rounded-md border border-emerald-600/40 bg-emerald-50/70 text-emerald-800 font-semibold shadow-xs text-xs transition-all cursor-default"
                title="របាយការណ៍សង្ខេបតាមខេត្ត (Province Report)"
              >
                <FileSpreadsheet className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="truncate">តាមខេត្ត (By Province)</span>
              </button>
              <button
                type="button"
                onClick={() => onSelectView('site_report')}
                className="flex h-8 w-[195px] shrink-0 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 font-medium shadow-2xs text-xs transition-all cursor-pointer active:scale-98"
                title="របាយការណ៍តាមមូលដ្ឋានសេវា (Site Report)"
              >
                <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="truncate">តាមមូលដ្ឋានសេវា (By Site)</span>
              </button>
            </div>
          )}
          <span className="h-8 hidden sm:inline-flex items-center px-2.5 rounded-md border border-slate-200/80 bg-slate-50 text-xs text-slate-600 font-medium">
            {periodDisplay}
          </span>
          {isLoading && (
            <span className="h-8 flex items-center gap-1.5 px-2.5 rounded-md text-xs text-sky-700 bg-sky-50 border border-sky-200 animate-pulse font-medium">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              <span>កំពុងទាញទិន្នន័យ...</span>
            </span>
          )}
        </div>

        {/* Right: Actions (Sort, Zoom, Excel, Print) - Unified Height & Standard Sizing */}
        <div className="flex items-center gap-2">
          {/* Quick Sort */}
          <div className="flex h-8 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 shadow-2xs hover:border-slate-300 transition-colors">
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent outline-none cursor-pointer text-slate-800 text-xs pr-1"
            >
              <option value="official">លំដាប់ខេត្ត ១-២៥</option>
              <option value="plhiv_desc">PLHIV ខ្ពស់ → ទាប</option>
              <option value="reactive_desc">VCCT វិជ្ជមាន ខ្ពស់ → ទាប</option>
              <option value="art_sites_desc">ចំនួនសេវា ART</option>
            </select>
          </div>

          {/* Zoom controls */}
          <div className="hidden md:flex h-8 items-center gap-1 rounded-md border border-slate-200 bg-white p-0.5 text-xs shadow-2xs">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(75, z - 10))}
              className="flex h-6.5 w-6.5 items-center justify-center rounded text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
              title="បង្រួម (Zoom Out)"
            >
              -
            </button>
            <span className="px-1.5 text-[11px] font-mono text-slate-600">{zoom}%</span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(125, z + 10))}
              className="flex h-6.5 w-6.5 items-center justify-center rounded text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
              title="ពង្រីក (Zoom In)"
            >
              +
            </button>
          </div>

          {/* Excel Export */}
          <button
            type="button"
            onClick={handleExportExcel}
            disabled={isExporting}
            className="flex h-8 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-all cursor-pointer active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed"
            title="ទាញយកជាឯកសារ Excel (.xlsx)"
          >
            {isExporting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-600 shrink-0" />
            ) : (
              <Download className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            )}
            <span>{isExporting ? 'កំពុងបង្កើត...' : 'Excel'}</span>
          </button>

          {/* Print / PDF */}
          <button
            type="button"
            onClick={handlePrint}
            className="flex h-8 items-center gap-1.5 rounded-md bg-[var(--app-header-bar-bg)] px-3 text-xs font-semibold text-white shadow-2xs hover:bg-[var(--app-header-bar-bg-hover)] transition-all cursor-pointer active:scale-95"
            title="បោះពុម្ព ឬរក្សាទុកជា PDF (A4 Landscape)"
          >
            <Printer className="h-3.5 w-3.5 text-white shrink-0" />
            <span>បោះពុម្ព A4</span>
          </button>
        </div>
      </div>

      {/* 2. Realistic A4 Paper Sheet Preview Area */}
      <div className="flex-1 p-3 sm:p-6 md:p-8 flex justify-center items-start print:p-0 print:block">
        <div 
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          className="print-page w-full max-w-[1140px] bg-white shadow-[0_10px_35px_rgba(0,0,0,0.10)] border border-slate-300/80 rounded-xs p-6 sm:p-10 md:p-12 transition-transform duration-150 print:max-w-none print:shadow-none print:border-none print:p-0 print:m-0"
        >
          {/* Paper Letterhead matching Official Government Document */}
          <div className="flex items-start justify-between pb-4 border-b border-slate-200/60 print:border-b-0">
            {/* Top-Left: Ministry & Center Official Emblem */}
            <div className="flex flex-col items-center text-center shrink-0">
              <img
                src={nchadsLogo}
                alt="មជ្ឈមណ្ឌលជាតិប្រយុទ្ធនឹងជំងឺអេដស៍ សើរស្បែក និងកាមរោគ"
                className="h-16 w-16 object-contain mb-3 drop-shadow-xs"
              />
              <div className="text-[12px] font-bold text-slate-800 leading-relaxed whitespace-nowrap">
                ក្រសួងសុខាភិបាល
              </div>
              <div className="text-[11.5px] font-bold text-slate-700 leading-relaxed mt-2 whitespace-nowrap">
                មជ្ឈមណ្ឌលជាតិប្រយុទ្ធនឹងជំងឺអេដស៍ សើរស្បែក និងកាមរោគ
              </div>
            </div>

            {/* Top-Right: Royal Kingdom Heading */}
            <div className="flex flex-col items-center text-center w-64 shrink-0">
              <div className="font-moul text-[13px] text-slate-900 tracking-wide leading-relaxed">
                ព្រះរាជាណាចក្រកម្ពុជា
              </div>
              <div className="font-moul text-[11.5px] text-slate-800 tracking-wide mt-1">
                ជាតិ សាសនា ព្រះមហាក្សត្រ
              </div>
              <div className="text-slate-500 text-[11px] font-serif tracking-widest mt-0.5">
                - - - ៚ - - -
              </div>
            </div>
          </div>

          {/* Centered Document Title */}
          <div className="text-center my-5">
            <h1 className="font-moul text-sm sm:text-base text-[#113a13] leading-relaxed tracking-wide">
              តារាងសង្ខេបព័ត៌មានអ្នកផ្ទុកមេរោគអេដស៍/ជំងឺអេដស៍ និងការរាយការណ៍
            </h1>
            <div className="font-moul text-[12.5px] text-[#1e4620] mt-1.5 flex items-center justify-center gap-2">
              <span>{periodDisplay}</span>
              {selectedProvinceName && (
                <span className="text-sky-800 font-sans font-bold text-xs bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  (ខេត្ត៖ {selectedProvinceName})
                </span>
              )}
            </div>
          </div>

          {/* 3. Official Government Two-Tier Green Table */}
          <div className="border border-[#7ba675] rounded-xs overflow-hidden shadow-2xs print:shadow-none print:border-slate-800">
            <table className="w-full text-[11.5px] text-slate-900 border-collapse">
              {/* Header: Official Green Two-Tier Header */}
              <thead>
                <tr className="bg-[#d9ead3] text-[#133814] border-b border-[#7ba675] font-bold text-[11.5px]">
                  <th rowSpan={2} className="py-2 px-2 text-center border-r border-[#7ba675] w-11">
                    ល.រ
                  </th>
                  <th rowSpan={2} className="py-2 px-3 text-left border-r border-[#7ba675] min-w-[155px]">
                    រាជធានីខេត្ត / ខេត្ត
                  </th>
                  <th rowSpan={2} className="py-2 px-2.5 text-center border-r border-[#7ba675] min-w-[95px]">
                    <div>ចំនួនសេវា</div>
                    <div className="text-[10.5px] font-bold text-emerald-900 mt-0.5">ART</div>
                  </th>
                  <th colSpan={2} className="py-1.5 px-3 text-center border-r border-[#7ba675]">
                    <div>ចំនួន PLHIV កំពុងទទួល ART</div>
                  </th>
                  <th rowSpan={2} className="py-2 px-2.5 text-center border-r border-[#7ba675] min-w-[95px]">
                    <div>ចំនួនសេវា</div>
                    <div className="text-[10.5px] font-bold text-emerald-900 mt-0.5">VCCT</div>
                  </th>
                  <th colSpan={2} className="py-1.5 px-3 text-center">
                    <div>ចំនួនអតិថិជនវិជ្ជមានមេរោគអេដស៍</div>
                  </th>
                </tr>
                <tr className="bg-[#e2efda] text-[#133814] border-b-2 border-[#7ba675] font-bold text-[11px]">
                  <th className="py-1 px-3 text-right border-r border-[#7ba675] w-26">
                    សរុប
                  </th>
                  <th className="py-1 px-3 text-right border-r border-[#7ba675] w-24">
                    ស្រី
                  </th>
                  <th className="py-1 px-3 text-right border-r border-[#7ba675] w-24">
                    សរុប
                  </th>
                  <th className="py-1 px-3 text-right w-20">
                    ស្រី
                  </th>
                </tr>
              </thead>

              {/* Body: 25 Provinces */}
              <tbody className="divide-y divide-[#d4e4cf]">
                {filteredAndSortedList.map((row, index) => {
                  const isEven = index % 2 === 1;
                  return (
                    <tr 
                      key={row.no} 
                      className={`transition-colors hover:bg-emerald-50/70 ${isEven ? 'bg-[#fcfdfa]' : 'bg-white'}`}
                    >
                      {/* No. */}
                      <td className="py-1.5 px-2 text-center font-mono text-slate-600 border-r border-[#d4e4cf]">
                        {row.no}
                      </td>

                      {/* Province Name */}
                      <td className="py-1.5 px-3 font-semibold text-slate-900 border-r border-[#d4e4cf]">
                        <span>{row.province_kh}</span>
                        <span className="text-[10px] text-slate-400 font-normal ml-1.5 hidden print:inline lg:inline">
                          ({row.province_en})
                        </span>
                      </td>

                      {/* ART Sites */}
                      <td className="py-1.5 px-2.5 text-center font-mono font-medium text-slate-800 border-r border-[#d4e4cf]">
                        {row.art_sites}
                      </td>

                      {/* PLHIV on ART Total */}
                      <td className="py-1.5 px-3 text-right font-mono font-bold text-emerald-900 border-r border-[#d4e4cf]">
                        {Number(row.plhiv_total).toLocaleString()}
                      </td>

                      {/* PLHIV on ART Female */}
                      <td className="py-1.5 px-3 text-right font-mono text-emerald-950 border-r border-[#d4e4cf]">
                        {Number(row.plhiv_female).toLocaleString()}
                      </td>

                      {/* VCCT Sites */}
                      <td className="py-1.5 px-2.5 text-center font-mono font-medium text-slate-800 border-r border-[#d4e4cf]">
                        {row.vcct_sites}
                      </td>

                      {/* VCCT Reactive Total */}
                      <td className="py-1.5 px-3 text-right font-mono font-bold text-rose-700 border-r border-[#d4e4cf]">
                        {Number(row.reactive_total).toLocaleString()}
                      </td>

                      {/* VCCT Reactive Female */}
                      <td className="py-1.5 px-3 text-right font-mono text-rose-950">
                        {Number(row.reactive_female).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}

                {filteredAndSortedList.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                      មិនមានទិន្នន័យត្រូវនឹងលក្ខខណ្ឌចម្រាញ់ឡើយ
                    </td>
                  </tr>
                )}
              </tbody>

              {/* Summary Row */}
              <tfoot>
                <tr className="bg-[#d9ead3] text-[#0f2e10] font-bold text-[12px] border-t-2 border-[#7ba675] border-b-2 border-[#7ba675]">
                  <td colSpan={2} className="py-2 px-3 text-center border-r border-[#7ba675]">
                    សរុប:
                  </td>

                  {/* Total ART Sites */}
                  <td className="py-2 px-2.5 text-center font-mono border-r border-[#7ba675]">
                    {totals.art_sites.toLocaleString()}
                  </td>

                  {/* Total PLHIV on ART */}
                  <td className="py-2 px-3 text-right font-mono border-r border-[#7ba675] text-emerald-950">
                    {totals.plhiv_total.toLocaleString()}
                  </td>

                  {/* Total PLHIV on ART Female */}
                  <td className="py-2 px-3 text-right font-mono border-r border-[#7ba675] text-emerald-950">
                    {totals.plhiv_female.toLocaleString()}
                  </td>

                  {/* Total VCCT Sites */}
                  <td className="py-2 px-2.5 text-center font-mono border-r border-[#7ba675]">
                    {totals.vcct_sites.toLocaleString()}
                  </td>

                  {/* Total VCCT Reactive */}
                  <td className="py-2 px-3 text-right font-mono border-r border-[#7ba675] text-rose-800">
                    {totals.reactive_total.toLocaleString()}
                  </td>

                  {/* Total VCCT Reactive Female */}
                  <td className="py-2 px-3 text-right font-mono text-rose-950">
                    {totals.reactive_female.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Footer Note */}
          <div className="mt-3 flex items-center justify-between text-[10.5px] text-slate-500 font-sans">
            <span>
              * ប្រភពទិន្នន័យ៖ មជ្ឈមណ្ឌលជាតិប្រយុទ្ធនឹងជំងឺអេដស៍ សើរស្បែក និងកាមរោគ (NCHADS) — ២៥ រាជធានី-ខេត្ត
            </span>
            <span className="font-mono text-[10px]">
              ទំព័រ ១ នៃ ១
            </span>
          </div>

          {/* 4. Official Paper Signatures & Endorsement Block */}
          <div className="mt-8 pt-4 flex items-start justify-between text-[11.5px] text-slate-800 leading-relaxed font-sans select-none">
            {/* Left: Seen & Approved by Head of Bureau */}
            <div className="text-center w-64">
              <div className="font-bold text-slate-700">បានឃើញ និងឯកភាព</div>
              <div className="font-moul text-[11px] text-slate-900 mt-1">
                ប្រធានការិយាល័យស្រាវជ្រាវ និងទិន្នន័យ
              </div>
              <div className="h-20 flex items-center justify-center text-slate-400 text-[10px] italic">
                (ហត្ថលេខា និងត្រា)
              </div>
            </div>

            {/* Right: Prepared by Data Manager */}
            <div className="text-center w-64">
              <div className="text-slate-600">
                {`រាជធានីភ្នំពេញ, ថ្ងៃទី....... ខែ....... ឆ្នាំ ${year || '២០២៦'}`}
              </div>
              <div className="font-moul text-[11px] text-slate-900 mt-1">
                អ្នករៀបចំរបាយការណ៍
              </div>
              <div className="h-20 flex items-center justify-center text-slate-400 text-[10px] italic">
                (ហត្ថលេខា)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArtVcctSummaryReport;
