import { getDbPool } from '../src/config/db.js';

async function testDateRange() {
  const pool = getDbPool();
  const dateFrom = '2026-07-01';
  const dateTo = '2026-09-25';

  console.log(`\n======================================================`);
  console.log(`TESTING VCCT DATA FOR: ${dateFrom} to ${dateTo} (01/07/2026 - 25/09/2026)`);
  console.log(`======================================================\n`);

  // 1. Overall counts
  const [[summary]] = await pool.query(`
    SELECT 
      COUNT(*) AS total_records,
      SUM(CASE WHEN hiv_result = 2 THEN 1 ELSE 0 END) AS reactive_total,
      SUM(CASE WHEN hiv_result = 2 AND (sex = 0 OR sex = 2) THEN 1 ELSE 0 END) AS reactive_female,
      SUM(CASE WHEN hiv_result = 1 THEN 1 ELSE 0 END) AS negative_total,
      SUM(CASE WHEN hiv_result = 3 THEN 1 ELSE 0 END) AS inconclusive_total,
      SUM(CASE WHEN hiv_result = 2 AND refer_to_service_id = 1 THEN 1 ELSE 0 END) AS linked_to_art
    FROM vccts
    WHERE registration_date BETWEEN ? AND ?
  `, [dateFrom, dateTo]);

  console.log('--- 1. OVERALL SUMMARY ---');
  console.table([summary]);

  // 2. Data Quality / Audit for this range
  console.log('\n--- 2. DATA QUALITY AUDIT (2026-07-01 to 2026-09-25) ---');
  const checks = [
    { name: 'ខ្វះលេខសម្គាល់បុគ្គល (Missing UUIC)', sql: `SELECT COUNT(*) as c FROM vccts WHERE registration_date BETWEEN ? AND ? AND (uuic IS NULL OR TRIM(uuic) = '')` },
    { name: 'ខ្វះការកំណត់ប្រភេទអតិថិជន (Missing Client Type)', sql: `SELECT COUNT(*) as c FROM vccts WHERE registration_date BETWEEN ? AND ? AND (patient_type_id IS NULL OR patient_type_id = 0)` },
    { name: 'HIV អវិជ្ជមានតែបញ្ជូនទៅ ART (Negative with ART Referral)', sql: `SELECT COUNT(*) as c FROM vccts WHERE registration_date BETWEEN ? AND ? AND hiv_result = 1 AND refer_to_service_id = 1` },
    { name: 'HIV វិជ្ជមានមិនទាន់បញ្ជូនទៅ ART (Reactive Unlinked)', sql: `SELECT COUNT(*) as c FROM vccts WHERE registration_date BETWEEN ? AND ? AND hiv_result = 2 AND (refer_to_service_id != 1 OR refer_to_service_id IS NULL)` },
    { name: 'HIV វិជ្ជមានខ្វះតេស្តឆ្លងថ្មី RTRI (Reactive Missing RTRI)', sql: `SELECT COUNT(*) as c FROM vccts WHERE registration_date BETWEEN ? AND ? AND hiv_result = 2 AND (rtri_result_id IS NULL OR rtri_result_id = 0)` },
    { name: 'តេស្ត RTRI លើករណីអវិជ្ជមាន (RTRI on Negative)', sql: `SELECT COUNT(*) as c FROM vccts WHERE registration_date BETWEEN ? AND ? AND (hiv_result = 1 OR hiv_result = 0) AND (rtri_result_id = 1 OR rtri_result_id = 2)` },
    { name: 'ភេទមិនត្រូវនឹងប្រភេទអតិថិជន (Gender & Client Type Conflict)', sql: `SELECT COUNT(*) as c FROM vccts WHERE registration_date BETWEEN ? AND ? AND ((sex = 1 AND patient_type_id IN (1, 8)) OR (sex = 0 AND patient_type_id IN (2, 7)))` },
    { name: 'កាលបរិច្ឆេទប្រឹក្សា មុនថ្ងៃចុះឈ្មោះ (Counseling Before Reg Date)', sql: `SELECT COUNT(*) as c FROM vccts WHERE registration_date BETWEEN ? AND ? AND post_counseling_date IS NOT NULL AND post_counseling_date < registration_date` },
    { name: 'UUIC ធ្វើតេស្តស្ទួនក្នុងថ្ងៃតែមួយ (Same-Day Duplicate Test)', sql: `SELECT COUNT(*) as c FROM (SELECT uuic, registration_date, COUNT(*) as cnt FROM vccts WHERE registration_date BETWEEN ? AND ? AND uuic IS NOT NULL AND TRIM(uuic) != '' GROUP BY uuic, registration_date HAVING cnt > 1) t` },
    { name: 'ករណីធ្លាប់ដឹងថាវិជ្ជមាន មកធ្វើតេស្តឡើងវិញ (Known Positive Re-testing)', sql: `SELECT COUNT(*) as c FROM vccts WHERE registration_date BETWEEN ? AND ? AND history_of_test_result = 2` },
    { name: 'លទ្ធផលមិនច្បាស់លាស់ ត្រូវតាមដានបន្ត (Inconclusive Results)', sql: `SELECT COUNT(*) as c FROM vccts WHERE registration_date BETWEEN ? AND ? AND hiv_result = 3` },
  ];

  for (const chk of checks) {
    try {
      const [[res]] = await pool.query(chk.sql, [dateFrom, dateTo]);
      console.log(`  - [${res.c} ករណី] ${chk.name}`);
    } catch (e) {
      console.log(`  - [ERR: ${e.message}] ${chk.name}`);
    }
  }

  // 3. By Province Summary
  console.log('\n--- 3. PROVINCIAL BREAKDOWN (2026-07-01 to 2026-09-25) ---');
  const [provRows] = await pool.query(`
    SELECT 
      p.id AS province_id,
      p.province_kh,
      COUNT(DISTINCT v.site_code) AS active_sites,
      COUNT(v.vcct_id) AS total_tested,
      SUM(CASE WHEN v.hiv_result = 2 THEN 1 ELSE 0 END) AS reactive_total,
      SUM(CASE WHEN v.hiv_result = 2 AND (v.sex = 0 OR v.sex = 2) THEN 1 ELSE 0 END) AS reactive_female
    FROM tblprovince p
    LEFT JOIN tblsites s ON s.province_id = p.id AND s.status_id = 1
    LEFT JOIN vccts v ON (v.site_code = s.vcct_site_code OR v.site_code = s.art_site_code) 
                     AND v.registration_date BETWEEN ? AND ?
    GROUP BY p.id, p.province_kh
    HAVING total_tested > 0
    ORDER BY total_tested DESC
  `, [dateFrom, dateTo]);
  console.table(provRows);

  process.exit(0);
}

testDateRange().catch(err => {
  console.error(err);
  process.exit(1);
});
