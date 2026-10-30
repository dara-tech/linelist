import re

with open(r'd:\dev\linelist\db_structure\main_db_structure.sql', 'r', encoding='utf-8', errors='ignore') as f:
    sql_text = f.read()

def show_table(name):
    pattern = rf'CREATE TABLE `?{name}`?\s*\((.*?)\)\s*ENGINE'
    m = re.search(pattern, sql_text, re.DOTALL | re.IGNORECASE)
    if m:
        print(f"=== TABLE: {name} ===")
        for line in m.group(1).split('\n'):
            line = line.strip()
            if line.startswith('`'):
                print("  ", line)

show_table('vccts')


