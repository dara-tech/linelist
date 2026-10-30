import express from 'express';
import { getHierarchy } from '../controllers/hierarchyController.js';
import { getMetadata } from '../controllers/metaController.js';
import { getVCCTLineList, getVCCTRecordDetail, exportVCCTExcel } from '../controllers/linelistController.js';
import { getAnalysisMetrics } from '../controllers/analysisController.js';
import { 
  getArtVcctSummaryReport, 
  exportArtVcctReportExcel,
  getArtVcctSiteReport,
  exportArtVcctSiteReportExcel
} from '../controllers/reportController.js';
import {
  getDataQualitySummary,
  getDataQualityRecords,
  exportDataQualityExcel
} from '../controllers/dataQualityController.js';

const router = express.Router();

// Health Check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'VCCT DHIS2 Line List Bridge', timestamp: new Date().toISOString() });
});

// Hierarchy (Provinces, ODs, Sites)
router.get('/hierarchy', getHierarchy);

// Metadata (Target groups, results, labels)
router.get('/metadata', getMetadata);

// Line List & Analytics
router.get('/linelist/vcct', getVCCTLineList);
router.get('/linelist/vcct/:siteCode/:vcctId', getVCCTRecordDetail);
router.get('/linelist/vcct-export/excel', exportVCCTExcel);
router.get('/analysis/metrics', getAnalysisMetrics);

// Data Quality Validation & Auditing
router.get('/data-quality/summary', getDataQualitySummary);
router.get('/data-quality/records', getDataQualityRecords);
router.get('/data-quality/export/excel', exportDataQualityExcel);

// National Provincial Reports (ART & VCCT)
router.get('/reports/art-vcct-summary', getArtVcctSummaryReport);
router.get('/reports/art-vcct-summary/excel', exportArtVcctReportExcel);

// Facility / Site-Level Breakdown Reports (ART & VCCT Breakdown by Site)
router.get('/reports/art-vcct-sites', getArtVcctSiteReport);
router.get('/reports/art-vcct-sites/excel', exportArtVcctSiteReportExcel);

export default router;
