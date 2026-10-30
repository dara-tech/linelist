import ExcelJS from 'exceljs';
import { GENDER_MAP, HIV_RESULT_MAP, RTRI_RESULT_MAP } from '../config/constants.js';

export async function generateVCCTExcelWorkbook(records, filterMeta = {}) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'DHIS2 VCCT Line List Bridge';
  workbook.lastModifiedBy = 'DHIS2 User';
  workbook.created = new Date();

  // 1. Line List Sheet
  const worksheet = workbook.addWorksheet('VCCT Line List', {
    views: [{ state: 'frozen', ySplit: 5, xSplit: 2 }],
    properties: { defaultRowHeight: 20 },
  });

  // Title Banner
  worksheet.mergeCells('A1:Q1');
  const titleCell = worksheet.getCell('A1');
  titleCell.value = 'NATIONAL VCCT CLIENT LINE LIST REPORT';
  titleCell.font = { name: 'Segoe UI', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getRow(1).height = 32;

  // Metadata Subtitle
  worksheet.mergeCells('A2:Q2');
  const subCell = worksheet.getCell('A2');
  const filterDesc = [
    filterMeta.provinceName ? `Province: ${filterMeta.provinceName}` : 'All Provinces',
    filterMeta.odName ? `OD: ${filterMeta.odName}` : 'All ODs',
    filterMeta.siteName ? `Site: ${filterMeta.siteName}` : 'All Sites',
    filterMeta.dateFrom ? `From: ${filterMeta.dateFrom}` : '',
    filterMeta.dateTo ? `To: ${filterMeta.dateTo}` : '',
    `Exported: ${new Date().toLocaleString()}`,
  ].filter(Boolean).join('  |  ');
  subCell.value = filterDesc;
  subCell.font = { name: 'Segoe UI', size: 10, italic: true, color: { argb: 'FF475569' } };
  subCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
  subCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  worksheet.getRow(2).height = 22;

  // Blank row
  worksheet.getRow(3).height = 8;

  // Summary Metrics Row
  worksheet.mergeCells('A4:Q4');
  const totalCount = records.length;
  const reactiveCount = records.filter(r => Number(r.hiv_result) === 2).length;
  const recentCount = records.filter(r => Number(r.rtri_result_id) === 1).length;
  const reactiveRate = totalCount > 0 ? ((reactiveCount / totalCount) * 100).toFixed(1) : 0;
  
  const metricCell = worksheet.getCell('A4');
  metricCell.value = `Summary Metrics: Total Tested = ${totalCount}  |  Reactive = ${reactiveCount} (${reactiveRate}%)  |  RTRI Recent = ${recentCount}`;
  metricCell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF0F172A' } };
  metricCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } };
  metricCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  worksheet.getRow(4).height = 24;

  // Table Column Headers (Row 5)
  const columns = [
    { header: '#', key: 'row_num', width: 6 },
    { header: 'កាលបរិច្ឆេទ (Date)', key: 'registration_date', width: 16 },
    { header: 'VCCT ID', key: 'vcct_id', width: 14 },
    { header: 'លេខសម្គាល់ (UUIC)', key: 'uuic', width: 18 },
    { header: 'ខេត្ត / រាជធានី (Province)', key: 'province_name', width: 18 },
    { header: 'ស្រុកប្រតិបត្តិ (OD Name)', key: 'od_name', width: 22 },
    { header: 'មណ្ឌលផ្តល់សេវា (Facility / Site)', key: 'site_name', width: 28 },
    { header: 'ភេទ (Sex)', key: 'sex_label', width: 12 },
    { header: 'អាយុ (Age)', key: 'age', width: 8 },
    { header: 'ប្រភេទអតិថិជន (Client Type)', key: 'target_group_name', width: 22 },
    { header: 'មុខរបរ (Occupation)', key: 'occupation_name', width: 18 },
    { header: 'ប្រវត្តិធ្វើតេស្ត (Test History)', key: 'history_of_test', width: 16 },
    { header: 'លទ្ធផល HIV (HIV Result)', key: 'hiv_result_label', width: 18 },
    { header: 'តេស្តឆ្លងថ្មី (RTRI)', key: 'rtri_result_label', width: 18 },
    { header: 'ការបញ្ជូន (Referral)', key: 'refer_service_name', width: 20 },
    { header: 'ប្រឹក្សាក្រោយតេស្ត (Post-Counseling)', key: 'post_counseling_date', width: 22 },
    { header: 'បន្ទុកមេរោគ (Viral Load)', key: 'vl_result', width: 14 },
    { header: 'Line 1 (Determine)', key: 'line_control', width: 16 },
    { header: 'Line 2 (Stat-Pak)', key: 'line_positive', width: 16 },
    { header: 'Line 3 (SD Bioline)', key: 'line_longterm', width: 16 },
    { header: 'បញ្ហាគុណភាពទិន្នន័យ (Data Quality Flags)', key: 'dq_flags', width: 36 },
  ];

  worksheet.getRow(5).values = columns.map(c => c.header);
  worksheet.getRow(5).height = 26;
  worksheet.getRow(5).eachCell((cell, colNumber) => {
    cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { 
      type: 'pattern', 
      pattern: 'solid', 
      fgColor: { argb: colNumber === 21 ? 'FFB91C1C' : 'FF0284C7' } 
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      bottom: { style: 'medium', color: { argb: colNumber === 21 ? 'FF991B1B' : 'FF0369A1' } },
      left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      right: { style: 'thin', color: { argb: 'FFCBD5E1' } },
    };
  });

  columns.forEach((col, idx) => {
    worksheet.getColumn(idx + 1).width = col.width;
  });

  // Populate Rows with attribute-level validation & error highlighting
  records.forEach((rec, idx) => {
    const sexInfo = GENDER_MAP[rec.sex] || { en: 'Unknown', kh: 'មិនស្គាល់' };
    const hivInfo = HIV_RESULT_MAP[rec.hiv_result] || { en: 'N/A', kh: 'N/A' };
    const rtriInfo = RTRI_RESULT_MAP[rec.rtri_result_id] || { en: '-', kh: '-' };
    const vcctId = rec.vcct_id !== null && rec.vcct_id !== undefined ? rec.vcct_id : '-';
    const referralText = rec.refer_service_name || (rec.refer_to_service_id === 1 ? 'ART' : rec.refer_to_service_id === 2 ? 'STD' : rec.refer_to_service_id === 3 ? 'TB' : rec.refer_to_service_id === 4 ? 'ANC' : 'គ្មាន');
    const postCounselingText = rec.post_counseling_date || (rec.post_counseling_id === 1 ? 'បានប្រឹក្សា' : '-');
    const testHistoryText = rec.history_of_test === 1 ? 'ធ្លាប់ធ្វើ' : rec.history_of_test === 0 ? 'មិនធ្លាប់' : '-';

    // Attribute Validation Flags
    const dqFlags = [];
    const isMissingUuic = !rec.uuic || !rec.uuic.trim();
    if (isMissingUuic) dqFlags.push('ខ្វះ UUIC');

    const isInvalidAge = !rec.dob || rec.age === null || rec.age === undefined || Number(rec.age) < 0 || Number(rec.age) > 105 || (rec.dob && rec.registration_date && rec.dob > rec.registration_date);
    if (isInvalidAge) dqFlags.push('អាយុ/ថ្ងៃកំណើតមិនត្រឹមត្រូវ');

    const isMissingTarget = !rec.patient_type_id || rec.patient_type_id === 0;
    if (isMissingTarget) dqFlags.push('ខ្វះប្រភេទអតិថិជន');

    const isCounselingBeforeReg = rec.post_counseling_date && rec.post_counseling_date < rec.registration_date;
    if (isCounselingBeforeReg) dqFlags.push('ប្រឹក្សាមុនថ្ងៃចុះឈ្មោះ');

    const isReactiveUnlinked = Number(rec.hiv_result) === 2 && (!rec.refer_to_service_id || Number(rec.refer_to_service_id) !== 1);
    if (isReactiveUnlinked) dqFlags.push('HIV វិជ្ជមានមិនទាន់បញ្ជូន ART');

    const isNegativeWithArt = Number(rec.hiv_result) === 1 && Number(rec.refer_to_service_id) === 1;
    if (isNegativeWithArt) dqFlags.push('HIV អវិជ្ជមានតែបញ្ជូន ART');

    const isReactiveMissingRtri = Number(rec.hiv_result) === 2 && (!rec.rtri_result_id || Number(rec.rtri_result_id) === 0);
    if (isReactiveMissingRtri) dqFlags.push('HIV វិជ្ជមានខ្វះតេស្ត RTRI');

    const isRtriOnNegative = Number(rec.hiv_result) !== 2 && (rec.rtri_result_id === 1 || rec.rtri_result_id === 2);
    if (isRtriOnNegative) dqFlags.push('RTRI លើករណីអវិជ្ជមាន');

    const isGenderConflict = (Number(rec.sex) === 1 && [1, 8].includes(Number(rec.patient_type_id))) ||
                             (Number(rec.sex) === 0 && [2, 7].includes(Number(rec.patient_type_id)));
    if (isGenderConflict) dqFlags.push('ភេទមិនត្រូវនឹងប្រភេទអតិថិជន');

    const isLineConflict = (rec.line_control === 0 && Number(rec.hiv_result) === 2) ||
                           (rec.line_control === 1 && rec.line_positive === 1 && rec.line_longterm === 1 && Number(rec.hiv_result) !== 2) ||
                           (rec.line_control === 0 && (rec.line_positive === 1 || rec.line_longterm === 1));
    if (isLineConflict) dqFlags.push('លទ្ធផល ៣ បន្ទាត់មិនស៊ីសង្វាក់');

    const rowData = [
      idx + 1,
      rec.registration_date,
      vcctId,
      isMissingUuic ? 'គ្មាន UUIC (Missing UUIC)' : rec.uuic,
      rec.province_name || rec.province_en || `Province ${rec.province_id}`,
      rec.od_name || rec.name_en || rec.od_code,
      rec.site_name || rec.site_code,
      sexInfo.kh || sexInfo.en,
      rec.age !== null && rec.age !== undefined ? rec.age : '-',
      rec.target_group_name || rec.Targroup || 'ប្រជាជនទូទៅ',
      rec.occupation_name || '-',
      testHistoryText,
      `${hivInfo.kh} (${hivInfo.en})`,
      isReactiveMissingRtri ? 'ខ្វះតេស្ត RTRI' : rtriInfo.en !== '-' ? `${rtriInfo.kh} (${rtriInfo.en})` : '-',
      isNegativeWithArt ? 'កំហុស៖ អវិជ្ជមានតែបញ្ជូន ART' : isReactiveUnlinked ? 'មិនទាន់បញ្ជូនទៅ ART' : referralText,
      isCounselingBeforeReg ? `${rec.post_counseling_date} ⚠️ (ចុះឈ្មោះ: ${rec.registration_date})` : postCounselingText,
      rec.vl_result ? rec.vl_result.toLocaleString() : '-',
      rec.line_control === 1 ? 'Reactive' : 'Non-reactive',
      rec.line_positive === 1 ? 'Reactive' : 'Non-reactive',
      rec.line_longterm === 1 ? 'Reactive' : 'Non-reactive',
      dqFlags.length > 0 ? dqFlags.join('; ') : 'ត្រឹមត្រូវ (Normal)',
    ];

    const row = worksheet.addRow(rowData);
    row.height = 20;

    // Alternate background & cell borders
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

      // Center codes and dates
      if ([1, 2, 3, 4, 8, 9, 12, 13, 14, 15, 16, 17, 18, 19, 20].includes(colNumber)) {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      } else {
        cell.alignment = { vertical: 'middle', horizontal: 'left', indent: 0.5 };
      }

      // --- ATTRIBUTE LEVEL ERROR HIGHLIGHTING ---
      // 1. Column 4: Missing UUIC -> Soft Red Highlight
      if (colNumber === 4 && isMissingUuic) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };
        cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF991B1B' } };
      }

      // 2. Column 9: Invalid Age / DOB -> Soft Red Highlight
      if (colNumber === 9 && isInvalidAge) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };
        cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF991B1B' } };
      }

      // 3. Column 10: Missing Target Group or Conflict -> Soft Amber Highlight
      if (colNumber === 10 && (isMissingTarget || isGenderConflict)) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3C7' } };
        cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF92400E' } };
      }

      // 4. Column 13: HIV Reactive -> Soft Red Highlight
      if (colNumber === 13 && Number(rec.hiv_result) === 2) {
        cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF991B1B' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };
      }

      // 5. Column 14: RTRI Issues (Missing on Reactive, or RTRI on Negative)
      if (colNumber === 14 && isReactiveMissingRtri) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3C7' } };
        cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF92400E' } };
      } else if (colNumber === 14 && isRtriOnNegative) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };
        cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF991B1B' } };
      } else if (colNumber === 14 && Number(rec.rtri_result_id) === 1) {
        cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FFC2410C' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFEDD5' } };
      }

      // 6. Column 15: Referral Issues (Reactive Unlinked or Negative referred to ART)
      if (colNumber === 15 && (isReactiveUnlinked || isNegativeWithArt)) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };
        cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF991B1B' } };
      }

      // 7. Column 16: Post-counseling Date Before Registration Date
      if (colNumber === 16 && isCounselingBeforeReg) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };
        cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF991B1B' } };
      }

      // 8. Columns 18, 19, 20: 3-Test Algorithm Conflict
      if ([18, 19, 20].includes(colNumber) && isLineConflict) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };
        cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF991B1B' } };
      }

      // 9. Column 21: Data Quality Summary Column
      if (colNumber === 21) {
        if (dqFlags.length > 0) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF1F2' } };
          cell.font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: 'FFE11D48' } };
        } else {
          cell.font = { name: 'Segoe UI', size: 9, color: { argb: 'FF16A34A' } };
        }
      }
    });
  });

  return workbook;
}
