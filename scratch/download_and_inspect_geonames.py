import urllib.request
import zipfile
import io
import os

GEONAMES_IN_URL = "https://download.geonames.org/export/dump/IN.zip"
ADMIN1_URL = "https://download.geonames.org/export/dump/admin1CodesASCII.txt"

print(f"Downloading GeoNames India Dataset from {GEONAMES_IN_URL}...")

req = urllib.request.Request(
    GEONAMES_IN_URL,
    headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'}
)

with urllib.request.urlopen(req) as resp:
    zip_bytes = resp.read()
    print(f"Downloaded {len(zip_bytes) / (1024*1024):.2f} MB compressed zip.")

with zipfile.ZipFile(io.BytesIO(zip_bytes)) as zf:
    zf.extractall("scratch/geonames_in")
    print("Extracted scratch/geonames_in/IN.txt successfully!")

# Let's inspect IN.txt
count = 0
feature_codes = {}
sample_places = []

target_names = ["mahabaleshwar", "panchgani", "lonavala", "lavasa", "saputara", "matheran", "palitana", "shikharji", "shravanabelagola", "ranakpur"]
found_targets = {}

with open("scratch/geonames_in/IN.txt", "r", encoding="utf-8", errors="ignore") as f:
    for line in f:
        parts = line.strip().split("\t")
        if len(parts) < 15:
            continue
        count += 1
        name = parts[1]
        asciiname = parts[2]
        alternates = parts[3]
        lat = parts[4]
        lng = parts[5]
        fclass = parts[6]
        fcode = parts[7]
        admin1 = parts[10]

        feature_codes[fcode] = feature_codes.get(fcode, 0) + 1

        lower_name = asciiname.lower()
        for t in target_names:
            if t in lower_name or (alternates and t in alternates.lower()):
                if t not in found_targets:
                    found_targets[t] = []
                found_targets[t].append((name, fcode, admin1, lat, lng))

print(f"\nTotal rows in IN.txt: {count}")
print(f"Target places found: {list(found_targets.keys())}")
for t, matches in found_targets.items():
    print(f"  {t}: {matches[:3]}")

print("\nFeature code counts (top 15):")
sorted_fc = sorted(feature_codes.items(), key=lambda x: x[1], reverse=True)
for fc, cnt in sorted_fc[:15]:
    print(f"  {fc}: {cnt}")
