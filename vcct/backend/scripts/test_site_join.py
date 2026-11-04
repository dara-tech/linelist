import mysql.connector
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

conn = mysql.connector.connect(
    host='mpi.nchads.gov.kh',
    port=3306,
    user='root_dmu',
    password='deV@0926mp!*',
    database='main_dbs'
)
cursor = conn.cursor(dictionary=True)

cursor.execute("""
SELECT 
    p.id AS province_id,
    p.province_kh,
    p.province_en,
    COUNT(DISTINCT s.art_site_code) AS configured_art_sites
FROM tblprovince p
JOIN tblsites s ON s.province_id = p.id AND s.status_id = 1 AND s.art_site_code IS NOT NULL AND s.art_site_code != ''
GROUP BY p.id, p.province_kh, p.province_en
ORDER BY p.id
""")
rows = cursor.fetchall()
print(f"Configured ART sites across {len(rows)} provinces:")
for r in rows[:5]:
    print(r['province_id'], r['province_en'], r['configured_art_sites'])

cursor.execute("""
SELECT DISTINCT v.site_code
FROM tblavmain v
LIMIT 10
""")
print("Sample tblavmain site_codes:", [r['site_code'] for r in cursor.fetchall()])

cursor.execute("""
SELECT DISTINCT s.art_site_code
FROM tblsites s
WHERE s.art_site_code IS NOT NULL AND s.art_site_code != ''
LIMIT 10
""")
print("Sample tblsites art_site_codes:", [r['art_site_code'] for r in cursor.fetchall()])

conn.close()
