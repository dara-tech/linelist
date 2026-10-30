export const GENDER_MAP = {
  1: { en: 'Male', kh: 'ប្រុស', badge: 'blue' },
  2: { en: 'Female', kh: 'ស្រី', badge: 'pink' },
  3: { en: 'TG (Transgender)', kh: 'បំប្លែងភេទ', badge: 'purple' },
};

export const HIV_RESULT_MAP = {
  1: { en: 'Non-reactive', kh: 'អវិជ្ជមាន', status: 'non-reactive', color: 'emerald' },
  2: { en: 'Reactive', kh: 'វិជ្ជមាន', status: 'reactive', color: 'red' },
  3: { en: 'Inconclusive', kh: 'មិនច្បាស់លាស់', status: 'inconclusive', color: 'amber' },
  4: { en: 'Invalid', kh: 'មិនត្រឹមត្រូវ', status: 'invalid', color: 'zinc' },
};

export const RTRI_RESULT_MAP = {
  1: { en: 'Recent', kh: 'ឆ្លងថ្មីៗ', color: 'rose' },
  2: { en: 'Long Term', kh: 'ឆ្លងយូរ', color: 'indigo' },
  3: { en: 'Negative', kh: 'អវិជ្ជមាន', color: 'emerald' },
  4: { en: 'Invalid', kh: 'មិនត្រឹមត្រូវ', color: 'zinc' },
};

export const MARITAL_STATUS_MAP = {
  1: { en: 'Single', kh: 'នៅលីវ' },
  2: { en: 'Married', kh: 'រៀបការ' },
  3: { en: 'Widowed', kh: 'ពោះម៉ាយ/មេម៉ាយ' },
  4: { en: 'Separated/Divorced', kh: 'លែងលះ/បែកបាក់' },
};

export const RISK_LABELS = {
  risk1: { code: 'risk1', en: 'Injecting drug user (PWID)', kh: 'អ្នកប្រើប្រាស់គ្រឿងញៀនចាក់' },
  risk2: { code: 'risk2', en: 'Non-injecting drug user (PWUD)', kh: 'អ្នកប្រើប្រាស់គ្រឿងញៀនមិនចាក់' },
  risk3: { code: 'risk3', en: 'Female Entertainment Worker (FEW)', kh: 'ស្ត្រីបម្រើសេវាកម្សាន្ត' },
  risk4: { code: 'risk4', en: 'Men who have Sex with Men (MSM)', kh: 'បុរសរួមភេទជាមួយបុរស' },
  risk5: { code: 'risk5', en: 'Transgender (TG)', kh: 'មនុស្សបំប្លែងភេទ' },
  risk6: { code: 'risk6', en: 'Partner of PLHIV', kh: 'ដៃគូអ្នកផ្ទុកមេរោគអេដស៍' },
  risk7: { code: 'risk7', en: 'Partner of Key Population', kh: 'ដៃគូក្រុមប្រជាជនគន្លឹះ' },
  risk8: { code: 'risk8', en: 'Sex with casual partner without condom', kh: 'រួមភេទមិនបានការពារជាមួយដៃគូបណ្តោះអាសន្ន' },
  risk9: { code: 'risk9', en: 'Sex with regular partner without condom', kh: 'រួមភេទមិនបានការពារជាមួយដៃគូប្រចាំ' },
  risk10: { code: 'risk10', en: 'Sex with Commercial Sex Worker', kh: 'រួមភេទជាមួយស្ត្រីរកស៊ីផ្លូវភេទ' },
  risk11: { code: 'risk11', en: 'Occupational exposure (Needle stick)', kh: 'គ្រោះថ្នាក់ការងារ (មុតម្ជុល)' },
  risk12: { code: 'risk12', en: 'Blood transfusion / Medical procedure', kh: 'បញ្ចូលឈាម ឬនីតិវិធីវេជ្ជសាស្ត្រ' },
  risk13: { code: 'risk13', en: 'STI symptoms / History', kh: 'មានរោគសញ្ញា ឬប្រវត្តិជំងឺកាមរោគ' },
  risk14: { code: 'risk14', en: 'TB patient / presumptive TB', kh: 'អ្នកជំងឺរបេង ឬសង្ស័យរបេង' },
  risk15: { code: 'risk15', en: 'Antenatal care (ANC)', kh: 'ស្ត្រីមានផ្ទៃពោះ (ANC)' },
  risk16: { code: 'risk16', en: 'Child born to HIV positive mother', kh: 'កុមារកើតពីម្តាយមានផ្ទុកមេរោគអេដស៍' },
  risk17: { code: 'risk17', en: 'PrEP user / initiating PrEP', kh: 'អ្នកប្រើប្រាស់ថ្នាំ PrEP' },
  risk18: { code: 'risk18', en: 'PEP user', kh: 'អ្នកប្រើប្រាស់ថ្នាំ PEP' },
};

export const REASON_LABELS = {
  rs1: { code: 'rs1', en: 'Self-referral / Voluntarily tested', kh: 'ស្ម័គ្រចិត្តមកធ្វើតេស្តដោយខ្លួនឯង' },
  rs2: { code: 'rs2', en: 'Referred by Outreach / Peer educator', kh: 'បញ្ជូនដោយក្រុមការងារផ្សព្វផ្សាយ/មិត្តអប់រំមិត្ត' },
  rs3: { code: 'rs3', en: 'Referred by Health Facility / OPD / Inpatient', kh: 'បញ្ជូនពីមណ្ឌលសុខភាព/មន្ទីរពេទ្យ' },
  rs4: { code: 'rs4', en: 'Referred by ANC / Maternity', kh: 'បញ្ជូនពីផ្នែកពិនិត្យផ្ទៃពោះ' },
  rs5: { code: 'rs5', en: 'Referred by TB clinic', kh: 'បញ្ជូនពីផ្នែករបេង' },
  rs6: { code: 'rs6', en: 'Referred by STI clinic', kh: 'បញ្ជូនពីផ្នែកកាមរោគ' },
  rs7: { code: 'rs7', en: 'Referred by NGO / Community Partner', kh: 'បញ្ជូនដោយអង្គការដៃគូ' },
  rs8: { code: 'rs8', en: 'Partner Notification / Index Testing', kh: 'តាមដាននិងជូនដំណឹងដល់ដៃគូ (Index Testing)' },
  rs9: { code: 'rs9', en: 'Pre-marriage / Pre-employment check', kh: 'ពិនិត្យមុនរៀបការ ឬមុនចូលបម្រើការងារ' },
  rs10: { code: 'rs10', en: 'Blood donor screening confirmation', kh: 'បញ្ជាក់លទ្ធផលពីការផ្តល់ឈាម' },
  rs11: { code: 'rs11', en: 'HIV Self-Test confirmation (reactive test)', kh: 'បញ្ជាក់លទ្ធផលតេស្តអេដស៍ដោយខ្លួនឯង' },
  rs12: { code: 'rs12', en: 'PrEP Follow-up testing', kh: 'តេស្តតាមដានសម្រាប់អ្នកប្រើ PrEP' },
  rs13: { code: 'rs13', en: 'PEP Follow-up testing', kh: 'តេស្តតាមដានសម្រាប់អ្នកប្រើ PEP' },
  rs14: { code: 'rs14', en: 'Other reason', kh: 'មូលហេតុផ្សេងៗ' },
};
