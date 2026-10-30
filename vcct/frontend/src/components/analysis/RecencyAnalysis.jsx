import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

import { Loading } from '../ui/loading';

export function RecencyAnalysis({ metrics, isLoading }) {
  if (isLoading) {
    return <Loading label="កំពុងវិភាគទិន្នន័យនៃការឆ្លងថ្មី (RTRI)..." variant="block" />;
  }

  const byTargetGroup = metrics?.byTargetGroup || [];
  const totalRecent = byTargetGroup.reduce((acc, curr) => acc + Number(curr.recent_count || 0), 0);
  const totalReactive = byTargetGroup.reduce((acc, curr) => acc + Number(curr.reactive_count || 0), 0);
  const overallRecencyRatio = totalReactive > 0 ? ((totalRecent / totalReactive) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-xs">
          <div className="text-[11px] font-medium tracking-wide text-slate-500">
            វិជ្ជមានសរុប (Total Reactive)
          </div>
          <div className="text-2xl font-bold font-mono text-rose-700 mt-1">
            {totalReactive.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">ករណីវិជ្ជមានដែលត្រូវធ្វើតេស្ត RTRI</div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-xs">
          <div className="text-[11px] font-medium tracking-wide text-slate-500">
            ករណីឆ្លងថ្មី (Recent Infections)
          </div>
          <div className="text-2xl font-bold font-mono text-amber-700 mt-1">
            {totalRecent.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">{overallRecencyRatio}% នៃករណីវិជ្ជមានទាំងអស់</div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-xs">
          <div className="text-[11px] font-medium tracking-wide text-slate-500">
            ករណីឆ្លងយូរ (Long-term Infections)
          </div>
          <div className="text-2xl font-bold font-mono text-slate-800 mt-1">
            {(totalReactive - totalRecent).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">ការឆ្លងដែលបានកើតឡើងលើសពី ១២ ខែ</div>
        </div>
      </div>

      {/* Recency Table */}
      <Card className="border-slate-200 bg-white">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-900">
            ការឆ្លងថ្មីតាមប្រភេទអតិថិជន (Recent Infections by Client Type)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4 font-semibold text-[11px]">ប្រភេទអតិថិជន</th>
                  <th className="py-2.5 px-4 font-semibold text-[11px] text-right">វិជ្ជមានសរុប</th>
                  <th className="py-2.5 px-4 font-semibold text-[11px] text-right">ឆ្លងថ្មី (Recent)</th>
                  <th className="py-2.5 px-4 font-semibold text-[11px] text-right">សមាមាត្រឆ្លងថ្មី (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {byTargetGroup.map((tg, idx) => {
                  const reactive = Number(tg.reactive_count || 0);
                  const recent = Number(tg.recent_count || 0);
                  const ratio = reactive > 0 ? ((recent / reactive) * 100).toFixed(1) : 0;

                  return (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-4 font-medium text-slate-800">
                        {tg.target_group}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono text-rose-700">
                        {reactive.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold text-amber-700">
                        {recent.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="font-mono font-semibold text-slate-900">{ratio}%</span>
                          <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                            <div
                              className="h-full bg-amber-500 rounded-full"
                              style={{ width: `${Math.min(Number(ratio) * 2, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
export default RecencyAnalysis;
