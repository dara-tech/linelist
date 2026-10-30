import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

import { Loading } from '../ui/loading';

export function YieldAnalysis({ metrics, isLoading }) {
  if (isLoading) {
    return <Loading label="កំពុងគណនាអត្រាវិជ្ជមាន និងទិន្នន័យប្រជាសាស្ត្រ..." variant="block" />;
  }

  const byTargetGroup = metrics?.byTargetGroup || [];
  const byAgeSex = metrics?.byAgeSex || [];

  return (
    <div className="space-y-4">
      {/* Key Population Yield Table */}
      <Card className="border-slate-200 bg-white">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-900">
            អត្រាវិជ្ជមានតាមប្រភេទអតិថិជន (Yield by Client Type)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4 font-semibold text-[11px]">ប្រភេទអតិថិជន</th>
                  <th className="py-2.5 px-4 font-semibold text-[11px] text-right">បានធ្វើតេស្ត</th>
                  <th className="py-2.5 px-4 font-semibold text-[11px] text-right">វិជ្ជមាន</th>
                  <th className="py-2.5 px-4 font-semibold text-[11px] text-right">អវិជ្ជមាន</th>
                  <th className="py-2.5 px-4 font-semibold text-[11px] text-right">អត្រាវិជ្ជមាន (%)</th>
                  <th className="py-2.5 px-4 font-semibold text-[11px] text-right">បញ្ជូនព្យាបាល</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {byTargetGroup.map((tg, idx) => {
                  const tested = Number(tg.total_tested || 0);
                  const reactive = Number(tg.reactive_count || 0);
                  const nonReactive = Number(tg.non_reactive_count || 0);
                  const linked = Number(tg.linked_count || 0);
                  const yieldRate = tested > 0 ? ((reactive / tested) * 100).toFixed(1) : 0;
                  const linkRate = reactive > 0 ? ((linked / reactive) * 100).toFixed(1) : 0;

                  return (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-4 font-medium text-slate-800">
                        {tg.target_group}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono text-slate-700">
                        {tested.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold text-rose-700">
                        {reactive.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono text-slate-500">
                        {nonReactive.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="font-mono font-semibold text-slate-900">{yieldRate}%</span>
                          <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                            <div
                              className="h-full bg-rose-500 rounded-full"
                              style={{ width: `${Math.min(Number(yieldRate) * 5, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono text-emerald-700 font-medium">
                        {linked.toLocaleString()} ({linkRate}%)
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Age & Sex Grid */}
      <Card className="border-slate-200 bg-white">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-900">
            ការបែងចែកតាមក្រុមអាយុ និងភេទ (Age & Sex Distribution)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['<15', '15-24', '25-49', '50+'].map((group) => {
              const maleData = byAgeSex.find((d) => d.age_group === group && Number(d.sex) === 1);
              const femaleData = byAgeSex.find((d) => d.age_group === group && Number(d.sex) === 2);
              const totalInGroup = (Number(maleData?.total_tested || 0) + Number(femaleData?.total_tested || 0));
              const reactiveInGroup = (Number(maleData?.reactive_count || 0) + Number(femaleData?.reactive_count || 0));
              const groupYield = totalInGroup > 0 ? ((reactiveInGroup / totalInGroup) * 100).toFixed(1) : 0;

              return (
                <div key={group} className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>អាយុ៖ {group} ឆ្នាំ</span>
                    <Badge variant="outline" className="text-[10px] font-mono">អត្រា {groupYield}%</Badge>
                  </div>
                  <div className="text-[11px] text-slate-600 font-mono">
                    សរុប៖ {totalInGroup.toLocaleString()} | វិជ្ជមាន៖ <span className="text-rose-700 font-bold">{reactiveInGroup}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-500 pt-1 border-t border-slate-200">
                    <div>ប្រុស៖ {Number(maleData?.total_tested || 0).toLocaleString()}</div>
                    <div>ស្រី៖ {Number(femaleData?.total_tested || 0).toLocaleString()}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
export default YieldAnalysis;
