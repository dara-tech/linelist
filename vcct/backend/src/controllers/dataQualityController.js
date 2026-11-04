import { getDbPool } from '../config/db.js';
import ExcelJS from 'exceljs';

/**
 * Registry of Data Quality Rules for VCCT Surveillance
 * Matches official national guidelines and DQA Assessment Dashboard
 */
export const DQ_RULES_CONFIG = {
  // 1. Missing HTS Codes
  hts_missing: {
    id: 'hts_missing',
    ruleCode: 'HTS-VCCT',
    labelKh: 'អតិថិជន VCCT ខ្វះលេខកូដ HTS',
    labelEn: 'CCT Clients missing HTS Codes - for VCCT',
    category: 'completeness',
    severity: 'medium',
    sqlCond: "(v.hts_code IS NULL OR TRIM(v.hts_code) = '')",
    description: 'អតិថិជន VCCT មិនទាន់មានលេខកូដ HTS Code នៅក្នុងប្រព័ន្ធ (ត្រូវការសម្រាប់តាមដានសេវា HTS)។',
    recommendation: 'ពិនិត្យ និងបំពេញលេខកូដ HTS Code ជូនអតិថិជន។',
  },

  // 2. Having HTS Codes for CMA
  hts_having: {
    id: 'hts_having',
    ruleCode: 'HTS-CMA',
    labelKh: 'អតិថិជន VCCT មានលេខកូដ HTS សម្រាប់ CMA',
    labelEn: 'VCCT Clients having HTS Codes, for CMA',
    category: 'completeness',
    severity: 'info',
    sqlCond: "(v.hts_code IS NOT NULL AND TRIM(v.hts_code) != '')",
    description: 'អតិថិជន VCCT ដែលមានលេខកូដ HTS Code រួចរាល់សម្រាប់ភ្ជាប់ទៅកាន់ប្រព័ន្ធ CMA។',
    recommendation: 'ទិន្នន័យត្រឹមត្រូវសម្រាប់ផ្ទៀងផ្ទាត់ជាមួយប្រព័ន្ធ CMA។',
  },

  // 5. Retest Result = not Positive?
  v10_retest_not_positive: {
    id: 'v10_retest_not_positive',
    ruleCode: 'V10',
    labelKh: 'លទ្ធផលតេស្តឡើងវិញ មិនវិជ្ជមាន',
    labelEn: 'V10. Retest Result = not Positive?',
    category: 'clinical',
    severity: 'high',
    sqlCond: '(rt.result IS NOT NULL)',
    description: 'អតិថិជនធ្វើតេស្តឡើងវិញ (Retest) មុនព្យាបាល ប៉ុន្តែលទ្ធផលមិនមែនវិជ្ជមាន (លទ្ធផល ≠ 2)។',
    recommendation: 'ផ្ទៀងផ្ទាត់សំណាក និងលទ្ធផលតេស្តឡើងវិញជាបន្ទាន់ មុននឹងបញ្ជូនទៅព្យាបាល ART។',
  },

  // 6. V0.1 HIV Test Result Inconclusive or Not Selected
  v01_inconclusive_or_empty: {
    id: 'v01_inconclusive_or_empty',
    ruleCode: 'V0.1',
    labelKh: 'លទ្ធផលតេស្ត HIV មិនច្បាស់ ឬមិនបានជ្រើសរើស',
    labelEn: 'V0.1 HIV Test Result of Inconclusive or Not Selected',
    category: 'clinical',
    severity: 'high',
    sqlCond: '(v.hiv_result = 3 OR v.hiv_result = 0 OR v.hiv_result IS NULL)',
    description: 'លទ្ធផលតេស្ត HIV កត់ត្រាជាមិនច្បាស់លាស់ (Inconclusive = 3) ឬមិនទាន់បានជ្រើសរើស (0 ឬទទេ)។',
    recommendation: 'ណាត់ជួបអតិថិជនធ្វើតេស្តឡើងវិញក្រោយ ១៤ ថ្ងៃ ឬបញ្ជាក់លទ្ធផលតេស្តចុងក្រោយ។',
  },

  // 7. V0.2 Age less than 1 year, but tested for HIV
  v02_age_under_1: {
    id: 'v02_age_under_1',
    ruleCode: 'V0.2',
    labelKh: 'អាយុតិចជាង ១ ឆ្នាំ តែធ្វើតេស្ត HIV',
    labelEn: 'V0.2 Age less than 1 year, but tested for HIV',
    category: 'logical',
    severity: 'high',
    sqlCond: '(TIMESTAMPDIFF(YEAR, v.dob, v.registration_date) < 1)',
    description: 'កុមារអាយុតិចជាង ១ ឆ្នាំ ត្រូវបានកត់ត្រាថាបានធ្វើតេស្ត HIV រហ័ស (ទារកក្រោម ១ ឆ្នាំត្រូវធ្វើតេស្ត PCR/DNA)។',
    recommendation: 'ផ្ទៀងផ្ទាត់ថ្ងៃខែឆ្នាំកំណើត ឬពិនិត្យវិធីសាស្ត្រធ្វើតេស្តតាមគោលការណ៍ជាតិកុមារ។',
  },

  // 8. V0.3 Age less than 15 years but Occupation
  v03_under_15_occupation: {
    id: 'v03_under_15_occupation',
    ruleCode: 'V0.3',
    labelKh: 'អាយុក្រោម ១៥ ឆ្នាំ តែមានមុខរបរមនុស្សធំ',
    labelEn: 'V0.3 Age less than 15 years but Occupation',
    category: 'logical',
    severity: 'medium',
    sqlCond: '(TIMESTAMPDIFF(YEAR, v.dob, v.registration_date) < 15 AND v.occupation_id IS NOT NULL AND v.occupation_id NOT IN (0, 9))',
    description: 'កុមារអាយុក្រោម ១៥ ឆ្នាំ ត្រូវបានកត់ត្រាថាមានមុខរបរមនុស្សធំ (ក្រៅពីសិស្ស ឬគ្មានមុខរបរ)។',
    recommendation: 'ផ្ទៀងផ្ទាត់អាយុ ឬមុខរបររបស់អតិថិជនឡើងវិញ។',
  },

  // 9. V0.4 Age less than 15 years, but Client Type ...
  v04_under_15_kp: {
    id: 'v04_under_15_kp',
    ruleCode: 'V0.4',
    labelKh: 'អាយុក្រោម ១៥ ឆ្នាំ តែជាក្រុមប្រជាជនគន្លឹះ',
    labelEn: 'V0.4 Age less than 15 years, but Client Type ...',
    category: 'logical',
    severity: 'high',
    sqlCond: '(TIMESTAMPDIFF(YEAR, v.dob, v.registration_date) < 15 AND v.patient_type_id IN (1, 2, 3, 4, 5, 7, 8))',
    description: 'កុមារអាយុក្រោម ១៥ ឆ្នាំ ត្រូវបានកត់ត្រាថាជាក្រុមប្រជាជនគន្លឹះមនុស្សធំ (FEW, MSM, TG, PWUD, PWID, MEW, PPW)។',
    recommendation: 'ត្រួតពិនិត្យប្រភេទអតិថិជន និងថ្ងៃខែឆ្នាំកំណើត។',
  },

  // 10. V0.5 Age less than 15 years, but Marital Status ...
  v05_under_15_marital: {
    id: 'v05_under_15_marital',
    ruleCode: 'V0.5',
    labelKh: 'អាយុក្រោម ១៥ ឆ្នាំ តែមានស្ថានភាពអាពាហ៍ពិពាហ៍',
    labelEn: 'V0.5 Age less than 15 years, but Marital Status ...',
    category: 'logical',
    severity: 'medium',
    sqlCond: '(TIMESTAMPDIFF(YEAR, v.dob, v.registration_date) < 15 AND v.marital_status_id IN (2, 3))',
    description: 'កុមារអាយុក្រោម ១៥ ឆ្នាំ ត្រូវបានកត់ត្រាថាបានរៀបការ ឬលែងលះ/ពោះម៉ាយ/មេម៉ាយ។',
    recommendation: 'ផ្ទៀងផ្ទាត់ស្ថានភាពអាពាហ៍ពិពាហ៍ និងអាយុរបស់អតិថិជន។',
  },

  // 11. V0.6 Age less than 15, but Education level of High School or Above
  v06_under_15_education: {
    id: 'v06_under_15_education',
    ruleCode: 'V0.6',
    labelKh: 'អាយុក្រោម ១៥ ឆ្នាំ តែរៀនចប់វិទ្យាល័យឡើងទៅ',
    labelEn: 'V0.6 Age less than 15, but Education level of High School or Above',
    category: 'logical',
    severity: 'medium',
    sqlCond: '(TIMESTAMPDIFF(YEAR, v.dob, v.registration_date) < 15 AND v.education_id IN (4, 5))',
    description: 'កុមារអាយុក្រោម ១៥ ឆ្នាំ ត្រូវបានកត់ត្រាកម្រិតវប្បធម៌ចាប់ពីវិទ្យាល័យ ឬឧត្តមសិក្សាឡើងទៅ។',
    recommendation: 'កែតម្រូវកម្រិតវប្បធម៌ ឬថ្ងៃខែឆ្នាំកំណើត។',
  },

  // 12. V0.7 Male Housewife
  v07_male_housewife: {
    id: 'v07_male_housewife',
    ruleCode: 'V0.7',
    labelKh: 'ភេទប្រុស ចុះជាស្ត្រីមេផ្ទះ',
    labelEn: 'V0.7 Male Housewife',
    category: 'logical',
    severity: 'medium',
    sqlCond: '(v.sex = 1 AND v.occupation_id = 11)',
    description: 'អតិថិជនភេទប្រុស (sex = 1) ប៉ុន្តែត្រូវបានកត់ត្រាមុខរបរជាស្ត្រីមេផ្ទះ (occupation_id = 11)។',
    recommendation: 'ផ្ទៀងផ្ទាត់ភេទ និងមុខរបររបស់អតិថិជន។',
  },

  // 13. V0. Clients tested HIV Pos, but not linked to ART
  v00_reactive_unlinked: {
    id: 'v00_reactive_unlinked',
    ruleCode: 'V0',
    labelKh: 'HIV វិជ្ជមាន មិនទាន់ភ្ជាប់ទៅព្យាបាល ART',
    labelEn: 'V0. Clients tested HIV Pos, but not linked to ART',
    category: 'clinical',
    severity: 'high',
    sqlCond: '(v.hiv_result = 2 AND (v.refer_to_service_id != 1 OR v.refer_to_service_id IS NULL OR v.refer_to_service_id = 0))',
    description: 'អតិថិជនរកឃើញ HIV វិជ្ជមាន (hiv_result = 2) ប៉ុន្តែមិនទាន់បានបញ្ជូន ឬភ្ជាប់ទៅសេវាព្យាបាល ART (refer_to_service_id ≠ 1)។',
    recommendation: 'តាមដានអតិថិជនជាបន្ទាន់ដើម្បីធានាការបញ្ជូនទៅទទួលការព្យាបាល ART។',
  },

  // Standard NCHADS Surveillance Rules
  missing_uuic: {
    id: 'missing_uuic',
    ruleCode: 'UUIC',
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
    ruleCode: 'CLIN-01',
    labelKh: 'HIV អវិជ្ជមានតែបញ្ជូនទៅ ART',
    labelEn: 'HIV Negative referred to ART',
    category: 'clinical',
    severity: 'high',
    sqlCond: '(v.hiv_result = 1 AND v.refer_to_service_id = 1)',
    description: 'លទ្ធផលតេស្តអវិជ្ជមាន ប៉ុន្តែប្រព័ន្ធកត់ត្រាថាបញ្ជូនទៅ ART (សេវាផ្សេងទៀតដូចជា កាមរោគ របេង ផ្ទៃពោះ គឺត្រឹមត្រូវធម្មតា)។',
    recommendation: 'កែសម្រួលលទ្ធផលតេស្ត ឬប្តូរស្ថានភាពបញ្ជូន (តេស្តអវិជ្ជមានមិនត្រូវបញ្ជូនទៅ ART ទេ)។',
  },
  counseling_before_reg: {
    id: 'counseling_before_reg',
    ruleCode: 'TIME-01',
    labelKh: 'កាលបរិច្ឆេទប្រឹក្សា មុនថ្ងៃចុះឈ្មោះ',
    labelEn: 'Post-Counseling Date Before Registration',
    category: 'timeline',
    severity: 'medium',
    sqlCond: '(v.post_counseling_date IS NOT NULL AND v.post_counseling_date < v.registration_date)',
    description: 'កាលបរិច្ឆេទផ្តល់ការប្រឹក្សាក្រោយតេស្តត្រូវបានកត់ត្រាមុនថ្ងៃដែលអតិថិជនបានចុះឈ្មោះធ្វើតេស្ត។',
    recommendation: 'ផ្ទៀងផ្ទាត់កាលបរិច្ឆេទប្រឹក្សាក្រោយតេស្ត (ត្រូវស្មើ ឬក្រោយថ្ងៃចុះឈ្មោះធ្វើតេស្ត)។',
  },
  line_test_inconsistency: {
    id: 'line_test_inconsistency',
    ruleCode: 'LAB-01',
    labelKh: 'លទ្ធផលតេស្ត ៣ បន្ទាត់មិនស៊ីសង្វាក់គ្នា',
    labelEn: '3-Test Algorithm Conflict',
    category: 'clinical',
    severity: 'high',
    sqlCond: '((ltr.line_control = 0 AND v.hiv_result = 2) OR (ltr.line_control = 1 AND ltr.line_positive = 1 AND ltr.line_longterm = 1 AND v.hiv_result != 2) OR (ltr.line_control = 0 AND (ltr.line_positive = 1 OR ltr.line_longterm = 1)))',
    description: 'លទ្ធផលតេស្ត Determine, Stat-Pak និង SD Bioline មិនស៊ីសង្វាក់គ្នានឹងលទ្ធផលសរុប HIV។',
    recommendation: 'ផ្ទៀងផ្ទាត់សៀវភៅបញ្ជីពិសោធន៍ និងកែតម្រូវលទ្ធផលតេស្ត ៣ បន្ទាត់ ឬលទ្ធផលចុងក្រោយ។',
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

    // Fast subquery join for retest not positive (only 24 rows in database)
    const retestJoin = 'LEFT JOIN (SELECT site_code, vcct_id, result FROM vcct_retests WHERE result != 2) rt ON v.site_code = rt.site_code AND v.vcct_id = rt.vcct_id';

    // 1. Overall Aggregated Data Quality Summary Query
    const overallSql = `
      SELECT
        COUNT(*) AS total_tested,
        SUM(CASE WHEN ${DQ_RULES_CONFIG.hts_missing.sqlCond} THEN 1 ELSE 0 END) AS hts_missing,
        SUM(CASE WHEN ${DQ_RULES_CONFIG.hts_having.sqlCond} THEN 1 ELSE 0 END) AS hts_having,
        SUM(CASE WHEN ${DQ_RULES_CONFIG.v10_retest_not_positive.sqlCond} THEN 1 ELSE 0 END) AS v10_retest_not_positive,
        SUM(CASE WHEN ${DQ_RULES_CONFIG.v01_inconclusive_or_empty.sqlCond} THEN 1 ELSE 0 END) AS v01_inconclusive_or_empty,
        SUM(CASE WHEN ${DQ_RULES_CONFIG.v02_age_under_1.sqlCond} THEN 1 ELSE 0 END) AS v02_age_under_1,
        SUM(CASE WHEN ${DQ_RULES_CONFIG.v03_under_15_occupation.sqlCond} THEN 1 ELSE 0 END) AS v03_under_15_occupation,
        SUM(CASE WHEN ${DQ_RULES_CONFIG.v04_under_15_kp.sqlCond} THEN 1 ELSE 0 END) AS v04_under_15_kp,
        SUM(CASE WHEN ${DQ_RULES_CONFIG.v05_under_15_marital.sqlCond} THEN 1 ELSE 0 END) AS v05_under_15_marital,
        SUM(CASE WHEN ${DQ_RULES_CONFIG.v06_under_15_education.sqlCond} THEN 1 ELSE 0 END) AS v06_under_15_education,
        SUM(CASE WHEN ${DQ_RULES_CONFIG.v07_male_housewife.sqlCond} THEN 1 ELSE 0 END) AS v07_male_housewife,
        SUM(CASE WHEN ${DQ_RULES_CONFIG.v00_reactive_unlinked.sqlCond} THEN 1 ELSE 0 END) AS v00_reactive_unlinked,
        SUM(CASE WHEN ${DQ_RULES_CONFIG.missing_uuic.sqlCond} THEN 1 ELSE 0 END) AS missing_uuic,
        SUM(CASE WHEN ${DQ_RULES_CONFIG.negative_with_referral.sqlCond} THEN 1 ELSE 0 END) AS negative_with_referral,
        SUM(CASE WHEN ${DQ_RULES_CONFIG.counseling_before_reg.sqlCond} THEN 1 ELSE 0 END) AS counseling_before_reg,
        SUM(CASE WHEN ${DQ_RULES_CONFIG.line_test_inconsistency.sqlCond} THEN 1 ELSE 0 END) AS line_test_inconsistency,
        SUM(CASE 
          WHEN NOT (v.hts_code IS NULL OR TRIM(v.hts_code) = '')
            AND (rt.result IS NULL)
            AND NOT (v.hiv_result = 3 OR v.hiv_result = 0 OR v.hiv_result IS NULL)
            AND NOT (TIMESTAMPDIFF(YEAR, v.dob, v.registration_date) < 1)
            AND NOT (TIMESTAMPDIFF(YEAR, v.dob, v.registration_date) < 15 AND v.occupation_id IS NOT NULL AND v.occupation_id NOT IN (0, 9))
            AND NOT (TIMESTAMPDIFF(YEAR, v.dob, v.registration_date) < 15 AND v.patient_type_id IN (1, 2, 3, 4, 5, 7, 8))
            AND NOT (TIMESTAMPDIFF(YEAR, v.dob, v.registration_date) < 15 AND v.marital_status_id IN (2, 3))
            AND NOT (TIMESTAMPDIFF(YEAR, v.dob, v.registration_date) < 15 AND v.education_id IN (4, 5))
            AND NOT (v.sex = 1 AND v.occupation_id = 11)
            AND NOT (v.hiv_result = 2 AND (v.refer_to_service_id != 1 OR v.refer_to_service_id IS NULL OR v.refer_to_service_id = 0))
            AND NOT (v.uuic IS NULL OR TRIM(v.uuic) = '')
          THEN 1 ELSE 0 END) AS clean_records
      FROM vccts v
      ${retestJoin}
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
        SUM(CASE WHEN ${DQ_RULES_CONFIG.hts_missing.sqlCond} THEN 1 ELSE 0 END) AS hts_missing,
        SUM(CASE WHEN ${DQ_RULES_CONFIG.v00_reactive_unlinked.sqlCond} THEN 1 ELSE 0 END) AS reactive_unlinked,
        SUM(CASE WHEN ${DQ_RULES_CONFIG.v03_under_15_occupation.sqlCond} THEN 1 ELSE 0 END) AS under_15_occupation,
        SUM(CASE WHEN ${DQ_RULES_CONFIG.v01_inconclusive_or_empty.sqlCond} THEN 1 ELSE 0 END) AS inconclusive_empty,
        SUM(CASE 
          WHEN (v.hts_code IS NULL OR TRIM(v.hts_code) = '')
            OR (rt.result IS NOT NULL)
            OR (v.hiv_result = 3 OR v.hiv_result = 0 OR v.hiv_result IS NULL)
            OR (TIMESTAMPDIFF(YEAR, v.dob, v.registration_date) < 1)
            OR (TIMESTAMPDIFF(YEAR, v.dob, v.registration_date) < 15 AND v.occupation_id IS NOT NULL AND v.occupation_id NOT IN (0, 9))
            OR (TIMESTAMPDIFF(YEAR, v.dob, v.registration_date) < 15 AND v.patient_type_id IN (1, 2, 3, 4, 5, 7, 8))
            OR (TIMESTAMPDIFF(YEAR, v.dob, v.registration_date) < 15 AND v.marital_status_id IN (2, 3))
            OR (TIMESTAMPDIFF(YEAR, v.dob, v.registration_date) < 15 AND v.education_id IN (4, 5))
            OR (v.sex = 1 AND v.occupation_id = 11)
            OR (v.hiv_result = 2 AND (v.refer_to_service_id != 1 OR v.refer_to_service_id IS NULL OR v.refer_to_service_id = 0))
          THEN 1 ELSE 0 END) AS total_issues
      FROM vccts v
      ${retestJoin}
      LEFT JOIN tblsites s ON v.site_code = s.vcct_site_code
      LEFT JOIN tblprovince p ON s.province_id = p.id
      LEFT JOIN tblods od ON s.od_code = od.od_code
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
        htsMissing: Number(f.hts_missing || 0),
        reactiveUnlinked: Number(f.reactive_unlinked || 0),
        under15Occupation: Number(f.under_15_occupation || 0),
        inconclusiveEmpty: Number(f.inconclusive_empty || 0),
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
 * GET /api/data-quality/consistency/yoy
 * Year-over-Year Consistency Metrics for VCCT Testing and Positivity:
 * 1. DQA - Consistency | VCCT # of HIV positive clients, Year over Year
 * 2. DQA - Consistency | VCCT # of clients tested for HIV, Year over Year
 */
export async function getDataQualityConsistencyYoY(req, res) {
  try {
    const pool = getDbPool();
    const { conditions, params, needsSiteJoin } = buildConditions(req.query);

    const siteJoin = needsSiteJoin ? 'LEFT JOIN tblsites s ON v.site_code = s.vcct_site_code' : '';

    const startYear = parseInt(req.query.startYear || '2020', 10);
    const endYear = parseInt(req.query.endYear || new Date().getFullYear().toString(), 10);

    const yoyConditions = [...conditions];
    yoyConditions.push('v.registration_date IS NOT NULL');
    yoyConditions.push('YEAR(v.registration_date) >= ?');
    yoyConditions.push('YEAR(v.registration_date) <= ?');

    const yoyParams = [...params, startYear, endYear];
    const whereClause = yoyConditions.join(' AND ');

    const sql = `
      SELECT
        YEAR(v.registration_date) AS year,
        COUNT(*) AS total_tested,
        SUM(CASE WHEN v.hiv_result = 2 THEN 1 ELSE 0 END) AS hiv_positive
      FROM vccts v
      ${siteJoin}
      WHERE ${whereClause}
      GROUP BY YEAR(v.registration_date)
      ORDER BY year ASC
    `;

    const [rows] = await pool.query(sql, yoyParams);

    // Compute YoY growth and consistency rates
    const trend = rows.map((r, idx) => {
      const year = Number(r.year);
      const totalTested = Number(r.total_tested || 0);
      const hivPositive = Number(r.hiv_positive || 0);
      const positivityRate = totalTested > 0 ? Number(((hivPositive / totalTested) * 100).toFixed(2)) : 0;

      let testedYoyChange = null;
      let positiveYoyChange = null;

      if (idx > 0) {
        const prev = rows[idx - 1];
        const prevTested = Number(prev.total_tested || 0);
        const prevPositive = Number(prev.hiv_positive || 0);

        if (prevTested > 0) {
          testedYoyChange = Number((((totalTested - prevTested) / prevTested) * 100).toFixed(1));
        }
        if (prevPositive > 0) {
          positiveYoyChange = Number((((hivPositive - prevPositive) / prevPositive) * 100).toFixed(1));
        }
      }

      // Consistency status flag (flag unusual shifts > 35% or < -25%)
      const testedConsistent = testedYoyChange === null || (testedYoyChange >= -25 && testedYoyChange <= 40);
      const positiveConsistent = positiveYoyChange === null || (positiveYoyChange >= -25 && positiveYoyChange <= 40);

      return {
        year,
        totalTested,
        hivPositive,
        positivityRate,
        testedYoyChange,
        positiveYoyChange,
        testedConsistent,
        positiveConsistent,
      };
    });

    return res.json({
      success: true,
      data: {
        metricTested: {
          id: 'consistency_tested_yoy',
          titleEn: 'DQA - Consistency | VCCT # of clients tested for HIV, Year over Year',
          titleKh: 'ភាពស៊ីសង្វាក់ DQA | ចំនួនអតិថិជនធ្វើតេស្ត HIV ប្រចាំឆ្នាំ (YoY)',
        },
        metricPositive: {
          id: 'consistency_positive_yoy',
          titleEn: 'DQA - Consistency | VCCT # of HIV positive clients, Year over Year',
          titleKh: 'ភាពស៊ីសង្វាក់ DQA | ចំនួនអតិថិជន HIV វិជ្ជមាន ប្រចាំឆ្នាំ (YoY)',
        },
        trend,
      },
    });
  } catch (err) {
    console.error('getDataQualityConsistencyYoY error:', err);
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

    // Fast subquery join for retest
    const retestJoin = 'LEFT JOIN (SELECT site_code, vcct_id, result FROM vcct_retests WHERE result != 2) rt ON v.site_code = rt.site_code AND v.vcct_id = rt.vcct_id';

    // Rule specific filter
    let ruleCondition = '1=1';
    if (DQ_RULES_CONFIG[rule]) {
      ruleCondition = DQ_RULES_CONFIG[rule].sqlCond;
    } else {
      // all_issues default condition
      ruleCondition = `(
        (v.hts_code IS NULL OR TRIM(v.hts_code) = '')
        OR (rt.result IS NOT NULL)
        OR (v.hiv_result = 3 OR v.hiv_result = 0 OR v.hiv_result IS NULL)
        OR (TIMESTAMPDIFF(YEAR, v.dob, v.registration_date) < 1)
        OR (TIMESTAMPDIFF(YEAR, v.dob, v.registration_date) < 15 AND v.occupation_id IS NOT NULL AND v.occupation_id NOT IN (0, 9))
        OR (TIMESTAMPDIFF(YEAR, v.dob, v.registration_date) < 15 AND v.patient_type_id IN (1, 2, 3, 4, 5, 7, 8))
        OR (TIMESTAMPDIFF(YEAR, v.dob, v.registration_date) < 15 AND v.marital_status_id IN (2, 3))
        OR (TIMESTAMPDIFF(YEAR, v.dob, v.registration_date) < 15 AND v.education_id IN (4, 5))
        OR (v.sex = 1 AND v.occupation_id = 11)
        OR (v.hiv_result = 2 AND (v.refer_to_service_id != 1 OR v.refer_to_service_id IS NULL OR v.refer_to_service_id = 0))
      )`;
    }

    conditions.push(ruleCondition);
    const whereClause = conditions.join(' AND ');

    // Count total flagged
    const countSql = `
      SELECT COUNT(*) AS total
      FROM vccts v
      ${retestJoin}
      LEFT JOIN tblsites s ON v.site_code = s.vcct_site_code
      LEFT JOIN vcct_line_test_results ltr ON v.site_code = ltr.site_code AND v.vcct_id = ltr.vcct_id
      WHERE ${whereClause}
    `;
    const [[countRes]] = await pool.query(countSql, params);
    const totalRecords = Number(countRes?.total || 0);

    // Fetch records with occupation, marital status, education, HTS code
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
        v.occupation_id,
        COALESCE(occ.occupation, 'គ្មាន/មិនស្គាល់') AS occupation_name,
        v.education_id,
        CASE 
          WHEN v.education_id = 1 THEN 'មិនចេះអក្សរ'
          WHEN v.education_id = 2 THEN 'បឋមសិក្សា'
          WHEN v.education_id = 3 THEN 'អនុវិទ្យាល័យ'
          WHEN v.education_id = 4 THEN 'វិទ្យាល័យ'
          WHEN v.education_id = 5 THEN 'ឧត្តមសិក្សា'
          ELSE 'គ្មាន'
        END AS education_name,
        v.marital_status_id,
        CASE
          WHEN v.marital_status_id = 1 THEN 'នៅលីវ'
          WHEN v.marital_status_id = 2 THEN 'រៀបការ'
          WHEN v.marital_status_id = 3 THEN 'ពោះម៉ាយ/មេម៉ាយ/លែងលះ'
          ELSE 'មិនស្គាល់'
        END AS marital_status_name,
        v.history_of_test_result,
        v.hiv_result,
        v.rtri_result_id,
        v.refer_to_service_id,
        v.post_counseling_date,
        v.phone_number,
        rt.result AS retest_result,
        ltr.line_control,
        ltr.line_positive,
        ltr.line_longterm,
        COALESCE(s.site_name, v.site_code) AS site_name,
        COALESCE(NULLIF(p.province_kh, ''), p.province_en) AS province_name,
        COALESCE(NULLIF(od.name_kh, ''), od.name_en) AS od_name
      FROM vccts v
      ${retestJoin}
      LEFT JOIN tblsites s ON v.site_code = s.vcct_site_code
      LEFT JOIN tbltargroup tg ON v.patient_type_id = tg.Tid
      LEFT JOIN occupations occ ON v.occupation_id = occ.id
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
      const ageNum = r.age !== null && r.age !== undefined ? Number(r.age) : null;

      // HTS Code checks
      if (!r.hts_code || !r.hts_code.trim()) {
        flags.push('ខ្វះ HTS Code');
      } else {
        flags.push('មាន HTS Code (CMA)');
      }

      // V10. Retest Result != 2
      if (r.retest_result !== null && r.retest_result !== undefined) {
        flags.push(`V10: Retest ≠ 2 (${r.retest_result})`);
      }

      // V0.1 HIV Result Inconclusive or empty
      if (Number(r.hiv_result) === 3) {
        flags.push('V0.1: HIV មិនច្បាស់លាស់ (3)');
      } else if (Number(r.hiv_result) === 0 || r.hiv_result === null) {
        flags.push('V0.1: HIV មិនបានជ្រើសរើស (0)');
      }

      // V0.2 Age < 1
      if (ageNum !== null && ageNum < 1) {
        flags.push('V0.2: អាយុ < 1 ឆ្នាំ ធ្វើតេស្ត HIV');
      }

      // V0.3 Age < 15 but Occupation
      if (ageNum !== null && ageNum < 15 && r.occupation_id && ![0, 9].includes(Number(r.occupation_id))) {
        flags.push(`V0.3: អាយុ < 15 មុខរបរ៖ ${r.occupation_name}`);
      }

      // V0.4 Age < 15 but KP Client Type
      if (ageNum !== null && ageNum < 15 && [1, 2, 3, 4, 5, 7, 8].includes(Number(r.patient_type_id))) {
        flags.push(`V0.4: អាយុ < 15 ក្រុមគន្លឹះ៖ ${r.target_group_name}`);
      }

      // V0.5 Age < 15 but Marital Status
      if (ageNum !== null && ageNum < 15 && [2, 3].includes(Number(r.marital_status_id))) {
        flags.push(`V0.5: អាយុ < 15 ស្ថានភាព៖ ${r.marital_status_name}`);
      }

      // V0.6 Age < 15 but High School+
      if (ageNum !== null && ageNum < 15 && [4, 5].includes(Number(r.education_id))) {
        flags.push(`V0.6: អាយុ < 15 រៀនចប់៖ ${r.education_name}`);
      }

      // V0.7 Male Housewife
      if (Number(r.sex) === 1 && Number(r.occupation_id) === 11) {
        flags.push('V0.7: ប្រុស ចុះជាស្រ្តីមេផ្ទះ');
      }

      // V0. HIV Pos but not linked to ART
      if (Number(r.hiv_result) === 2 && (!r.refer_to_service_id || Number(r.refer_to_service_id) !== 1)) {
        flags.push('V0: HIV វិជ្ជមាន មិនទាន់ភ្ជាប់ទៅ ART');
      }

      // Missing UUIC
      if (!r.uuic || !r.uuic.trim()) {
        flags.push('ខ្វះ UUIC');
      }

      // Negative with ART
      if (Number(r.hiv_result) === 1 && Number(r.refer_to_service_id) === 1) {
        flags.push('HIV អវិជ្ជមានតែបញ្ជូនទៅ ART');
      }

      // Counseling before registration
      if (r.post_counseling_date && r.post_counseling_date < r.registration_date) {
        flags.push('ប្រឹក្សាមុនថ្ងៃចុះឈ្មោះ');
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

    const retestJoin = 'LEFT JOIN (SELECT site_code, vcct_id, result FROM vcct_retests WHERE result != 2) rt ON v.site_code = rt.site_code AND v.vcct_id = rt.vcct_id';

    let ruleCondition = '1=1';
    if (DQ_RULES_CONFIG[rule]) {
      ruleCondition = DQ_RULES_CONFIG[rule].sqlCond;
    } else {
      ruleCondition = `(
        (v.hts_code IS NULL OR TRIM(v.hts_code) = '')
        OR (rt.result IS NOT NULL)
        OR (v.hiv_result = 3 OR v.hiv_result = 0 OR v.hiv_result IS NULL)
        OR (TIMESTAMPDIFF(YEAR, v.dob, v.registration_date) < 1)
        OR (TIMESTAMPDIFF(YEAR, v.dob, v.registration_date) < 15 AND v.occupation_id IS NOT NULL AND v.occupation_id NOT IN (0, 9))
        OR (TIMESTAMPDIFF(YEAR, v.dob, v.registration_date) < 15 AND v.patient_type_id IN (1, 2, 3, 4, 5, 7, 8))
        OR (TIMESTAMPDIFF(YEAR, v.dob, v.registration_date) < 15 AND v.marital_status_id IN (2, 3))
        OR (TIMESTAMPDIFF(YEAR, v.dob, v.registration_date) < 15 AND v.education_id IN (4, 5))
        OR (v.sex = 1 AND v.occupation_id = 11)
        OR (v.hiv_result = 2 AND (v.refer_to_service_id != 1 OR v.refer_to_service_id IS NULL OR v.refer_to_service_id = 0))
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
        v.occupation_id,
        COALESCE(occ.occupation, 'គ្មាន/មិនស្គាល់') AS occupation_name,
        v.education_id,
        CASE 
          WHEN v.education_id = 1 THEN 'មិនចេះអក្សរ'
          WHEN v.education_id = 2 THEN 'បឋមសិក្សា'
          WHEN v.education_id = 3 THEN 'អនុវិទ្យាល័យ'
          WHEN v.education_id = 4 THEN 'វិទ្យាល័យ'
          WHEN v.education_id = 5 THEN 'ឧត្តមសិក្សា'
          ELSE 'គ្មាន'
        END AS education_name,
        v.marital_status_id,
        CASE
          WHEN v.marital_status_id = 1 THEN 'នៅលីវ'
          WHEN v.marital_status_id = 2 THEN 'រៀបការ'
          WHEN v.marital_status_id = 3 THEN 'ពោះម៉ាយ/មេម៉ាយ/លែងលះ'
          ELSE 'មិនស្គាល់'
        END AS marital_status_name,
        v.history_of_test_result,
        v.hiv_result,
        v.rtri_result_id,
        v.refer_to_service_id,
        v.post_counseling_date,
        v.phone_number,
        rt.result AS retest_result,
        ltr.line_control,
        ltr.line_positive,
        ltr.line_longterm,
        COALESCE(s.site_name, v.site_code) AS site_name,
        COALESCE(NULLIF(p.province_kh, ''), p.province_en) AS province_name,
        COALESCE(NULLIF(od.name_kh, ''), od.name_en) AS od_name
      FROM vccts v
      ${retestJoin}
      LEFT JOIN tblsites s ON v.site_code = s.vcct_site_code
      LEFT JOIN tbltargroup tg ON v.patient_type_id = tg.Tid
      LEFT JOIN occupations occ ON v.occupation_id = occ.id
      LEFT JOIN tblprovince p ON s.province_id = p.id
      LEFT JOIN tblods od ON s.od_code = od.od_code
      LEFT JOIN vcct_line_test_results ltr ON v.site_code = ltr.site_code AND v.vcct_id = ltr.vcct_id
      WHERE ${whereClause}
      ORDER BY v.registration_date DESC, v.vcct_id DESC
      LIMIT 20000
    `;

    const [rows] = await pool.query(recordsSql, params);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('DQA Audit List');

    worksheet.mergeCells('A1:O1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'VCCT DATA QUALITY ASSESSMENT (DQA) AUDIT REPORT';
    titleCell.font = { name: 'Segoe UI', size: 13, bold: true, color: { argb: 'FFFFFFFF' } };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF991B1B' } };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getRow(1).height = 30;

    const ruleLabel = DQ_RULES_CONFIG[rule]?.labelKh ? `${DQ_RULES_CONFIG[rule].labelKh} (${DQ_RULES_CONFIG[rule].labelEn})` : 'បញ្ជីកំហុសទាំងអស់ (All Quality Issues)';
    worksheet.mergeCells('A2:O2');
    const subCell = worksheet.getCell('A2');
    subCell.value = `Rule: ${ruleLabel} | Flagged Records: ${rows.length} | Export Date: ${new Date().toLocaleDateString()}`;
    subCell.font = { name: 'Segoe UI', size: 9.5, italic: true, color: { argb: 'FF475569' } };
    subCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
    worksheet.getRow(2).height = 20;

    const columns = [
      { header: '#', width: 6 },
      { header: 'កាលបរិច្ឆេទ (Date)', width: 15 },
      { header: 'VCCT ID', width: 12 },
      { header: 'លេខកូដ HTS (HTS Code)', width: 18 },
      { header: 'លេខសម្គាល់ (UUIC)', width: 18 },
      { header: 'មណ្ឌលផ្តល់សេវា (Site)', width: 24 },
      { header: 'ខេត្ត (Province)', width: 16 },
      { header: 'ភេទ / អាយុ (Sex/Age)', width: 15 },
      { header: 'មុខរបរ (Occupation)', width: 18 },
      { header: 'ស្ថានភាព (Marital)', width: 16 },
      { header: 'កម្រិតវប្បធម៌ (Education)', width: 16 },
      { header: 'ប្រភេទអតិថិជន (Client Type)', width: 22 },
      { header: 'លទ្ធផល HIV (HIV Result)', width: 16 },
      { header: 'ការបញ្ជូន (Referral)', width: 18 },
      { header: 'កំហុសដែលរកឃើញ (Issues Detected)', width: 38 },
    ];

    worksheet.getRow(4).values = columns.map(c => c.header);
    worksheet.getRow(4).height = 24;
    worksheet.getRow(4).eachCell((cell) => {
      cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { 
        type: 'pattern', 
        pattern: 'solid', 
        fgColor: { argb: 'FFBE123C' } 
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    columns.forEach((col, idx) => {
      worksheet.getColumn(idx + 1).width = col.width;
    });

    rows.forEach((r, idx) => {
      const flags = [];
      const ageNum = r.age !== null && r.age !== undefined ? Number(r.age) : null;

      if (!r.hts_code || !r.hts_code.trim()) flags.push('ខ្វះ HTS Code');
      if (r.retest_result !== null && r.retest_result !== undefined) flags.push(`Retest ≠ 2 (${r.retest_result})`);
      if (Number(r.hiv_result) === 3 || Number(r.hiv_result) === 0 || r.hiv_result === null) flags.push('HIV Result មិនច្បាស់/ទទេ');
      if (ageNum !== null && ageNum < 1) flags.push('អាយុ < 1 ឆ្នាំ');
      if (ageNum !== null && ageNum < 15 && r.occupation_id && ![0, 9].includes(Number(r.occupation_id))) flags.push(`អាយុ < 15 មុខរបរ៖ ${r.occupation_name}`);
      if (ageNum !== null && ageNum < 15 && [1, 2, 3, 4, 5, 7, 8].includes(Number(r.patient_type_id))) flags.push(`អាយុ < 15 ក្រុមគន្លឹះ៖ ${r.target_group_name}`);
      if (ageNum !== null && ageNum < 15 && [2, 3].includes(Number(r.marital_status_id))) flags.push(`អាយុ < 15 ស្ថានភាព៖ ${r.marital_status_name}`);
      if (ageNum !== null && ageNum < 15 && [4, 5].includes(Number(r.education_id))) flags.push(`អាយុ < 15 រៀនចប់៖ ${r.education_name}`);
      if (Number(r.sex) === 1 && Number(r.occupation_id) === 11) flags.push('ប្រុស ចុះជាស្រ្តីមេផ្ទះ');
      if (Number(r.hiv_result) === 2 && (!r.refer_to_service_id || Number(r.refer_to_service_id) !== 1)) flags.push('HIV វិជ្ជមាន មិនទាន់ភ្ជាប់ទៅ ART');

      const sexLabel = Number(r.sex) === 1 ? 'ប្រុស' : Number(r.sex) === 0 ? 'ស្រី' : 'TG';
      const hivLabel = Number(r.hiv_result) === 2 ? 'វិជ្ជមាន (2)' : Number(r.hiv_result) === 1 ? 'អវិជ្ជមាន (1)' : 'មិនច្បាស់ (3)';
      const referralLabel = Number(r.refer_to_service_id) === 1 ? 'ART' : Number(r.refer_to_service_id) > 1 ? 'សេវាផ្សេង' : 'មិនទាន់បញ្ជូន';

      const row = worksheet.addRow([
        idx + 1,
        r.registration_date,
        r.vcct_id || '-',
        r.hts_code || 'គ្មាន (Missing)',
        r.uuic || 'គ្មាន (Missing)',
        r.site_name,
        r.province_name,
        `${sexLabel} / ${r.age || '-'} ឆ្នាំ`,
        r.occupation_name,
        r.marital_status_name,
        r.education_name,
        r.target_group_name,
        hivLabel,
        referralLabel,
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

        if ([1, 2, 3, 4, 5, 8, 13, 14].includes(colNumber)) {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        } else {
          cell.alignment = { vertical: 'middle', horizontal: 'left', indent: 0.5 };
        }

        // Highlight HTS Missing in red
        if (colNumber === 4 && (!r.hts_code || !r.hts_code.trim())) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };
          cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF991B1B' } };
        }

        // Highlight HIV Reactive in red
        if (colNumber === 13 && Number(r.hiv_result) === 2) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };
          cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF991B1B' } };
        }

        // Highlight Detected Issues
        if (colNumber === 15) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF1F2' } };
          cell.font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: 'FFE11D48' } };
        }
      });
    });

    const filename = `VCCT_DQA_Audit_${new Date().toISOString().slice(0, 10)}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('exportDataQualityExcel error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
