import { Table, LayoutDashboard, FileSpreadsheet, Building2, ShieldCheck } from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'linelist', label: 'បញ្ជីឈ្មោះអ្នកទទួលសេវា', Icon: Table },
  { id: 'analysis', label: 'ផ្ទាំងវិភាគតាមក្រុម', Icon: LayoutDashboard },
  { id: 'data_quality', label: 'គុណភាពទិន្នន័យ (Data Quality)', Icon: ShieldCheck },
  { id: 'provincial_report', label: 'របាយការណ៍តាមខេត្ត (Province)', Icon: FileSpreadsheet },
  { id: 'site_report', label: 'របាយការណ៍តាមមូលដ្ឋាន (Site)', Icon: Building2 },
];

