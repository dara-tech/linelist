import { getDbPool } from '../config/db.js';
import ExcelJS from 'exceljs';

/**
 * Registry of Data Quality Rules for VCCT Surveillance
 */
export const DQ_RULES_CONFIG = {
  missing_uuic: {
    id: 'missing_uuic',
    labelKh: 'ខ្វះលេខសម្គាល់បុគ្គល (UUIC)',
    labelEn: 'Missing UUIC',
    category: 'completeness',
    severity: 'high',
    sqlCond: "(v.uuic IS NULL OR TRIM(v.uuic) = '')",
    description: 'កំណត់ត្រាមិនមានលេខសម្គាល់បុគ្គល UUIC ឬនៅទទេ ធ្វើឲ្យពិបាកតាមដានឆ្លងកាត់សេវា។',
    recommendation: 'ពិនិត្យឈ្មោះ ភេទ ថ្ងៃខែឆ្នាំកំណើត និងបង្កើត UUIC តាមក្បួនខ្នាត NCHADS។',
  },
  negative_with_referral: {
    id: 'negative_with_referral',
    labelKh: 'HIV អវិជ្ជមានតែបញ្ជូនទៅ ART',
    labelEn: 'HIV Negative referred to ART',
    category: 'clinical',
    severity: 'high',
    sqlCond: '(v.hiv_result = 1 AND v.refer_to_service_id = 1)',
    description: 'លទ្ធផលតេស្តអវិជ្ជមាន ប៉ុន្តែប្រព័ន្ធកត់ត្រាថាបញ្ជូនទៅ ART (សេវាផ្សេងទៀតដូចជា កាមរោគ របេង ផ្ទៃពោះ គឺត្រឹមត្រូវធម្មតា)។',
    recommendation: 'កែសម្រួលលទ្ធផលតេស្ត ឬប្តូរស្ថានភាពបញ្ជូន (តេស្តអវិជ្ជមានមិនត្រូវបញ្ជូនទៅ ART ទេ)។',
  },
  reactive_unlinked: {
    id: 'reactive_unlinked',
    labelKh: 'HIV វិជ្ជមានមិនទាន់បញ្ជូនទៅ ART',
    labelEn: 'HIV Positive unlinked to ART',
    category: 'clinical',
    severity: 'high',
    sqlCond: '(v.hiv_result = 2 AND (v.refer_to_service_id != 1 OR v.refer_to_service_id IS NULL))',
    description: 'ករណីរកឃើញវិជ្ជមាន HIV តែពុំទាន់មានព័ត៌មានបញ្ជូនទៅសេវាព្យាបាល ART ឬចុះលេខកូដ ART។',
    recommendation: 'តាមដានអតិថិជនដើម្បីធានាការភ្ជាប់ទៅព្យាបាលឱសថប្រឆាំងមេរោគអេដស៍ទាន់ពេលវេលា។',
  },
  reactive_missing_rtri: {
    id: 'reactive_missing_rtri',
    labelKh: 'HIV វិជ្ជមានខ្វះតេស្តឆ្លងថ្មី RTRI',
    labelEn: 'Reactive Missing Recency Test (RTRI)',
    category: 'clinical',
    severity: 'high',
    sqlCond: '(v.hiv_result = 2 AND (v.rtri_result_id IS NULL OR v.rtri_result_id = 0))',
    description: 'ករណីរកឃើញ HIV វិជ្ជមាន តែមិនទាន់បានធ្វើ ឬកត់ត្រាលទ្ធផលតេស្តឆ្លងថ្មី RTRI (Recent/Long-term) តាមគោលការណ៍ជាតិ។',
    recommendation: 'ផ្តល់ការធ្វើតេស្ត RTRI និងកត់ត្រាលទ្ធផលភ្លាមៗសម្រាប់គ្រប់ករណីវិជ្ជមានថ្មី។',
  },
  line_test_inconsistency: {
    id: 'line_test_inconsistency',
    labelKh: 'លទ្ធផលតេស្ត ៣ បន្ទាត់មិនស៊ីសង្វាក់គ្នា',
    labelEn: '3-Test Algorithm Conflict',
    category: 'clinical',
    severity: 'high',
    sqlCond: '((ltr.line_control = 0 AND v.hiv_result = 2) OR (ltr.line_control = 1 AND ltr.line_positive = 1 AND ltr.line_longterm = 1 AND v.hiv_result != 2) OR (ltr.line_control = 0 AND (ltr.line_positive = 1 OR ltr.line_longterm = 1)))',
    description: 'លទ្ធផលតេស្ត Determine, Stat-Pak និង SD Bioline មិនស៊ីសង្វាក់គ្នានឹងលទ្ធផលសរុប HIV (ឧ. បន្ទាត់ទី១ អវិជ្ជមាន តែសរុបវិជ្ជមាន)។',
    recommendation: 'ផ្ទៀងផ្ទាត់សៀវភៅបញ្ជីពិសោធន៍ និងកែតម្រូវលទ្ធផលតេស្ត ៣ បន្ទាត់ ឬលទ្ធផលចុងក្រោយ។',
  },
  counseling_before_reg: {
    id: 'counseling_before_reg',
    labelKh: 'កាលបរិច្ឆេទប្រឹក្សា មុនថ្ងៃចុះឈ្មោះ',
    labelEn: 'Post-Counseling Date Before Registration',
    category: 'timeline',
    severity: 'medium',
    sqlCond: '(v.post_counseling_date IS NOT NULL AND v.post_counseling_date < v.registration_date)',
    description: 'កាលបរិច្ឆេទផ្តល់ការប្រឹក្សាក្រោយតេស្តត្រូវបានកត់ត្រាមុនថ្ងៃដែលអតិថិជនបានចុះឈ្មោះធ្វើតេស្ត (កំហុសលំដាប់កាលបរិច្ឆេទ)។',
    recommendation: 'ផ្ទៀងផ្ទាត់កាលបរិច្ឆេទប្រឹក្សាក្រោយតេស្ត (ត្រូវស្មើ ឬក្រោយថ្ងៃចុះឈ្មោះធ្វើតេស្ត)។',
  },
  missing_target_group: {
    id: 'missing_target_group',
    labelKh: 'មិនបានបញ្ជាក់ប្រភេទអតិថិជន',
    labelEn: 'Missing Client Type',
    category: 'completeness',
    severity: 'medium',
    sqlCond: '(v.patient_type_id IS NULL OR v.patient_type_id = 0)',
    description: 'មិនមានប្រភេទអតិថិជន (TG, MSM, FEW, GP) ក្នុងទិន្នន័យ។',
    recommendation: 'ជ្រើសរើសប្រភេទអតិថិជនជាក់លាក់ ឬ "ប្រជាជនទូទៅ" ក្នុងប្រព័ន្ធ។',
  },
  invalid_dob_age: {
    id: 'invalid_dob_age',
    labelKh: 'ថ្ងៃខែឆ្នាំកំណើត ឬអាយុមិនត្រឹមត្រូវ',
    labelEn: 'Invalid DOB or Calculated Age',
    category: 'logical',
    severity: 'medium',
    sqlCond: '(v.dob IS NULL OR YEAR(v.dob) < 1920 OR v.dob > v.registration_date OR TIMESTAMPDIFF(YEAR, v.dob, v.registration_date) > 105)',
    description: 'ថ្ងៃកំណើតលើសថ្ងៃចុះឈ្មោះ ឬអាយុគណនាឃើញតិចជាង ០ ឬលើសពី ១០៥ ឆ្នាំ។',
    recommendation: 'ផ្ទៀងផ្ទាត់ថ្ងៃខែឆ្នាំកំណើតរបស់អតិថិជន និងកែតម្រូវឡើងវិញ។',
  },
  missing_post_counseling: {
    id: 'missing_post_counseling',
    labelKh: 'ខ្វះការប្រឹក្សាក្រោយតេស្ត',
    labelEn: 'Missing Post-test Counseling Date',
    category: 'completeness',
    severity: 'low',
    sqlCond: '((v.post_counseling_date IS NULL OR YEAR(v.post_counseling_date) < 1920) AND v.hiv_result > 0)',
    description: 'អតិថិជនបានធ្វើតេស្តរួចរាល់ ប៉ុន្តែមិនទាន់បានបញ្ចូលកាលបរិច្ឆេទផ្តល់ការប្រឹក្សាក្រោយតេស្ត។',
    recommendation: 'បំពេញកាលបរិច្ឆេទប្រឹក្សាក្រោយតេស្តដើម្បីបញ្ចប់ដំណាក់កាល VCCT។',
  },
  gender_target_conflict: {
    id: 'gender_target_conflict',
    labelKh: 'ភាពមិនស៊ីសង្វាក់រវាងភេទ និងប្រភេទអតិថិជន',
    labelEn: 'Gender & Client Type Mismatch',
    category: 'logical',
    severity: 'medium',
    sqlCond: '((v.sex = 1 AND v.patient_type_id IN (1, 8)) OR (v.sex = 0 AND v.patient_type_id IN (2, 7)))',
    description: 'ភេទប្រុសចុះជាស្រីសេវាកម្សាន្ត ឬស្ត្រីមានផ្ទៃពោះ, ឬភេទស្រីចុះជាបុរសស្រឡាញ់បុរស (MSM)។',
    recommendation: 'ត្រួតពិនិត្យប្រភេទអតិថិជន និងភេទរបស់អតិថិជនឡើងវិញ។',
  },
  rtri_on_negative: {
    id: 'rtri_on_negative',
    labelKh: 'តេស្ត RTRI លើករណីអវិជ្ជមាន',
    labelEn: 'RTRI on HIV Negative',
    category: 'clinical',
    severity: 'high',
    sqlCond: '((v.hiv_result = 1 OR v.hiv_result = 0) AND (v.rtri_result_id = 1 OR v.rtri_result_id = 2))',
    description: 'ការធ្វើតេស្តរកការឆ្លងថ្មី (RTRI) ត្រូវបានកត់ត្រាលើករណីដែលតេស្ត HIV អវិជ្ជមាន។',
    recommendation: 'លុបលទ្ធផល RTRI ចេញ (តេស្ត RTRI ធ្វើឡើងតែលើករណីវិជ្ជមាន HIV ប៉ុណ្ណោះ)។',
  },
  known_positive_retesting: {
    id: 'known_positive_retesting',
    labelKh: 'ដឹងថាវិជ្ជមានពីមុន មកធ្វើតេស្តឡើងវិញ',
    labelEn: 'Known Positive Re-testing at VCCT',
    category: 'clinical',
    severity: 'low',
    sqlCond: '(v.history_of_test_result = 2)',
    description: 'អតិថិជនធ្លាប់ដឹងថាខ្លួនមានផ្ទុកមេរោគអេដស៍ពីមុនមកហើយ ប៉ុន្តែមកធ្វើតេស្តបញ្ជាក់ឡើងវិញនៅ VCCT ជំនួសឱ្យការទទួលការព្យាបាល ART។',
    recommendation: 'បញ្ជូនអតិថិជនទៅសេវា ART សម្រាប់ការពិនិត្យបន្ទុកមេរោគ (Viral Load) និងការព្យាបាលបន្ត។',
  },
  inconclusive_results: {
    id: 'inconclusive_results',
    labelKh: 'លទ្ធផលមិនច្បាស់លាស់ ត្រូវតាមដានបន្ត',
    labelEn: 'Inconclusive Result Pending Confirmation',
    category: 'clinical',
    severity: 'medium',
    sqlCond: '(v.hiv_result = 3)',
    description: 'ករណីតេស្ត ៣ បន្ទាត់មិនដាច់ស្រេច (Inconclusive) ត្រូវកំណត់កាលបរិច្ឆេទណាត់ជួបធ្វើតេស្តឡើងវិញក្រោយ ១៤ ថ្ងៃ។',
    recommendation: 'តាមដានអតិថិជនដើម្បីធ្វើតេស្តឡើងវិញក្រោយ ១៤ ថ្ងៃ ឬបញ្ជូនសំណាកទៅ NCHADS Lab។',
  },
  invalid_phone: {
    id: 'invalid_phone',
    labelKh: 'លេខទូរស័ព្ទមិនត្រឹមត្រូវ/ខុសទម្រង់',
    labelEn: 'Invalid Phone Number Format',
    category: 'completeness',
    severity: 'low',
    sqlCond: "(v.phone_number IS NOT NULL AND TRIM(v.phone_number) != '' AND (LENGTH(REGEXP_REPLACE(v.phone_number, '[^0-9]', '')) < 8 OR LENGTH(REGEXP_REPLACE(v.phone_number, '[^0-9]', '')) > 12))",
    description: 'លេខទូរស័ព្ទមានប្រវែងខ្លីជាង ៨ ខ្ទង់ ឬវែងជាង ១២ ខ្ទង់ ដែលមិនអាចទាក់ទងតាមដានការបញ្ជូនបាន។',
    recommendation: 'ផ្ទៀងផ្ទាត់ និងបញ្ចូលលេខទូរស័ព្ទត្រឹមត្រូវតាមទម្រង់លេខកម្ពុជា។',
  },
};

/**
 * Builds base WHERE conditions and params for VCCT filters.
 */
function buildConditions(query) {
  const conditions = ['1=1'];
  const params = [];

  const needsSiteJoin = Boolean(query.provinceId || query.odCode);

  if (query.provinceId) {
    conditions.push('s.province_id = ?');
    params.push(query.provinceId);
  }
  if (query.odCode) {
    conditions.push('s.od_code = ?');
    params.push(query.odCode);
  }
  if (query.siteCode) {
    conditions.push('v.site_code = ?');
    params.push(query.siteCode);
  }
  if (query.dateFrom) {
    conditions.push('v.registration_date >= ?');
    params.push(query.dateFrom);
  }
  if (query.dateTo) {
    conditions.push('v.registration_date <= ?');
    params.push(query.dateTo);
  }

  return { conditions, params, needsSiteJoin };
}

/**
 * GET /api/data-quality/summary
 * Aggregate VCCT Data Quality Metrics, Completeness & Clinical Inconsistencies
 */
export async function getDataQualitySummary(req, res) {
  try {
    const pool = getDbPool();
    const { conditions, params, needsSiteJoin } = buildConditions(req.query);

    const whereClause = conditions.join(' AND ');
    const siteJoin = needsSiteJoin ? 'LEFT JOIN tblsites s ON v.site_code = s.vcct_site_code' : '';

    // 1. Overall Aggregated Data Quality Summary Query
    const overallSql = `
      SELECT
        COUNT(*) AS total_tested,
        SUM(CASE WHEN ${DQ_RULES_CONFIG.missing_uuic.sqlCond} THEN 1 ELSE 0 END) AS missing_uuic,
        SUM(CASE WHEN ${DQ_RULES_CONFIG.invalid_dob_age.sqlCond} THEN 1 ELSE 0 END) AS invalid_dob_age,
        SUM(CASE WHEN ${DQ_RULES_CONFIG.missing_target_group.sqlCond} THEN 1 ELSE 0 END) AS missing_target_group,
        SUM(CASE WHEN ${DQ_RULES_CONFIG.missing_post_counseling.sqlCond} THEN 1 ELSE 0 END) AS missing_post_counseling,
        SUM(CASE WHEN ${DQ_RULES_CONFIG.counseling_before_reg.sqlCond} THEN 1 ELSE 0 END) AS counseling_before_reg,
        SUM(CASE WHEN ${DQ_RULES_CONFIG.reactive_unlinked.sqlCond} THEN 1 ELSE 0 END) AS reactive_unlinked,
        SUM(CASE WHEN ${DQ_RULES_CONFIG.negative_with_referral.sqlCond} THEN 1 ELSE 0 END) AS negative_with_referral,
        SUM(CASE WHEN ${DQ_RULES_CONFIG.rtri_on_negative.sqlCond} THEN 1 ELSE 0 END) AS rtri_on_negative,
        SUM(CASE WHEN ${DQ_RULES_CONFIG.reactive_missing_rtri.sqlCond} THEN 1 ELSE 0 END) AS reactive_missing_rtri,
        SUM(CASE WHEN ${DQ_RULES_CONFIG.gender_target_conflict.sqlCond} THEN 1 ELSE 0 END) AS gender_target_conflict,
        SUM(CASE WHEN ${DQ_RULES_CONFIG.line_test_inconsistency.sqlCond} THEN 1 ELSE 0 END) AS line_test_inconsistency,
        SUM(CASE WHEN ${DQ_RULES_CONFIG.known_positive_retesting.sqlCond} THEN 1 ELSE 0 END) AS known_positive_retesting,
        SUM(CASE WHEN ${DQ_RULES_CONFIG.inconclusive_results.sqlCond} THEN 1 ELSE 0 END) AS inconclusive_results,
        SUM(CASE WHEN ${DQ_RULES_CONFIG.invalid_phone.sqlCond} THEN 1 ELSE 0 END) AS invalid_phone,
        SUM(CASE 
          WHEN (v.uuic IS NOT NULL AND TRIM(v.uuic) != '')
            AND (v.dob IS NOT NULL AND YEAR(v.dob) >= 1920 AND v.dob <= v.registration_date AND TIMESTAMPDIFF(YEAR, v.dob, v.registration_date) <= 105)
            AND (v.patient_type_id IS NOT NULL AND v.patient_type_id > 0)
            AND NOT (v.hiv_result = 1 AND v.refer_to_service_id = 1)
            AND NOT (v.hiv_result = 2 AND (v.refer_to_service_id != 1 OR v.refer_to_service_id IS NULL))
            AND NOT ((v.hiv_result = 1 OR v.hiv_result = 0) AND (v.rtri_result_id = 1 OR v.rtri_result_id = 2))
            AND NOT ((v.sex = 1 AND v.patient_type_id IN (1, 8)) OR (v.sex = 0 AND v.patient_type_id IN (2, 7)))
            AND NOT (v.post_counseling_date IS NOT NULL AND v.post_counseling_date < v.registration_date)
            AND NOT (v.hiv_result = 2 AND (v.rtri_result_id IS NULL OR v.rtri_result_id = 0))
            AND NOT ((ltr.line_control = 0 AND v.hiv_result = 2) OR (ltr.line_control = 1 AND ltr.line_positive = 1 AND ltr.line_longterm = 1 AND v.hiv_result != 2) OR (ltr.line_control = 0 AND (ltr.line_positive = 1 OR ltr.line_longterm = 1)))
          THEN 1 ELSE 0 END) AS clean_records
      FROM vccts v
      LEFT JOIN vcct_line_test_results ltr ON v.site_code = ltr.site_code AND v.vcct_id = ltr.vcct_id
      ${siteJoin}
      WHERE ${whereClause}
    `;

    // 2. Facility Ranking Query: Sites with highest Data Quality flags
    const siteBreakdownSql = `
      SELECT
        v.site_code,
        COALESCE(s.site_name, v.site_code) AS site_name,
        COALESCE(NULLIF(p.province_kh, ''), p.province_en, 'មិនស្គាល់') AS province_name,
        COALESCE(NULLIF(od.name_kh, ''), od.name_en, 'មិនស្គាល់') AS od_name,
        COUNT(*) AS total_tested,
        SUM(CASE WHEN ${DQ_RULES_CONFIG.missing_uuic.sqlCond} THEN 1 ELSE 0 END) AS missing_uuic,
        SUM(CASE WHEN ${DQ_RULES_CONFIG.missing_target_group.sqlCond} THEN 1 ELSE 0 END) AS missing_target_group,
        SUM(CASE WHEN ${DQ_RULES_CONFIG.negative_with_referral.sqlCond} THEN 1 ELSE 0 END) AS negative_with_referral,
        SUM(CASE WHEN ${DQ_RULES_CONFIG.reactive_unlinked.sqlCond} THEN 1 ELSE 0 END) AS reactive_unlinked,
        SUM(CASE WHEN ${DQ_RULES_CONFIG.counseling_before_reg.sqlCond} THEN 1 ELSE 0 END) AS counseling_before_reg,
        SUM(CASE WHEN ${DQ_RULES_CONFIG.reactive_missing_rtri.sqlCond} THEN 1 ELSE 0 END) AS reactive_missing_rtri,
        SUM(CASE 
          WHEN (v.uuic IS NULL OR TRIM(v.uuic) = '')
            OR (v.dob IS NULL OR YEAR(v.dob) < 1920 OR v.dob > v.registration_date OR TIMESTAMPDIFF(YEAR, v.dob, v.registration_date) > 105)
            OR (v.patient_type_id IS NULL OR v.patient_type_id = 0)
            OR (v.hiv_result = 1 AND v.refer_to_service_id = 1)
            OR (v.hiv_result = 2 AND (v.refer_to_service_id != 1 OR v.refer_to_service_id IS NULL))
            OR ((v.hiv_result = 1 OR v.hiv_result = 0) AND (v.rtri_result_id = 1 OR v.rtri_result_id = 2))
            OR ((v.sex = 1 AND v.patient_type_id IN (1, 8)) OR (v.sex = 0 AND v.patient_type_id IN (2, 7)))
            OR (v.post_counseling_date IS NOT NULL AND v.post_counseling_date < v.registration_date)
            OR (v.hiv_result = 2 AND (v.rtri_result_id IS NULL OR v.rtri_result_id = 0))
            OR ((ltr.line_control = 0 AND v.hiv_result = 2) OR (ltr.line_control = 1 AND ltr.line_positive = 1 AND ltr.line_longterm = 1 AND v.hiv_result != 2) OR (ltr.line_control = 0 AND (ltr.line_positive = 1 OR ltr.line_longterm = 1)))
          THEN 1 ELSE 0 END) AS total_issues
      FROM vccts v
      LEFT JOIN tblsites s ON v.site_code = s.vcct_site_code
      LEFT JOIN tblprovince p ON s.province_id = p.id
      LEFT JOIN tblods od ON s.od_code = od.od_code
      LEFT JOIN vcct_line_test_results ltr ON v.site_code = ltr.site_code AND v.vcct_id = ltr.vcct_id
      WHERE ${whereClause}
      GROUP BY v.site_code, s.site_name, p.province_kh, p.province_en, od.name_kh, od.name_en
      HAVING total_issues > 0
      ORDER BY total_issues DESC
      LIMIT 20
    `;

    const [[[rawOverall]], [facilities]] = await Promise.all([
      pool.query(overallSql, params),
      pool.query(siteBreakdownSql, params),
    ]);

    const totalTested = Number(rawOverall?.total_tested || 0);
    const cleanRecords = Number(rawOverall?.clean_records || 0);
    const dqScore = totalTested > 0 ? Number(((cleanRecords / totalTested) * 100).toFixed(1)) : 100;
    const totalIssues = Math.max(0, totalTested - cleanRecords);

    // Structure validation issue categories
    const issuesByType = Object.values(DQ_RULES_CONFIG).map((cfg) => {
      const count = Number(rawOverall?.[cfg.id] || 0);
      return {
        ...cfg,
        count,
        percentage: totalTested > 0 ? Number(((count / totalTested) * 100).toFixed(1)) : 0,
      };
    });

    // Format facilities ranking
    const facilitiesFormatted = facilities.map((f) => {
      const siteTested = Number(f.total_tested || 0);
      const siteIssues = Number(f.total_issues || 0);
      const siteClean = Math.max(0, siteTested - siteIssues);
      const score = siteTested > 0 ? Number(((siteClean / siteTested) * 100).toFixed(1)) : 100;
      return {
        siteCode: f.site_code,
        siteName: f.site_name,
        provinceName: f.province_name,
        odName: f.od_name,
        totalTested: siteTested,
        totalIssues: siteIssues,
        dqScore: score,
        missingUuic: Number(f.missing_uuic || 0),
        counselingBeforeReg: Number(f.counseling_before_reg || 0),
        reactiveMissingRtri: Number(f.reactive_missing_rtri || 0),
        negativeWithReferral: Number(f.negative_with_referral || 0),
        reactiveUnlinked: Number(f.reactive_unlinked || 0),
      };
    });

    return res.json({
      success: true,
      data: {
        overall: {
          totalTested,
          cleanRecords,
          totalIssues,
          dqScore,
        },
        issuesByType,
        byFacility: facilitiesFormatted,
      },
    });
  } catch (err) {
    console.error('getDataQualitySummary error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * GET /api/data-quality/records
 * Returns paginated flagged records for drill-down inspection.
 */
export async function getDataQualityRecords(req, res) {
  try {
    const pool = getDbPool();
    const { conditions, params } = buildConditions(req.query);
    const rule = req.query.rule || 'all_issues';
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(100, Math.max(10, parseInt(req.query.limit || '50', 10)));
    const offset = (page - 1) * limit;

    // Rule specific filter
    let ruleCondition = '1=1';
    if (DQ_RULES_CONFIG[rule]) {
      ruleCondition = DQ_RULES_CONFIG[rule].sqlCond;
    } else {
      // all_issues
      ruleCondition = `(
        (v.uuic IS NULL OR TRIM(v.uuic) = '')
        OR (v.dob IS NULL OR YEAR(v.dob) < 1920 OR v.dob > v.registration_date OR TIMESTAMPDIFF(YEAR, v.dob, v.registration_date) > 105)
        OR (v.patient_type_id IS NULL OR v.patient_type_id = 0)
        OR (v.hiv_result = 1 AND v.refer_to_service_id = 1)
        OR (v.hiv_result = 2 AND (v.refer_to_service_id != 1 OR v.refer_to_service_id IS NULL))
        OR ((v.hiv_result = 1 OR v.hiv_result = 0) AND (v.rtri_result_id = 1 OR v.rtri_result_id = 2))
        OR ((v.sex = 1 AND v.patient_type_id IN (1, 8)) OR (v.sex = 0 AND v.patient_type_id IN (2, 7)))
        OR (v.post_counseling_date IS NOT NULL AND v.post_counseling_date < v.registration_date)
        OR (v.hiv_result = 2 AND (v.rtri_result_id IS NULL OR v.rtri_result_id = 0))
        OR ((ltr.line_control = 0 AND v.hiv_result = 2) OR (ltr.line_control = 1 AND ltr.line_positive = 1 AND ltr.line_longterm = 1 AND v.hiv_result != 2) OR (ltr.line_control = 0 AND (ltr.line_positive = 1 OR ltr.line_longterm = 1)))
      )`;
    }

    conditions.push(ruleCondition);
    const whereClause = conditions.join(' AND ');

    // Count total flagged
    const countSql = `
      SELECT COUNT(*) AS total
      FROM vccts v
      LEFT JOIN tblsites s ON v.site_code = s.vcct_site_code
      LEFT JOIN vcct_line_test_results ltr ON v.site_code = ltr.site_code AND v.vcct_id = ltr.vcct_id
      WHERE ${whereClause}
    `;
    const [[countRes]] = await pool.query(countSql, params);
    const totalRecords = Number(countRes?.total || 0);

    // Fetch records
    const recordsSql = `
      SELECT 
        v.site_code,
        v.vcct_id,
        v.registration_date,
        v.uuic,
        v.pmrs_code,
        v.hts_code,
        v.sex,
        v.dob,
        TIMESTAMPDIFF(YEAR, v.dob, v.registration_date) AS age,
        v.patient_type_id,
        COALESCE(NULLIF(tg.Targroupkh, ''), tg.Targroup, 'មិនស្គាល់') AS target_group_name,
        v.history_of_test_result,
        v.hiv_result,
        v.rtri_result_id,
        v.refer_to_service_id,
        v.post_counseling_date,
        v.phone_number,
        ltr.line_control,
        ltr.line_positive,
        ltr.line_longterm,
        COALESCE(s.site_name, v.site_code) AS site_name,
        COALESCE(NULLIF(p.province_kh, ''), p.province_en) AS province_name,
        COALESCE(NULLIF(od.name_kh, ''), od.name_en) AS od_name
      FROM vccts v
      LEFT JOIN tblsites s ON v.site_code = s.vcct_site_code
      LEFT JOIN tbltargroup tg ON v.patient_type_id = tg.Tid
      LEFT JOIN tblprovince p ON s.province_id = p.id
      LEFT JOIN tblods od ON s.od_code = od.od_code
      LEFT JOIN vcct_line_test_results ltr ON v.site_code = ltr.site_code AND v.vcct_id = ltr.vcct_id
      WHERE ${whereClause}
      ORDER BY v.registration_date DESC, v.vcct_id DESC
      LIMIT ? OFFSET ?
    `;

    const [rows] = await pool.query(recordsSql, [...params, limit, offset]);

    // Attach specific validation flags to each record
    const recordsWithFlags = rows.map((r) => {
      const flags = [];
      if (!r.uuic || !r.uuic.trim()) {
        flags.push('ខ្វះ UUIC');
      }
      if (!r.dob || Number(r.age) < 0 || Number(r.age) > 105) {
        flags.push('អាយុ/ថ្ងៃកំណើតមិនត្រឹមត្រូវ');
      }
      if (!r.patient_type_id || r.patient_type_id === 0) {
        flags.push('ខ្វះប្រភេទអតិថិជន');
      }
      if (r.post_counseling_date && r.post_counseling_date < r.registration_date) {
        flags.push('ប្រឹក្សាមុនថ្ងៃចុះឈ្មោះ');
      }
      if (Number(r.hiv_result) === 1 && Number(r.refer_to_service_id) === 1) {
        flags.push('HIV អវិជ្ជមានតែបញ្ជូនទៅ ART');
      }
      if (Number(r.hiv_result) === 2 && (!r.refer_to_service_id || Number(r.refer_to_service_id) !== 1)) {
        flags.push('HIV វិជ្ជមានមិនទាន់បញ្ជូនទៅ ART');
      }
      if (Number(r.hiv_result) === 2 && (!r.rtri_result_id || Number(r.rtri_result_id) === 0)) {
        flags.push('HIV វិជ្ជមានខ្វះតេស្ត RTRI');
      }
      if (Number(r.hiv_result) !== 2 && (Number(r.rtri_result_id) === 1 || Number(r.rtri_result_id) === 2)) {
        flags.push('RTRI លើករណីអវិជ្ជមាន');
      }
      if ((Number(r.sex) === 1 && [1, 8].includes(Number(r.patient_type_id))) ||
          (Number(r.sex) === 0 && [2, 7].includes(Number(r.patient_type_id)))) {
        flags.push('ភេទមិនត្រូវនឹងប្រភេទអតិថិជន');
      }
      if (
        (r.line_control === 0 && Number(r.hiv_result) === 2) ||
        (r.line_control === 1 && r.line_positive === 1 && r.line_longterm === 1 && Number(r.hiv_result) !== 2) ||
        (r.line_control === 0 && (r.line_positive === 1 || r.line_longterm === 1))
      ) {
        flags.push('លទ្ធផល ៣ បន្ទាត់មិនស៊ីសង្វាក់');
      }
      if (Number(r.history_of_test_result) === 2) {
        flags.push('ដឹងថាវិជ្ជមានពីមុន មកធ្វើតេស្តឡើងវិញ');
      }
      if (Number(r.hiv_result) === 3) {
        flags.push('លទ្ធផលមិនច្បាស់លាស់ (Inconclusive)');
      }
      if (r.phone_number && r.phone_number.trim() && (r.phone_number.replace(/[^0-9]/g, '').length < 8 || r.phone_number.replace(/[^0-9]/g, '').length > 12)) {
        flags.push('លេខទូរស័ព្ទមិនត្រឹមត្រូវ');
      }

      return {
        ...r,
        flags,
      };
    });

    return res.json({
      success: true,
      data: recordsWithFlags,
      pagination: {
        page,
        limit,
        total: totalRecords,
        totalPages: Math.ceil(totalRecords / limit) || 1,
      },
    });
  } catch (err) {
    console.error('getDataQualityRecords error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * GET /api/data-quality/export/excel
 * Export Data Quality Flagged Records to Excel
 */
export async function exportDataQualityExcel(req, res) {
  try {
    const pool = getDbPool();
    const { conditions, params } = buildConditions(req.query);
    const rule = req.query.rule || 'all_issues';

    let ruleCondition = '1=1';
    if (DQ_RULES_CONFIG[rule]) {
      ruleCondition = DQ_RULES_CONFIG[rule].sqlCond;
    } else {
      ruleCondition = `(
        (v.uuic IS NULL OR TRIM(v.uuic) = '')
        OR (v.dob IS NULL OR YEAR(v.dob) < 1920 OR v.dob > v.registration_date OR TIMESTAMPDIFF(YEAR, v.dob, v.registration_date) > 105)
        OR (v.patient_type_id IS NULL OR v.patient_type_id = 0)
        OR (v.hiv_result = 1 AND v.refer_to_service_id = 1)
        OR (v.hiv_result = 2 AND (v.refer_to_service_id != 1 OR v.refer_to_service_id IS NULL))
        OR ((v.hiv_result = 1 OR v.hiv_result = 0) AND (v.rtri_result_id = 1 OR v.rtri_result_id = 2))
        OR ((v.sex = 1 AND v.patient_type_id IN (1, 8)) OR (v.sex = 0 AND v.patient_type_id IN (2, 7)))
        OR (v.post_counseling_date IS NOT NULL AND v.post_counseling_date < v.registration_date)
        OR (v.hiv_result = 2 AND (v.rtri_result_id IS NULL OR v.rtri_result_id = 0))
        OR ((ltr.line_control = 0 AND v.hiv_result = 2) OR (ltr.line_control = 1 AND ltr.line_positive = 1 AND ltr.line_longterm = 1 AND v.hiv_result != 2) OR (ltr.line_control = 0 AND (ltr.line_positive = 1 OR ltr.line_longterm = 1)))
      )`;
    }

    conditions.push(ruleCondition);
    const whereClause = conditions.join(' AND ');

    const recordsSql = `
      SELECT 
        v.site_code,
        v.vcct_id,
        v.registration_date,
        v.uuic,
        v.pmrs_code,
        v.hts_code,
        v.sex,
        v.dob,
        TIMESTAMPDIFF(YEAR, v.dob, v.registration_date) AS age,
        v.patient_type_id,
        COALESCE(NULLIF(tg.Targroupkh, ''), tg.Targroup, 'មិនស្គាល់') AS target_group_name,
        v.history_of_test_result,
        v.hiv_result,
        v.rtri_result_id,
        v.refer_to_service_id,
        v.post_counseling_date,
        v.phone_number,
        ltr.line_control,
        ltr.line_positive,
        ltr.line_longterm,
        COALESCE(s.site_name, v.site_code) AS site_name,
        COALESCE(NULLIF(p.province_kh, ''), p.province_en) AS province_name,
        COALESCE(NULLIF(od.name_kh, ''), od.name_en) AS od_name
      FROM vccts v
      LEFT JOIN tblsites s ON v.site_code = s.vcct_site_code
      LEFT JOIN tbltargroup tg ON v.patient_type_id = tg.Tid
      LEFT JOIN tblprovince p ON s.province_id = p.id
      LEFT JOIN tblods od ON s.od_code = od.od_code
      LEFT JOIN vcct_line_test_results ltr ON v.site_code = ltr.site_code AND v.vcct_id = ltr.vcct_id
      WHERE ${whereClause}
      ORDER BY v.registration_date DESC, v.vcct_id DESC
      LIMIT 20000
    `;

    const [rows] = await pool.query(recordsSql, params);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Quality Audit List');

    worksheet.mergeCells('A1:M1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'VCCT DATA QUALITY AUDIT & VALIDATION REPORT';
    titleCell.font = { name: 'Segoe UI', size: 13, bold: true, color: { argb: 'FFFFFFFF' } };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF991B1B' } };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getRow(1).height = 30;

    const ruleLabel = DQ_RULES_CONFIG[rule]?.labelKh || 'បញ្ជីកំហុសទាំងអស់ (All Issues)';
    worksheet.mergeCells('A2:M2');
    const subCell = worksheet.getCell('A2');
    subCell.value = `Rule: ${ruleLabel} | Total Flagged Records: ${rows.length} | Export Date: ${new Date().toLocaleDateString()}`;
    subCell.font = { name: 'Segoe UI', size: 9.5, italic: true, color: { argb: 'FF475569' } };
    subCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
    worksheet.getRow(2).height = 20;

    const columns = [
      { header: '#', width: 6 },
      { header: 'កាលបរិច្ឆេទ (Date)', width: 16 },
      { header: 'VCCT ID', width: 14 },
      { header: 'លេខសម្គាល់ (UUIC)', width: 18 },
      { header: 'មណ្ឌលផ្តល់សេវា (Site)', width: 26 },
      { header: 'ខេត្ត (Province)', width: 18 },
      { header: 'ភេទ / អាយុ (Sex/Age)', width: 16 },
      { header: 'ប្រភេទអតិថិជន (Client Type)', width: 22 },
      { header: 'លទ្ធផល HIV (HIV Result)', width: 16 },
      { header: 'តេស្តឆ្លងថ្មី (RTRI)', width: 16 },
      { header: 'ការបញ្ជូន (Referral)', width: 18 },
      { header: 'ប្រឹក្សាក្រោយតេស្ត (Post-Counseling)', width: 22 },
      { header: 'កំហុសដែលរកឃើញ (Issues Detected)', width: 38 },
    ];

    worksheet.getRow(4).values = columns.map(c => c.header);
    worksheet.getRow(4).height = 24;
    worksheet.getRow(4).eachCell((cell, colNumber) => {
      cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { 
        type: 'pattern', 
        pattern: 'solid', 
        fgColor: { argb: colNumber === 13 ? 'FFB91C1C' : 'FFBE123C' } 
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    columns.forEach((col, idx) => {
      worksheet.getColumn(idx + 1).width = col.width;
    });

    rows.forEach((r, idx) => {
      const flags = [];
      const isMissingUuic = !r.uuic || !r.uuic.trim();
      if (isMissingUuic) flags.push('ខ្វះ UUIC');

      const isInvalidAge = !r.dob || r.age === null || r.age === undefined || Number(r.age) < 0 || Number(r.age) > 105;
      if (isInvalidAge) flags.push('អាយុ/ថ្ងៃកំណើតមិនត្រឹមត្រូវ');

      const isMissingTarget = !r.patient_type_id || r.patient_type_id === 0;
      if (isMissingTarget) flags.push('ខ្វះប្រភេទអតិថិជន');

      const isCounselingBeforeReg = r.post_counseling_date && r.post_counseling_date < r.registration_date;
      if (isCounselingBeforeReg) flags.push('ប្រឹក្សាមុនថ្ងៃចុះឈ្មោះ');

      const isNegativeWithArt = Number(r.hiv_result) === 1 && Number(r.refer_to_service_id) === 1;
      if (isNegativeWithArt) flags.push('HIV អវិជ្ជមានតែបញ្ជូនទៅ ART');

      const isReactiveUnlinked = Number(r.hiv_result) === 2 && Number(r.refer_to_service_id) !== 1;
      if (isReactiveUnlinked) flags.push('HIV វិជ្ជមានមិនទាន់បញ្ជូន ART');

      const isReactiveMissingRtri = Number(r.hiv_result) === 2 && (!r.rtri_result_id || Number(r.rtri_result_id) === 0);
      if (isReactiveMissingRtri) flags.push('HIV វិជ្ជមានខ្វះតេស្ត RTRI');

      const isRtriOnNegative = Number(r.hiv_result) !== 2 && (Number(r.rtri_result_id) === 1 || Number(r.rtri_result_id) === 2);
      if (isRtriOnNegative) flags.push('RTRI លើករណីអវិជ្ជមាន');

      const isGenderConflict = (Number(r.sex) === 1 && [1, 8].includes(Number(r.patient_type_id))) ||
                               (Number(r.sex) === 0 && [2, 7].includes(Number(r.patient_type_id)));
      if (isGenderConflict) flags.push('ភេទមិនត្រូវនឹងប្រភេទអតិថិជន');

      const isLineConflict = (r.line_control === 0 && Number(r.hiv_result) === 2) ||
                             (r.line_control === 1 && r.line_positive === 1 && r.line_longterm === 1 && Number(r.hiv_result) !== 2) ||
                             (r.line_control === 0 && (r.line_positive === 1 || r.line_longterm === 1));
      if (isLineConflict) flags.push('លទ្ធផល ៣ បន្ទាត់មិនស៊ីសង្វាក់');

      if (Number(r.history_of_test_result) === 2) flags.push('ដឹងថាវិជ្ជមានពីមុន មកធ្វើតេស្តឡើងវិញ');
      if (Number(r.hiv_result) === 3) flags.push('លទ្ធផលមិនច្បាស់លាស់ (Inconclusive)');

      const vcctId = r.vcct_id !== null && r.vcct_id !== undefined ? r.vcct_id : '-';
      const sexLabel = Number(r.sex) === 1 ? 'ប្រុស' : Number(r.sex) === 0 ? 'ស្រី' : 'TG';
      const hivLabel = Number(r.hiv_result) === 2 ? 'វិជ្ជមាន (2)' : Number(r.hiv_result) === 1 ? 'អវិជ្ជមាន (1)' : 'មិនច្បាស់ (3)';
      const rtriLabel = isReactiveMissingRtri ? 'ខ្វះតេស្ត RTRI' : Number(r.rtri_result_id) === 1 ? 'Recent' : Number(r.rtri_result_id) === 2 ? 'Long-term' : '-';
      const referralLabel = isNegativeWithArt ? 'កំហុស៖ បញ្ជូនទៅ ART' : isReactiveUnlinked ? 'មិនទាន់បញ្ជូនទៅ ART' : r.refer_to_service_id === 1 ? 'ART' : r.refer_to_service_id > 0 ? 'សេវាផ្សេង' : 'គ្មាន';
      const postCounselingLabel = isCounselingBeforeReg ? `${r.post_counseling_date} ⚠️ (ចុះឈ្មោះ: ${r.registration_date})` : r.post_counseling_date || '-';

      const row = worksheet.addRow([
        idx + 1,
        r.registration_date,
        vcctId,
        isMissingUuic ? 'គ្មាន UUIC (Missing UUIC)' : r.uuic,
        r.site_name,
        r.province_name,
        `${sexLabel} / ${r.age || '-'} ឆ្នាំ`,
        r.target_group_name,
        hivLabel,
        rtriLabel,
        referralLabel,
        postCounselingLabel,
        flags.join('; '),
      ]);
      row.height = 20;

      const isEven = idx % 2 === 0;
      row.eachCell((cell, colNumber) => {
        cell.font = { name: 'Segoe UI', size: 9.5 };
        cell.border = {
          top: { style: 'hair', color: { argb: 'FFE2E8F0' } },
          bottom: { style: 'hair', color: { argb: 'FFE2E8F0' } },
          left: { style: 'hair', color: { argb: 'FFE2E8F0' } },
          right: { style: 'hair', color: { argb: 'FFE2E8F0' } },
        };
        if (isEven) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
        }

        // Center alignment for codes and numbers
        if ([1, 2, 3, 4, 7, 9, 10, 11, 12].includes(colNumber)) {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        } else {
          cell.alignment = { vertical: 'middle', horizontal: 'left', indent: 0.5 };
        }

        // Highlight Specific Wrong Attributes:
        // Col 4: Missing UUIC
        if (colNumber === 4 && isMissingUuic) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };
          cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF991B1B' } };
        }
        // Col 7: Invalid Age
        if (colNumber === 7 && isInvalidAge) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };
          cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF991B1B' } };
        }
        // Col 8: Missing Target Group or Gender Conflict
        if (colNumber === 8 && (isMissingTarget || isGenderConflict)) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3C7' } };
          cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF92400E' } };
        }
        // Col 9: HIV Reactive
        if (colNumber === 9 && Number(r.hiv_result) === 2) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };
          cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF991B1B' } };
        }
        // Col 10: RTRI issues
        if (colNumber === 10 && isReactiveMissingRtri) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3C7' } };
          cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF92400E' } };
        } else if (colNumber === 10 && isRtriOnNegative) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };
          cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF991B1B' } };
        }
        // Col 11: Referral issues
        if (colNumber === 11 && (isReactiveUnlinked || isNegativeWithArt)) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };
          cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF991B1B' } };
        }
        // Col 12: Counseling Date Before Registration Date
        if (colNumber === 12 && isCounselingBeforeReg) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };
          cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF991B1B' } };
        }
        // Col 13: Issues Detected Summary
        if (colNumber === 13) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF1F2' } };
          cell.font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: 'FFE11D48' } };
        }
      });
    });

    const filename = `VCCT_DataQuality_Audit_${new Date().toISOString().slice(0, 10)}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('exportDataQualityExcel error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
