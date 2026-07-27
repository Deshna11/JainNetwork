import urllib.request
import os

ADMIN1_URL = "https://download.geonames.org/export/dump/admin1CodesASCII.txt"

print("Downloading admin1CodesASCII.txt...")
req = urllib.request.Request(
    ADMIN1_URL,
    headers={'User-Agent': 'Mozilla/5.0'}
)
with urllib.request.urlopen(req) as resp:
    lines = resp.read().decode('utf-8').splitlines()

admin1_map = {}
for line in lines:
    parts = line.split('\t')
    if len(parts) >= 2 and parts[0].startswith('IN.'):
        code = parts[0].split('.')[1]
        name = parts[1]
        admin1_map[code] = name

print("Admin1 State Map for India:")
for k, v in sorted(admin1_map.items()):
    print(f"  {k} -> {v}")
