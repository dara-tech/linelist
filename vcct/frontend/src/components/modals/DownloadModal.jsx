import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Download, X, Check, FileSpreadsheet, FileText, FileCode } from 'lucide-react';
import { Button } from '../ui/button';
import { MODAL } from '../../lib/overlayUi';
import { cn } from '../../lib/utils';
import { ALL_COLUMNS } from '../linelist/DataTable';
import { 
  getExcelExportUrl, 
  getArtVcctExcelExportUrl, 
  getArtVcctSiteExcelExportUrl, 
  getDataQualityExcelExportUrl,
  triggerFileDownload,
} from '../../lib/api';

export function DownloadModal({
  isOpen,
  onClose,
  filters,
  totalRecords = 0,
  activeView = 'linelist',
}) {
  const [downloadFormat, setDownloadFormat] = useState('XLSX');
  const [selectedColIds, setSelectedColIds] = useState(() => ALL_COLUMNS.map((c) => c.id));
  const [exporting, setExporting] = useState(false);

  if (typeof document === 'undefined' || !isOpen) return null;

  const toggleColumn = (id) => {
    setSelectedColIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSelectedColIds(ALL_COLUMNS.map((c) => c.id));
  const clearAll = () => setSelectedColIds([]);

  const handleDownload = async () => {
    setExporting(true);
    try {
      const match = filters?.dateFrom?.match(/^(\d{4})-(\d{2})/);
      let q = '2';
      let y = '2026';
      if (match) {
        y = match[1];
        const m = parseInt(match[2], 10);
        if (m >= 1 && m <= 3) q = '1';
        else if (m >= 4 && m <= 6) q = '2';
        else if (m >= 7 && m <= 9) q = '3';
        else if (m >= 10 && m <= 12) q = '4';
      }

      let url;
      if (activeView === 'provincial_report') {
        url = getArtVcctExcelExportUrl({
          quarter: q,
          year: y,
          dateFrom: filters?.dateFrom,
          dateTo: filters?.dateTo,
        });
      } else if (activeView === 'site_report') {
        url = getArtVcctSiteExcelExportUrl({
          quarter: q,
          year: y,
          dateFrom: filters?.dateFrom,
          dateTo: filters?.dateTo,
          provinceId: filters?.provinceId,
          odCode: filters?.odCode,
          siteCode: filters?.siteCode,
        });
      } else if (activeView === 'data_quality') {
        url = getDataQualityExcelExportUrl(filters);
      } else {
        url = getExcelExportUrl(filters);
      }

      const defaultName = activeView === 'data_quality'
        ? `VCCT_DataQuality_Audit_${new Date().toISOString().slice(0, 10)}.xlsx`
        : activeView === 'provincial_report'
        ? `NCHADS_ART_VCCT_Report_Q${q}_${y}.xlsx`
        : activeView === 'site_report'
        ? `NCHADS_ART_VCCT_Sites_Report_Q${q}_${y}.xlsx`
        : `VCCT_LineList_${new Date().toISOString().slice(0, 10)}.xlsx`;

      await triggerFileDownload(url, defaultName);
      onClose();
    } catch (err) {
      console.error('DownloadModal error:', err);
      alert('ការទាញយក Excel បរាជ័យ៖ ' + (err.message || 'Error'));
    } finally {
      setExporting(false);
    }
  };

  return createPortal(
    <div className={MODAL.backdrop} onClick={onClose}>
      <div
        className={cn(MODAL.panelMd, 'max-w-md')}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className={MODAL.header}>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--app-header-bar-bg)] text-white shadow-sm">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {activeView === 'provincial_report' 
                  ? 'ទាញយករបាយការណ៍សង្ខេប ART & VCCT' 
                  : activeView === 'site_report'
                  ? 'ទាញយករបាយការណ៍តាមមូលដ្ឋាន ART & VCCT'
                  : activeView === 'data_quality'
                  ? 'ទាញយករបាយការណ៍សវនកម្មគុណភាពទិន្នន័យ'
                  : 'ទាញយកទិន្នន័យបញ្ជីឈ្មោះ'}
              </h3>
              <p className="text-[12px] text-slate-500 leading-tight">
                {activeView === 'provincial_report' || activeView === 'site_report'
                  ? 'ទម្រង់ Microsoft Excel (.xlsx) ផ្លូវការ'
                  : activeView === 'data_quality'
                  ? 'ទម្រង់ Microsoft Excel (.xlsx) សម្រាប់ផ្ទៀងផ្ទាត់ និងសម្អាតទិន្នន័យ'
                  : 'ជ្រើសរើសទម្រង់ឯកសារ និងជួរឈរដែលត្រូវទាញយក'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={MODAL.closeBtn}
            aria-label="បិទ"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-3">
          {/* Format Tabs */}
          <div className="mb-4 flex items-center rounded-xl border border-slate-200 bg-slate-50/80 p-1">
            {[
              { id: 'XLSX', label: 'Excel (.xlsx)', icon: FileSpreadsheet },
              ...(activeView !== 'provincial_report' ? [
                { id: 'CSV', label: 'CSV (.csv)', icon: FileText },
                { id: 'JSON', label: 'JSON (.json)', icon: FileCode }
              ] : []),
            ].map((tab) => {
              const active = downloadFormat === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setDownloadFormat(tab.id)}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
                    active
                      ? 'bg-white text-[var(--app-header-bar-bg)] border border-slate-200 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {activeView === 'provincial_report' ? (
            <div className="py-4 px-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/90 text-xs space-y-2">
              <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                <FileSpreadsheet className="h-4 w-4 text-emerald-700" />
                <span>តារាងសង្ខេបព័ត៌មានអ្នកផ្ទុកមេរោគអេដស៍ (ART & VCCT)</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                ឯកសារ Excel ត្រូវបានរៀបចំតាមគំរូផ្លូវការរបស់មជ្ឈមណ្ឌលជាតិ NCHADS ដែលមានក្បាលតារាងពណ៌បៃតងពីរជាន់ ព័ត៌មាន ២៥ រាជធានី-ខេត្ត និងរូបមន្តបូកសរុបស្វ័យប្រវត្តិ។
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between pb-1.5 px-1">
                <span className="text-xs font-semibold text-slate-700">
                  ជ្រើសរើសជួរឈរដែលត្រូវទាញយក៖
                </span>
                <div className="flex items-center gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={selectAll}
                    className="text-[var(--app-header-bar-bg)] font-medium hover:underline cursor-pointer"
                  >
                    ជ្រើសទាំងអស់
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-slate-500 hover:underline cursor-pointer"
                  >
                    សម្អាត
                  </button>
                </div>
              </div>

              {/* Column Checklist */}
              <div className={cn(MODAL.scrollList, 'max-h-[240px]')}>
                {ALL_COLUMNS.map((col) => {
                  const checked = selectedColIds.includes(col.id);
                  return (
                    <div
                      key={col.id}
                      onClick={() => toggleColumn(col.id)}
                      className="group flex cursor-pointer items-center justify-between gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100/80 transition-colors select-none"
                    >
                      <span
                        className={cn(
                          'truncate text-xs font-medium',
                          checked ? 'text-slate-900' : 'text-slate-400'
                        )}
                      >
                        {col.label}
                      </span>

                      <div
                        className={cn(
                          'flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all',
                          checked
                            ? 'border-[var(--app-header-bar-bg)] bg-[var(--app-header-bar-bg)] text-white shadow-xs'
                            : 'border-slate-300 bg-white hover:border-slate-400'
                        )}
                      >
                        {checked && <Check className="h-3 w-3 stroke-[2.5]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className={MODAL.footerEnd}>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="h-8 px-4 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            បោះបង់
          </Button>
          <Button
            type="button"
            variant="default"
            disabled={exporting || (activeView !== 'provincial_report' && selectedColIds.length === 0)}
            onClick={handleDownload}
            className="h-8 px-5 text-xs bg-[var(--app-header-bar-bg)] hover:bg-[var(--app-header-bar-bg-hover)] text-white shadow-sm cursor-pointer disabled:opacity-50"
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            {exporting 
              ? 'កំពុងបង្កើតឯកសារ...' 
              : activeView === 'provincial_report' 
              ? 'ទាញយករបាយការណ៍ Excel' 
              : `ទាញយក (${downloadFormat})`}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
export default DownloadModal;
