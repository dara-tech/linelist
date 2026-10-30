import re
import os

with open(r'd:\dev\linelist\db_structure\main_db_structure.sql', 'r', encoding='utf-8', errors='ignore') as f:
    sql_text = f.read()

table_blocks = re.findall(r'/\*Table structure for table `?([^`*]+)`? \*/\s*(?:DROP TABLE[^;]+;\s*)?CREATE TABLE `?([^`\s(]+)`?\s*\((.*?)\)\s*ENGINE', sql_text, re.DOTALL)

print(f"Total tables found: {len(table_blocks)}")

for comment_name, table_name, schema in table_blocks:
    columns = []
    for line in schema.split('\n'):
        line = line.strip()
        if line.startswith('`'):
            col_match = re.match(r'`([^`]+)`\s+([a-zA-Z0-9_()]+)', line)
            if col_match:
                columns.append(f"{col_match.group(1)} ({col_match.group(2)})")
    print(f"Table: {table_name} -> {len(columns)} cols: {', '.join(columns[:6])}...")
