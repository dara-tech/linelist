import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
} from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, Eye, FileSpreadsheet, Download, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { LoadingMark } from '../ui/loading';
import { getExcelExportUrl, triggerFileDownload } from '../../lib/api';

export const ALL_COLUMNS = [
  { id: 'registration_date', label: 'កាលបរិច្ឆេទចុះឈ្មោះ' },
  { id: 'vcct_id', label: 'VCCT ID' },
  { id: 'uuic', label: 'លេខសម្គាល់បុគ្គល (UUIC)' },
  { id: 'site_name', label: 'មណ្ឌលផ្តល់សេវា' },
  { id: 'sex', label: 'ភេទ / អាយុ' },
  { id: 'target_group_name', label: 'ប្រភេទអតិថិជន' },
  { id: 'occupation_name', label: 'មុខរបរ' },
  { id: 'history_of_test', label: 'ប្រវត្តិធ្វើតេស្ត' },
  { id: 'hiv_result', label: 'លទ្ធផលតេស្ត HIV' },
  { id: 'rtri_result_id', label: 'តេស្តឆ្លងថ្មី (RTRI)' },
  { id: 'refer_to_service_id', label: 'ការបញ្ជូនព្យាបាល' },
  { id: 'post_counseling_date', label: 'ប្រឹក្សាក្រោយតេស្ត' },
  { id: 'vl_result', label: 'បន្ទុកមេរោគ (VL)' },
  { id: 'dq_status', label: 'គុណភាពទិន្នន័យ (DQ)' },
];

export function DataTable({
  data = [],
  pagination,
  onPageChange,
  isLoading,
  onSelectRecord,
  visibleColumns = {},
  filters = {},
}) {
  const [sorting, setSorting] = useState([]);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportAll = async () => {
    setIsExporting(true);
    try {
      const url = getExcelExportUrl(filters);
      const filename = `VCCT_LineList_${new Date().toISOString().slice(0, 10)}.xlsx`;
      await triggerFileDownload(url, filename);
    } catch (err) {
      console.error('Export failed:', err);
      alert('ការទាញយក Excel បរាជ័យ៖ ' + (err.message || 'Error'));
    } finally {
      setIsExporting(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'registration_date',
        header: 'កាលបរិច្ឆេទចុះឈ្មោះ',
        cell: (info) => {
          const regDate = info.getValue();
          const row = info.row.original;
          const isCounselingBeforeReg = Boolean(
            row.post_counseling_date && regDate && row.post_counseling_date < regDate
          );
          if (isCounselingBeforeReg) {
            return (
              <span
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 tabular-nums font-mono whitespace-nowrap shadow-2xs"
                title={`ថ្ងៃចុះឈ្មោះ (${regDate}) ក្រោយថ្ងៃប្រឹក្សា (${row.post_counseling_date})`}
              >
                ⚠️ {regDate || '-'}
              </span>
            );
          }
          return (
            <span className="text-slate-700 text-xs whitespace-nowrap tabular-nums font-mono">
              {regDate || '-'}
            </span>
          );
        },
      },
      {
        id: 'vcct_id',
        accessorKey: 'vcct_id',
        header: 'VCCT ID',
        cell: (info) => {
          const val = info.getValue() ?? info.row.original.vcct_id;
          return (
            <span className="text-xs font-bold font-mono text-sky-800 whitespace-nowrap tracking-wide leading-normal">
              {val !== null && val !== undefined && val !== '' ? val : '-'}
            </span>
          );
        },
      },
      {
        accessorKey: 'uuic',
        header: 'លេខសម្គាល់ (UUIC)',
        cell: (info) => {
          const uuic = info.getValue();
          if (!uuic || !uuic.trim()) {
            return (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10.5px] font-bold bg-rose-100 text-rose-800 border border-rose-300 shadow-2xs whitespace-nowrap">
                ⚠️ គ្មាន UUIC
              </span>
            );
          }
          return (
            <span className="text-xs font-semibold font-mono text-slate-900 whitespace-nowrap tracking-wide leading-normal">
              {uuic}
            </span>
          );
        },
      },
      {
        accessorKey: 'site_name',
        header: 'មណ្ឌលផ្តល់សេវា',
        cell: (info) => {
          const row = info.row.original;
          const facility = info.getValue() || row.site_code;
          const location = row.province_name || row.od_name;
          return (
            <div className="max-w-[190px] truncate" title={facility}>
              <div className="text-slate-900 text-xs font-medium truncate">{facility}</div>
              {location && (
                <div className="text-[11px] text-slate-500 truncate">{location}</div>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: 'sex',
        header: 'ភេទ / អាយុ',
        cell: (info) => {
          const rawSex = info.getValue();
          const row = info.row.original;
          const age = row.age;
          const sexNum = Number(rawSex);
          // 0 = ស្រី, 1 = ប្រុស, 2 = បំប្លែងភេទ
          const sexLabel = sexNum === 1 ? 'ប្រុស' : sexNum === 0 ? 'ស្រី' : 'បំប្លែងភេទ';
          const isInvalidAge = !row.dob || age === null || age === undefined || Number(age) < 0 || Number(age) > 105;

          if (isInvalidAge) {
            return (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10.5px] font-bold bg-rose-100 text-rose-800 border border-rose-300 whitespace-nowrap">
                ⚠️ {sexLabel} / {age !== null && age !== undefined ? `${age} ឆ្នាំ` : 'គ្មានអាយុ'}
              </span>
            );
          }
          return (
            <span className="text-xs text-slate-700 whitespace-nowrap">
              {sexLabel} {age !== null && age !== undefined ? `/ ${age} ឆ្នាំ` : ''}
            </span>
          );
        },
      },
      {
        accessorKey: 'target_group_name',
        header: 'ប្រភេទអតិថិជន',
        cell: (info) => {
          const row = info.row.original;
          const targetName = info.getValue();
          const isMissingTarget = !row.patient_type_id || Number(row.patient_type_id) === 0;
          const isGenderConflict =
            (Number(row.sex) === 1 && [1, 8].includes(Number(row.patient_type_id))) ||
            (Number(row.sex) === 0 && [2, 7].includes(Number(row.patient_type_id)));

          if (isMissingTarget) {
            return (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10.5px] font-bold bg-amber-100 text-amber-800 border border-amber-300 whitespace-nowrap">
                ⚠️ ខ្វះប្រភេទអតិថិជន
              </span>
            );
          }
          if (isGenderConflict) {
            return (
              <span
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10.5px] font-bold bg-rose-100 text-rose-800 border border-rose-300 whitespace-nowrap"
                title="ភេទមិនត្រូវនឹងប្រភេទអតិថិជន"
              >
                ⚠️ {targetName || 'មិនត្រូវគ្នា'}
              </span>
            );
          }
          return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200/70 whitespace-nowrap">
              {targetName || 'ប្រជាជនទូទៅ'}
            </span>
          );
        },
      },
      {
        accessorKey: 'occupation_name',
        header: 'មុខរបរ',
        cell: (info) => {
          const occ = info.getValue() || info.row.original.occupation_other;
          return (
            <span className="text-xs text-slate-600 truncate max-w-[120px] block" title={occ || '-'}>
              {occ || '-'}
            </span>
          );
        },
      },
      {
        accessorKey: 'history_of_test',
        header: 'ប្រវត្តិធ្វើតេស្ត',
        cell: (info) => {
          const val = Number(info.getValue());
          if (val === 1) return <span className="text-xs text-slate-700">លើកដំបូង</span>;
          if (val === 2) return <span className="text-xs text-slate-600">ធ្លាប់ធ្វើតេស្ត</span>;
          return <span className="text-slate-400 text-xs">-</span>;
        },
      },
      {
        accessorKey: 'hiv_result',
        header: 'លទ្ធផលតេស្ត HIV',
        cell: (info) => {
          const val = Number(info.getValue());
          // In Cambodia VCCT: 2 = វិជ្ជមាន (Reactive), 1 = អវិជ្ជមាន (Non-reactive), 3 = មិនច្បាស់លាស់ (Inconclusive)
          if (val === 2) {
            return (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 shadow-xs whitespace-nowrap">
                វិជ្ជមាន (2)
              </span>
            );
          }
          if (val === 1) {
            return (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80 whitespace-nowrap">
                អវិជ្ជមាន (1)
              </span>
            );
          }
          if (val === 3) {
            return (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200 whitespace-nowrap">
                មិនច្បាស់លាស់ (3)
              </span>
            );
          }
          return <span className="text-slate-400 text-xs">-</span>;
        },
      },
      {
        accessorKey: 'rtri_result_id',
        header: 'តេស្តឆ្លងថ្មី (RTRI)',
        cell: (info) => {
          const val = Number(info.getValue());
          const row = info.row.original;
          const isReactive = Number(row.hiv_result) === 2;
          const isReactiveMissingRtri = isReactive && (!val || val === 0);
          const isRtriOnNegative = !isReactive && (val === 1 || val === 2);

          if (isReactiveMissingRtri) {
            return (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10.5px] font-bold bg-amber-100 text-amber-800 border border-amber-300 whitespace-nowrap">
                ⚠️ ខ្វះ RTRI
              </span>
            );
          }
          if (isRtriOnNegative) {
            return (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10.5px] font-bold bg-rose-100 text-rose-800 border border-rose-300 whitespace-nowrap">
                ⚠️ ខុសប្រក្រតី
              </span>
            );
          }
          if (val === 1) {
            return (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200 whitespace-nowrap">
                ឆ្លងថ្មី (Recent)
              </span>
            );
          }
          if (val === 2) {
            return (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 whitespace-nowrap">
                ឆ្លងយូរ (Long-term)
              </span>
            );
          }
          return <span className="text-slate-400 text-xs">-</span>;
        },
      },
      {
        accessorKey: 'refer_to_service_id',
        header: 'ការបញ្ជូនព្យាបាល',
        cell: (info) => {
          const row = info.row.original;
          const val = Number(info.getValue());
          const isReactive = Number(row.hiv_result) === 2;
          const isNegative = Number(row.hiv_result) === 1;

          if (isReactive) {
            if (val === 1) {
              return (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-teal-50 text-teal-700 border border-teal-200 whitespace-nowrap">
                  ✓ បានបញ្ជូនទៅ ART
                </span>
              );
            }
            if (val > 1) {
              return (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap">
                  បញ្ជូនបន្ត ({val})
                </span>
              );
            }
            return (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10.5px] font-bold bg-rose-100 text-rose-800 border border-rose-300 shadow-2xs whitespace-nowrap">
                ⚠️ មិនបានបញ្ជូន ART
              </span>
            );
          }

          if (isNegative && val === 1) {
            return (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10.5px] font-bold bg-rose-100 text-rose-800 border border-rose-300 whitespace-nowrap">
                ⚠️ អវិជ្ជមានតែបញ្ជូន ART
              </span>
            );
          }

          return <span className="text-slate-400 text-xs whitespace-nowrap">-</span>;
        },
      },
      {
        accessorKey: 'post_counseling_date',
        header: 'ប្រឹក្សាក្រោយតេស្ត',
        cell: (info) => {
          const date = info.getValue();
          const row = info.row.original;
          const isCounselingBeforeReg = Boolean(date && row.registration_date && date < row.registration_date);

          if (isCounselingBeforeReg) {
            return (
              <span
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10.5px] font-bold bg-rose-100 text-rose-800 border border-rose-300 font-mono shadow-2xs whitespace-nowrap"
                title={`កាលបរិច្ឆេទប្រឹក្សា (${date}) គឺមុនថ្ងៃចុះឈ្មោះ (${row.registration_date})`}
              >
                ⚠️ {date} (ចុះឈ្មោះ៖ {row.registration_date})
              </span>
            );
          }
          if (date) {
            return <span className="text-xs text-slate-700 whitespace-nowrap tabular-nums font-mono">{date}</span>;
          }
          if (row.post_counseling_id === 1) {
            return <span className="text-xs text-slate-600">បានប្រឹក្សា</span>;
          }
          return <span className="text-slate-400 text-xs">-</span>;
        },
      },
      {
        accessorKey: 'vl_result',
        header: 'បន្ទុកមេរោគ (VL)',
        cell: (info) => {
          const val = info.getValue();
          return (
            <span className="text-xs text-slate-700 whitespace-nowrap tabular-nums">
              {val ? Number(val).toLocaleString() : '-'}
            </span>
          );
        },
      },
      {
        id: 'dq_status',
        accessorKey: 'dq_status',
        header: 'គុណភាពទិន្នន័យ (DQ)',
        cell: (info) => {
          const row = info.row.original;
          const flags = [];
          if (!row.uuic || !row.uuic.trim()) flags.push('ខ្វះ UUIC');
          if (!row.dob || row.age === null || row.age === undefined || Number(row.age) < 0 || Number(row.age) > 105) flags.push('អាយុខុសប្រក្រតី');
          if (!row.patient_type_id || Number(row.patient_type_id) === 0) flags.push('ខ្វះក្រុម');
          if (row.post_counseling_date && row.registration_date && row.post_counseling_date < row.registration_date) flags.push('ប្រឹក្សាមុនថ្ងៃចុះឈ្មោះ');
          if (Number(row.hiv_result) === 2 && (!row.refer_to_service_id || Number(row.refer_to_service_id) !== 1)) flags.push('មិនទាន់បញ្ជូន ART');
          if (Number(row.hiv_result) === 2 && (!row.rtri_result_id || Number(row.rtri_result_id) === 0)) flags.push('ខ្វះ RTRI');
          if (Number(row.hiv_result) === 1 && Number(row.refer_to_service_id) === 1) flags.push('អវិជ្ជមានបញ្ជូន ART');

          if (flags.length > 0) {
            return (
              <span
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10.5px] font-bold bg-rose-50 text-rose-700 border border-rose-200 whitespace-nowrap shadow-2xs"
                title={flags.join(', ')}
              >
                ⚠️ {flags[0]} {flags.length > 1 ? `(+${flags.length - 1})` : ''}
              </span>
            );
          }
          return (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 whitespace-nowrap">
              ✓ ត្រឹមត្រូវ
            </span>
          );
        },
      },
      {
        id: 'actions',
        header: 'សកម្មភាព',
        cell: (info) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onSelectRecord(info.row.original);
            }}
            className="h-6 text-[11px] text-[var(--app-header-bar-bg)] hover:bg-sky-50 px-2 rounded cursor-pointer whitespace-nowrap"
          >
            <Eye className="h-3 w-3 mr-1" />
            មើលលម្អិត
          </Button>
        ),
      },
    ].filter((col) => {
      const key = col.accessorKey || col.id;
      return !key || key === 'actions' || visibleColumns[key] !== false;
    }),
    [onSelectRecord, visibleColumns]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="flex-1 flex flex-col min-h-0 space-y-2">
      {/* Table Container Card (Full Height) */}
      <div className="relative flex-1 flex flex-col min-h-[calc(100vh-210px)] rounded-[var(--app-radius)] border border-slate-200 bg-white shadow-xs overflow-hidden">
        {/* Centered Loading Overlay (npdcapture standard viewport centered) */}
        {isLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px] transition-all duration-200">
            <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white/95 px-6 py-4 shadow-2xl shadow-slate-900/10 backdrop-blur-md">
              <LoadingMark className="h-7 w-7" />
              <span className="text-[14px] font-semibold text-slate-800 tracking-tight">
                កំពុងទាញទិន្នន័យបញ្ជីឈ្មោះ...
              </span>
            </div>
          </div>
        )}

        {/* Table Top Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-1.5 border-b border-slate-200/90 bg-slate-50/80 shrink-0 text-xs">
          <div className="flex items-center gap-2 text-slate-600 font-medium text-[11px]">
            <span>បង្ហាញ {data.length} ក្នុងចំណោម {pagination?.total?.toLocaleString() || 0} កំណត់ត្រា (ទំព័រទី {pagination?.page || 1}/{pagination?.totalPages || 1})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">ចុចលើជួរដេកដើម្បីពិនិត្យទម្រង់លម្អិត</span>
          </div>
        </div>

        <div className="flex-1 overflow-auto min-h-0 custom-scrollbar">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-slate-50 shadow-2xs">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-b border-slate-200 bg-slate-50">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-slate-700 text-[11.5px] font-semibold tracking-wider py-2.5 px-3 whitespace-nowrap bg-slate-50">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    onClick={() => onSelectRecord(row.original)}
                    className="cursor-pointer hover:bg-slate-50/80 border-b border-slate-100 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-2.5 px-3 text-xs text-slate-800">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : !isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-64 text-center text-slate-500 text-xs">
                    មិនមានទិន្នន័យត្រូវបង្ហាញឡើយ។
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination (50 per page) with Excel Export All Button */}
      {pagination && (
        <div className="flex flex-wrap items-center justify-between gap-2 py-1 text-xs shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-slate-600 text-[11.5px]">
              ទំព័រទី <strong>{pagination.page}</strong> នៃ <strong>{pagination.totalPages}</strong> (សរុប {pagination.total.toLocaleString()} កំណត់ត្រា — បង្ហាញ ៥០ ក្នុងមួយទំព័រ)
            </span>
            <button
              type="button"
              onClick={handleExportAll}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-emerald-300 bg-emerald-50 text-emerald-800 font-semibold text-xs hover:bg-emerald-100 hover:border-emerald-400 transition-all cursor-pointer shadow-2xs active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed"
              title="ទាញយកកំណត់ត្រាទាំងអស់ដែលត្រូវគ្នានឹងតម្រងបច្ចុប្បន្នជាឯកសារ Excel"
            >
              {isExporting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-600" />
              ) : (
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
              )}
              <span>{isExporting ? 'កំពុងទាញយក...' : `ទាញយកទាំងអស់ជា Excel (${pagination.total.toLocaleString()})`}</span>
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1 || isLoading}
              className="h-7 text-xs px-2.5 rounded cursor-pointer"
            >
              <ChevronLeft className="h-3 w-3 mr-0.5" /> ថយក្រោយ
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages || isLoading}
              className="h-7 text-xs px-2.5 rounded cursor-pointer"
            >
              បន្ទាប់ <ChevronRight className="h-3 w-3 ml-0.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
export default DataTable;
