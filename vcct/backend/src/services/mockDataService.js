// High-fidelity mock data generator matching main_dbs schema
const PROVINCES = [
  { id: 1, province_en: 'Phnom Penh', province_kh: 'ភ្នំពេញ' },
  { id: 2, province_en: 'Battambang', province_kh: 'បាត់ដំបង' },
  { id: 3, province_en: 'Siem Reap', province_kh: 'សៀមរាប' },
  { id: 4, province_en: 'Banteay Meanchey', province_kh: 'បន្ទាយមានជ័យ' },
  { id: 5, province_en: 'Kampong Cham', province_kh: 'កំពង់ចាម' },
];

const ODS = [
  { od_code: '0101', name_en: 'Phnom Penh South', name_kh: 'ភ្នំពេញត្បូង', province_id: 1 },
  { od_code: '0102', name_en: 'Phnom Penh North', name_kh: 'ភ្នំពេញជើង', province_id: 1 },
  { od_code: '0201', name_en: 'Battambang OD', name_kh: 'ស្រុកប្រតិបត្តិបាត់ដំបង', province_id: 2 },
  { od_code: '0202', name_en: 'Moung Ruessei OD', name_kh: 'ស្រុកប្រតិបត្តិមោងឫស្សី', province_id: 2 },
  { od_code: '0301', name_en: 'Siem Reap OD', name_kh: 'ស្រុកប្រតិបត្តិសៀមរាប', province_id: 3 },
  { od_code: '0302', name_en: 'Soutr Nikom OD', name_kh: 'ស្រុកប្រតិបត្តិសូទ្រនិគម', province_id: 3 },
  { od_code: '0401', name_en: 'Mongkol Borei OD', name_kh: 'ស្រុកប្រតិបត្តិមង្គលបូរី', province_id: 4 },
  { od_code: '0501', name_en: 'Kampong Cham OD', name_kh: 'ស្រុកប្រតិបត្តិកំពង់ចាម', province_id: 5 },
];

const SITES = [
  { site_code: '1001', site_name: 'National Maternal and Child Health Center (NMCHC)', od_code: '0101', province_id: 1 },
  { site_code: '1002', site_name: 'Calmette Hospital VCCT', od_code: '0102', province_id: 1 },
  { site_code: '1003', site_name: 'Khmer-Soviet Friendship Hospital VCCT', od_code: '0101', province_id: 1 },
  { site_code: '2001', site_name: 'Battambang Referral Hospital VCCT', od_code: '0201', province_id: 2 },
  { site_code: '2002', site_name: 'Moung Ruessei Referral Hospital', od_code: '0202', province_id: 2 },
  { site_code: '3001', site_name: 'Siem Reap Provincial Hospital VCCT', od_code: '0301', province_id: 3 },
  { site_code: '4001', site_name: 'Mongkol Borei Provincial Hospital', od_code: '0401', province_id: 4 },
  { site_code: '5001', site_name: 'Kampong Cham Provincial Hospital VCCT', od_code: '0501', province_id: 5 },
];

const TARGET_GROUPS = [
  { Tid: 1, Targroup: 'MSM', Targroupkh: 'បុរសរួមភេទជាមួយបុរស' },
  { Tid: 2, Targroup: 'FEW', Targroupkh: 'ស្ត្រីបម្រើសេវាកម្សាន្ត' },
  { Tid: 3, Targroup: 'TG', Targroupkh: 'មនុស្សបំប្លែងភេទ' },
  { Tid: 4, Targroup: 'PWID', Targroupkh: 'អ្នកចាក់គ្រឿងញៀន' },
  { Tid: 5, Targroup: 'PWUD', Targroupkh: 'អ្នកប្រើប្រាស់គ្រឿងញៀនមិនចាក់' },
  { Tid: 6, Targroup: 'GenPop', Targroupkh: 'ប្រជាជនទូទៅ' },
  { Tid: 7, Targroup: 'ANC', Targroupkh: 'ស្ត្រីមានផ្ទៃពោះ' },
  { Tid: 8, Targroup: 'Partner', Targroupkh: 'ដៃគូអ្នកផ្ទុក' },
];

let cachedMockRecords = null;

export function getMockHierarchy() {
  return {
    provinces: PROVINCES,
    ods: ODS,
    sites: SITES,
  };
}

export function getMockMetadata() {
  return {
    targetGroups: TARGET_GROUPS,
    patientTypes: [
      { id: 1, type_en: 'Outpatient', type_kh: 'អ្នកជំងឺក្រៅ' },
      { id: 2, type_en: 'Inpatient', type_kh: 'អ្នកជំងឺសម្រាកពេទ្យ' },
      { id: 3, type_en: 'Voluntary', type_kh: 'ស្ម័គ្រចិត្ត' },
    ],
    hivResults: [
      { id: 1, result_en: 'Reactive', result_kh: 'វិជ្ជមាន' },
      { id: 2, result_en: 'Non-reactive', result_kh: 'អវិជ្ជមាន' },
      { id: 3, result_en: 'Inconclusive', result_kh: 'មិនច្បាស់លាស់' },
    ],
    rtriResults: [
      { id: 1, result: 'Recent' },
      { id: 2, result: 'Long Term' },
      { id: 3, result: 'Negative' },
    ],
  };
}

export function generateMockRecords(count = 120) {
  if (cachedMockRecords && cachedMockRecords.length === count) {
    return cachedMockRecords;
  }

  const records = [];
  const startTimestamp = new Date('2024-01-01').getTime();
  const endTimestamp = new Date('2024-12-31').getTime();

  for (let i = 1; i <= count; i++) {
    const site = SITES[Math.floor(Math.random() * SITES.length)];
    const od = ODS.find((o) => o.od_code === site.od_code) || ODS[0];
    const province = PROVINCES.find((p) => p.id === site.province_id) || PROVINCES[0];
    const target = TARGET_GROUPS[Math.floor(Math.random() * TARGET_GROUPS.length)];

    const randomDate = new Date(startTimestamp + Math.random() * (endTimestamp - startTimestamp));
    const regDateStr = randomDate.toISOString().split('T')[0];

    // HIV result weighted: 85% Non-reactive (2), 12% Reactive (1), 3% Inconclusive (3)
    const randRes = Math.random();
    const hivResultId = randRes < 0.12 ? 1 : randRes < 0.97 ? 2 : 3;
    const isReactive = hivResultId === 1;

    const sex = target.Tid === 1 ? 1 : target.Tid === 2 ? 2 : target.Tid === 3 ? 3 : Math.random() > 0.48 ? 1 : 2;
    const age = 15 + Math.floor(Math.random() * 50);
    const birthYear = new Date().getFullYear() - age;
    const dob = `${birthYear}-${String(1 + Math.floor(Math.random() * 12)).padStart(2, '0')}-${String(1 + Math.floor(Math.random() * 28)).padStart(2, '0')}`;

    const rtriResultId = isReactive ? (Math.random() < 0.35 ? 1 : 2) : 3; // 1=Recent, 2=Longterm, 3=Negative

    records.push({
      site_code: site.site_code,
      site_name: site.site_name,
      od_code: od.od_code,
      od_name: od.name_en,
      province_id: province.id,
      province_name: province.province_en,
      vcct_id: 100000 + i,
      registration_date: regDateStr,
      pmrs_code: `PMRS-${site.site_code}-${String(i).padStart(4, '0')}`,
      hts_code: `HTS-${site.site_code}-${String(i).padStart(4, '0')}`,
      uuic: `U${site.site_code}${dob.replace(/-/g, '').slice(2)}${sex}`,
      idpoor: Math.random() < 0.25 ? `IDP-${Math.floor(100000 + Math.random() * 900000)}` : null,
      sex,
      dob,
      age,
      marital_status_id: 1 + Math.floor(Math.random() * 4),
      occupation_id: 1 + Math.floor(Math.random() * 8),
      occupation_other: '',
      education_id: 1 + Math.floor(Math.random() * 5),
      phone_number: `0${Math.floor(10 + Math.random() * 89)}${Math.floor(100000 + Math.random() * 900000)}`,
      target_group_id: target.Tid,
      target_group_name: target.Targroup,
      patient_type_id: 1 + Math.floor(Math.random() * 3),
      history_of_test: Math.random() < 0.4 ? 1 : 0,
      history_of_test_result: Math.random() < 0.05 ? 1 : 2,
      is_agree_test_hiv: 1,
      combo_result: isReactive ? 1 : 2,
      hiv_result: hivResultId,
      is_agree_test_rtri: isReactive ? 1 : 0,
      rtri_result_id: isReactive ? rtriResultId : 0,
      is_first_invalid: 0,
      is_agree_test_vl: isReactive ? 1 : 0,
      vl_result: isReactive ? (Math.random() < 0.7 ? Math.floor(5000 + Math.random() * 50000) : 20) : 0,
      rita_result: isReactive ? (rtriResultId === 1 ? 1 : 2) : 0,
      post_counseling_id: 1,
      post_counseling_date: regDateStr,
      refer_to_service_id: isReactive ? 1 : (Math.random() < 0.3 ? 2 : 0),
      refer_to_other: '',
      line_control: isReactive ? 1 : 1,
      line_positive: isReactive ? 1 : 0,
      line_longterm: rtriResultId === 2 ? 1 : 0,
      cambo_ag: isReactive ? 1 : 0,
      cambo_ab: isReactive ? 1 : 0,
      // Risk flags
      risk1: target.Tid === 4 ? 1 : 0,
      risk2: target.Tid === 5 ? 1 : 0,
      risk3: target.Tid === 2 ? 1 : 0,
      risk4: target.Tid === 1 ? 1 : 0,
      risk5: target.Tid === 3 ? 1 : 0,
      risk6: target.Tid === 8 ? 1 : 0,
      risk8: Math.random() < 0.3 ? 1 : 0,
      risk13: Math.random() < 0.1 ? 1 : 0,
      risk15: target.Tid === 7 ? 1 : 0,
      // Reason flags
      rs1: Math.random() < 0.5 ? 1 : 0,
      rs2: target.Tid <= 5 ? 1 : 0,
      rs8: target.Tid === 8 ? 1 : 0,
      rs11: Math.random() < 0.15 ? 1 : 0,
      created_at: `${regDateStr} 09:30:00`,
    });
  }

  // Sort by registration_date descending
  records.sort((a, b) => new Date(b.registration_date) - new Date(a.registration_date));
  cachedMockRecords = records;
  return records;
}
