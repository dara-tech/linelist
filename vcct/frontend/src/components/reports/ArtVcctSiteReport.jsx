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
  RefreshCw,
  Search,
  FileSpreadsheet,
  X,
  Loader2,
} from 'lucide-react';
import { fetchArtVcctSiteReport, getArtVcctSiteExcelExportUrl, triggerFileDownload } from '../../lib/api';
import { Loading } from '../ui/loading';
import nchadsLogo from '../../assets/nchads-logo.png';

export function ArtVcctSiteReport({ 
  filters = {}, 
  refreshTrigger = 0,
  onSelectView,
}) {
  const [siteData, setSiteData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('official'); // 'official', 'site_asc', 'plhiv_desc', 'reactive_desc', 'tested_desc'
  const [zoom, setZoom] = useState(100);

  // Derive Quarter & Year from Top Toolbar's filters
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

  // Load site breakdown data based on global TopContextToolbar filters
  const loadSiteReport = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchArtVcctSiteReport({
        quarter,
        year,
        dateFrom: filters?.dateFrom,
        dateTo: filters?.dateTo,
        provinceId: filters?.provinceId,
        odCode: filters?.odCode,
        siteCode: filters?.siteCode,
      });
      if (res && res.data && res.data.length > 0) {
        setSiteData(res.data);
      } else {
        setSiteData([]);
      }
    } catch (err) {
      console.error('Failed to load site breakdown report:', err);
    } finally {
      setIsLoading(false);
    }
  }, [quarter, year, filters?.dateFrom, filters?.dateTo, filters?.provinceId, filters?.odCode, filters?.siteCode]);

  useEffect(() => {
    loadSiteReport();
  }, [loadSiteReport, refreshTrigger]);

  // Filter and sort data cleanly using TopContextToolbar filters and inline quick search
  const filteredAndSortedList = useMemo(() => {
    let list = siteData.filter((item) => {
      // Province filter from TopContextToolbar
      if (filters?.provinceId && String(item.province_id) !== String(filters.provinceId)) {
        return false;
      }
      // OD filter from TopContextToolbar
      if (filters?.odCode && String(item.od_code) !== String(filters.odCode)) {
        return false;
      }
      // Site filter from TopContextToolbar
      if (filters?.siteCode && item.vcct_site_code !== filters.siteCode && item.art_site_code !== filters.siteCode) {
        return false;
      }
      // Search term from inline search or toolbar
      const term = (searchTerm || filters?.search || '').trim().toLowerCase();
      if (term) {
        const matchesName = (item.site_name || '').toLowerCase().includes(term);
        const matchesProv = (item.province_name || '').toLowerCase().includes(term);
        const matchesOd = (item.od_name || '').toLowerCase().includes(term);
        const matchesArtCode = (item.art_site_code || '').toLowerCase().includes(term);
        const matchesVcctCode = (item.vcct_site_code || '').toLowerCase().includes(term);
        if (!matchesName && !matchesProv && !matchesOd && !matchesArtCode && !matchesVcctCode) {
          return false;
        }
      }
      return true;
    });

    if (sortBy === 'site_asc') {
      list = [...list].sort((a, b) => a.site_name.localeCompare(b.site_name));
    } else if (sortBy === 'plhiv_desc') {
      list = [...list].sort((a, b) => b.plhiv_total - a.plhiv_total);
    } else if (sortBy === 'reactive_desc') {
      list = [...list].sort((a, b) => b.vcct_reactive_total - a.vcct_reactive_total);
    } else if (sortBy === 'tested_desc') {
      list = [...list].sort((a, b) => b.vcct_tested_total - a.vcct_tested_total);
    } else {
      // Official order: province_id, od_code, site_name
      list = [...list].sort((a, b) => {
        if (a.province_id !== b.province_id) return a.province_id - b.province_id;
        if (a.od_code !== b.od_code) return (a.od_code || '').localeCompare(b.od_code || '');
        return a.site_name.localeCompare(b.site_name);
      });
    }

    return list;
  }, [siteData, filters?.provinceId, filters?.odCode, filters?.siteCode, filters?.search, searchTerm, sortBy]);

  // Compute Totals
  const totals = useMemo(() => {
    return filteredAndSortedList.reduce(
      (acc, cur) => ({
        total_sites: acc.total_sites + 1,
        art_sites: acc.art_sites + (cur.has_art ? 1 : 0),
        vcct_sites: acc.vcct_sites + (cur.has_vcct ? 1 : 0),
        plhiv_total: acc.plhiv_total + Number(cur.plhiv_total || 0),
        plhiv_female: acc.plhiv_female + Number(cur.plhiv_female || 0),
        vcct_tested_total: acc.vcct_tested_total + Number(cur.vcct_tested_total || 0),
        vcct_reactive_total: acc.vcct_reactive_total + Number(cur.vcct_reactive_total || 0),
        vcct_reactive_female: acc.vcct_reactive_female + Number(cur.vcct_reactive_female || 0),
        vcct_linked_count: acc.vcct_linked_count + Number(cur.vcct_linked_count || 0),
      }),
      {
        total_sites: 0,
        art_sites: 0,
        vcct_sites: 0,
        plhiv_total: 0,
        plhiv_female: 0,
        vcct_tested_total: 0,
        vcct_reactive_total: 0,
        vcct_reactive_female: 0,
        vcct_linked_count: 0,
      }
    );
  }, [filteredAndSortedList]);

  const plhivFemalePct = totals.plhiv_total > 0
    ? ((totals.plhiv_female / totals.plhiv_total) * 100).toFixed(1)
    : '0';

  const overallYield = totals.vcct_tested_total > 0
    ? ((totals.vcct_reactive_total / totals.vcct_tested_total) * 100).toFixed(1)
    : '0';

  const overallLinkage = totals.vcct_reactive_total > 0
    ? ((totals.vcct_linked_count / totals.vcct_reactive_total) * 100).toFixed(1)
    : '0';

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const url = getArtVcctSiteExcelExportUrl({
        quarter,
        year,
        dateFrom: filters?.dateFrom,
        dateTo: filters?.dateTo,
        provinceId: filters?.provinceId,
        odCode: filters?.odCode,
        siteCode: filters?.siteCode,
      });
      const filename = `NCHADS_ART_VCCT_Sites_Report_Q${quarter}_${year}.xlsx`;
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
      {/* 1. Paper Control Action Bar (Single Unified Bar, No Duplicate Strip) */}
      <div className="sticky top-0 z-20 w-full border-b border-slate-200/90 bg-white/95 px-4 py-2 backdrop-blur-xs shadow-2xs flex flex-wrap items-center justify-between gap-2 shrink-0 print:hidden">
        {/* Left: View Switcher Tabs (By Province vs By Site) - Separated & Equal Sized */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            {onSelectView && (
              <button
                type="button"
                onClick={() => onSelectView('provincial_report')}
                className="flex h-8 w-[195px] shrink-0 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 font-medium shadow-2xs text-xs transition-all cursor-pointer active:scale-98"
                title="របាយការណ៍សង្ខេបតាមខេត្ត (Province Report)"
              >
                <FileSpreadsheet className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="truncate">តាមខេត្ត (By Province)</span>
              </button>
            )}
            <button
              type="button"
              className="flex h-8 w-[195px] shrink-0 items-center justify-center gap-2 rounded-md border border-emerald-600/40 bg-emerald-50/70 text-emerald-800 font-semibold shadow-xs text-xs transition-all cursor-default"
              title="របាយការណ៍តាមមូលដ្ឋានសេវា (Site Report)"
            >
              <Building2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span className="truncate">តាមមូលដ្ឋានសេវា (By Site)</span>
            </button>
          </div>

          <span className="h-8 hidden lg:inline-flex items-center px-2.5 rounded-md border border-slate-200/80 bg-slate-50 text-xs text-slate-600 font-medium">
            {periodDisplay}
          </span>

          <span className="h-8 hidden sm:inline-flex items-center px-2.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold">
            {filteredAndSortedList.length} មូលដ្ឋាន
          </span>

          {isLoading && (
            <span className="h-8 flex items-center gap-1.5 px-2.5 rounded-md text-xs text-sky-700 bg-sky-50 border border-sky-200 animate-pulse font-medium">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              <span>កំពុងទាញទិន្នន័យ...</span>
            </span>
          )}
        </div>

        {/* Right: Actions (Search, Sort, Zoom, Excel, Print) - Unified Height & Standard Sizing */}
        <div className="flex items-center gap-2">
          {/* Quick Search */}
          <div className="relative w-44 sm:w-56">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ស្វែងរកឈ្មោះមូលដ្ឋាន..."
              className="h-8 w-full rounded-md border border-slate-200 bg-white pl-8 pr-7 text-xs text-slate-800 placeholder-slate-400 outline-none hover:border-slate-300 focus:border-[var(--app-header-bar-bg)] focus:ring-1 focus:ring-[var(--app-header-bar-bg)] transition-colors shadow-2xs"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Quick Sort */}
          <div className="flex h-8 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 shadow-2xs hover:border-slate-300 transition-colors">
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent outline-none cursor-pointer text-slate-800 text-xs pr-1"
            >
              <option value="official">លំដាប់ខេត្ត / OD</option>
              <option value="site_asc">ឈ្មោះមូលដ្ឋាន A-Z</option>
              <option value="plhiv_desc">PLHIV ខ្ពស់ → ទាប</option>
              <option value="reactive_desc">VCCT វិជ្ជមាន ខ្ពស់ → ទាប</option>
              <option value="tested_desc">VCCT ធ្វើតេស្ត ខ្ពស់ → ទាប</option>
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

          {/* Excel Export Button */}
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

          {/* Print Button */}
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

      {/* 2. Real-time Facility KPI Summary Ribbon */}
      <div className="px-4 pt-3 pb-1 print:hidden">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {/* Card 1: Total Sites */}
          <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-2xs">
            <div className="text-[11px] text-slate-500 font-medium flex items-center justify-between">
              <span>មូលដ្ឋានសរុប</span>
              <Building2 className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
              {totals.total_sites}
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              {totals.art_sites} ART / {totals.vcct_sites} VCCT
            </div>
          </div>

          {/* Card 2: ART Sites */}
          <div className="rounded-lg border border-emerald-100 bg-emerald-50/40 p-2.5 shadow-2xs">
            <div className="text-[11px] text-emerald-800 font-medium flex items-center justify-between">
              <span>សេវា ART</span>
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            </div>
            <div className="text-lg font-bold font-mono text-emerald-700 mt-0.5">
              {totals.art_sites}
            </div>
            <div className="text-[10px] text-emerald-600/80">មូលដ្ឋានព្យាបាល</div>
          </div>

          {/* Card 3: VCCT Sites */}
          <div className="rounded-lg border border-sky-100 bg-sky-50/40 p-2.5 shadow-2xs">
            <div className="text-[11px] text-sky-800 font-medium flex items-center justify-between">
              <span>សេវា VCCT</span>
              <Activity className="h-3.5 w-3.5 text-sky-600" />
            </div>
            <div className="text-lg font-bold font-mono text-sky-700 mt-0.5">
              {totals.vcct_sites}
            </div>
            <div className="text-[10px] text-sky-600/80">មូលដ្ឋានប្រឹក្សា/ធ្វើតេស្ត</div>
          </div>

          {/* Card 4: PLHIV Active on ART */}
          <div className="rounded-lg border border-emerald-200 bg-white p-2.5 shadow-2xs">
            <div className="text-[11px] text-slate-600 font-medium flex items-center justify-between">
              <span>PLHIV លើ ART</span>
              <Users className="h-3.5 w-3.5 text-emerald-600" />
            </div>
            <div className="text-lg font-bold font-mono text-emerald-600 mt-0.5">
              {totals.plhiv_total.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-500">
              ស្រី: {totals.plhiv_female.toLocaleString()} ({plhivFemalePct}%)
            </div>
          </div>

          {/* Card 5: VCCT Tested */}
          <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-2xs">
            <div className="text-[11px] text-slate-600 font-medium flex items-center justify-between">
              <span>ធ្វើតេស្តសរុប</span>
              <Users className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
              {totals.vcct_tested_total.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400">ក្នុងត្រីមាសនេះ</div>
          </div>

          {/* Card 6: VCCT Reactive Positives */}
          <div className="rounded-lg border border-rose-200 bg-rose-50/30 p-2.5 shadow-2xs">
            <div className="text-[11px] text-rose-800 font-medium flex items-center justify-between">
              <span>រកឃើញវិជ្ជមាន</span>
              <Activity className="h-3.5 w-3.5 text-rose-600" />
            </div>
            <div className="text-lg font-bold font-mono text-rose-600 mt-0.5">
              {totals.vcct_reactive_total.toLocaleString()}
            </div>
            <div className="text-[10px] text-rose-700 font-medium">
              Yield {overallYield}% (ស្រី {totals.vcct_reactive_female})
            </div>
          </div>

          {/* Card 7: Linked to ART */}
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/30 p-2.5 shadow-2xs">
            <div className="text-[11px] text-emerald-800 font-medium flex items-center justify-between">
              <span>បញ្ជូនទៅ ART</span>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            </div>
            <div className="text-lg font-bold font-mono text-emerald-600 mt-0.5">
              {totals.vcct_linked_count.toLocaleString()}
            </div>
            <div className="text-[10px] text-emerald-700 font-medium">
              Linkage {overallLinkage}%
            </div>
          </div>
        </div>
      </div>

      {/* 3. Official Report Paper Container */}
      <div className="flex-1 p-3 sm:p-6 md:p-8 flex justify-center items-start print:p-0 print:block">
        <div 
          className="print-page w-full max-w-[1280px] bg-white shadow-[0_10px_35px_rgba(0,0,0,0.10)] border border-slate-300/80 rounded-xs p-6 sm:p-10 transition-transform duration-150 print:max-w-none print:shadow-none print:border-none print:p-0 print:m-0 origin-top"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          {/* Kingdom Header */}
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
              <div className="text-[11.5px] font-bold text-slate-700 leading-relaxed mt-1 whitespace-nowrap">
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

          {/* Report Title */}
          <div className="text-center my-5">
            <h1 className="font-moul text-sm sm:text-base text-[#113a13] leading-relaxed tracking-wide">
              តារាងសង្ខេបព័ត៌មានអ្នកផ្ទុកមេរោគអេដស៍/ជំងឺអេដស៍ បំបែកតាមមូលដ្ឋានសុខាភិបាល (ART & VCCT Breakdown by Site)
            </h1>
            <div className="font-moul text-[12.5px] text-[#1e4620] mt-1.5 flex items-center justify-center gap-2">
              <span>{periodDisplay}</span>
            </div>
          </div>

          {/* Data Table */}
          <div className="border border-[#7ba675] rounded-xs overflow-hidden shadow-2xs print:shadow-none print:border-slate-800">
            <table className="w-full text-[11.5px] text-slate-900 border-collapse">
              {/* Table Header: Two-tier Green Header matching NCHADS */}
              <thead>
                <tr className="bg-[#d9ead3] text-[#133814] border-b border-[#7ba675] font-bold text-[11.5px]">
                  <th rowSpan={2} className="py-2 px-2 text-center border-r border-[#7ba675] w-10">
                    ល.រ
                  </th>
                  <th rowSpan={2} className="py-2 px-3 text-left border-r border-[#7ba675] font-bold whitespace-nowrap">
                    រាជធានី-ខេត្ត
                  </th>
                  <th rowSpan={2} className="py-2 px-3 text-left border-r border-[#7ba675] font-bold whitespace-nowrap">
                    ស្រុកប្រតិបត្តិ (OD)
                  </th>
                  <th rowSpan={2} className="py-2.5 px-3 text-left border-r border-[#7ba675] font-bold">
                    ឈ្មោះមូលដ្ឋានសុខាភិបាល
                  </th>
                  <th rowSpan={2} className="py-2 px-2.5 text-center border-r border-[#7ba675] min-w-[90px] whitespace-nowrap">
                    <div>កូដសេវា</div>
                    <div className="text-[10px] font-bold text-emerald-800 mt-0.5">ART</div>
                  </th>
                  <th rowSpan={2} className="py-2 px-2.5 text-center border-r border-[#7ba675] min-w-[95px] whitespace-nowrap">
                    <div>កូដសេវា</div>
                    <div className="text-[10px] font-bold text-sky-800 mt-0.5">VCCT</div>
                  </th>
                  <th colSpan={2} className="py-1.5 px-3 text-center border-r border-[#7ba675] font-bold">
                    <div>ចំនួន PLHIV កំពុងទទួល ART</div>
                  </th>
                  <th rowSpan={2} className="py-2.5 px-3 text-right border-r border-[#7ba675] font-bold">
                    ធ្វើតេស្តសរុប
                  </th>
                  <th colSpan={2} className="py-1.5 px-3 text-center border-r border-[#7ba675] font-bold">
                    <div>ចំនួនអតិថិជនវិជ្ជមាន (VCCT)</div>
                  </th>
                  <th rowSpan={2} className="py-2.5 px-3 text-right border-r border-[#7ba675] font-bold">
                    បញ្ជូន ART
                  </th>
                  <th rowSpan={2} className="py-2.5 px-3 text-center font-bold">
                    Yield / Linkage
                  </th>
                </tr>
                <tr className="bg-[#e2efda] text-[#133814] border-b-2 border-[#7ba675] font-bold text-[11px]">
                  <th className="py-1 px-2.5 text-right border-r border-[#7ba675]">សរុប</th>
                  <th className="py-1 px-2.5 text-right border-r border-[#7ba675]">ស្រី</th>
                  <th className="py-1 px-2.5 text-right border-r border-[#7ba675]">សរុប</th>
                  <th className="py-1 px-2.5 text-right border-r border-[#7ba675]">ស្រី</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-[#d4e4cf]">
                {filteredAndSortedList.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="py-8 text-center text-slate-500">
                      មិនមានទិន្នន័យស្របតាមលក្ខខណ្ឌស្វែងរកនេះទេ
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedList.map((row, index) => {
                    const isEven = index % 2 === 1;
                    return (
                      <tr 
                        key={row.site_id || index}
                        className={`transition-colors hover:bg-emerald-50/70 ${isEven ? 'bg-[#fcfdfa]' : 'bg-white'}`}
                      >
                        {/* No */}
                        <td className="py-1.5 px-2 text-center font-mono text-slate-600 border-r border-[#d4e4cf]">
                          {index + 1}
                        </td>

                        {/* Province */}
                        <td className="py-1.5 px-3 font-semibold text-slate-900 border-r border-[#d4e4cf] whitespace-nowrap">
                          {row.province_name}
                        </td>

                        {/* OD */}
                        <td className="py-1.5 px-3 text-slate-700 border-r border-[#d4e4cf] whitespace-nowrap">
                          {row.od_name}
                        </td>

                        {/* Facility / Site Name */}
                        <td className="py-1.5 px-3 font-medium text-slate-900 border-r border-[#d4e4cf]">
                          {row.site_name}
                        </td>

                        {/* ART Site Code */}
                        <td className="py-1.5 px-2.5 text-center border-r border-[#d4e4cf] whitespace-nowrap">
                          {row.has_art && row.art_site_code !== '-' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-300 text-xs font-semibold">
                              <span className="text-[9.5px] px-1 py-0.2 rounded bg-emerald-200/80 text-emerald-950 font-bold">ART</span>
                              <span className="font-mono font-bold">{row.art_site_code}</span>
                            </span>
                          ) : (
                            <span className="text-slate-300 font-mono text-xs">-</span>
                          )}
                        </td>

                        {/* VCCT Site Code */}
                        <td className="py-1.5 px-2.5 text-center border-r border-[#d4e4cf] whitespace-nowrap">
                          {row.has_vcct && row.vcct_site_code !== '-' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-50 text-sky-900 border border-sky-300 text-xs font-semibold">
                              <span className="text-[9.5px] px-1 py-0.2 rounded bg-sky-200/80 text-sky-950 font-bold">VCCT</span>
                              <span className="font-mono font-bold">{row.vcct_site_code}</span>
                            </span>
                          ) : (
                            <span className="text-slate-300 font-mono text-xs">-</span>
                          )}
                        </td>

                        {/* PLHIV Total */}
                        <td className="py-1.5 px-2.5 text-right font-mono font-bold text-slate-900 border-r border-[#d4e4cf]">
                          {row.plhiv_total > 0 ? row.plhiv_total.toLocaleString() : '-'}
                        </td>

                        {/* PLHIV Female */}
                        <td className="py-1.5 px-2.5 text-right font-mono text-slate-600 border-r border-[#d4e4cf]">
                          {row.plhiv_female > 0 ? row.plhiv_female.toLocaleString() : '-'}
                        </td>

                        {/* VCCT Tested Total */}
                        <td className="py-1.5 px-3 text-right font-mono font-medium text-slate-800 border-r border-[#d4e4cf]">
                          {row.vcct_tested_total > 0 ? row.vcct_tested_total.toLocaleString() : '-'}
                        </td>

                        {/* VCCT Reactive Total */}
                        <td className="py-1.5 px-2.5 text-right font-mono font-bold text-rose-600 border-r border-[#d4e4cf]">
                          {row.vcct_reactive_total > 0 ? row.vcct_reactive_total.toLocaleString() : '-'}
                        </td>

                        {/* VCCT Reactive Female */}
                        <td className="py-1.5 px-2.5 text-right font-mono text-rose-500 border-r border-[#d4e4cf]">
                          {row.vcct_reactive_female > 0 ? row.vcct_reactive_female.toLocaleString() : '-'}
                        </td>

                        {/* VCCT Linked to ART */}
                        <td className="py-1.5 px-3 text-right font-mono font-bold text-emerald-700 border-r border-[#d4e4cf]">
                          {row.vcct_linked_count > 0 ? row.vcct_linked_count.toLocaleString() : '-'}
                        </td>

                        {/* Yield / Linkage */}
                        <td className="py-1.5 px-3 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5 font-mono text-[11px]">
                            <span className="px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 font-semibold border border-rose-200" title="Yield Rate">
                              Y:{row.yield_rate}%
                            </span>
                            <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200" title="Linkage Rate">
                              L:{row.linkage_rate}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>

              {/* Table Footer: Totals Row */}
              <tfoot className="bg-[#d9ead3] font-bold text-[#133814] border-t-2 border-[#7ba675]">
                <tr>
                  <td colSpan={6} className="py-2 px-3 text-right border-r border-[#7ba675] font-bold text-[#133814]">
                    សរុបទាំងអស់ ({totals.total_sites} មូលដ្ឋាន) :
                  </td>
                  <td className="py-2 px-2 text-right font-mono font-bold text-[#133814] border-r border-[#7ba675]">
                    {totals.plhiv_total.toLocaleString()}
                  </td>
                  <td className="py-2 px-2 text-right font-mono font-bold text-[#133814] border-r border-[#7ba675]">
                    {totals.plhiv_female.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-[#133814] border-r border-[#7ba675]">
                    {totals.vcct_tested_total.toLocaleString()}
                  </td>
                  <td className="py-2 px-2 text-right font-mono font-bold text-rose-700 border-r border-[#7ba675]">
                    {totals.vcct_reactive_total.toLocaleString()}
                  </td>
                  <td className="py-2 px-2 text-right font-mono font-bold text-rose-700 border-r border-[#7ba675]">
                    {totals.vcct_reactive_female.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-emerald-800 border-r border-[#7ba675]">
                    {totals.vcct_linked_count.toLocaleString()}
                  </td>
                  <td className="py-2 px-2 text-center font-mono text-[11px] text-[#133814]">
                    <div>Y: {overallYield}%</div>
                    <div>L: {overallLinkage}%</div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* 4. Official Signatures matching Government Format */}
          <div className="mt-8 flex justify-between items-start text-xs text-slate-800 print:mt-12">
            <div className="text-center w-64">
              <div className="font-moul text-[11.5px] text-slate-900 mb-1">
                បានឃើញ និងឯកភាព
              </div>
              <div className="font-bold text-slate-800 text-[11px]">
                ប្រធានការិយាល័យរោគរាតត្បាត និងទិន្នន័យ
              </div>
              <div className="mt-16 text-slate-400 text-[10px]">
                (ហត្ថលេខា និងត្រា)
              </div>
            </div>

            <div className="text-center w-72">
              <div className="text-[11px] text-slate-700 italic mb-1 font-serif">
                រាជធានីភ្នំពេញ, ថ្ងៃទី...... ខែ...... ឆ្នាំ 2026
              </div>
              <div className="font-bold text-slate-800 text-[11.5px]">
                អ្នករៀបចំរបាយការណ៍
              </div>
              <div className="mt-16 text-slate-400 text-[10px]">
                (ហត្ថលេខា)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArtVcctSiteReport;
