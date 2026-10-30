import React, { useState, useMemo } from 'react';
import {
  Building2,
  Calendar,
  Tag,
  Activity,
  Download,
  RefreshCw,
  Search,
  SlidersHorizontal,
  ChevronDown,
  X,
  Play,
} from 'lucide-react';
import { OrgUnitTreeModal } from '../modals/OrgUnitTreeModal';
import { PeriodGridModal } from '../modals/PeriodGridModal';
import { ColumnConfigModal } from '../modals/ColumnConfigModal';
import { DownloadModal } from '../modals/DownloadModal';
import { Button } from '../ui/button';
import { Select } from '../ui/select';
import { cn } from '../../lib/utils';

export function TopContextToolbar({
  filters,
  onChangeFilter,
  onBatchChangeFilter,
  onResetFilters,
  provinces = [],
  ods = [],
  sites = [],
  targetGroups = [],
  onRefresh,
  totalRecords = 0,
  activeView = 'linelist',
  columns = [],
  visibleColumns = {},
  onToggleColumn,
  onResetColumns,
  onApplyColumns,
}) {
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false);
  const [isColModalOpen, setIsColModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  // Compute selected names for labels
  const selectedSite = sites.find((s) => String(s.site_code) === String(filters.siteCode));
  const selectedOd = ods.find((o) => String(o.od_code) === String(filters.odCode));
  const selectedProv = provinces.find((p) => String(p.id) === String(filters.provinceId));

  const orgLabel = selectedSite
    ? selectedSite.site_name
    : selectedOd
    ? `ស្រុកប្រតិបត្តិ៖ ${selectedOd.name_kh || selectedOd.name_en}`
    : selectedProv
    ? `ខេត្ត៖ ${selectedProv.province_kh || selectedProv.province_en}`
    : 'គ្រប់ទីតាំង (ទូទាំងប្រទេស)';

  const periodLabel = useMemo(() => {
    if (!filters.dateFrom || !filters.dateTo) return 'គ្រប់កាលបរិច្ឆេទទាំងអស់';
    const mMatch = filters.dateFrom.match(/^(\d{4})-(\d{2})-01$/);
    if (mMatch && filters.dateTo.startsWith(`${mMatch[1]}-${mMatch[2]}`)) {
      const y = mMatch[1];
      const mIdx = parseInt(mMatch[2], 10) - 1;
      const khMonths = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];
      if (khMonths[mIdx]) return `ខែ${khMonths[mIdx]} ឆ្នាំ ${y}`;
    }
    const qMatch = filters.dateFrom.match(/^(\d{4})-(01|04|07|10)-01$/);
    if (qMatch) {
      const qMap = { '01': '១', '04': '២', '07': '៣', '10': '៤' };
      const qNum = qMap[qMatch[2]];
      if (qNum) return `ត្រីមាសទី ${qNum} ឆ្នាំ ${qMatch[1]}`;
    }
    if (filters.dateFrom.endsWith('-01-01') && filters.dateTo.endsWith('-12-31') && filters.dateFrom.substring(0, 4) === filters.dateTo.substring(0, 4)) {
      return `ឆ្នាំ ${filters.dateFrom.substring(0, 4)}`;
    }
    return `${filters.dateFrom} ដល់ ${filters.dateTo}`;
  }, [filters.dateFrom, filters.dateTo]);

  const iconBtnSecondary =
    'flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer disabled:opacity-40';
  const iconBtnPrimary =
    'flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--app-header-bar-bg)] text-white hover:bg-[var(--app-header-bar-bg-hover)] transition-colors cursor-pointer disabled:opacity-40 shadow-xs';

  return (
    <div className="w-full border-b border-slate-200/90 bg-white px-4 py-2 md:bg-slate-50/95">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Left Side: Selectors (identical to npdcapture TrackerContextSelector) */}
        <div className="flex flex-1 flex-wrap items-center gap-1.5 min-w-0">
          {/* Site / Org Unit Trigger */}
          <button
            type="button"
            onClick={() => setIsOrgModalOpen(true)}
            className={cn(
              'app-filter-control flex h-8 min-w-[150px] max-w-[240px] items-center justify-between rounded-md border bg-white px-2.5 py-1 text-[13px] font-normal transition-colors text-left outline-none cursor-pointer',
              filters.siteCode || filters.odCode || filters.provinceId
                ? 'border-[var(--app-header-bar-bg)] bg-sky-50/60 text-[var(--app-header-bar-bg)] font-semibold'
                : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            )}
            title={orgLabel}
          >
            <div className="flex items-center gap-1.5 truncate pr-1">
              <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{orgLabel}</span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          </button>

          {/* Period Trigger */}
          <button
            type="button"
            onClick={() => setIsPeriodModalOpen(true)}
            className={cn(
              'app-filter-control flex h-8 min-w-[140px] max-w-[220px] items-center justify-between rounded-md border bg-white px-2.5 py-1 text-[13px] font-normal transition-colors text-left outline-none cursor-pointer',
              filters.dateFrom || filters.dateTo
                ? 'border-[var(--app-header-bar-bg)] bg-sky-50/60 text-[var(--app-header-bar-bg)] font-semibold'
                : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            )}
            title={periodLabel}
          >
            <div className="flex items-center gap-1.5 truncate pr-1">
              <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{periodLabel}</span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          </button>

          {/* Key Pop Dropdown (npdcapture Select UI) */}
          <Select
            value={filters.targetGroupId || ''}
            onValueChange={(val) => onChangeFilter('targetGroupId', val)}
            options={[
              { value: '', label: 'គ្រប់ក្រុមប្រឈម' },
              ...targetGroups.map((tg) => ({
                value: String(tg.Tid),
                label: tg.Targroupkh || tg.Targroup || `ក្រុម ${tg.Tid}`,
              })),
            ]}
            placeholder="គ្រប់ក្រុមប្រឈម"
            searchable
            className={cn(
              'min-w-[150px]',
              filters.targetGroupId &&
                'border-[var(--app-header-bar-bg)] font-semibold text-[var(--app-header-bar-bg)] bg-sky-50/60'
            )}
          />

          {/* HIV Result Dropdown (npdcapture Select UI) */}
          <Select
            value={filters.hivResult || ''}
            onValueChange={(val) => {
              if (onBatchChangeFilter) {
                onBatchChangeFilter({
                  hivResult: val,
                  ...(val !== '2' ? { unlinkedOnly: '', linkedOnly: '', rtriResult: '' } : {}),
                });
              } else {
                onChangeFilter('hivResult', val);
              }
            }}
            options={[
              { value: '', label: 'គ្រប់លទ្ធផល' },
              { value: '2', label: 'វិជ្ជមាន' },
              { value: '1', label: 'អវិជ្ជមាន' },
              { value: '3', label: 'មិនច្បាស់លាស់' },
            ]}
            placeholder="គ្រប់លទ្ធផល"
            className={cn(
              'min-w-[130px]',
              filters.hivResult &&
                'border-[var(--app-header-bar-bg)] font-semibold text-[var(--app-header-bar-bg)] bg-sky-50/60'
            )}
          />

          {/* Search Input */}
          <div className="relative flex items-center">
            <Search className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="ស្វែងរកកូដ, UUIC..."
              value={filters.search || ''}
              onChange={(e) => onChangeFilter('search', e.target.value)}
              className="h-8 w-40 rounded-md border border-slate-200 bg-white pl-8 pr-6 text-[13px] text-slate-800 placeholder-slate-400 outline-none hover:border-slate-300 focus:border-[var(--app-header-bar-bg)] focus:ring-1 focus:ring-[var(--app-header-bar-bg)] transition-colors"
            />
            {filters.search && (
              <button
                type="button"
                onClick={() => onChangeFilter('search', '')}
                className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Primary Run / Execute Action Button */}
          <button
            type="button"
            onClick={onRefresh}
            className="flex h-8 items-center gap-1.5 rounded-md bg-[var(--app-header-bar-bg)] px-3 py-1 text-[13px] font-semibold text-white shadow-xs hover:bg-[var(--app-header-bar-bg-hover)] transition-all cursor-pointer active:scale-95 shrink-0"
            title="ដំណើរការទាញយកទិន្នន័យ (Run / Generate)"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>ដំណើរការ</span>
          </button>
        </div>

        {/* Right Side: Action Controls (npdcapture standard) */}
        <div className="flex shrink-0 items-center gap-1.5">

          {/* Refresh Action */}
          <button
            type="button"
            onClick={onRefresh}
            className={iconBtnSecondary}
            title="ទាញទិន្នន័យឡើងវិញ (Refresh)"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          {/* Configure Columns Action (only on Line List) */}
          {activeView === 'linelist' && (
            <button
              type="button"
              onClick={() => setIsColModalOpen(true)}
              className={iconBtnSecondary}
              title="កំណត់បង្ហាញជួរឈរ (Columns)"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          )}

          {/* Export Action */}
          <button
            type="button"
            onClick={() => setIsDownloadModalOpen(true)}
            className={iconBtnSecondary}
            title={activeView === 'provincial_report' ? 'ទាញយករបាយការណ៍សង្ខេប (Excel)' : 'ទាញយកទិន្នន័យ (Export)'}
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Facility Tree Modal */}
      <OrgUnitTreeModal
        isOpen={isOrgModalOpen}
        onClose={() => setIsOrgModalOpen(false)}
        provinces={provinces}
        ods={ods}
        sites={sites}
        selectedProvinceId={filters.provinceId}
        selectedOdCode={filters.odCode}
        selectedSiteCode={filters.siteCode}
        onSelectOrgUnit={(provId, odCode, siteCode) => {
          if (onBatchChangeFilter) {
            onBatchChangeFilter({ provinceId: provId, odCode, siteCode });
          } else {
            onChangeFilter('provinceId', provId);
            onChangeFilter('odCode', odCode);
            onChangeFilter('siteCode', siteCode);
          }
        }}
      />

      {/* Period Grid Modal */}
      <PeriodGridModal
        isOpen={isPeriodModalOpen}
        onClose={() => setIsPeriodModalOpen(false)}
        dateFrom={filters.dateFrom}
        dateTo={filters.dateTo}
        onSelectPeriod={(from, to) => {
          if (onBatchChangeFilter) {
            onBatchChangeFilter({ dateFrom: from, dateTo: to });
          } else {
            onChangeFilter('dateFrom', from);
            onChangeFilter('dateTo', to);
          }
        }}
      />

      {/* Column Config Modal */}
      <ColumnConfigModal
        isOpen={isColModalOpen}
        onClose={() => setIsColModalOpen(false)}
        columns={columns}
        visibleColumns={visibleColumns}
        onToggleColumn={onToggleColumn}
        onResetColumns={onResetColumns}
        onApplyColumns={onApplyColumns}
      />

      {/* Export / Download Modal */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        filters={filters}
        totalRecords={totalRecords}
        activeView={activeView}
      />
    </div>
  );
}
export default TopContextToolbar;
