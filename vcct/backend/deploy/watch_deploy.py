import os
import sys
import time
from sync_quick import quick_sync

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
WATCH_DIR = os.path.join(BACKEND_DIR, "src")

def get_mtimes():
    mtimes = {}
    for root, _, files in os.walk(WATCH_DIR):
        for f in files:
            if f.endswith((".js", ".json", ".env")):
                path = os.path.join(root, f)
                try:
                    mtimes[path] = os.path.getmtime(path)
                except OSError:
                    pass
    env_path = os.path.join(BACKEND_DIR, ".env")
    if os.path.exists(env_path):
        mtimes[env_path] = os.path.getmtime(env_path)
    return mtimes

print("==========================================================")
print("  VCCT Backend Auto-Deploy Watcher")
print(f"  Watching: {WATCH_DIR} & .env")
print("  Target:   http://192.168.1.46:5000/")
print("  Press Ctrl+C to stop.")
print("==========================================================")

last_mtimes = get_mtimes()

try:
    while True:
        time.sleep(1)
        current_mtimes = get_mtimes()
        changed = []
        for path, mtime in current_mtimes.items():
            if path not in last_mtimes or mtime > last_mtimes[path]:
                changed.append(os.path.basename(path))

        if changed:
            print(f"\n[🔄 Change detected in: {', '.join(changed)}]")
            time.sleep(0.5)  # debounce
            try:
                quick_sync()
            except Exception as e:
                print(f"[❌ Sync error]: {e}")
            last_mtimes = get_mtimes()

except KeyboardInterrupt:
    print("\nWatcher stopped.")

