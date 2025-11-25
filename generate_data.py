import json
import random
from datetime import datetime, timedelta

# Companies - Increase to 25 companies across Indonesia
companies = []
for i in range(25):
    regions = [
        ("Jawa Timur", "JT", "08123456"),
        ("Kalimantan Tengah", "KT", "08223456"), 
        ("Kalimantan Selatan", "KS", "08323456"),
        ("Riau", "RI", "08423456"),
        ("Jambi", "JB", "08523456")
    ]
    region = regions[i // 5]  # 5 companies per region
    companies.append({
        "id": 19 + i,
        "nama_perusahaan": f"PT. Sawit {region[0]} {(i % 5) + 1}",
        "pic_kontak": f"Contact {i+1}",
        "email_kontak": f"contact{i+1}@sawit{region[1].lower()}.com",
        "telepon": f"{region[2]}{i+19}",
        "alamat": f"Jl. Sample No. {i+1}, City {i+1}",
        "status": "aktif",
        "created_at": "2025-11-25 00:00:00",
        "kode_perusahaan": f"{region[1]}{i+1:03d}",
        "jenis_perusahaan": "Perkebunan"
    })

# Sites - More diverse locations across Indonesia (50 sites total)
sites = []
site_locations = [
    # Jawa Timur (10 locations)
    {"name": "Surabaya Utara", "lat": -7.2575, "lon": 112.7521, "region": "Jawa Timur"},
    {"name": "Malang Selatan", "lat": -7.9666, "lon": 112.6326, "region": "Jawa Timur"},
    {"name": "Jember Timur", "lat": -8.1845, "lon": 113.6681, "region": "Jawa Timur"},
    {"name": "Kediri Barat", "lat": -7.8480, "lon": 112.0178, "region": "Jawa Timur"},
    {"name": "Madiun Utara", "lat": -7.6298, "lon": 111.5239, "region": "Jawa Timur"},
    {"name": "Blitar Selatan", "lat": -8.0956, "lon": 112.1609, "region": "Jawa Timur"},
    {"name": "Probolinggo Timur", "lat": -7.7543, "lon": 113.2159, "region": "Jawa Timur"},
    {"name": "Pasuruan Barat", "lat": -7.6469, "lon": 112.9072, "region": "Jawa Timur"},
    {"name": "Mojokerto Utara", "lat": -7.4722, "lon": 112.4338, "region": "Jawa Timur"},
    {"name": "Batu Selatan", "lat": -7.8748, "lon": 112.5265, "region": "Jawa Timur"},
    
    # Kalimantan Tengah (10 locations)
    {"name": "Palangka Raya", "lat": -2.2088, "lon": 113.9213, "region": "Kalimantan Tengah"},
    {"name": "Sampit Utara", "lat": -2.5312, "lon": 112.9497, "region": "Kalimantan Tengah"},
    {"name": "Kuala Kapuas", "lat": -3.009, "lon": 114.3909, "region": "Kalimantan Tengah"},
    {"name": "Pangkalan Bun", "lat": -2.6769, "lon": 111.6294, "region": "Kalimantan Tengah"},
    {"name": "Muara Teweh", "lat": -0.9738, "lon": 114.8934, "region": "Kalimantan Tengah"},
    {"name": "Kapuas Barat", "lat": -3.0139, "lon": 114.3776, "region": "Kalimantan Tengah"},
    {"name": "Barito Timur", "lat": -2.1386, "lon": 114.8451, "region": "Kalimantan Tengah"},
    {"name": "Sukamara", "lat": -2.6683, "lon": 111.2434, "region": "Kalimantan Tengah"},
    {"name": "Kotawaringin Barat", "lat": -2.6174, "lon": 111.7418, "region": "Kalimantan Tengah"},
    {"name": "Pulang Pisau", "lat": -2.7041, "lon": 113.9542, "region": "Kalimantan Tengah"},
    
    # Kalimantan Selatan (10 locations) 
    {"name": "Banjarmasin Timur", "lat": -3.3194, "lon": 114.5906, "region": "Kalimantan Selatan"},
    {"name": "Barito Kuala", "lat": -3.2697, "lon": 114.6405, "region": "Kalimantan Selatan"},
    {"name": "Tapin Selatan", "lat": -2.8707, "lon": 115.1581, "region": "Kalimantan Selatan"},
    {"name": "Hulu Sungai Tengah", "lat": -2.6103, "lon": 115.5027, "region": "Kalimantan Selatan"},
    {"name": "Kotabaru Utara", "lat": -3.2891, "lon": 116.1674, "region": "Kalimantan Selatan"},
    {"name": "Tanah Bumbu", "lat": -3.4464, "lon": 115.6356, "region": "Kalimantan Selatan"},
    {"name": "Balangan", "lat": -2.3167, "lon": 115.6167, "region": "Kalimantan Selatan"},
    {"name": "Tabalong", "lat": -2.1833, "lon": 115.5, "region": "Kalimantan Selatan"},
    {"name": "Hulu Sungai Selatan", "lat": -2.8333, "lon": 115.2833, "region": "Kalimantan Selatan"},
    {"name": "Hulu Sungai Utara", "lat": -2.5, "lon": 115.1667, "region": "Kalimantan Selatan"},
    
    # Riau (10 locations)
    {"name": "Pekanbaru Selatan", "lat": 0.5071, "lon": 101.4478, "region": "Riau"},
    {"name": "Dumai Timur", "lat": 1.6595, "lon": 101.4467, "region": "Riau"},
    {"name": "Bengkalis Utara", "lat": 1.4667, "lon": 102.0833, "region": "Riau"},
    {"name": "Siak Sri Indrapura", "lat": 1.1179, "lon": 102.0264, "region": "Riau"},
    {"name": "Rokan Hilir", "lat": 2.0833, "lon": 100.8667, "region": "Riau"},
    {"name": "Rokan Hulu", "lat": 1.0, "lon": 100.4667, "region": "Riau"},
    {"name": "Kampar", "lat": 0.3267, "lon": 101.1474, "region": "Riau"},
    {"name": "Kuantan Singingi", "lat": -0.4833, "lon": 101.4667, "region": "Riau"},
    {"name": "Indragiri Hulu", "lat": -0.35, "lon": 102.1167, "region": "Riau"},
    {"name": "Indragiri Hilir", "lat": -0.5167, "lon": 103.0833, "region": "Riau"},
    
    # Jambi (10 locations)
    {"name": "Jambi Timur", "lat": -1.6101, "lon": 103.6131, "region": "Jambi"},
    {"name": "Muaro Jambi", "lat": -1.4851, "lon": 103.8928, "region": "Jambi"},
    {"name": "Tanjung Jabung Timur", "lat": -1.0581, "lon": 104.0122, "region": "Jambi"},
    {"name": "Tanjung Jabung Barat", "lat": -1.0944, "lon": 103.6181, "region": "Jambi"},
    {"name": "Batanghari", "lat": -1.7833, "lon": 103.1167, "region": "Jambi"},
    {"name": "Sarolangun", "lat": -2.2333, "lon": 102.6167, "region": "Jambi"},
    {"name": "Merangin", "lat": -2.0667, "lon": 101.5, "region": "Jambi"},
    {"name": "Bungo", "lat": -1.4833, "lon": 101.8667, "region": "Jambi"},
    {"name": "Tebo", "lat": -1.4167, "lon": 102.4333, "region": "Jambi"},
    {"name": "Kerinci", "lat": -1.9667, "lon": 101.0833, "region": "Jambi"}
]

# Create sites with company assignment
company_index = 0
for i, loc in enumerate(site_locations):
    # Each company gets 2 sites
    if i > 0 and i % 2 == 0:
        company_index += 1
    
    sites.append({
        "id": 11 + i,
        "id_perusahaan": 19 + company_index,
        "nama_site": f"Site {loc['name']} {(i % 2) + 1}",
        "id_provinsi": 0,
        "id_kabupaten": 0,
        "id_kecamatan": 0,
        "id_kelurahan": 0,
        "latitude": loc["lat"],
        "longitude": loc["lon"],
        "keterangan": f"Lokasi pemantauan di {loc['name']}, {loc['region']}",
        "created_at": "2025-11-25 00:00:00"
    })

# Devices - Increase to 400 devices (8 per site)
devices = []
for i in range(400):
    site_id = 11 + (i // 8)  # 8 devices per site
    site = next(s for s in sites if s["id"] == site_id)
    company_id = site["id_perusahaan"]
    
    # Create device spread around site location
    lat_offset = random.uniform(-0.005, 0.005)
    lon_offset = random.uniform(-0.005, 0.005)
    
    devices.append({
        "id": 15 + i,
        "device_id_unik": f"DEV-{site['keterangan'].split()[-1][:2].upper()}-{i+1:03d}",
        "id_perusahaan": company_id,
        "id_site": site_id,
        "tipe_alat": "TMAT Logger V3",
        "alamat": None,
        "provinsi": site['keterangan'].split(', ')[-1],
        "kabupaten": site["nama_site"].split()[1],
        "kota": site["nama_site"].split()[1],
        "latitude": site["latitude"] + lat_offset,
        "longitude": site["longitude"] + lon_offset,
        "status": "aktif",
        "last_online": "2025-11-25 12:00:00",
        "created_at": "2025-11-25 00:00:00",
        "kode_titik": f"{site['keterangan'].split()[-1][:2].upper()}{i+1:03d}",
        "kode_blok": f"A{(i%8)+1}"
    })

# Data realtime - More realistic TMAT values
data_realtime = []
for device in devices:
    # Each device gets 2-4 recent readings
    for j in range(random.randint(2, 4)):
        # More realistic TMAT values for Indonesian peatland
        # Optimal range: -0.3 to +0.4m (SiPPEG standards)
        tmat_value = round(random.uniform(-0.5, 0.8), 3)
        
        # Time variation - recent readings
        time_offset = random.randint(0, 12) * 60 * 60  # Last 12 hours
        timestamp = datetime.now() - timedelta(seconds=time_offset)
        
        data_realtime.append({
            "id": len(data_realtime) + 17,
            "device_id_unik": device["device_id_unik"],
            "timestamp_data": timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            "tmat_value": tmat_value,
            "suhu_value": round(random.uniform(24, 32), 2),  # Tropical temperature
            "ph_value": round(random.uniform(3.5, 6.5), 2),  # Acidic peat pH
            "api_key_used": None
        })

# API keys
api_keys = []
for i, company in enumerate(companies):
    api_keys.append({
        "id": 7 + i,
        "id_perusahaan": company["id"],
        "key_value": f"KLHK-JT-{i+1:03d}",
        "level": 1,
        "ignore_limits": 0,
        "date_created": 1764038400,
        "status": "aktif"
    })

# Users
users = []
for i, company in enumerate(companies):
    users.append({
        "id": 15 + i,
        "ip_address": "127.0.0.1",
        "username": f"user.jt{i+1}",
        "password": "$2y$10$hashedpassword",
        "email": f"user@sawitjt{i+1}.com",
        "created_on": 1764038400,
        "last_login": None,
        "active": 1,
        "first_name": "User",
        "last_name": f"JT{i+1}",
        "company": company["nama_perusahaan"],
        "phone": None,
        "id_perusahaan": company["id"]
    })

# Users groups
users_groups = []
for user in users:
    users_groups.append({
        "id": user["id"],
        "user_id": user["id"],
        "group_id": 3
    })

# Output JSON
data = {
    "master_perusahaan": companies,
    "master_site": sites,
    "master_device": devices,
    "data_realtime": data_realtime,
    "api_keys": api_keys,
    "users": users,
    "users_groups": users_groups
}

with open("populate_db.json", "w") as f:
    json.dump(data, f, indent=2)