import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

import { Loading } from '../ui/loading';

export function SiteCrossTab({ metrics, isLoading }) {
  if (isLoading) {
    return <Loading label="កំពុងគណនាតារាងតាមមណ្ឌលសុខភាព..." variant="block" />;
  }

  const bySite = metrics?.bySite || [];

  return (
    <Card className="border-slate-200 bg-white">
      <CardHeader className="pb-3 border-b border-slate-100">
        <CardTitle className="text-sm font-bold text-slate-900">
          តារាងទិន្នន័យតាមបណ្តាមណ្ឌលសុខភាព និងមន្ទីរពេទ្យ (VCCT Facilities Matrix)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 font-semibold text-[11px]">កូដមណ្ឌល</th>
                <th className="py-2.5 px-3 font-semibold text-[11px]">ឈ្មោះមណ្ឌលសុខភាព / មន្ទីរពេទ្យ</th>
                <th className="py-2.5 px-3 font-semibold text-[11px]">ខេត្ត / ស្រុកប្រតិបត្តិ</th>
                <th className="py-2.5 px-3 font-semibold text-[11px] text-right">បានធ្វើតេស្ត</th>
                <th className="py-2.5 px-3 font-semibold text-[11px] text-right">វិជ្ជមាន</th>
                <th className="py-2.5 px-3 font-semibold text-[11px] text-right">អត្រាវិជ្ជមាន (%)</th>
                <th className="py-2.5 px-3 font-semibold text-[11px] text-right">ឆ្លងថ្មី (Recent)</th>
                <th className="py-2.5 px-3 font-semibold text-[11px] text-right">បញ្ជូនព្យាបាល</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bySite.map((site, idx) => {
                const tested = Number(site.total_tested || 0);
                const reactive = Number(site.reactive_count || 0);
                const recent = Number(site.recent_count || 0);
                const linked = Number(site.linked_count || 0);
                const yieldRate = tested > 0 ? ((reactive / tested) * 100).toFixed(1) : 0;

                return (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2 px-3 font-mono text-blue-700 font-semibold text-[11px]">
                      {site.site_code}
                    </td>
                    <td className="py-2 px-3 font-medium text-slate-900 truncate max-w-[200px]" title={site.site_name}>
                      {site.site_name || '-'}
                    </td>
                    <td className="py-2 px-3 text-slate-500 text-[11px] truncate max-w-[150px]">
                      {site.province_name} &bull; {site.od_name}
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-slate-700">
                      {tested.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-rose-700">
                      {reactive.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-medium text-slate-900">
                      {yieldRate}%
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-amber-700 font-medium">
                      {recent.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-emerald-700 font-medium">
                      {linked.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
export default SiteCrossTab;
