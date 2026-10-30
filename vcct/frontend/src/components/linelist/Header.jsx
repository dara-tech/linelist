import React from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';

export function Header({ activeViewTitle, onRefresh, onExportExcel, isExporting, totalRecords }) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-2.5 h-12">
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-bold text-slate-900 tracking-tight">
          {activeViewTitle || 'Line List Register'}
        </h2>
        <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
          {(totalRecords || 0).toLocaleString()} Records
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          className="h-7 text-xs px-2.5 gap-1"
        >
          <RefreshCw className="h-3 w-3 text-slate-500" />
          Refresh
        </Button>

        <Button
          variant="default"
          size="sm"
          onClick={onExportExcel}
          disabled={isExporting}
          className="h-7 text-xs font-medium px-3 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Download className="h-3.5 w-3.5" />
          {isExporting ? 'Exporting...' : 'Export Excel'}
        </Button>
      </div>
    </header>
  );
}
