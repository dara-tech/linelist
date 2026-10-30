import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '../ui/sheet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Check, X } from 'lucide-react';
import { RISK_LABELS, REASON_LABELS } from '../../../../backend/src/config/constants.js';

export function RecordDetailSheet({ record, isOpen, onClose }) {
  if (!record) return null;

  const isReactive = Number(record.hiv_result) === 1;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl bg-white border-slate-200 text-slate-900 overflow-y-auto">
        <SheetHeader className="pb-3 border-b border-slate-200">
          <div className="flex items-center justify-between pr-6">
            <div>
              <SheetTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>{record.vcct_id ? `VCCT ID: ${record.vcct_id}` : record.pmrs_code || record.hts_code || 'VCCT'}</span>
                {isReactive ? (
                  <Badge variant="destructive">វិជ្ជមាន (Reactive)</Badge>
                ) : (
                  <Badge variant="success">អវិជ្ជមាន (Non-reactive)</Badge>
                )}
              </SheetTitle>
              <SheetDescription className="text-xs text-slate-500 mt-0.5">
                {record.site_name} &bull; កាលបរិច្ឆេទចុះឈ្មោះ៖ {record.registration_date}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <Tabs defaultValue="profile" className="mt-3">
          <TabsList className="grid grid-cols-4 w-full bg-slate-100 border border-slate-200 h-8">
            <TabsTrigger value="profile" className="text-xs py-1">ព័ត៌មានបុគ្គល</TabsTrigger>
            <TabsTrigger value="tests" className="text-xs py-1">លទ្ធផលតេស្ត</TabsTrigger>
            <TabsTrigger value="risks" className="text-xs py-1">កត្តាប្រឈម</TabsTrigger>
            <TabsTrigger value="reasons" className="text-xs py-1">មូលហេតុទទួលសេវា</TabsTrigger>
          </TabsList>

          {/* Tab 1: Profile */}
          <TabsContent value="profile" className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">VCCT ID:</span>
                <span className="font-mono text-sky-800 font-bold text-sm">{record.vcct_id || '-'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">លេខសម្គាល់បុគ្គល (UUIC):</span>
                <span className="font-mono text-slate-800 font-semibold">{record.uuic || '-'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">លេខកូដ PMRS:</span>
                <span className="font-mono text-slate-600">{record.pmrs_code || '-'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">លេខកូដ HTS:</span>
                <span className="font-mono text-slate-600">{record.hts_code || '-'}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">ភេទ (Sex):</span>
                <span className="text-slate-800 font-medium">{record.sex === 1 ? 'ប្រុស' : record.sex === 2 ? 'ស្រី' : 'បំប្លែងភេទ'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">ថ្ងៃខែឆ្នាំកំណើត:</span>
                <span className="text-slate-800">{record.dob || '-'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">អាយុ:</span>
                <span className="text-slate-900 font-semibold">{record.age || '-'} ឆ្នាំ</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">ប្រភេទអតិថិជន:</span>
                <span className="text-purple-700 font-semibold">{record.target_group_name || 'ទូទៅ'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">លេខទូរស័ព្ទ:</span>
                <span className="text-slate-700 font-mono">{record.phone_number || '-'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">ជនចំណាកស្រុក:</span>
                <span className="text-slate-700">{record.is_migrant === 1 ? 'បាទ/ចាស' : 'ទេ'}</span>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                ស្ថានភាពពិគ្រោះយោបល់ និងការបញ្ជូនព្យាបាល
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500">ធ្លាប់ធ្វើតេស្តពីមុន៖ </span>
                  <span className="text-slate-800 font-medium">{record.history_of_test === 1 ? 'ធ្លាប់' : 'លើកដំបូង'}</span>
                </div>
                <div>
                  <span className="text-slate-500">ពិគ្រោះក្រោយធ្វើតេស្ត៖ </span>
                  <span className="text-slate-800">{record.post_counseling_date ? 'បានទទួល' : 'មិនទាន់ទទួល'}</span>
                </div>
                <div>
                  <span className="text-slate-500">បញ្ជូនទៅព្យាបាល (ART)៖ </span>
                  <span className={Number(record.refer_to_service_id) > 0 ? 'text-emerald-700 font-bold' : 'text-slate-500'}>
                    {Number(record.refer_to_service_id) > 0 ? 'បានបញ្ជូន (Referred)' : 'មិនបានបញ្ជូន'}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Tab 2: Tests */}
          <TabsContent value="tests" className="space-y-3 pt-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                លទ្ធផលក្បួនតេស្ត ៣ ដំណាក់កាល (3-Test Algorithm)
              </span>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded border border-slate-200 bg-white p-2 text-center text-xs">
                  <span className="text-slate-500 block text-[10px]">តេស្តទី១ (Determine)</span>
                  <span className={`font-mono font-bold ${record.line_control === 1 ? 'text-rose-700' : 'text-slate-500'}`}>
                    {record.line_control === 1 ? 'វិជ្ជមាន (R)' : 'អវិជ្ជមាន (NR)'}
                  </span>
                </div>
                <div className="rounded border border-slate-200 bg-white p-2 text-center text-xs">
                  <span className="text-slate-500 block text-[10px]">តេស្តទី២ (Stat-Pak)</span>
                  <span className={`font-mono font-bold ${record.line_positive === 1 ? 'text-rose-700' : 'text-slate-500'}`}>
                    {record.line_positive === 1 ? 'វិជ្ជមាន (R)' : 'អវិជ្ជមាន (NR)'}
                  </span>
                </div>
                <div className="rounded border border-slate-200 bg-white p-2 text-center text-xs">
                  <span className="text-slate-500 block text-[10px]">តេស្តទី៣ (SD Bioline)</span>
                  <span className={`font-mono font-bold ${record.line_longterm === 1 ? 'text-rose-700' : 'text-slate-500'}`}>
                    {record.line_longterm === 1 ? 'វិជ្ជមាន (R)' : 'អវិជ្ជមាន (NR)'}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-500 block text-[10px]">លទ្ធផលតេស្តឆ្លងថ្មី (RTRI):</span>
                <span className="font-mono text-amber-700 font-bold">
                  {record.rtri_result_id === 1 ? 'ឆ្លងថ្មី (Recent)' : record.rtri_result_id === 2 ? 'ឆ្លងយូរ (Long Term)' : 'អវិជ្ជមាន'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">បន្ទុកមេរោគ (Viral Load):</span>
                <span className="font-mono text-slate-800">
                  {record.vl_result ? `${record.vl_result.toLocaleString()} copies/mL` : '-'}
                </span>
              </div>
            </div>
          </TabsContent>

          {/* Tab 3: Risks */}
          <TabsContent value="risks" className="space-y-2 pt-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-1.5 max-h-[360px] overflow-y-auto">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                ការវាយតម្លៃកត្តាប្រឈម
              </span>
              {Object.entries(RISK_LABELS).map(([key, item]) => {
                const isChecked = record[key] === 1;
                return (
                  <div
                    key={key}
                    className={`flex items-center justify-between p-2 rounded text-xs border ${
                      isChecked
                        ? 'border-rose-200 bg-rose-50 text-rose-800 font-medium'
                        : 'border-slate-200 bg-white text-slate-500'
                    }`}
                  >
                    <span>{item.kh || item.en}</span>
                    {isChecked ? (
                      <Check className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                    ) : (
                      <X className="h-3 w-3 text-slate-400 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* Tab 4: Reasons */}
          <TabsContent value="reasons" className="space-y-2 pt-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-1.5 max-h-[360px] overflow-y-auto">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                មូលហេតុដែលមកទទួលសេវា
              </span>
              {Object.entries(REASON_LABELS).map(([key, item]) => {
                const isChecked = record[key] === 1;
                return (
                  <div
                    key={key}
                    className={`flex items-center justify-between p-2 rounded text-xs border ${
                      isChecked
                        ? 'border-blue-200 bg-blue-50 text-blue-800 font-medium'
                        : 'border-slate-200 bg-white text-slate-500'
                    }`}
                  >
                    <span>{item.kh || item.en}</span>
                    {isChecked ? (
                      <Check className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                    ) : (
                      <X className="h-3 w-3 text-slate-400 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
export default RecordDetailSheet;
