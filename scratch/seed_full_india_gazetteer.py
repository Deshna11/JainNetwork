import os
import json
import urllib.request
import ssl
import sys
import unicodedata

# Supabase Credentials
SUPABASE_URL = "https://opueithvutkkqkphhlug.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wdWVpdGh2dXRra3FrcGhobHVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MjU5MDAsImV4cCI6MjEwMDQwMTkwMH0.NWGTbGKe8Vwc29JKbYDsaxSoEelgPm2vypJ0DfqCCzs"

# Admin1 Code to State Name mapping
ADMIN1_MAP = {
    '01': 'Andaman and Nicobar Islands',
    '02': 'Andhra Pradesh',
    '03': 'Assam',
    '05': 'Chandigarh',
    '07': 'Delhi',
    '09': 'Gujarat',
    '10': 'Haryana',
    '11': 'Himachal Pradesh',
    '12': 'Jammu and Kashmir',
    '13': 'Kerala',
    '14': 'Lakshadweep',
    '16': 'Maharashtra',
    '17': 'Manipur',
    '18': 'Meghalaya',
    '19': 'Karnataka',
    '20': 'Nagaland',
    '21': 'Odisha',
    '22': 'Puducherry',
    '23': 'Punjab',
    '24': 'Rajasthan',
    '25': 'Tamil Nadu',
    '26': 'Tripura',
    '28': 'West Bengal',
    '29': 'Sikkim',
    '30': 'Arunachal Pradesh',
    '31': 'Mizoram',
    '33': 'Goa',
    '34': 'Bihar',
    '35': 'Madhya Pradesh',
    '36': 'Uttar Pradesh',
    '37': 'Chhattisgarh',
    '38': 'Jharkhand',
    '39': 'Uttarakhand',
    '40': 'Telangana',
    '41': 'Ladakh',
    '52': 'Dadra and Nagar Haveli and Daman and Diu'
}

# Features to include from GeoNames
ALLOWED_FEATURE_CODES = {
    'ADM1': 'State',
    'ADM2': 'District',
    'ADM3': 'Tehsil',
    'ADM4': 'Tehsil',
    'PPLC': 'City',
    'PPLA': 'City',
    'PPLA2': 'City',
    'PPLA3': 'Town',
    'PPLA4': 'Town',
    'PPL': 'Town/Village',
    'PPLX': 'Locality',
    'PPLL': 'Locality',
    'PPLH': 'Village',
    'LCTY': 'Locality',
    'RSTN': 'Tourist Destination',
    'HSTL': 'Tourist Destination',
    'TMPL': 'Pilgrimage Center',
    'RESF': 'Tourist Destination'
}

def remove_diacritics(input_str):
    if not input_str:
        return ""
    nfkd_form = unicodedata.normalize('NFKD', input_str)
    return "".join([c for c in nfkd_form if not unicodedata.combining(c)])

def determine_type(fcode, pop):
    if fcode in ['ADM1']:
        return 'State'
    if fcode in ['ADM2']:
        return 'District'
    if fcode in ['ADM3', 'ADM4']:
        return 'Tehsil'
    if fcode in ['PPLC', 'PPLA', 'PPLA2']:
        return 'City'
    if fcode in ['PPLA3', 'PPLA4']:
        return 'Town'
    if fcode in ['PPLX', 'PPLL', 'LCTY']:
        return 'Locality'
    if fcode in ['RSTN', 'HSTL', 'RESF']:
        return 'Tourist Destination'
    if fcode in ['TMPL']:
        return 'Pilgrimage Center'
    
    # For general PPL
    try:
        population = int(pop) if pop else 0
    except ValueError:
        population = 0

    if population >= 100000:
        return 'City'
    elif population >= 10000:
        return 'Town'
    else:
        return 'Village'

def parse_geonames_file(filepath):
    print(f"Parsing GeoNames file {filepath}...")
    records = []
    seen = set()

    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        for line in f:
            parts = line.strip().split('\t')
            if len(parts) < 15:
                continue

            geonameid = parts[0]
            raw_name = parts[1]
            asciiname = parts[2]
            alternates_str = parts[3]
            lat_str = parts[4]
            lng_str = parts[5]
            fclass = parts[6]
            fcode = parts[7]
            admin1_code = parts[10]
            pop_str = parts[14]

            if fcode not in ALLOWED_FEATURE_CODES and fclass not in ['P', 'A']:
                continue

            # Determine clean name
            clean_name = remove_diacritics(asciiname or raw_name).strip()
            if not clean_name:
                continue

            state_name = ADMIN1_MAP.get(admin1_code, 'India')
            loc_type = determine_type(fcode, pop_str)

            # Determine lat/lng
            try:
                lat = float(lat_str) if lat_str else None
                lng = float(lng_str) if lng_str else None
            except ValueError:
                lat, lng = None, None

            # Aliases
            aliases = []
            if alternates_str:
                for alt in alternates_str.split(','):
                    alt_clean = remove_diacritics(alt).strip()
                    if alt_clean and alt_clean.lower() != clean_name.lower() and len(alt_clean) > 2:
                        aliases.append(alt_clean)
            
            # Limit aliases to top 5
            aliases = list(dict.fromkeys(aliases))[:5] if aliases else None

            # Formatted text
            if loc_type in ['State', 'Union Territory']:
                formatted = f"{clean_name}, India"
            elif loc_type == 'District':
                formatted = f"{clean_name} District, {state_name}"
            else:
                formatted = f"{clean_name}, {state_name}"

            # Deduplication key
            dedup_key = (clean_name.lower(), loc_type.lower(), state_name.lower())
            if dedup_key in seen:
                continue
            seen.add(dedup_key)

            records.append({
                "name": clean_name,
                "type": loc_type,
                "district": None,
                "state": state_name,
                "country": "India",
                "latitude": lat,
                "longitude": lng,
                "formatted": formatted,
                "aliases": aliases
            })

    print(f"Extracted {len(records)} clean location records from GeoNames!")
    return records

def clear_existing_locations():
    print("Clearing existing locations table...")
    url = f"{SUPABASE_URL}/rest/v1/locations?id=gt.00000000-0000-0000-0000-000000000000"
    headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}"
    }
    req = urllib.request.Request(url, headers=headers, method="DELETE")
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    try:
        with urllib.request.urlopen(req, context=ctx) as response:
            print("Cleared previous records!")
    except Exception as e:
        print(f"Warning clearing locations: {e}")

def seed_to_supabase(records):
    print(f"Seeding {len(records)} locations to Supabase in batches of 500...")
    url = f"{SUPABASE_URL}/rest/v1/locations"
    batch_size = 500
    headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }

    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    total = len(records)
    inserted = 0

    for i in range(0, total, batch_size):
        chunk = records[i:i+batch_size]
        data_json = json.dumps(chunk).encode("utf-8")

        req = urllib.request.Request(url, data=data_json, headers=headers, method="POST")
        try:
            with urllib.request.urlopen(req, context=ctx) as response:
                if response.status in [200, 201]:
                    inserted += len(chunk)
                    if inserted % 5000 == 0 or inserted == total:
                        print(f"Progress: Inserted {inserted}/{total} locations ({(inserted/total)*100:.1f}%)...")
        except urllib.error.HTTPError as e:
            print(f"Error inserting batch at index {i}: {e.read().decode()}")
            # Continue with next batch on minor error
            continue

    print(f"✅ Successfully seeded {inserted} locations into Supabase!")

if __name__ == "__main__":
    filepath = "scratch/geonames_in/IN.txt"
    if not os.path.exists(filepath):
        print(f"Error: {filepath} not found.")
        sys.exit(1)

    records = parse_geonames_file(filepath)
    clear_existing_locations()
    seed_to_supabase(records)
