import mysql.connector, sys
if hasattr(sys.stdout, 'reconfigure'): sys.stdout.reconfigure(encoding='utf-8')

conn = mysql.connector.connect(host='mpi.nchads.gov.kh', port=3306, user='root_dmu', password='deV@0926mp!*', database='main_dbs')
cursor = conn.cursor(dictionary=True)

cursor.execute("SHOW TABLES")
tables = [list(r.values())[0] for r in cursor.fetchall()]
for t in tables:
    if any(k in t.lower() for k in ['educ', 'marit', 'retest', 'cma', 'hts', 'dqa']):
        print('Matched table:', t)

cursor.execute("SELECT DISTINCT education_id FROM vccts ORDER BY education_id")
print('Distinct education_id:', [r['education_id'] for r in cursor.fetchall()])

cursor.execute("SELECT DISTINCT marital_status_id FROM vccts ORDER BY marital_status_id")
print('Distinct marital_status_id:', [r['marital_status_id'] for r in cursor.fetchall()])

conn.close()

