import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

import { Loading } from '../ui/loading';

export function LinkageCascade({ kpis, isLoading }) {
  if (isLoading) {
    return <Loading label="កំពុងគណនាលំហូរនៃការបញ្ជូនទៅព្យាបាល..." variant="block" />;
  }

  const totalTested = kpis?.totalTested || 0;
  const reactive = kpis?.reactiveCount || 0;
  const linked = kpis?.linkedToCareCount || 0;
  const unlinked = reactive - linked;
  const linkageRate = reactive > 0 ? ((linked / reactive) * 100).toFixed(1) : 0;

  const steps = [
    { label: '១. អតិថិជនបានធ្វើតេស្តសរុប (Clients Tested)', count: totalTested, percentage: '100%', color: 'bg-blue-600', textColor: 'text-blue-700' },
    { label: '២. រកឃើញលទ្ធផលវិជ្ជមានអេដស៍ (HIV Reactive)', count: reactive, percentage: totalTested > 0 ? `${((reactive / totalTested) * 100).toFixed(1)}%` : '0%', color: 'bg-rose-600', textColor: 'text-rose-700' },
    { label: '៣. បានបញ្ជូន និងភ្ជាប់ទៅសេវាព្យាបាល (Linked to ART)', count: linked, percentage: `${linkageRate}%`, color: 'bg-emerald-600', textColor: 'text-emerald-700' },
  ];

  return (
    <div className="space-y-4">
      <Card className="border-slate-200 bg-white">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-900">
            លំហូរនៃការធ្វើតេស្តរហូតដល់ការបញ្ជូនទៅព្យាបាល (Linkage to Care Cascade)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-3">
            {steps.map((step, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-700">{step.label}</span>
                  <span className="font-mono text-slate-900">
                    <strong className={step.textColor}>{step.count.toLocaleString()}</strong> ({step.percentage})
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
                  <div
                    className={`h-full ${step.color} transition-all duration-300`}
                    style={{
                      width: `${
                        idx === 0 ? 100 : idx === 1 ? Math.min((reactive / (totalTested || 1)) * 300, 100) : Math.min(Number(linkageRate), 100)
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
            <div className="rounded border border-emerald-200 bg-emerald-50/50 p-3">
              <span className="text-slate-600 block text-[11px]">បានបញ្ជូនទៅព្យាបាល (ART)៖</span>
              <span className="text-xl font-bold font-mono text-emerald-700 mt-1 block">
                {linked.toLocaleString()} នាក់ ({linkageRate}%)
              </span>
            </div>
            <div className="rounded border border-amber-200 bg-amber-50/50 p-3">
              <span className="text-slate-600 block text-[11px]">គម្លាតមិនទាន់បានបញ្ជូន (Gap)៖</span>
              <span className="text-xl font-bold font-mono text-amber-700 mt-1 block">
                {unlinked > 0 ? unlinked.toLocaleString() : 0} នាក់
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
export default LinkageCascade;
