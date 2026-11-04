import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Users,
  Building2,
  Calendar,
  Filter,
  RefreshCw,
  Search,
  ExternalLink,
  ChevronRight,
  Info,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  BadgeAlert,
  HelpCircle,
  FileWarning,
  FileSpreadsheet,
  Loader2,
  TrendingUp,
  BarChart3,
  ListFilter,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  fetchDataQualitySummary,
  fetchDataQualityRecords,
  fetchDataQualityConsistencyYoY,
  getDataQualityExcelExportUrl,
  triggerFileDownload,
} from '../../lib/api';
import { LoadingMark } from '../ui/loading';

// In-chart & in-card frosted loading overlay
function DQLoadingOverlay({ label = 'កំពុងត្រួតពិនិត្យគុណភាពទិន្នន័យ...' }) {
  return (
    <div className="absolute inset-0 bg-white/70 backdrop-blur-[1.5px] rounded-xl flex items-center justify-center z-20 pointer-events-none transition-all duration-200">
      <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/95 border border-slate-200/80 shadow-md text-xs font-medium text-slate-700 animate-in fade-in duration-200">
        <LoadingMark className="h-4 w-4 text-sky-600" />
        <span>{label}</span>
      </div>
    </div>
  );
}

export function DataQualityDashboard({
  filters = {},
  refreshTrigger = 0,
  onDrillDownToLineList,
  onSelectRecord,
}) {
  const [activeTab, setActiveTab] = useState('rules'); // 'rules' | 'yoy_consistency'

  // Summary & Rules state
  const [summaryData, setSummaryData] = useState(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  const [selectedRule, setSelectedRule] = useState('all_issues');

  // YoY Consistency state
  const [yoyData, setYoyData] = useState(null);
  const [isLoadingYoy, setIsLoadingYoy] = useState(false);

  // Drilldown records state
  const [records, setRecords] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // 1. Load Summary Data
  const loadSummary = useCallback(async () => {
    setIsLoadingSummary(true);
    try {
      const res = await fetchDataQualitySummary({
        provinceId: filters.provinceId || '',
        odCode: filters.odCode || '',
        siteCode: filters.siteCode || '',
        dateFrom: filters.dateFrom || '',
        dateTo: filters.dateTo || '',
      });
      if (res && res.success) {
        setSummaryData(res.data);
      }
    } catch (err) {
      console.error('Failed to load DQ summary:', err);
    } finally {
      setIsLoadingSummary(false);
    }
  }, [filters]);

  // 2. Load YoY Consistency Data
  const loadYoyConsistency = useCallback(async () => {
    setIsLoadingYoy(true);
    try {
      const res = await fetchDataQualityConsistencyYoY({
        provinceId: filters.provinceId || '',
        odCode: filters.odCode || '',
        siteCode: filters.siteCode || '',
        startYear: 2020,
        endYear: new Date().getFullYear(),
      });
      if (res && res.success) {
        setYoyData(res.data);
      }
    } catch (err) {
      console.error('Failed to load YoY consistency data:', err);
    } finally {
      setIsLoadingYoy(false);
    }
  }, [filters]);

  useEffect(() => {
    loadSummary();
    loadYoyConsistency();
  }, [loadSummary, loadYoyConsistency, refreshTrigger]);

  // 3. Load Flagged Records for the Selected Rule
  const loadFlaggedRecords = useCallback(
    async (page = 1, rule = selectedRule) => {
      setIsLoadingRecords(true);
      try {
        const res = await fetchDataQualityRecords({
          provinceId: filters.provinceId || '',
          odCode: filters.odCode || '',
          siteCode: filters.siteCode || '',
          dateFrom: filters.dateFrom || '',
          dateTo: filters.dateTo || '',
          rule,
          page,
          limit: 15,
        });
        if (res && res.success) {
          setRecords(res.data || []);
          setPagination(res.pagination || { page: 1, limit: 15, total: 0, totalPages: 1 });
        }
      } catch (err) {
        console.error('Failed to load flagged records:', err);
      } finally {
        setIsLoadingRecords(false);
      }
    },
    [filters, selectedRule]
  );

  useEffect(() => {
    loadFlaggedRecords(1, selectedRule);
  }, [loadFlaggedRecords, selectedRule, refreshTrigger]);

  const handleSelectRule = (ruleId) => {
    setSelectedRule(ruleId);
  };

  const overall = summaryData?.overall || {
    totalTested: 0,
    cleanRecords: 0,
    totalIssues: 0,
    dqScore: 100,
  };

  const issuesByType = summaryData?.issuesByType || [];
  const facilities = summaryData?.byFacility || [];

  const [selectedCategory, setSelectedCategory] = useState('all');

  const displayedRules = useMemo(() => {
    if (selectedCategory === 'all') return issuesByType;
    if (selectedCategory === 'dqa_core') {
      return issuesByType.filter((r) =>
        ['hts_missing', 'hts_having', 'v10_retest_not_positive', 'v01_inconclusive_or_empty',
         'v02_age_under_1', 'v03_under_15_occupation', 'v04_under_15_kp', 'v05_under_15_marital',
         'v06_under_15_education', 'v07_male_housewife', 'v00_reactive_unlinked'].includes(r.id)
      );
    }
    return issuesByType.filter((r) => r.category === selectedCategory);
  }, [issuesByType, selectedCategory]);

  const isInitialLoading = !summaryData && isLoadingSummary;
  const isRefreshing = !!summaryData && isLoadingSummary;

  // Filter records by search query
  const filteredRecords = useMemo(() => {
    if (!searchQuery.trim()) return records;
    const q = searchQuery.toLowerCase().trim();
    return records.filter(
      (r) =>
        (r.uuic && r.uuic.toLowerCase().includes(q)) ||
        (r.hts_code && r.hts_code.toLowerCase().includes(q)) ||
        (r.site_name && r.site_name.toLowerCase().includes(q)) ||
        (r.site_code && r.site_code.toLowerCase().includes(q)) ||
        (r.occupation_name && r.occupation_name.toLowerCase().includes(q)) ||
        (r.target_group_name && r.target_group_name.toLowerCase().includes(q))
    );
  }, [records, searchQuery]);

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const url = getDataQualityExcelExportUrl({
        ...filters,
        rule: selectedRule,
      });
      const filename = `VCCT_DQA_Audit_${selectedRule}_${new Date().toISOString().slice(0, 10)}.xlsx`;
      await triggerFileDownload(url, filename);
    } catch (err) {
      console.error('Export Excel failed:', err);
      alert('ការទាញយក Excel បរាជ័យ៖ ' + (err.message || 'Error'));
    } finally {
      setIsExporting(false);
    }
  };

  // Selected rule metadata
  const currentRuleMeta = useMemo(() => {
    if (selectedRule === 'all_issues') {
      return {
        labelKh: 'បញ្ជីកំណត់ត្រាដែលមានកំហុសទាំងអស់ (All DQA Issues)',
        labelEn: 'All Flagged Records',
        count: overall.totalIssues,
        severity: 'high',
      };
    }
    return (
      issuesByType.find((i) => i.id === selectedRule) || {
        labelKh: 'កំណត់ត្រាផ្ទៀងផ្ទាត់',
        labelEn: 'Flagged Records',
        count: 0,
        severity: 'medium',
      }
    );
  }, [selectedRule, overall.totalIssues, issuesByType]);

  // Specific counts for key cards
  const htsMissingCount = issuesByType.find((i) => i.id === 'hts_missing')?.count || 0;
  const htsHavingCount = issuesByType.find((i) => i.id === 'hts_having')?.count || 0;
  const reactiveUnlinkedCount = issuesByType.find((i) => i.id === 'v00_reactive_unlinked')?.count || 0;
  const inconclusiveCount = issuesByType.find((i) => i.id === 'v01_inconclusive_or_empty')?.count || 0;

  // Max values for YoY visual bars
  const maxTested = useMemo(() => {
    if (!yoyData?.trend?.length) return 1;
    return Math.max(...yoyData.trend.map((t) => t.totalTested), 1);
  }, [yoyData]);

  const maxPositive = useMemo(() => {
    if (!yoyData?.trend?.length) return 1;
    return Math.max(...yoyData.trend.map((t) => t.hivPositive), 1);
  }, [yoyData]);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50/50 relative">
      {/* Background Refetch Top Shimmer Bar */}
      {isRefreshing && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-sky-200 overflow-hidden z-30">
          <div className="h-full bg-sky-600 animate-[indeterminate_1.5s_infinite_linear] origin-left w-full" />
        </div>
      )}

      {/* 1. Full-Width Sticky Header Bar */}
      <div className="sticky top-0 z-20 w-full border-b border-slate-200/90 bg-white/95 px-4 py-2 backdrop-blur-xs shadow-2xs flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-700 flex items-center justify-center border border-emerald-200/50">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <span>ផ្ទាំងត្រួតពិនិត្យគុណភាពទិន្នន័យ (DQA Dashboard)</span>
              <span className="text-[11px] font-semibold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-full shadow-2xs">
                VCCT Surveillance & CMA
              </span>
            </h1>
          </div>
        </div>

        {/* View Mode Tabs & Refresh */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('rules')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer ${
                activeTab === 'rules'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListFilter className="h-3.5 w-3.5 text-sky-600" />
              <span>វិធានផ្ទៀងផ្ទាត់ (Validation Rules)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('yoy_consistency')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer ${
                activeTab === 'yoy_consistency'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
              <span>ភាពស៊ីសង្វាក់ប្រចាំឆ្នាំ (YoY Consistency)</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              loadSummary();
              loadYoyConsistency();
            }}
            disabled={isLoadingSummary || isLoadingYoy}
            className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-md border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all text-xs font-medium shadow-2xs cursor-pointer active:scale-95 disabled:opacity-70"
            title="ទាញយកទិន្នន័យគុណភាពឡើងវិញ (Refresh)"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 text-slate-400 ${
                isLoadingSummary || isLoadingYoy ? 'animate-spin text-sky-500' : ''
              }`}
            />
            <span>{isLoadingSummary || isLoadingYoy ? 'កំពុងទាញយក...' : 'ផ្ទុកឡើងវិញ'}</span>
          </button>
        </div>
      </div>

      {/* Scrollable Dashboard Body */}
      <div className="flex-1 flex flex-col gap-3.5 px-4 py-3 min-h-0 overflow-y-auto">
        {/* 2. Top 4 High-Consistency Highlight KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Card 1: Missing HTS Codes */}
          <div
            onClick={() => {
              setActiveTab('rules');
              handleSelectRule('hts_missing');
            }}
            className="rounded-xl border border-slate-200/90 bg-white p-2.5 shadow-2xs hover:border-amber-400 hover:shadow-xs transition-all h-[78px] flex flex-col justify-between cursor-pointer"
          >
            <div className="flex items-center justify-between text-slate-500 text-xs h-5">
              <span className="text-[11.5px] font-medium text-slate-600 flex items-center gap-1.5">
                <span className="p-1 rounded-md bg-amber-50 text-amber-600">
                  <FileWarning className="h-3 w-3" />
                </span>
                <span className="truncate max-w-[155px]" title="CCT Clients missing HTS Codes - for VCCT">
                  Missing HTS Codes
                </span>
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                HTS-VCCT
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold font-mono tracking-tight text-amber-600">
                {isInitialLoading ? '--' : htsMissingCount.toLocaleString()}
              </span>
              <span className="text-[10.5px] text-slate-400 font-medium">ករណីខ្វះកូដ</span>
            </div>
          </div>

          {/* Card 2: Having HTS Codes for CMA */}
          <div
            onClick={() => {
              setActiveTab('rules');
              handleSelectRule('hts_having');
            }}
            className="rounded-xl border border-slate-200/90 bg-white p-2.5 shadow-2xs hover:border-emerald-400 hover:shadow-xs transition-all h-[78px] flex flex-col justify-between cursor-pointer"
          >
            <div className="flex items-center justify-between text-slate-500 text-xs h-5">
              <span className="text-[11.5px] font-medium text-slate-600 flex items-center gap-1.5">
                <span className="p-1 rounded-md bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="h-3 w-3" />
                </span>
                <span className="truncate max-w-[155px]" title="VCCT Clients having HTS Codes, for CMA">
                  Having HTS (CMA)
                </span>
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                HTS-CMA
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold font-mono tracking-tight text-emerald-600">
                {isInitialLoading ? '--' : htsHavingCount.toLocaleString()}
              </span>
              <span className="text-[10.5px] text-emerald-700 font-medium">មានកូដ CMA</span>
            </div>
          </div>

          {/* Card 3: HIV Pos unlinked to ART */}
          <div
            onClick={() => {
              setActiveTab('rules');
              handleSelectRule('v00_reactive_unlinked');
            }}
            className="rounded-xl border border-slate-200/90 bg-white p-2.5 shadow-2xs hover:border-rose-400 hover:shadow-xs transition-all h-[78px] flex flex-col justify-between cursor-pointer"
          >
            <div className="flex items-center justify-between text-slate-500 text-xs h-5">
              <span className="text-[11.5px] font-medium text-slate-600 flex items-center gap-1.5">
                <span className="p-1 rounded-md bg-rose-50 text-rose-600">
                  <BadgeAlert className="h-3 w-3" />
                </span>
                <span className="truncate max-w-[155px]" title="V0. Clients tested HIV Pos, but not linked to ART">
                  HIV Pos unlinked to ART
                </span>
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                V0
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold font-mono tracking-tight text-rose-600">
                {isInitialLoading ? '--' : reactiveUnlinkedCount.toLocaleString()}
              </span>
              <span className="text-[10.5px] text-rose-500 font-medium">មិនទាន់ភ្ជាប់ ART</span>
            </div>
          </div>

          {/* Card 4: V0.1 HIV Test Result Inconclusive / Not Selected */}
          <div
            onClick={() => {
              setActiveTab('rules');
              handleSelectRule('v01_inconclusive_or_empty');
            }}
            className="rounded-xl border border-slate-200/90 bg-white p-2.5 shadow-2xs hover:border-purple-400 hover:shadow-xs transition-all h-[78px] flex flex-col justify-between cursor-pointer"
          >
            <div className="flex items-center justify-between text-slate-500 text-xs h-5">
              <span className="text-[11.5px] font-medium text-slate-600 flex items-center gap-1.5">
                <span className="p-1 rounded-md bg-purple-50 text-purple-600">
                  <AlertCircle className="h-3 w-3" />
                </span>
                <span className="truncate max-w-[155px]" title="V0.1 HIV Test Result of Inconclusive or Not Selected">
                  Inconclusive / Empty
                </span>
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                V0.1
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold font-mono tracking-tight text-purple-700">
                {isInitialLoading ? '--' : inconclusiveCount.toLocaleString()}
              </span>
              <span className="text-[10.5px] text-purple-600 font-medium">លទ្ធផលមិនច្បាស់</span>
            </div>
          </div>
        </div>

        {/* 3. Conditional Content: Rules Mode vs YoY Consistency Mode */}
        {activeTab === 'yoy_consistency' ? (
          /* YoY Consistency Assessment View */
          <div className="space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                <h2 className="text-xs font-bold text-slate-800">
                  ការវាយតម្លៃភាពស៊ីសង្វាក់គ្នានៃទិន្នន័យប្រចាំឆ្នាំ (DQA Consistency Year-over-Year)
                </h2>
              </div>
              <span className="text-[11px] text-slate-400">
                ទិន្នន័យផ្ទៀងផ្ទាត់ចាប់ពីឆ្នាំ 2020 ដល់ឆ្នាំបច្ចុប្បន្ន
              </span>
            </div>

            {/* Two Side-by-Side Metric Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
              {/* Metric 1: VCCT # of clients tested for HIV, Year over Year */}
              <div className="rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded bg-sky-50 text-sky-700">
                        <Users className="h-3.5 w-3.5" />
                      </span>
                      <h3 className="text-xs font-bold text-slate-800">
                        DQA - Consistency | VCCT # of clients tested for HIV, Year over Year
                      </h3>
                    </div>
                    <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                      ចំនួនធ្វើតេស្តសរុប
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-3">
                    តាមដាននិន្នាការ និងភាពស៊ីសង្វាក់គ្នានៃបរិមាណអតិថិជនបានធ្វើតេស្តអេដស៍ពីមួយឆ្នាំទៅមួយឆ្នាំ។
                  </p>

                  {/* Visual Trend Bars */}
                  <div className="space-y-2">
                    {yoyData?.trend?.map((item) => {
                      const pct = Math.min(100, Math.round((item.totalTested / maxTested) * 100));
                      const isConsistent = item.testedConsistent;
                      return (
                        <div key={`tested-${item.year}`} className="space-y-0.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-700 font-mono w-12">{item.year}</span>
                            <div className="flex items-center gap-2 font-mono text-[11px]">
                              <span className="font-semibold text-slate-900">
                                {item.totalTested.toLocaleString()} នាក់
                              </span>
                              {item.testedYoyChange !== null && (
                                <span
                                  className={`inline-flex items-center text-[10px] font-bold px-1 rounded ${
                                    item.testedYoyChange >= 0
                                      ? 'text-emerald-700 bg-emerald-50'
                                      : 'text-rose-700 bg-rose-50'
                                  }`}
                                >
                                  {item.testedYoyChange >= 0 ? '+' : ''}
                                  {item.testedYoyChange}%
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                isConsistent ? 'bg-sky-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Metric 2: VCCT # of HIV positive clients, Year over Year */}
              <div className="rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded bg-rose-50 text-rose-700">
                        <AlertTriangle className="h-3.5 w-3.5" />
                      </span>
                      <h3 className="text-xs font-bold text-slate-800">
                        DQA - Consistency | VCCT # of HIV positive clients, Year over Year
                      </h3>
                    </div>
                    <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                      ចំនួនវិជ្ជមាន HIV
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-3">
                    តាមដាននិន្នាការ និងស្ថិរភាពនៃករណីរកឃើញ HIV វិជ្ជមានប្រចាំឆ្នាំ (Year over Year)។
                  </p>

                  {/* Visual Trend Bars */}
                  <div className="space-y-2">
                    {yoyData?.trend?.map((item) => {
                      const pct = Math.min(100, Math.round((item.hivPositive / maxPositive) * 100));
                      return (
                        <div key={`pos-${item.year}`} className="space-y-0.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-700 font-mono w-12">{item.year}</span>
                            <div className="flex items-center gap-2 font-mono text-[11px]">
                              <span className="font-semibold text-rose-700">
                                {item.hivPositive.toLocaleString()} នាក់ ({item.positivityRate}%)
                              </span>
                              {item.positiveYoyChange !== null && (
                                <span
                                  className={`inline-flex items-center text-[10px] font-bold px-1 rounded ${
                                    item.positiveYoyChange >= 0
                                      ? 'text-rose-700 bg-rose-50'
                                      : 'text-emerald-700 bg-emerald-50'
                                  }`}
                                >
                                  {item.positiveYoyChange >= 0 ? '+' : ''}
                                  {item.positiveYoyChange}%
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500 bg-rose-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Consistency Data Table */}
            <div className="rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <h3 className="text-xs font-bold text-slate-800">
                  តារាងសង្ខេបភាពស៊ីសង្វាក់គ្នានៃទិន្នន័យ VCCT ពីមួយឆ្នាំទៅមួយឆ្នាំ (Year-over-Year Matrix)
                </h3>
                <span className="text-[11px] text-slate-400">ឯកតា៖ នាក់ / ភាគរយ</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-700 font-semibold text-[11px]">
                      <th className="py-2.5 px-3">ឆ្នាំ (Year)</th>
                      <th className="py-2.5 px-3 text-right">ចំនួនធ្វើតេស្តសរុប</th>
                      <th className="py-2.5 px-3 text-right">កំណើន YoY តេស្ត</th>
                      <th className="py-2.5 px-3 text-right">ចំនួន HIV វិជ្ជមាន</th>
                      <th className="py-2.5 px-3 text-right">កំណើន YoY វិជ្ជមាន</th>
                      <th className="py-2.5 px-3 text-right">អត្រាវិជ្ជមាន (%)</th>
                      <th className="py-2.5 px-3 text-center">ការវាយតម្លៃភាពស៊ីសង្វាក់</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11.5px]">
                    {yoyData?.trend?.map((item) => (
                      <tr key={item.year} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-slate-900">{item.year}</td>
                        <td className="py-2.5 px-3 text-right text-slate-800 font-semibold">
                          {item.totalTested.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          {item.testedYoyChange !== null ? (
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10.5px] font-bold ${
                                item.testedYoyChange >= 0
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-rose-50 text-rose-700'
                              }`}
                            >
                              {item.testedYoyChange >= 0 ? '+' : ''}
                              {item.testedYoyChange}%
                            </span>
                          ) : (
                            <span className="text-slate-400">មូលដ្ឋាន (Base)</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right text-rose-700 font-bold">
                          {item.hivPositive.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          {item.positiveYoyChange !== null ? (
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10.5px] font-bold ${
                                item.positiveYoyChange >= 0
                                  ? 'bg-rose-50 text-rose-700'
                                  : 'bg-emerald-50 text-emerald-700'
                              }`}
                            >
                              {item.positiveYoyChange >= 0 ? '+' : ''}
                              {item.positiveYoyChange}%
                            </span>
                          ) : (
                            <span className="text-slate-400">មូលដ្ឋាន (Base)</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-800">
                          {item.positivityRate}%
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold border ${
                              item.testedConsistent && item.positiveConsistent
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}
                          >
                            {item.testedConsistent && item.positiveConsistent
                              ? '✓ ស៊ីសង្វាក់ល្អ (Consistent)'
                              : '⚠️ មានបំរែបំរួលខ្ពស់ (Variance)'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* Rules Mode: 11 DQA Indicators Grid */
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-600" />
                <h2 className="text-xs font-bold text-slate-800">
                  វិធានត្រួតពិនិត្យគុណភាពទិន្នន័យ (Data Quality Validation Rules — {issuesByType.length} វិធាន)
                </h2>
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  — ចុចលើវិធានដើម្បីពិនិត្យ និងទាញយកបញ្ជីឈ្មោះអតិថិជនជាក់ស្តែង
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleSelectRule('all_issues')}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer font-medium ${
                  selectedRule === 'all_issues'
                    ? 'bg-slate-800 text-white border-slate-800 shadow-2xs font-semibold'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                បង្ហាញបញ្ជីកំហុសទាំងអស់ ({overall.totalIssues.toLocaleString()})
              </button>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-200/50 border border-slate-200/80">
              {[
                { id: 'all', label: `វិធានទាំងអស់ (${issuesByType.length})` },
                { id: 'dqa_core', label: `⭐ DQA ស្នូល (11 វិធាន)` },
                { id: 'logical', label: `⚖️ ភាពស៊ីសង្វាក់តក្កវិជ្ជា/អាយុ` },
                { id: 'clinical', label: `🧪 គ្លីនិក & ការបញ្ជូន` },
                { id: 'completeness', label: `📋 លេខកូដ & ភាពពេញលេញ` },
              ].map((cat) => {
                const active = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      active
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Grid of Interactive Rule Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {displayedRules.map((rule) => {
                const isSelected = selectedRule === rule.id;
                const hasIssues = rule.count > 0;

                const severityBadge =
                  rule.severity === 'high'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : rule.severity === 'medium'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200';

                return (
                  <button
                    key={rule.id}
                    type="button"
                    onClick={() => handleSelectRule(rule.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between h-[132px] ${
                      isSelected
                        ? 'border-sky-500 bg-sky-50/25 ring-2 ring-sky-500/20 shadow-xs'
                        : hasIssues
                        ? 'border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-2xs'
                        : 'border-slate-200/60 bg-slate-50/50 opacity-70 hover:opacity-100'
                    }`}
                    title={rule.recommendation}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1.5 mb-1.5">
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                          {rule.ruleCode || rule.id}
                        </span>
                        <span
                          className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                            hasIssues
                              ? rule.severity === 'info'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {rule.count.toLocaleString()}
                        </span>
                      </div>

                      <h3 className="text-xs font-bold text-slate-800 line-clamp-1">{rule.labelKh}</h3>
                      <div className="text-[10px] font-mono text-slate-500 truncate" title={rule.labelEn}>
                        {rule.labelEn}
                      </div>
                    </div>

                    <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10.5px]">
                      <span className="text-slate-400 truncate max-w-[170px]" title={rule.description}>
                        {rule.description}
                      </span>
                      <ChevronRight
                        className={`h-3 w-3 shrink-0 ${isSelected ? 'text-sky-600' : 'text-slate-300'}`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. Flagged Records Drill-Down Table (Full Width) */}
        <div className="w-full rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs flex flex-col relative overflow-hidden min-h-[460px]">
          {isLoadingRecords && <DQLoadingOverlay label="កំពុងទាញកំណត់ត្រាមានកំហុស..." />}

          {/* Table Header Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              <div>
                <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <span>{currentRuleMeta.labelKh}</span>
                  {currentRuleMeta.labelEn && (
                    <span className="text-[11px] font-mono font-normal text-slate-400">
                      ({currentRuleMeta.labelEn})
                    </span>
                  )}
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-normal">
                ({filteredRecords.length}/{pagination.total.toLocaleString()} កំណត់ត្រា)
              </span>
            </div>

            {/* Search Box & Excel Export */}
            <div className="flex items-center gap-2">
              <div className="relative w-52 sm:w-64">
                <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ស្វែងរកតាម UUIC, HTS Code ឬឈ្មោះ..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-hidden focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <button
                type="button"
                onClick={handleExportExcel}
                disabled={isExporting}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-600 bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 shadow-xs transition-all cursor-pointer active:scale-95 shrink-0 disabled:opacity-75 disabled:cursor-not-allowed"
                title="ទាញយកបញ្ជីកំណត់ត្រាដែលមានកំហុសទាំងអស់ជាឯកសារ Excel"
              >
                {isExporting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                ) : (
                  <FileSpreadsheet className="h-3.5 w-3.5 text-white" />
                )}
                <span>
                  {isExporting ? 'កំពុងបង្កើត...' : `ទាញយក Excel (${pagination.total.toLocaleString()})`}
                </span>
              </button>
            </div>
          </div>

          {/* Records Table */}
          <div className="flex-1 overflow-auto custom-scrollbar my-2">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-semibold text-[11px]">
                  <th className="py-2.5 px-2.5 whitespace-nowrap">កាលបរិច្ឆេទ</th>
                  <th className="py-2.5 px-2.5 whitespace-nowrap">VCCT ID</th>
                  <th className="py-2.5 px-2.5 whitespace-nowrap">លេខកូដ HTS</th>
                  <th className="py-2.5 px-2.5 whitespace-nowrap">លេខសម្គាល់ (UUIC)</th>
                  <th className="py-2.5 px-2.5 whitespace-nowrap">មណ្ឌលផ្តល់សេវា</th>
                  <th className="py-2.5 px-2.5 whitespace-nowrap">ភេទ / អាយុ</th>
                  <th className="py-2.5 px-2.5 whitespace-nowrap">មុខរបរ</th>
                  <th className="py-2.5 px-2.5 whitespace-nowrap">ស្ថានភាព</th>
                  <th className="py-2.5 px-2.5 whitespace-nowrap">កម្រិតវប្បធម៌</th>
                  <th className="py-2.5 px-2.5 whitespace-nowrap">ប្រភេទអតិថិជន</th>
                  <th className="py-2.5 px-2.5 whitespace-nowrap">លទ្ធផល HIV</th>
                  <th className="py-2.5 px-2.5 whitespace-nowrap">ការបញ្ជូន ART</th>
                  <th className="py-2.5 px-2.5 whitespace-nowrap">កំហុសដែលរកឃើញ</th>
                  <th className="py-2.5 px-2.5 text-right whitespace-nowrap">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((r, idx) => {
                    const isReactive = Number(r.hiv_result) === 2;
                    const isNegative = Number(r.hiv_result) === 1;
                    const isInconclusive = Number(r.hiv_result) === 3;
                    const vcctId = r.vcct_id !== null && r.vcct_id !== undefined && r.vcct_id !== '' ? r.vcct_id : '-';

                    // Individual Attribute Validation Checks
                    const isMissingHts = !r.hts_code || !r.hts_code.trim();
                    const isMissingUuic = !r.uuic || !r.uuic.trim();
                    const isInvalidAge = !r.dob || r.age === null || r.age === undefined || Number(r.age) < 1;
                    const isMaleHousewife = Number(r.sex) === 1 && Number(r.occupation_id) === 11;
                    const isUnder15Job = Number(r.age) < 15 && r.occupation_id && ![0, 9].includes(Number(r.occupation_id));
                    const isUnder15Kp = Number(r.age) < 15 && [1, 2, 3, 4, 5, 7, 8].includes(Number(r.patient_type_id));
                    const isUnder15Marital = Number(r.age) < 15 && [2, 3].includes(Number(r.marital_status_id));
                    const isUnder15Education = Number(r.age) < 15 && [4, 5].includes(Number(r.education_id));
                    const isReactiveUnlinked = isReactive && (!r.refer_to_service_id || Number(r.refer_to_service_id) !== 1);

                    const sexLabel = Number(r.sex) === 1 ? 'ប្រុស' : Number(r.sex) === 0 ? 'ស្រី' : 'TG';

                    return (
                      <tr key={`${r.site_code}-${r.vcct_id}-${idx}`} className="hover:bg-slate-50/80 transition-colors">
                        {/* 1. Registration Date */}
                        <td className="py-2 px-2.5 font-mono text-[11px] whitespace-nowrap text-slate-600">
                          {r.registration_date || '-'}
                        </td>

                        {/* 2. VCCT ID */}
                        <td className="py-2 px-2.5 font-mono text-xs font-bold whitespace-nowrap text-sky-800">
                          {vcctId}
                        </td>

                        {/* 3. HTS Code */}
                        <td className="py-2 px-2.5 font-mono text-[11px] whitespace-nowrap">
                          {isMissingHts ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              ខ្វះ HTS Code
                            </span>
                          ) : (
                            <span className="text-slate-900 font-semibold">{r.hts_code}</span>
                          )}
                        </td>

                        {/* 4. UUIC */}
                        <td className="py-2 px-2.5 font-mono font-semibold whitespace-nowrap">
                          {isMissingUuic ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              គ្មាន UUIC
                            </span>
                          ) : (
                            <span className="text-slate-900">{r.uuic}</span>
                          )}
                        </td>

                        {/* 5. Facility / Site */}
                        <td className="py-2 px-2.5 whitespace-nowrap">
                          <div className="font-medium text-slate-800 text-[11.5px] max-w-[130px] truncate" title={r.site_name}>
                            {r.site_name || r.site_code}
                          </div>
                          <div className="text-[10px] text-slate-400">{r.province_name}</div>
                        </td>

                        {/* 6. Sex / Age */}
                        <td className="py-2 px-2.5 whitespace-nowrap text-[11px]">
                          {isInvalidAge ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                              ⚠️ {sexLabel} / {r.age !== null ? `${r.age} ឆ្នាំ` : 'គ្មាន'}
                            </span>
                          ) : (
                            <span>
                              {sexLabel} / {r.age} ឆ្នាំ
                            </span>
                          )}
                        </td>

                        {/* 7. Occupation */}
                        <td className="py-2 px-2.5 whitespace-nowrap text-[11px]">
                          {isMaleHousewife || isUnder15Job ? (
                            <span
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200"
                              title={isMaleHousewife ? 'ភេទប្រុស ចុះជាស្ត្រីមេផ្ទះ' : 'អាយុក្រោម ១៥ ឆ្នាំ មានមុខរបរ'}
                            >
                              ⚠️ {r.occupation_name}
                            </span>
                          ) : (
                            <span className="text-slate-700">{r.occupation_name}</span>
                          )}
                        </td>

                        {/* 8. Marital Status */}
                        <td className="py-2 px-2.5 whitespace-nowrap text-[11px]">
                          {isUnder15Marital ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              ⚠️ {r.marital_status_name}
                            </span>
                          ) : (
                            <span className="text-slate-600">{r.marital_status_name}</span>
                          )}
                        </td>

                        {/* 9. Education Level */}
                        <td className="py-2 px-2.5 whitespace-nowrap text-[11px]">
                          {isUnder15Education ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              ⚠️ {r.education_name}
                            </span>
                          ) : (
                            <span className="text-slate-600">{r.education_name}</span>
                          )}
                        </td>

                        {/* 10. Client Type */}
                        <td className="py-2 px-2.5 whitespace-nowrap text-[11px]">
                          {isUnder15Kp ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              ⚠️ {r.target_group_name}
                            </span>
                          ) : (
                            <span className="text-slate-700 truncate max-w-[120px] block" title={r.target_group_name}>
                              {r.target_group_name || 'មិនស្គាល់'}
                            </span>
                          )}
                        </td>

                        {/* 11. HIV Result */}
                        <td className="py-2 px-2.5 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded text-[10.5px] font-bold ${
                              isReactive
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : isNegative
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : isInconclusive
                                ? 'bg-purple-50 text-purple-800 border border-purple-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {isReactive ? 'វិជ្ជមាន (2)' : isNegative ? 'អវិជ្ជមាន (1)' : isInconclusive ? 'មិនច្បាស់ (3)' : 'មិនបានជ្រើស (0)'}
                          </span>
                        </td>

                        {/* 12. Referral to ART */}
                        <td className="py-2 px-2.5 whitespace-nowrap text-[11px]">
                          {isReactiveUnlinked ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                              ⚠️ មិនទាន់ភ្ជាប់ ART
                            </span>
                          ) : Number(r.refer_to_service_id) === 1 ? (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10.5px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                              ✓ បញ្ជូនទៅ ART
                            </span>
                          ) : (
                            <span className="text-slate-400">គ្មាន</span>
                          )}
                        </td>

                        {/* 13. Detected Issues Badges */}
                        <td className="py-2 px-2.5">
                          <div className="flex flex-wrap gap-1 max-w-[220px]">
                            {r.flags && r.flags.length > 0 ? (
                              r.flags.map((flag, fIdx) => (
                                <span
                                  key={fIdx}
                                  className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-rose-50 text-rose-800 border border-rose-200 whitespace-nowrap"
                                >
                                  {flag}
                                </span>
                              ))
                            ) : (
                              <span className="text-[10.5px] text-slate-400">-</span>
                            )}
                          </div>
                        </td>

                        {/* 14. Actions */}
                        <td className="py-2 px-2.5 text-right whitespace-nowrap">
                          {onSelectRecord ? (
                            <button
                              type="button"
                              onClick={() => onSelectRecord(r)}
                              className="px-2 py-1 rounded border border-slate-200 bg-white text-[11px] font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer shadow-2xs"
                            >
                              លម្អិត
                            </button>
                          ) : onDrillDownToLineList ? (
                            <button
                              type="button"
                              onClick={() => onDrillDownToLineList(r)}
                              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                              title="មើលក្នុងបញ្ជីឈ្មោះ"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </button>
                          ) : null}
                        </td>
                      </tr>
                    );
                  })
                ) : !isLoadingRecords ? (
                  <tr>
                    <td colSpan={14} className="py-12 text-center text-slate-400 text-xs">
                      <div className="flex flex-col items-center justify-center gap-1.5">
                        <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                        <span className="font-medium text-slate-700">ពុំមានកំហុសទិន្នន័យសម្រាប់វិធាននេះឡើយ</span>
                        <span className="text-[11px] text-slate-400">ទិន្នន័យត្រឹមត្រូវ និងស៊ីសង្វាក់គ្នាល្អ!</span>
                      </div>
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          {pagination.total > 0 && (
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <div className="flex items-center gap-2.5">
                <span>
                  ទំព័រ {pagination.page} នៃ {pagination.totalPages} (សរុប {pagination.total.toLocaleString()} ករណី)
                </span>
                <button
                  type="button"
                  onClick={handleExportExcel}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-emerald-300 bg-emerald-50 text-emerald-800 font-semibold text-[11px] hover:bg-emerald-100 transition-all cursor-pointer active:scale-95"
                  title="ទាញយកបញ្ជីកំហុសទាំងអស់ជា Excel"
                >
                  <FileSpreadsheet className="h-3 w-3 text-emerald-600" />
                  <span>Excel</span>
                </button>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => loadFlaggedRecords(pagination.page - 1)}
                  disabled={pagination.page <= 1 || isLoadingRecords}
                  className="px-2 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 cursor-pointer text-xs"
                >
                  ថយក្រោយ
                </button>
                <button
                  type="button"
                  onClick={() => loadFlaggedRecords(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages || isLoadingRecords}
                  className="px-2 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 cursor-pointer text-xs"
                >
                  បន្ទាប់
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 5. Facility Quality League Table */}
        <div className="w-full rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs flex flex-col relative overflow-hidden">
          {isRefreshing && <DQLoadingOverlay label="កំពុងធ្វើបច្ចុប្បន្នភាព..." />}

          {/* Header */}
          <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-100">
                <Building2 className="h-4 w-4" />
              </span>
              <h3 className="text-xs font-bold text-slate-800">
                មូលដ្ឋានមានកំហុសច្រើនជាងគេ (Facilities with Quality Issues)
              </h3>
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {facilities.length} មូលដ្ឋាន
            </span>
          </div>

          {/* 2-Column Responsive Grid */}
          <div className="my-2.5">
            {facilities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {facilities.map((fac, idx) => (
                  <div
                    key={fac.siteCode || idx}
                    className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/40 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between gap-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <span className="h-5 w-5 rounded-full bg-slate-200 text-slate-700 text-[10.5px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-bold text-slate-800" title={fac.siteName}>
                              {fac.siteName || fac.siteCode}
                            </span>
                            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                              {fac.siteCode}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {fac.provinceName} — {fac.odName}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          {fac.totalIssues.toLocaleString()} កំហុស
                        </span>
                      </div>
                    </div>

                    {/* Micro Breakdown Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-slate-200/60">
                      {fac.htsMissing > 0 && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200/80">
                          ខ្វះ HTS: {fac.htsMissing}
                        </span>
                      )}
                      {fac.reactiveUnlinked > 0 && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-rose-50 text-rose-700 border border-rose-200/80">
                          មិនទាន់ភ្ជាប់ ART: {fac.reactiveUnlinked}
                        </span>
                      )}
                      {fac.under15Occupation > 0 && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-50 text-purple-700 border border-purple-200/80">
                          អាយុ &lt;15 មានមុខរបរ: {fac.under15Occupation}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : !isLoadingSummary ? (
              <div className="py-10 text-center text-slate-400 text-xs">
                <CheckCircle2 className="h-6 w-6 text-emerald-500 mx-auto mb-1" />
                <span>ពុំមានមូលដ្ឋានណាមានបញ្ហាគុណភាពទិន្នន័យឡើយ</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataQualityDashboard;
