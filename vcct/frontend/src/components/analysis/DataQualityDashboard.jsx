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
  FileText,
  BadgeAlert,
  HelpCircle,
  FileWarning,
  FileSpreadsheet,
  Loader2,
} from 'lucide-react';
import {
  fetchDataQualitySummary,
  fetchDataQualityRecords,
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
  const [summaryData, setSummaryData] = useState(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  const [selectedRule, setSelectedRule] = useState('all_issues');

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

  useEffect(() => {
    loadSummary();
  }, [loadSummary, refreshTrigger]);

  // 2. Load Flagged Records for the Selected Rule
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
    return issuesByType.filter((r) => r.category === selectedCategory);
  }, [issuesByType, selectedCategory]);

  const isInitialLoading = !summaryData && isLoadingSummary;
  const isRefreshing = !!summaryData && isLoadingSummary;

  // Filter records by search
  const filteredRecords = useMemo(() => {
    if (!searchQuery.trim()) return records;
    const q = searchQuery.toLowerCase().trim();
    return records.filter(
      (r) =>
        (r.uuic && r.uuic.toLowerCase().includes(q)) ||
        (r.site_name && r.site_name.toLowerCase().includes(q)) ||
        (r.site_code && r.site_code.toLowerCase().includes(q)) ||
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
      const filename = `VCCT_DataQuality_Audit_${new Date().toISOString().slice(0, 10)}.xlsx`;
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
        labelKh: 'បញ្ជីកំណត់ត្រាដែលមានកំហុសទាំងអស់ (All Quality Issues)',
        count: overall.totalIssues,
        severity: 'high',
      };
    }
    return issuesByType.find((i) => i.id === selectedRule) || {
      labelKh: 'កំណត់ត្រាផ្ទៀងផ្ទាត់',
      count: 0,
      severity: 'medium',
    };
  }, [selectedRule, overall.totalIssues, issuesByType]);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50/50 relative">
      {/* Background Refetch Top Shimmer Bar */}
      {isRefreshing && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-sky-200 overflow-hidden z-30">
          <div className="h-full bg-sky-600 animate-[indeterminate_1.5s_infinite_linear] origin-left w-full" />
        </div>
      )}

      {/* 1. Full-Width Sticky Sub-Header Bar (Consistent across all pages, no outer padding) */}
      <div className="sticky top-0 z-20 w-full border-b border-slate-200/90 bg-white/95 px-4 py-2 backdrop-blur-xs shadow-2xs flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-700 flex items-center justify-center border border-emerald-200/50">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <h1 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <span>ផ្ទាំងត្រួតពិនិត្យគុណភាពទិន្នន័យ VCCT</span>
            <span className="text-[11px] font-semibold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-full shadow-2xs">
              NCHADS Standard Rules
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadSummary}
            disabled={isLoadingSummary}
            className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-md border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all text-xs font-medium shadow-2xs cursor-pointer active:scale-95 disabled:opacity-70"
            title="ទាញយកទិន្នន័យគុណភាពឡើងវិញ (Refresh)"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-slate-400 ${isLoadingSummary ? 'animate-spin text-sky-500' : ''}`} />
            <span>{isLoadingSummary ? 'កំពុងទាញយក...' : 'ផ្ទុកឡើងវិញ'}</span>
          </button>
        </div>
      </div>

      {/* Scrollable Dashboard Body */}
      <div className="flex-1 flex flex-col gap-3.5 px-4 py-3 min-h-0 overflow-y-auto">
        {/* 2. Top 4 High-Consistency KPI Cards (Compact, clean, no sub-labels) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {/* Card 1: Data Quality Score */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-2.5 shadow-2xs hover:shadow-xs transition-all h-[76px] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs h-5">
            <span className="text-[11.5px] font-medium text-slate-600 flex items-center gap-1.5">
              <span className="p-1 rounded-md bg-emerald-50 text-emerald-600">
                <ShieldCheck className="h-3 w-3" />
              </span>
              សន្ទស្សន៍គុណភាព (DQ)
            </span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${
                overall.dqScore >= 90
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                  : overall.dqScore >= 75
                  ? 'bg-amber-50 text-amber-700 border-amber-100'
                  : 'bg-rose-50 text-rose-700 border-rose-100'
              }`}
            >
              {overall.dqScore >= 90 ? 'កម្រិតល្អ' : overall.dqScore >= 75 ? 'ល្អបង្គួរ' : 'ត្រូវការកែលម្អ'}
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span
              className={`text-xl font-bold font-mono tracking-tight ${
                overall.dqScore >= 90 ? 'text-emerald-600' : overall.dqScore >= 75 ? 'text-amber-600' : 'text-rose-600'
              }`}
            >
              {isInitialLoading ? '--' : `${overall.dqScore}%`}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">ភាពត្រឹមត្រូវ</span>
          </div>
        </div>

        {/* Card 2: Total Quality Flags */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-2.5 shadow-2xs hover:shadow-xs transition-all h-[76px] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs h-5">
            <span className="text-[11.5px] font-medium text-slate-600 flex items-center gap-1.5">
              <span className="p-1 rounded-md bg-amber-50 text-amber-600">
                <AlertTriangle className="h-3 w-3" />
              </span>
              កំណត់ត្រាមានកំហុស
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {overall.totalTested > 0 ? ((overall.totalIssues / overall.totalTested) * 100).toFixed(1) : 0}%
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono tracking-tight text-amber-600">
              {isInitialLoading ? '--' : overall.totalIssues.toLocaleString()}
            </span>
            <span className="text-[11px] text-amber-700 font-medium">ករណី</span>
          </div>
        </div>

        {/* Card 3: Missing UUIC Count */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-2.5 shadow-2xs hover:shadow-xs transition-all h-[76px] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs h-5">
            <span className="text-[11.5px] font-medium text-slate-600 flex items-center gap-1.5">
              <span className="p-1 rounded-md bg-rose-50 text-rose-600">
                <FileWarning className="h-3 w-3" />
              </span>
              ខ្វះលេខកូដ UUIC
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100">
              កម្រិតខ្ពស់
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono tracking-tight text-rose-600">
              {isInitialLoading
                ? '--'
                : (issuesByType.find((i) => i.id === 'missing_uuic')?.count || 0).toLocaleString()}
            </span>
            <span className="text-[11px] text-rose-500 font-medium">ករណី</span>
          </div>
        </div>

        {/* Card 4: HIV Negative Referred to ART (Clinical Contradiction Check) */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-2.5 shadow-2xs hover:shadow-xs transition-all h-[76px] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs h-5">
            <span className="text-[11.5px] font-medium text-slate-600 flex items-center gap-1.5">
              <span className="p-1 rounded-md bg-indigo-50 text-indigo-600">
                <BadgeAlert className="h-3 w-3" />
              </span>
              អវិជ្ជមានបញ្ជូនទៅ ART
            </span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${
                (issuesByType.find((i) => i.id === 'negative_with_referral')?.count || 0) === 0
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                  : 'bg-rose-50 text-rose-700 border-rose-100'
              }`}
            >
              {(issuesByType.find((i) => i.id === 'negative_with_referral')?.count || 0) === 0 ? 'ត្រឹមត្រូវល្អ' : 'មានកំហុស'}
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono tracking-tight text-slate-900">
              {isInitialLoading
                ? '--'
                : (issuesByType.find((i) => i.id === 'negative_with_referral')?.count || 0).toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">ករណីខុសគ្លីនិក</span>
          </div>
        </div>
      </div>

      {/* 3. Validation Rules Grid: Interactive Rule Cards with Click-to-Drilldown */}
      <div className="space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-600" />
            <h2 className="text-xs font-bold text-slate-800">
              វិធានត្រួតពិនិត្យគុណភាពទិន្នន័យ (Data Quality Validation Rules — {issuesByType.length} វិធាន)
            </h2>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              — ចុចលើវិធានដើម្បីពិនិត្យបញ្ជីឈ្មោះអតិថិជនជាក់ស្តែង
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
            បង្ហាញទាំងអស់ ({overall.totalIssues.toLocaleString()})
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-200/50 border border-slate-200/80">
          {[
            { id: 'all', label: `វិធានទាំងអស់ (${issuesByType.length})` },
            { id: 'clinical', label: `🧪 គ្លីនិក & មន្ទីរពិសោធន៍` },
            { id: 'timeline', label: `⏱️ កាលបរិច្ឆេទ & លំដាប់` },
            { id: 'completeness', label: `📋 ភាពពេញលេញទិន្នន័យ` },
            { id: 'logical', label: `⚖️ ភាពស៊ីសង្វាក់តក្កវិជ្ជា` },
          ].map((cat) => {
            const active = selectedCategory === cat.id;
            const countInCat = cat.id === 'all' 
              ? issuesByType.reduce((acc, r) => acc + (r.count > 0 ? 1 : 0), 0)
              : issuesByType.filter(r => r.category === cat.id && r.count > 0).length;

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
                {countInCat > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    active ? 'bg-rose-100 text-rose-700 font-bold' : 'bg-slate-200/80 text-slate-600'
                  }`}>
                    {countInCat}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {displayedRules.map((rule) => {
            const isSelected = selectedRule === rule.id;
            const hasIssues = rule.count > 0;

            const severityBadge =
              rule.severity === 'high'
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : rule.severity === 'medium'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-slate-100 text-slate-700 border-slate-200';

            return (
              <button
                key={rule.id}
                type="button"
                onClick={() => handleSelectRule(rule.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between h-[126px] ${
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
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${severityBadge}`}>
                      {rule.severity === 'high' ? 'កម្រិតខ្ពស់' : rule.severity === 'medium' ? 'កម្រិតមធ្យម' : 'កម្រិតទាប'}
                    </span>
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                        hasIssues ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {rule.count.toLocaleString()}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-800 line-clamp-1">{rule.labelKh}</h3>
                  <div className="text-[10px] font-mono text-slate-400 truncate">{rule.labelEn}</div>
                </div>

                <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10.5px]">
                  <span className="text-slate-400 truncate max-w-[170px]">{rule.description}</span>
                  <ChevronRight className={`h-3 w-3 shrink-0 ${isSelected ? 'text-sky-600' : 'text-slate-300'}`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Flagged Records Drill-Down Table (Full Width) */}
      <div className="w-full rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs flex flex-col relative overflow-hidden min-h-[460px]">
          {isLoadingRecords && <DQLoadingOverlay label="កំពុងទាញកំណត់ត្រាមានកំហុស..." />}

          {/* Table Header Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              <h3 className="text-xs font-bold text-slate-800">{currentRuleMeta.labelKh}</h3>
              <span className="text-[11px] text-slate-400 font-normal">
                ({filteredRecords.length}/{pagination.total.toLocaleString()} កំណត់ត្រា)
              </span>
            </div>

            {/* Search Box & Excel Export */}
            <div className="flex items-center gap-2">
              <div className="relative w-52 sm:w-60">
                <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ស្វែងរកតាម UUIC ឬឈ្មោះមូលដ្ឋាន..."
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
                <span>{isExporting ? 'កំពុងបង្កើត...' : `ទាញយក Excel (${pagination.total.toLocaleString()})`}</span>
              </button>
            </div>
          </div>

          {/* Records Table */}
          <div className="flex-1 overflow-auto custom-scrollbar my-2">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-semibold text-[11px]">
                  <th className="py-2.5 px-2.5 whitespace-nowrap">កាលបរិច្ឆេទចុះឈ្មោះ</th>
                  <th className="py-2.5 px-2.5 whitespace-nowrap">VCCT ID</th>
                  <th className="py-2.5 px-2.5 whitespace-nowrap">លេខកូដ (UUIC)</th>
                  <th className="py-2.5 px-2.5 whitespace-nowrap">មណ្ឌលផ្តល់សេវា</th>
                  <th className="py-2.5 px-2.5 whitespace-nowrap">ភេទ / អាយុ</th>
                  <th className="py-2.5 px-2.5 whitespace-nowrap">ប្រភេទអតិថិជន</th>
                  <th className="py-2.5 px-2.5 whitespace-nowrap">លទ្ធផល HIV</th>
                  <th className="py-2.5 px-2.5 whitespace-nowrap">តេស្ត RTRI</th>
                  <th className="py-2.5 px-2.5 whitespace-nowrap">ការបញ្ជូន ART</th>
                  <th className="py-2.5 px-2.5 whitespace-nowrap">ប្រឹក្សាក្រោយតេស្ត</th>
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
                    const isMissingUuic = !r.uuic || !r.uuic.trim();
                    const isInvalidAge = !r.dob || r.age === null || r.age === undefined || Number(r.age) < 0 || Number(r.age) > 105;
                    const isMissingTarget = !r.patient_type_id || Number(r.patient_type_id) === 0;
                    const isGenderConflict =
                      (Number(r.sex) === 1 && [1, 8].includes(Number(r.patient_type_id))) ||
                      (Number(r.sex) === 0 && [2, 7].includes(Number(r.patient_type_id)));
                    const isCounselingBeforeReg =
                      Boolean(r.post_counseling_date && r.registration_date && r.post_counseling_date < r.registration_date);
                    const isReactiveUnlinked = isReactive && (!r.refer_to_service_id || Number(r.refer_to_service_id) !== 1);
                    const isNegativeWithArt = isNegative && Number(r.refer_to_service_id) === 1;
                    const isReactiveMissingRtri = isReactive && (!r.rtri_result_id || Number(r.rtri_result_id) === 0);
                    const isRtriOnNegative = !isReactive && (Number(r.rtri_result_id) === 1 || Number(r.rtri_result_id) === 2);

                    const sexLabel = Number(r.sex) === 1 ? 'ប្រុស' : Number(r.sex) === 0 ? 'ស្រី' : 'TG';

                    return (
                      <tr key={`${r.site_code}-${r.vcct_id}-${idx}`} className="hover:bg-slate-50/80 transition-colors">
                        {/* 1. Registration Date */}
                        <td className="py-2 px-2.5 font-mono text-[11px] whitespace-nowrap text-slate-600">
                          {isCounselingBeforeReg ? (
                            <span
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10.5px] font-bold bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs"
                              title={`ថ្ងៃចុះឈ្មោះ (${r.registration_date}) ក្រោយថ្ងៃប្រឹក្សា (${r.post_counseling_date})`}
                            >
                              ⚠️ {r.registration_date || '-'}
                            </span>
                          ) : (
                            r.registration_date || '-'
                          )}
                        </td>

                        {/* 2. VCCT ID */}
                        <td className="py-2 px-2.5 font-mono text-xs font-bold whitespace-nowrap text-sky-800">
                          {vcctId}
                        </td>

                        {/* 3. UUIC (Highlighted in Red if Missing) */}
                        <td className="py-2 px-2.5 font-mono font-semibold whitespace-nowrap">
                          {isMissingUuic ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-bold bg-rose-100 text-rose-800 border border-rose-300 shadow-2xs">
                              ⚠️ គ្មាន UUIC
                            </span>
                          ) : (
                            <span className="text-slate-900">{r.uuic}</span>
                          )}
                        </td>

                        {/* 4. Facility / Site */}
                        <td className="py-2 px-2.5 whitespace-nowrap">
                          <div className="font-medium text-slate-800 text-[11.5px] max-w-[140px] truncate" title={r.site_name}>
                            {r.site_name || r.site_code}
                          </div>
                          <div className="text-[10px] text-slate-400">{r.province_name}</div>
                        </td>

                        {/* 5. Sex / Age (Highlighted in Red if Invalid Age) */}
                        <td className="py-2 px-2.5 whitespace-nowrap text-[11px]">
                          {isInvalidAge ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10.5px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                              ⚠️ {sexLabel} / {r.age !== null && r.age !== undefined ? `${r.age} ឆ្នាំ` : 'គ្មានអាយុ'}
                            </span>
                          ) : (
                            <span>
                              {sexLabel}
                              {r.age !== null && r.age !== undefined ? ` / ${r.age} ឆ្នាំ` : ''}
                            </span>
                          )}
                        </td>

                        {/* 6. Client Type (Highlighted if Missing or Conflict) */}
                        <td className="py-2 px-2.5 whitespace-nowrap text-[11px]">
                          {isMissingTarget ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10.5px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                              ⚠️ ខ្វះប្រភេទអតិថិជន
                            </span>
                          ) : isGenderConflict ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10.5px] font-bold bg-rose-100 text-rose-800 border border-rose-300" title="ភេទមិនត្រូវនឹងប្រភេទអតិថិជន">
                              ⚠️ {r.target_group_name}
                            </span>
                          ) : (
                            <span className="text-slate-700 truncate max-w-[120px] block" title={r.target_group_name}>
                              {r.target_group_name || 'មិនស្គាល់'}
                            </span>
                          )}
                        </td>

                        {/* 7. HIV Result */}
                        <td className="py-2 px-2.5 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded text-[10.5px] font-bold ${
                              isReactive
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : isNegative
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : isInconclusive
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {isReactive ? 'វិជ្ជមាន (2)' : isNegative ? 'អវិជ្ជមាន (1)' : isInconclusive ? 'មិនច្បាស់ (3)' : '-'}
                          </span>
                        </td>

                        {/* 8. RTRI Test Result (Highlighted if Missing on Reactive or on Negative) */}
                        <td className="py-2 px-2.5 whitespace-nowrap text-[11px]">
                          {isReactiveMissingRtri ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10.5px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                              ⚠️ ខ្វះតេស្ត RTRI
                            </span>
                          ) : isRtriOnNegative ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10.5px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                              ⚠️ តេស្តលើអវិជ្ជមាន
                            </span>
                          ) : Number(r.rtri_result_id) === 1 ? (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10.5px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                              ឆ្លងថ្មី (Recent)
                            </span>
                          ) : Number(r.rtri_result_id) === 2 ? (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10.5px] font-medium bg-slate-100 text-slate-600">
                              ឆ្លងយូរ (Long-term)
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>

                        {/* 9. Referral to ART (Highlighted if Reactive Unlinked or Negative with ART) */}
                        <td className="py-2 px-2.5 whitespace-nowrap text-[11px]">
                          {isReactiveUnlinked ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10.5px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                              ⚠️ មិនបានបញ្ជូន ART
                            </span>
                          ) : isNegativeWithArt ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10.5px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                              ⚠️ អវិជ្ជមានតែបញ្ជូន
                            </span>
                          ) : Number(r.refer_to_service_id) === 1 ? (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10.5px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                              ✓ បញ្ជូនទៅ ART
                            </span>
                          ) : Number(r.refer_to_service_id) > 1 ? (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10.5px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                              បញ្ជូនបន្ត
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>

                        {/* 10. Post-Counseling Date (Highlighted in Red if Before Reg Date) */}
                        <td className="py-2 px-2.5 whitespace-nowrap text-[11px]">
                          {isCounselingBeforeReg ? (
                            <span
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10.5px] font-bold bg-rose-100 text-rose-800 border border-rose-300 font-mono shadow-2xs"
                              title={`កាលបរិច្ឆេទប្រឹក្សា (${r.post_counseling_date}) គឺមុនថ្ងៃចុះឈ្មោះធ្វើតេស្ត (${r.registration_date})`}
                            >
                              ⚠️ {r.post_counseling_date} (ចុះឈ្មោះ៖ {r.registration_date})
                            </span>
                          ) : r.post_counseling_date ? (
                            <span className="font-mono text-slate-700 text-[11px]">{r.post_counseling_date}</span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>

                        {/* 11. Detected Issues Badges */}
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

                        {/* 12. Actions */}
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
                    <td colSpan={12} className="py-12 text-center text-slate-400 text-xs">
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

      {/* 5. Facility Quality League Table Below (2 Columns Layout) */}
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

                  {/* DQ Score progress bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10.5px]">
                      <span className="text-slate-500 font-medium">ពិន្ទុភាពត្រឹមត្រូវទិន្នន័យ (DQ Score)</span>
                      <span
                        className={`font-mono font-bold ${
                          fac.dqScore >= 90
                            ? 'text-emerald-600'
                            : fac.dqScore >= 70
                            ? 'text-amber-600'
                            : 'text-rose-600'
                        }`}
                      >
                        {fac.dqScore}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200/70 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          fac.dqScore >= 90
                            ? 'bg-emerald-500'
                            : fac.dqScore >= 70
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(0, fac.dqScore))}%` }}
                      />
                    </div>
                  </div>

                  {/* Micro Breakdown Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-slate-200/60">
                    {fac.missingUuic > 0 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-rose-50 text-rose-700 border border-rose-200/80">
                        ខ្វះ UUIC: {fac.missingUuic}
                      </span>
                    )}
                    {fac.negativeWithReferral > 0 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                        អវិជ្ជមានបញ្ជូន: {fac.negativeWithReferral}
                      </span>
                    )}
                    {fac.missingTargetGroup > 0 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200/80">
                        ខ្វះប្រភេទអតិថិជន: {fac.missingTargetGroup}
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
