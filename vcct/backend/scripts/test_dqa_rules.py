import mysql.connector, sys
if hasattr(sys.stdout, 'reconfigure'): sys.stdout.reconfigure(encoding='utf-8')

conn = mysql.connector.connect(host='mpi.nchads.gov.kh', port=3306, user='root_dmu', password='deV@0926mp!*', database='main_dbs')
cursor = conn.cursor(dictionary=True)

# 1. Missing HTS Codes
cursor.execute("SELECT COUNT(*) as cnt FROM vccts WHERE hts_code IS NULL OR TRIM(hts_code) = ''")
print("1. Missing HTS Code:", cursor.fetchone()['cnt'])

# 2. Having HTS Code
cursor.execute("SELECT COUNT(*) as cnt FROM vccts WHERE hts_code IS NOT NULL AND TRIM(hts_code) != ''")
print("2. Having HTS Code:", cursor.fetchone()['cnt'])

# 5. Retest Result
cursor.execute("SELECT COUNT(*) as cnt FROM vccts WHERE history_of_test_result = 1 AND hiv_result != 2")
print("5. Retest check in vccts:", cursor.fetchone()['cnt'])

cursor.execute("SELECT * FROM vcct_retests LIMIT 5")
print("Sample vcct_retests:", cursor.fetchall())

# 6. V0.1 HIV Test Result Inconclusive or Not Selected
cursor.execute("SELECT COUNT(*) as cnt FROM vccts WHERE hiv_result = 3 OR hiv_result = 0 OR hiv_result IS NULL")
print("6. V0.1 Inconclusive / Not Selected:", cursor.fetchone()['cnt'])

# 7. V0.2 Age < 1
cursor.execute("SELECT COUNT(*) as cnt FROM vccts WHERE TIMESTAMPDIFF(YEAR, dob, registration_date) < 1")
print("7. V0.2 Age < 1:", cursor.fetchone()['cnt'])

# 8. V0.3 Age < 15 but Occupation (not student)
cursor.execute("SELECT COUNT(*) as cnt FROM vccts WHERE TIMESTAMPDIFF(YEAR, dob, registration_date) < 15 AND occupation_id IS NOT NULL AND occupation_id NOT IN (0, 9)")
print("8. V0.3 Age < 15 but Occupation:", cursor.fetchone()['cnt'])

# 9. V0.4 Age < 15 but Client Type
cursor.execute("SELECT COUNT(*) as cnt FROM vccts WHERE TIMESTAMPDIFF(YEAR, dob, registration_date) < 15 AND patient_type_id IN (1, 2, 3, 4, 5, 7, 8)")
print("9. V0.4 Age < 15 but KP Client Type:", cursor.fetchone()['cnt'])

# 10. V0.5 Age < 15 but Marital Status
cursor.execute("SELECT COUNT(*) as cnt FROM vccts WHERE TIMESTAMPDIFF(YEAR, dob, registration_date) < 15 AND marital_status_id IN (2, 3)")
print("10. V0.5 Age < 15 but Married/Widowed:", cursor.fetchone()['cnt'])

# 11. V0.6 Age < 15 but Education High School or Above
cursor.execute("SELECT COUNT(*) as cnt FROM vccts WHERE TIMESTAMPDIFF(YEAR, dob, registration_date) < 15 AND education_id IN (4, 5)")
print("11. V0.6 Age < 15 but High School+:", cursor.fetchone()['cnt'])

# 12. V0.7 Male Housewife
cursor.execute("SELECT COUNT(*) as cnt FROM vccts WHERE sex = 1 AND occupation_id = 11")
print("12. V0.7 Male Housewife:", cursor.fetchone()['cnt'])

# 13. V0. HIV Pos but not linked to ART
cursor.execute("SELECT COUNT(*) as cnt FROM vccts WHERE hiv_result = 2 AND (refer_to_service_id != 1 OR refer_to_service_id IS NULL OR refer_to_service_id = 0)")
print("13. V0. HIV Pos not linked to ART:", cursor.fetchone()['cnt'])

# 3 & 4. Year over Year Consistency
cursor.execute("SELECT YEAR(registration_date) as yr, COUNT(*) as total_tested, SUM(CASE WHEN hiv_result = 2 THEN 1 ELSE 0 END) as total_positive FROM vccts WHERE YEAR(registration_date) >= 2020 GROUP BY yr ORDER BY yr")
print("3&4. YoY:", cursor.fetchall())

conn.close()

