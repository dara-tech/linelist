import { getDbPool } from '../src/config/db.js';

async function auditDatabase() {
  const pool = getDbPool();

  console.log('--- AUDITING VCCT DATABASE FOR POTENTIAL QUALITY ISSUES ---');

  const checks = [
    {
      name: 'Future Registration Date (កាលបរិច្ឆេទធ្វើតេស្តលើសពីថ្ងៃបច្ចុប្បន្ន)',
      sql: `SELECT COUNT(*) AS cnt FROM vccts WHERE registration_date > CURRENT_DATE()`
    },
    {
      name: 'Post-counseling Date Before Registration Date (កាលបរិច្ឆេទប្រឹក្សាក្រោយតេស្ត មុនថ្ងៃចុះឈ្មោះ)',
      sql: `SELECT COUNT(*) AS cnt FROM vccts WHERE post_counseling_date IS NOT NULL AND post_counseling_date < registration_date`
    },
    {
      name: 'Same Day Duplicate Test (UUIC ដដែល ធ្វើតេស្តលើសពីម្តង ក្នុងថ្ងៃតែមួយ)',
      sql: `
        SELECT COUNT(*) AS cnt FROM (
          SELECT uuic, registration_date, COUNT(*) as c
          FROM vccts
          WHERE uuic IS NOT NULL AND TRIM(uuic) != ''
          GROUP BY uuic, registration_date
          HAVING c > 1
        ) t
      `
    },
    {
      name: 'Duplicate HTS/PMRS Code in Site (លេខកូដ HTS/PMRS ជាន់គ្នា)',
      sql: `
        SELECT COUNT(*) AS cnt FROM (
          SELECT site_code, hts_code, COUNT(*) as c
          FROM vccts
          WHERE hts_code IS NOT NULL AND TRIM(hts_code) != ''
          GROUP BY site_code, hts_code
          HAVING c > 1
        ) t
      `
    },
    {
      name: 'Client Disagreed to HIV Test But Has Test Results (មិនយល់ព្រមធ្វើតេស្ត តែមានលទ្ធផលតេស្ត)',
      sql: `SELECT COUNT(*) AS cnt FROM vccts WHERE is_agree_test_hiv = 0 AND hiv_result > 0`
    },
    {
      name: 'Missing Recency (RTRI) on HIV Reactive Cases (HIV វិជ្ជមាន តែខ្វះការធ្វើតេស្តឆ្លងថ្មី RTRI)',
      sql: `SELECT COUNT(*) AS cnt FROM vccts WHERE hiv_result = 2 AND (rtri_result_id IS NULL OR rtri_result_id = 0)`
    },
    {
      name: '3-Test Algorithm Inconsistency (លទ្ធផលតេស្ត ៣ បន្ទាត់ មិនស៊ីសង្វាក់នឹងលទ្ធផលចុងក្រោយ)',
      sql: `
        SELECT COUNT(*) AS cnt 
        FROM vccts v
        JOIN vcct_line_test_results ltr ON v.site_code = ltr.site_code AND v.vcct_id = ltr.vcct_id
        WHERE (ltr.line_control = 0 AND v.hiv_result = 2)
           OR (ltr.line_control = 1 AND ltr.line_positive = 1 AND ltr.line_longterm = 1 AND v.hiv_result != 2)
           OR (ltr.line_control = 0 AND (ltr.line_positive = 1 OR ltr.line_longterm = 1))
      `
    },
    {
      name: 'Never Tested Before But Has Prior Result (ប្រាប់ថាមិនធ្លាប់ធ្វើតេស្ត តែមានកត់ត្រាលទ្ធផលពីមុន)',
      sql: `SELECT COUNT(*) AS cnt FROM vccts WHERE history_of_test = 0 AND history_of_test_result > 0`
    },
    {
      name: 'Previously Tested But Missing Prior Result (ប្រាប់ថាធ្លាប់ធ្វើតេស្ត តែមិនបានកត់ត្រាលទ្ធផល)',
      sql: `SELECT COUNT(*) AS cnt FROM vccts WHERE history_of_test = 1 AND (history_of_test_result IS NULL OR history_of_test_result = 0)`
    },
    {
      name: 'Known Positive Re-testing at VCCT (ករណីធ្លាប់ដឹងថាវិជ្ជមានពីមុន មកធ្វើតេស្តឡើងវិញនៅ VCCT)',
      sql: `SELECT COUNT(*) AS cnt FROM vccts WHERE history_of_test_result = 2`
    },
    {
      name: 'Missing Occupation (មិនបានបំពេញមុខរបរ)',
      sql: `SELECT COUNT(*) AS cnt FROM vccts WHERE occupation_id IS NULL OR occupation_id = 0`
    },
    {
      name: 'Missing Marital Status (មិនបានបំពេញស្ថានភាពអាពាហ៍ពិពាហ៍)',
      sql: `SELECT COUNT(*) AS cnt FROM vccts WHERE marital_status_id IS NULL OR marital_status_id = 0`
    },
    {
      name: 'Missing Education (មិនបានបំពេញកម្រិតវប្បធម៌/ការអប់រំ)',
      sql: `SELECT COUNT(*) AS cnt FROM vccts WHERE education_id IS NULL OR education_id = 0`
    },
    {
      name: 'Invalid Phone Number (លេខទូរស័ព្ទមិនត្រឹមត្រូវ)',
      sql: `
        SELECT COUNT(*) AS cnt 
        FROM vccts 
        WHERE phone_number IS NOT NULL 
          AND TRIM(phone_number) != '' 
          AND (LENGTH(REGEXP_REPLACE(phone_number, '[^0-9]', '')) < 8 OR LENGTH(REGEXP_REPLACE(phone_number, '[^0-9]', '')) > 12)
      `
    },
    {
      name: 'Viral Load Recorded on HIV Negative Client (លទ្ធផលបន្ទុកមេរោគ VL លើអ្នកអវិជ្ជមាន)',
      sql: `SELECT COUNT(*) AS cnt FROM vccts WHERE (hiv_result = 1 OR hiv_result = 0) AND vl_result > 0`
    },
    {
      name: 'Inconclusive Result Without Follow-up/Remark (លទ្ធផលមិនច្បាស់លាស់ ៣ បន្ទាត់មិនដាច់ស្រេច)',
      sql: `SELECT COUNT(*) AS cnt FROM vccts WHERE hiv_result = 3`
    }
  ];

  for (const c of checks) {
    try {
      const [[res]] = await pool.query(c.sql);
      console.log(`- [${res.cnt} ករណី] ${c.name}`);
    } catch (e) {
      console.log(`- [ERROR: ${e.message}] ${c.name}`);
    }
  }

  process.exit(0);
}

auditDatabase();
