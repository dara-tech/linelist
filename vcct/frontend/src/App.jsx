import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Table, FileSpreadsheet, RefreshCw, Loader2 } from 'lucide-react';
import { Sidebar } from './components/layout/Sidebar';
import { TopContextToolbar } from './components/layout/TopContextToolbar';
import { KPISummary } from './components/linelist/KPISummary';
import { DataTable, ALL_COLUMNS } from './components/linelist/DataTable';
import { RecordDetailSheet } from './components/linelist/RecordDetailSheet';
import { GroupDashboard } from './components/analysis/GroupDashboard';
import { DataQualityDashboard } from './components/analysis/DataQualityDashboard';
import { ArtVcctSummaryReport } from './components/reports/ArtVcctSummaryReport';
import { ArtVcctSiteReport } from './components/reports/ArtVcctSiteReport';
import { fetchHierarchy, fetchMetadata, fetchVCCTLineList, getExcelExportUrl, triggerFileDownload } from './lib/api';

export default function App() {
  const [activeView, setActiveView] = useState('linelist');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  const [hierarchy, setHierarchy] = useState({ provinces: [], ods: [], sites: [] });
  const [metadata, setMetadata] = useState({ targetGroups: [], patientTypes: [] });
  const [lineListData, setLineListData] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, totalPages: 1 });
  const [kpis, setKpis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);

  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const map = {};
    ALL_COLUMNS.forEach((col) => {
      map[col.id] = true;
    });
    return map;
  });

  // Default to current month period (DHIS2 standard)
  const currentPeriod = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const daysInMonth = new Date(y, now.getMonth() + 1, 0).getDate();
    return {
      dateFrom: `${y}-${m}-01`,
      dateTo: `${y}-${m}-${String(daysInMonth).padStart(2, '0')}`,
    };
  }, []);

  // Filters
  const [filters, setFilters] = useState(() => ({
    provinceId: '',
    odCode: '',
    siteCode: '',
    dateFrom: currentPeriod.dateFrom,
    dateTo: currentPeriod.dateTo,
    targetGroupId: '',
    sex: '',
    hivResult: '',
    rtriResult: '',
    unlinkedOnly: '',
    linkedOnly: '',
    search: '',
  }));

  // Selected Record for Drawer
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Refresh trigger counter that increments on manual Run/Refresh click or filter changes
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Initial metadata
  useEffect(() => {
    async function initMeta() {
      try {
        const [hier, meta] = await Promise.all([fetchHierarchy(), fetchMetadata()]);
        if (hier) setHierarchy(hier);
        if (meta) setMetadata(meta);
      } catch (err) {
        console.warn('Initial metadata load error:', err);
      }
    }
    initMeta();
  }, []);

  // Fetch Line List records (50 per page)
  const loadRecords = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      try {
        const res = await fetchVCCTLineList({
          ...filters,
          page,
          limit: 50,
        });

        if (res && res.success) {
          setLineListData(res.data || []);
          setPagination(res.pagination || { page: 1, limit: 50, total: res.data?.length || 0, totalPages: 1 });
          if (res.kpis) setKpis(res.kpis);
        }
      } catch (err) {
        console.error('Failed to load line list:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    loadRecords(1);
  }, [loadRecords]);

  const handleRun = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
    if (activeView === 'linelist') {
      loadRecords(1);
    }
  }, [activeView, loadRecords]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleBatchFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleResetFilters = () => {
    setFilters({
      provinceId: '',
      odCode: '',
      siteCode: '',
      dateFrom: currentPeriod.dateFrom,
      dateTo: currentPeriod.dateTo,
      targetGroupId: '',
      sex: '',
      hivResult: '',
      rtriResult: '',
      unlinkedOnly: '',
      linkedOnly: '',
      search: '',
    });
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleToggleColumn = (id) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [id]: prev[id] === false ? true : false,
    }));
  };

  const handleResetColumns = () => {
    const map = {};
    ALL_COLUMNS.forEach((col) => {
      map[col.id] = true;
    });
    setVisibleColumns(map);
  };

  const handleApplyColumns = (newMap) => {
    setVisibleColumns(newMap);
  };

  const handleExportLineListExcel = async () => {
    setIsExportingExcel(true);
    try {
      const url = getExcelExportUrl(filters);
      const filename = `VCCT_LineList_${new Date().toISOString().slice(0, 10)}.xlsx`;
      await triggerFileDownload(url, filename);
    } catch (err) {
      console.error('Export Excel failed:', err);
      alert('ការទាញយក Excel បរាជ័យ៖ ' + (err.message || 'Error'));
    } finally {
      setIsExportingExcel(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--app-canvas)] font-sans text-slate-900">
      {/* App Sidebar (npdcapture style) */}
      <Sidebar
        activeView={activeView}
        onSelectView={setActiveView}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
      />

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Context Toolbar with Pill Selectors & Modal Popups (npdcapture pattern) */}
        <TopContextToolbar
          filters={filters}
          onChangeFilter={handleFilterChange}
          onBatchChangeFilter={handleBatchFilterChange}
          onResetFilters={handleResetFilters}
          provinces={hierarchy.provinces}
          ods={hierarchy.ods}
          sites={hierarchy.sites}
          targetGroups={metadata.targetGroups}
          onRefresh={handleRun}
          totalRecords={pagination.total}
          activeView={activeView}
          columns={ALL_COLUMNS}
          visibleColumns={visibleColumns}
          onToggleColumn={handleToggleColumn}
          onResetColumns={handleResetColumns}
          onApplyColumns={handleApplyColumns}
        />

        {activeView === 'linelist' ? (
          <div className="flex-1 flex flex-col min-h-0 bg-slate-50/50">
            {/* 1. Full-Width Sticky Sub-Header Bar (Consistent across all pages, no outer padding) */}
            <div className="sticky top-0 z-20 w-full border-b border-slate-200/90 bg-white/95 px-4 py-2 backdrop-blur-xs shadow-2xs flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-sky-500/10 text-sky-700 flex items-center justify-center border border-sky-200/50">
                  <Table className="h-4 w-4" />
                </div>
                <h1 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
                  <span>បញ្ជីឈ្មោះអ្នកទទួលសេវា VCCT</span>
                  {pagination.total !== undefined && (
                    <span className="text-[11px] font-semibold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-full shadow-2xs">
                      {pagination.total.toLocaleString()} កំណត់ត្រា
                    </span>
                  )}
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRun}
                  disabled={isLoading}
                  className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-md border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all text-xs font-medium shadow-2xs cursor-pointer active:scale-95 disabled:opacity-70"
                  title="ទាញទិន្នន័យឡើងវិញ (Refresh)"
                >
                  <RefreshCw className={`h-3.5 w-3.5 text-slate-400 ${isLoading ? 'animate-spin text-sky-500' : ''}`} />
                  <span>{isLoading ? 'កំពុងទាញយក...' : 'ផ្ទុកឡើងវិញ'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportLineListExcel}
                  disabled={isExportingExcel}
                  className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-md border border-emerald-600 bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 shadow-2xs transition-all cursor-pointer active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed"
                  title="ទាញយកកំណត់ត្រាទាំងអស់ជា Excel"
                >
                  {isExportingExcel ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                  ) : (
                    <FileSpreadsheet className="h-3.5 w-3.5 text-white" />
                  )}
                  <span>{isExportingExcel ? 'កំពុងបង្កើត...' : 'ទាញយក Excel'}</span>
                </button>
              </div>
            </div>

            {/* Scrollable Workspace: KPI cards + Line List Table */}
            <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
              <KPISummary
                kpis={kpis}
                filters={filters}
                onChangeFilter={handleFilterChange}
                onBatchChangeFilter={handleBatchFilterChange}
                onResetPresets={() => {
                  setFilters((prev) => ({
                    ...prev,
                    hivResult: '',
                    rtriResult: '',
                    unlinkedOnly: '',
                    linkedOnly: '',
                  }));
                  setRefreshTrigger((prev) => prev + 1);
                }}
              />

              <main className="flex-1 flex flex-col min-h-0 px-4 py-2.5">
                <DataTable
                  data={lineListData}
                  pagination={pagination}
                  onPageChange={(p) => loadRecords(p)}
                  isLoading={isLoading}
                  onSelectRecord={(rec) => setSelectedRecord(rec)}
                  visibleColumns={visibleColumns}
                  filters={filters}
                />
              </main>
            </div>
          </div>
        ) : activeView === 'analysis' ? (
          <GroupDashboard
            filters={filters}
            refreshTrigger={refreshTrigger}
            onDrillDownToLineList={(tgId) => {
              handleFilterChange('targetGroupId', String(tgId));
              setActiveView('linelist');
            }}
          />
        ) : activeView === 'data_quality' ? (
          <DataQualityDashboard
            filters={filters}
            refreshTrigger={refreshTrigger}
            onSelectRecord={(rec) => setSelectedRecord(rec)}
            onDrillDownToLineList={(rec) => {
              if (rec.site_code) handleFilterChange('siteCode', rec.site_code);
              setActiveView('linelist');
            }}
          />
        ) : activeView === 'site_report' ? (
          <ArtVcctSiteReport
            filters={filters}
            provinces={hierarchy.provinces}
            ods={hierarchy.ods}
            refreshTrigger={refreshTrigger}
            onSelectView={setActiveView}
          />
        ) : (
          <ArtVcctSummaryReport
            filters={filters}
            provinces={hierarchy.provinces}
            refreshTrigger={refreshTrigger}
            onSelectView={setActiveView}
          />
        )}

        {/* Record Detail Sheet */}
        <RecordDetailSheet
          record={selectedRecord}
          isOpen={Boolean(selectedRecord)}
          onClose={() => setSelectedRecord(null)}
        />
      </div>
    </div>
  );
}
