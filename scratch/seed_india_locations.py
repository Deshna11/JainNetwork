import os
import json
import urllib.request
import zipfile
import io
import ssl
import sys

# Supabase Credentials from env
SUPABASE_URL = "https://opueithvutkkqkphhlug.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wdWVpdGh2dXRra3FrcGhobHVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MjU5MDAsImV4cCI6MjEwMDQwMTkwMH0.NWGTbGKe8Vwc29JKbYDsaxSoEelgPm2vypJ0DfqCCzs"

# All 28 States & 8 UTs of India
INDIAN_STATES_AND_UTS = [
    # States
    ("Andhra Pradesh", "State"),
    ("Arunachal Pradesh", "State"),
    ("Assam", "State"),
    ("Bihar", "State"),
    ("Chhattisgarh", "State"),
    ("Goa", "State"),
    ("Gujarat", "State"),
    ("Haryana", "State"),
    ("Himachal Pradesh", "State"),
    ("Jharkhand", "State"),
    ("Karnataka", "State"),
    ("Kerala", "State"),
    ("Madhya Pradesh", "State"),
    ("Maharashtra", "State"),
    ("Manipur", "State"),
    ("Meghalaya", "State"),
    ("Mizoram", "State"),
    ("Nagaland", "State"),
    ("Odisha", "State"),
    ("Punjab", "State"),
    ("Rajasthan", "State"),
    ("Sikkim", "State"),
    ("Tamil Nadu", "State"),
    ("Telangana", "State"),
    ("Tripura", "State"),
    ("Uttar Pradesh", "State"),
    ("Uttarakhand", "State"),
    ("West Bengal", "State"),
    # Union Territories
    ("Andaman and Nicobar Islands", "Union Territory"),
    ("Chandigarh", "Union Territory"),
    ("Dadra and Nagar Haveli and Daman and Diu", "Union Territory"),
    ("Delhi", "Union Territory"),
    ("Jammu and Kashmir", "Union Territory"),
    ("Ladakh", "Union Territory"),
    ("Lakshadweep", "Union Territory"),
    ("Puducherry", "Union Territory")
]

# Comprehensive District List across Indian States
DISTRICTS = [
    # Madhya Pradesh
    ("Indore", "Madhya Pradesh"), ("Bhopal", "Madhya Pradesh"), ("Ujjain", "Madhya Pradesh"), ("Gwalior", "Madhya Pradesh"),
    ("Jabalpur", "Madhya Pradesh"), ("Dhar", "Madhya Pradesh"), ("Khargone", "Madhya Pradesh"), ("Khandwa", "Madhya Pradesh"),
    ("Barwani", "Madhya Pradesh"), ("Dewas", "Madhya Pradesh"), ("Ratlam", "Madhya Pradesh"), ("Mandsaur", "Madhya Pradesh"),
    ("Neemuch", "Madhya Pradesh"), ("Sagar", "Madhya Pradesh"), ("Satna", "Madhya Pradesh"), ("Rewa", "Madhya Pradesh"),
    ("Chhatarpur", "Madhya Pradesh"), ("Damoh", "Madhya Pradesh"), ("Tikamgarh", "Madhya Pradesh"), ("Vidisha", "Madhya Pradesh"),
    ("Raisen", "Madhya Pradesh"), ("Sehore", "Madhya Pradesh"), ("Rajgarh", "Madhya Pradesh"), ("Hoshangabad", "Madhya Pradesh"),
    ("Harda", "Madhya Pradesh"), ("Betul", "Madhya Pradesh"), ("Narsinghpur", "Madhya Pradesh"), ("Chhindwara", "Madhya Pradesh"),
    ("Seoni", "Madhya Pradesh"), ("Balaghat", "Madhya Pradesh"), ("Mandla", "Madhya Pradesh"), ("Dindori", "Madhya Pradesh"),
    ("Katni", "Madhya Pradesh"), ("Umaria", "Madhya Pradesh"), ("Shahdol", "Madhya Pradesh"), ("Anuppur", "Madhya Pradesh"),
    ("Sidhi", "Madhya Pradesh"), ("Singrauli", "Madhya Pradesh"), ("Panna", "Madhya Pradesh"), ("Datia", "Madhya Pradesh"),
    ("Shivpuri", "Madhya Pradesh"), ("Guna", "Madhya Pradesh"), ("Ashoknagar", "Madhya Pradesh"), ("Sheopur", "Madhya Pradesh"),
    ("Bhind", "Madhya Pradesh"), ("Morena", "Madhya Pradesh"), ("Jhabua", "Madhya Pradesh"), ("Alirajpur", "Madhya Pradesh"),
    ("Burhanpur", "Madhya Pradesh"), ("Agar Malwa", "Madhya Pradesh"), ("Niwari", "Madhya Pradesh"), ("Mauganj", "Madhya Pradesh"),
    ("Maihar", "Madhya Pradesh"), ("Pandhurna", "Madhya Pradesh"),
    
    # Gujarat
    ("Ahmedabad", "Gujarat"), ("Surat", "Gujarat"), ("Vadodara", "Gujarat"), ("Rajkot", "Gujarat"),
    ("Bhavnagar", "Gujarat"), ("Jamnagar", "Gujarat"), ("Junagadh", "Gujarat"), ("Gandhinagar", "Gujarat"),
    ("Anand", "Gujarat"), ("Kheda", "Gujarat"), ("Mehsana", "Gujarat"), ("Patan", "Gujarat"),
    ("Banaskantha", "Gujarat"), ("Sabarkantha", "Gujarat"), ("Aravalli", "Gujarat"), ("Dahod", "Gujarat"),
    ("Panchmahal", "Gujarat"), ("Mahisagar", "Gujarat"), ("Chhota Udaipur", "Gujarat"), ("Narmada", "Gujarat"),
    ("Bharuch", "Gujarat"), ("Tapi", "Gujarat"), ("Navsari", "Gujarat"), ("Valsad", "Gujarat"),
    ("Dang", "Gujarat"), ("Amreli", "Gujarat"), ("Gir Somnath", "Gujarat"), ("Devbhumi Dwarka", "Gujarat"),
    ("Porbandar", "Gujarat"), ("Morbi", "Gujarat"), ("Surendranagar", "Gujarat"), ("Kutch", "Gujarat"),
    ("Botad", "Gujarat"),

    # Rajasthan
    ("Jaipur", "Rajasthan"), ("Jodhpur", "Rajasthan"), ("Udaipur", "Rajasthan"), ("Kota", "Rajasthan"),
    ("Ajmer", "Rajasthan"), ("Bhilwara", "Rajasthan"), ("Bikaner", "Rajasthan"), ("Alwar", "Rajasthan"),
    ("Bharatpur", "Rajasthan"), ("Sikar", "Rajasthan"), ("Pali", "Rajasthan"), ("Sirohi", "Rajasthan"),
    ("Jalore", "Rajasthan"), ("Barmer", "Rajasthan"), ("Jaisalmer", "Rajasthan"), ("Nagaur", "Rajasthan"),
    ("Churu", "Rajasthan"), ("Jhunjhunu", "Rajasthan"), ("Ganganagar", "Rajasthan"), ("Hanumangarh", "Rajasthan"),
    ("Dungarpur", "Rajasthan"), ("Banswara", "Rajasthan"), ("Chittorgarh", "Rajasthan"), ("Pratapgarh", "Rajasthan"),
    ("Rajsamand", "Rajasthan"), ("Jhalawar", "Rajasthan"), ("Baran", "Rajasthan"), ("Bundi", "Rajasthan"),
    ("Tonk", "Rajasthan"), ("Sawai Madhopur", "Rajasthan"), ("Karauli", "Rajasthan"), ("Dholpur", "Rajasthan"),
    ("Dausa", "Rajasthan"),

    # Maharashtra
    ("Mumbai", "Maharashtra"), ("Mumbai Suburban", "Maharashtra"), ("Pune", "Maharashtra"), ("Nagpur", "Maharashtra"),
    ("Thane", "Maharashtra"), ("Nashik", "Maharashtra"), ("Chhatrapati Sambhajinagar", "Maharashtra"), ("Solapur", "Maharashtra"),
    ("Amravati", "Maharashtra"), ("Kolhapur", "Maharashtra"), ("Sangli", "Maharashtra"), ("Satara", "Maharashtra"),
    ("Ahmednagar", "Maharashtra"), ("Jalgaon", "Maharashtra"), ("Dhule", "Maharashtra"), ("Nandurbar", "Maharashtra"),
    ("Palghar", "Maharashtra"), ("Raigad", "Maharashtra"), ("Ratnagiri", "Maharashtra"), ("Sindhudurg", "Maharashtra"),
    ("Latur", "Maharashtra"), ("Nanded", "Maharashtra"), ("Dharashiv", "Maharashtra"), ("Parbhani", "Maharashtra"),
    ("Jalna", "Maharashtra"), ("Beed", "Maharashtra"), ("Hingoli", "Maharashtra"), ("Akola", "Maharashtra"),
    ("Washim", "Maharashtra"), ("Buldhana", "Maharashtra"), ("Yavatmal", "Maharashtra"), ("Wardha", "Maharashtra"),
    ("Bhandara", "Maharashtra"), ("Gondia", "Maharashtra"), ("Chandrapur", "Maharashtra"), ("Gadchiroli", "Maharashtra"),

    # Uttar Pradesh
    ("Lucknow", "Uttar Pradesh"), ("Kanpur Nagar", "Uttar Pradesh"), ("Varanasi", "Uttar Pradesh"), ("Agra", "Uttar Pradesh"),
    ("Prayagraj", "Uttar Pradesh"), ("Meerut", "Uttar Pradesh"), ("Ghaziabad", "Uttar Pradesh"), ("Gautam Buddha Nagar", "Uttar Pradesh"),
    ("Bareilly", "Uttar Pradesh"), ("Aligarh", "Uttar Pradesh"), ("Moradabad", "Uttar Pradesh"), ("Saharanpur", "Uttar Pradesh"),
    ("Gorakhpur", "Uttar Pradesh"), ("Ayodhya", "Uttar Pradesh"), ("Jhansi", "Uttar Pradesh"), ("Mathura", "Uttar Pradesh"),
    ("Lalitpur", "Uttar Pradesh"), ("Rampur", "Uttar Pradesh"), ("Muzaffarnagar", "Uttar Pradesh"), ("Bijnor", "Uttar Pradesh"),
    
    # Karnataka
    ("Bengaluru Urban", "Karnataka"), ("Bengaluru Rural", "Karnataka"), ("Mysuru", "Karnataka"), ("Hubballi-Dharwad", "Karnataka"),
    ("Belagavi", "Karnataka"), ("Mangaluru", "Karnataka"), ("Vijayapura", "Karnataka"), ("Kalaburagi", "Karnataka"),
    ("Ballari", "Karnataka"), ("Tumakuru", "Karnataka"), ("Shivamogga", "Karnataka"), ("Davangere", "Karnataka"),
    ("Hassan", "Karnataka"), ("Udupi", "Karnataka"), ("Dakshina Kannada", "Karnataka"), ("Uttara Kannada", "Karnataka"),

    # Bihar & Jharkhand
    ("Patna", "Bihar"), ("Gaya", "Bihar"), ("Bhagalpur", "Bihar"), ("Muzaffarpur", "Bihar"), ("Nalanda", "Bihar"),
    ("Ranchi", "Jharkhand"), ("Jamshedpur", "Jharkhand"), ("Dhanbad", "Jharkhand"), ("Giridih", "Jharkhand"), ("Deoghar", "Jharkhand")
]

# Major Cities, Towns, Villages, Localities & Pilgrimage Hubs
CITIES_TOWNS_VILLAGES = [
    # MP Cities, Towns, Villages
    {"name": "Indore", "type": "City", "district": "Indore", "state": "Madhya Pradesh", "aliases": ["Indore Metro"]},
    {"name": "Dhar", "type": "City", "district": "Dhar", "state": "Madhya Pradesh"},
    {"name": "Kukshi", "type": "Town", "district": "Dhar", "state": "Madhya Pradesh"},
    {"name": "Sardarpur", "type": "Town", "district": "Dhar", "state": "Madhya Pradesh"},
    {"name": "Rajgarh", "type": "Town", "district": "Dhar", "state": "Madhya Pradesh"},
    {"name": "Badnawar", "type": "Town", "district": "Dhar", "state": "Madhya Pradesh"},
    {"name": "Manawar", "type": "Town", "district": "Dhar", "state": "Madhya Pradesh"},
    {"name": "Dhamnod", "type": "Town", "district": "Dhar", "state": "Madhya Pradesh"},
    {"name": "Gandhwani", "type": "Town", "district": "Dhar", "state": "Madhya Pradesh"},
    {"name": "Bhopal", "type": "City", "district": "Bhopal", "state": "Madhya Pradesh"},
    {"name": "Ujjain", "type": "City", "district": "Ujjain", "state": "Madhya Pradesh"},
    {"name": "Mahidpur", "type": "Town", "district": "Ujjain", "state": "Madhya Pradesh"},
    {"name": "Nagda", "type": "City", "district": "Ujjain", "state": "Madhya Pradesh"},
    {"name": "Khachrod", "type": "Town", "district": "Ujjain", "state": "Madhya Pradesh"},
    {"name": "Barnagar", "type": "Town", "district": "Ujjain", "state": "Madhya Pradesh"},
    {"name": "Tarana", "type": "Town", "district": "Ujjain", "state": "Madhya Pradesh"},
    {"name": "Gwalior", "type": "City", "district": "Gwalior", "state": "Madhya Pradesh"},
    {"name": "Jabalpur", "type": "City", "district": "Jabalpur", "state": "Madhya Pradesh"},
    {"name": "Ratlam", "type": "City", "district": "Ratlam", "state": "Madhya Pradesh"},
    {"name": "Jaora", "type": "Town", "district": "Ratlam", "state": "Madhya Pradesh"},
    {"name": "Alot", "type": "Town", "district": "Ratlam", "state": "Madhya Pradesh"},
    {"name": "Sailana", "type": "Town", "district": "Ratlam", "state": "Madhya Pradesh"},
    {"name": "Mandsaur", "type": "City", "district": "Mandsaur", "state": "Madhya Pradesh"},
    {"name": "Neemuch", "type": "City", "district": "Neemuch", "state": "Madhya Pradesh"},
    {"name": "Manasa", "type": "Town", "district": "Neemuch", "state": "Madhya Pradesh"},
    {"name": "Jawad", "type": "Town", "district": "Neemuch", "state": "Madhya Pradesh"},
    {"name": "Khargone", "type": "City", "district": "Khargone", "state": "Madhya Pradesh"},
    {"name": "Sanawad", "type": "Town", "district": "Khargone", "state": "Madhya Pradesh"},
    {"name": "Barwaha", "type": "Town", "district": "Khargone", "state": "Madhya Pradesh"},
    {"name": "Sendhwa", "type": "Town", "district": "Barwani", "state": "Madhya Pradesh"},
    {"name": "Barwani", "type": "City", "district": "Barwani", "state": "Madhya Pradesh"},
    {"name": "Bawangaja", "type": "Village", "district": "Barwani", "state": "Madhya Pradesh", "aliases": ["Chulgiri"]},
    {"name": "Khandwa", "type": "City", "district": "Khandwa", "state": "Madhya Pradesh"},
    {"name": "Dewas", "type": "City", "district": "Dewas", "state": "Madhya Pradesh"},
    {"name": "Mhow", "type": "City", "district": "Indore", "state": "Madhya Pradesh", "aliases": ["Dr. Ambedkar Nagar"]},
    {"name": "Sanwer", "type": "Town", "district": "Indore", "state": "Madhya Pradesh"},
    {"name": "Depalpur", "type": "Town", "district": "Indore", "state": "Madhya Pradesh"},
    {"name": "Gautampura", "type": "Town", "district": "Indore", "state": "Madhya Pradesh"},
    {"name": "Sonagiri", "type": "Town", "district": "Datia", "state": "Madhya Pradesh"},
    {"name": "Datia", "type": "City", "district": "Datia", "state": "Madhya Pradesh"},
    {"name": "Sagar", "type": "City", "district": "Sagar", "state": "Madhya Pradesh"},
    {"name": "Satna", "type": "City", "district": "Satna", "state": "Madhya Pradesh"},
    {"name": "Rewa", "type": "City", "district": "Rewa", "state": "Madhya Pradesh"},

    # Gujarat Cities, Towns, Villages
    {"name": "Ahmedabad", "type": "City", "district": "Ahmedabad", "state": "Gujarat", "aliases": ["Amdavad"]},
    {"name": "Surat", "type": "City", "district": "Surat", "state": "Gujarat"},
    {"name": "Vadodara", "type": "City", "district": "Vadodara", "state": "Gujarat", "aliases": ["Baroda"]},
    {"name": "Rajkot", "type": "City", "district": "Rajkot", "state": "Gujarat"},
    {"name": "Bhavnagar", "type": "City", "district": "Bhavnagar", "state": "Gujarat"},
    {"name": "Palitana", "type": "Town", "district": "Bhavnagar", "state": "Gujarat", "aliases": ["Shatrunjaya"]},
    {"name": "Jamnagar", "type": "City", "district": "Jamnagar", "state": "Gujarat"},
    {"name": "Junagadh", "type": "City", "district": "Junagadh", "state": "Gujarat"},
    {"name": "Girnar", "type": "Town", "district": "Junagadh", "state": "Gujarat"},
    {"name": "Mahuva", "type": "Town", "district": "Bhavnagar", "state": "Gujarat"},
    {"name": "Dahod", "type": "City", "district": "Dahod", "state": "Gujarat", "aliases": ["Dohad"]},
    {"name": "Jhalod", "type": "Town", "district": "Dahod", "state": "Gujarat"},
    {"name": "Devgadh Baria", "type": "Town", "district": "Dahod", "state": "Gujarat"},
    {"name": "Dharampur", "type": "Town", "district": "Valsad", "state": "Gujarat"},
    {"name": "Valsad", "type": "City", "district": "Valsad", "state": "Gujarat"},
    {"name": "Vapi", "type": "City", "district": "Valsad", "state": "Gujarat"},
    {"name": "Navsari", "type": "City", "district": "Navsari", "state": "Gujarat"},
    {"name": "Anand", "type": "City", "district": "Anand", "state": "Gujarat"},
    {"name": "Nadiad", "type": "City", "district": "Kheda", "state": "Gujarat"},
    {"name": "Mehsana", "type": "City", "district": "Mehsana", "state": "Gujarat"},
    {"name": "Taranga", "type": "Village", "district": "Mehsana", "state": "Gujarat"},
    {"name": "Patan", "type": "City", "district": "Patan", "state": "Gujarat"},
    {"name": "Sidhpur", "type": "Town", "district": "Patan", "state": "Gujarat"},
    {"name": "Palanpur", "type": "City", "district": "Banaskantha", "state": "Gujarat"},
    {"name": "Deesa", "type": "City", "district": "Banaskantha", "state": "Gujarat"},
    {"name": "Bhuj", "type": "City", "district": "Kutch", "state": "Gujarat"},
    {"name": "Gandhidham", "type": "City", "district": "Kutch", "state": "Gujarat"},
    {"name": "Anjar", "type": "Town", "district": "Kutch", "state": "Gujarat"},
    {"name": "Mandvi", "type": "Town", "district": "Kutch", "state": "Gujarat"},
    {"name": "Dhari", "type": "Town", "district": "Amreli", "state": "Gujarat"},
    {"name": "Amreli", "type": "City", "district": "Amreli", "state": "Gujarat"},

    # Rajasthan Cities, Towns, Villages
    {"name": "Jaipur", "type": "City", "district": "Jaipur", "state": "Rajasthan"},
    {"name": "Jodhpur", "type": "City", "district": "Jodhpur", "state": "Rajasthan"},
    {"name": "Udaipur", "type": "City", "district": "Udaipur", "state": "Rajasthan"},
    {"name": "Kota", "type": "City", "district": "Kota", "state": "Rajasthan"},
    {"name": "Ajmer", "type": "City", "district": "Ajmer", "state": "Rajasthan"},
    {"name": "Bhilwara", "type": "City", "district": "Bhilwara", "state": "Rajasthan"},
    {"name": "Bikaner", "type": "City", "district": "Bikaner", "state": "Rajasthan"},
    {"name": "Alwar", "type": "City", "district": "Alwar", "state": "Rajasthan"},
    {"name": "Sikar", "type": "City", "district": "Sikar", "state": "Rajasthan"},
    {"name": "Pali", "type": "City", "district": "Pali", "state": "Rajasthan"},
    {"name": "Sirohi", "type": "Town", "district": "Sirohi", "state": "Rajasthan"},
    {"name": "Mount Abu", "type": "Town", "district": "Sirohi", "state": "Rajasthan", "aliases": ["Dilwara"]},
    {"name": "Ranakpur", "type": "Village", "district": "Pali", "state": "Rajasthan"},
    {"name": "Sadri", "type": "Town", "district": "Pali", "state": "Rajasthan"},
    {"name": "Bali", "type": "Town", "district": "Pali", "state": "Rajasthan"},
    {"name": "Sumserpur", "type": "Town", "district": "Pali", "state": "Rajasthan"},
    {"name": "Nathdwara", "type": "Town", "district": "Rajsamand", "state": "Rajasthan"},
    {"name": "Kankroli", "type": "Town", "district": "Rajsamand", "state": "Rajasthan"},
    {"name": "Chittorgarh", "type": "City", "district": "Chittorgarh", "state": "Rajasthan"},
    {"name": "Nimbahera", "type": "Town", "district": "Chittorgarh", "state": "Rajasthan"},
    {"name": "Banswara", "type": "City", "district": "Banswara", "state": "Rajasthan"},
    {"name": "Dungarpur", "type": "City", "district": "Dungarpur", "state": "Rajasthan"},
    {"name": "Jalore", "type": "City", "district": "Jalore", "state": "Rajasthan"},
    {"name": "Bhinmal", "type": "Town", "district": "Jalore", "state": "Rajasthan"},
    {"name": "Barmer", "type": "City", "district": "Barmer", "state": "Rajasthan"},
    {"name": "Balotra", "type": "City", "district": "Barmer", "state": "Rajasthan"},
    {"name": "Jaisalmer", "type": "City", "district": "Jaisalmer", "state": "Rajasthan"},
    {"name": "Nagaur", "type": "City", "district": "Nagaur", "state": "Rajasthan"},
    {"name": "Ladnun", "type": "Town", "district": "Nagaur", "state": "Rajasthan"},
    {"name": "Makrana", "type": "City", "district": "Nagaur", "state": "Rajasthan"},

    # Maharashtra Cities, Towns, Villages
    {"name": "Mumbai", "type": "City", "district": "Mumbai", "state": "Maharashtra", "aliases": ["Bombay"]},
    {"name": "Pune", "type": "City", "district": "Pune", "state": "Maharashtra", "aliases": ["Poona"]},
    {"name": "Indapur", "type": "Town", "district": "Pune", "state": "Maharashtra"},
    {"name": "Baramati", "type": "Town", "district": "Pune", "state": "Maharashtra"},
    {"name": "Nagpur", "type": "City", "district": "Nagpur", "state": "Maharashtra"},
    {"name": "Thane", "type": "City", "district": "Thane", "state": "Maharashtra"},
    {"name": "Nashik", "type": "City", "district": "Nashik", "state": "Maharashtra"},
    {"name": "Chhatrapati Sambhajinagar", "type": "City", "district": "Chhatrapati Sambhajinagar", "state": "Maharashtra", "aliases": ["Aurangabad"]},
    {"name": "Solapur", "type": "City", "district": "Solapur", "state": "Maharashtra"},
    {"name": "Kolhapur", "type": "City", "district": "Kolhapur", "state": "Maharashtra"},
    {"name": "Sangli", "type": "City", "district": "Sangli", "state": "Maharashtra"},
    {"name": "Satara", "type": "City", "district": "Satara", "state": "Maharashtra"},
    {"name": "Jalgaon", "type": "City", "district": "Jalgaon", "state": "Maharashtra"},
    {"name": "Dharangaon", "type": "Town", "district": "Jalgaon", "state": "Maharashtra"},
    {"name": "Bhusawal", "type": "City", "district": "Jalgaon", "state": "Maharashtra"},
    {"name": "Dhule", "type": "City", "district": "Dhule", "state": "Maharashtra"},
    {"name": "Nandurbar", "type": "City", "district": "Nandurbar", "state": "Maharashtra"},
    {"name": "Shahada", "type": "Town", "district": "Nandurbar", "state": "Maharashtra"},
    {"name": "Navi Mumbai", "type": "City", "district": "Thane", "state": "Maharashtra"},
    {"name": "Kalyan-Dombivli", "type": "City", "district": "Thane", "state": "Maharashtra"},
    {"name": "Mira-Bhayandar", "type": "City", "district": "Thane", "state": "Maharashtra"},
    {"name": "Vasai-Virar", "type": "City", "district": "Palghar", "state": "Maharashtra"},

    # Karnataka & South Cities, Towns, Villages
    {"name": "Bengaluru", "type": "City", "district": "Bengaluru Urban", "state": "Karnataka", "aliases": ["Bangalore", "Banglore"]},
    {"name": "Indi", "type": "Town", "district": "Vijayapura", "state": "Karnataka"},
    {"name": "Vijayapura", "type": "City", "district": "Vijayapura", "state": "Karnataka", "aliases": ["Bijapur"]},
    {"name": "Shravanabelagola", "type": "Town", "district": "Hassan", "state": "Karnataka", "aliases": ["Sravanabelagola"]},
    {"name": "Hassan", "type": "City", "district": "Hassan", "state": "Karnataka"},
    {"name": "Karkala", "type": "Town", "district": "Udupi", "state": "Karnataka"},
    {"name": "Moodabidri", "type": "Town", "district": "Dakshina Kannada", "state": "Karnataka"},
    {"name": "Dharmasthala", "type": "Town", "district": "Dakshina Kannada", "state": "Karnataka"},
    {"name": "Mangaluru", "type": "City", "district": "Dakshina Kannada", "state": "Karnataka", "aliases": ["Mangalore"]},
    {"name": "Mysuru", "type": "City", "district": "Mysuru", "state": "Karnataka", "aliases": ["Mysore"]},
    {"name": "Hubballi", "type": "City", "district": "Hubballi-Dharwad", "state": "Karnataka", "aliases": ["Hubli"]},
    {"name": "Dharwad", "type": "City", "district": "Hubballi-Dharwad", "state": "Karnataka"},
    {"name": "Belagavi", "type": "City", "district": "Belagavi", "state": "Karnataka", "aliases": ["Belgaum"]},
    {"name": "Kalaburagi", "type": "City", "district": "Kalaburagi", "state": "Karnataka", "aliases": ["Gulbarga"]},

    # North, East, South Metros & Towns
    {"name": "Delhi", "type": "City", "district": "New Delhi", "state": "Delhi"},
    {"name": "New Delhi", "type": "City", "district": "New Delhi", "state": "Delhi"},
    {"name": "Noida", "type": "City", "district": "Gautam Buddha Nagar", "state": "Uttar Pradesh"},
    {"name": "Greater Noida", "type": "City", "district": "Gautam Buddha Nagar", "state": "Uttar Pradesh"},
    {"name": "Ghaziabad", "type": "City", "district": "Ghaziabad", "state": "Uttar Pradesh"},
    {"name": "Gurugram", "type": "City", "district": "Gurugram", "state": "Haryana", "aliases": ["Gurgaon"]},
    {"name": "Faridabad", "type": "City", "district": "Faridabad", "state": "Haryana"},
    {"name": "Chandigarh", "type": "City", "district": "Chandigarh", "state": "Chandigarh"},
    {"name": "Lucknow", "type": "City", "district": "Lucknow", "state": "Uttar Pradesh"},
    {"name": "Kanpur", "type": "City", "district": "Kanpur Nagar", "state": "Uttar Pradesh"},
    {"name": "Varanasi", "type": "City", "district": "Varanasi", "state": "Uttar Pradesh", "aliases": ["Banaras", "Kashi"]},
    {"name": "Agra", "type": "City", "district": "Agra", "state": "Uttar Pradesh"},
    {"name": "Prayagraj", "type": "City", "district": "Prayagraj", "state": "Uttar Pradesh", "aliases": ["Allahabad"]},
    {"name": "Hastinapur", "type": "Town", "district": "Meerut", "state": "Uttar Pradesh"},
    {"name": "Lalitpur", "type": "Town", "district": "Lalitpur", "state": "Uttar Pradesh"},
    {"name": "Rampur", "type": "City", "district": "Rampur", "state": "Uttar Pradesh"},
    {"name": "Maharajganj", "type": "Town", "district": "Maharajganj", "state": "Uttar Pradesh"},
    {"name": "Dharamsala", "type": "City", "district": "Kangra", "state": "Himachal Pradesh", "aliases": ["Dharamshala"]},
    {"name": "Shimla", "type": "City", "district": "Shimla", "state": "Himachal Pradesh"},
    {"name": "Rampur Bushahr", "type": "Town", "district": "Shimla", "state": "Himachal Pradesh"},
    {"name": "Dehradun", "type": "City", "district": "Dehradun", "state": "Uttarakhand"},
    {"name": "Haridwar", "type": "City", "district": "Haridwar", "state": "Uttarakhand"},
    {"name": "Rishikesh", "type": "Town", "district": "Dehradun", "state": "Uttarakhand"},

    # Bihar, Jharkhand, Bengal, NE
    {"name": "Sammed Shikharji", "type": "Town", "district": "Giridih", "state": "Jharkhand", "aliases": ["Shikharji", "Parasnath"]},
    {"name": "Pawapuri", "type": "Town", "district": "Nalanda", "state": "Bihar"},
    {"name": "Patna", "type": "City", "district": "Patna", "state": "Bihar"},
    {"name": "Gaya", "type": "City", "district": "Gaya", "state": "Bihar"},
    {"name": "Rampur", "type": "Town", "district": "Gaya", "state": "Bihar"},
    {"name": "Ranchi", "type": "City", "district": "Ranchi", "state": "Jharkhand"},
    {"name": "Kolkata", "type": "City", "district": "Kolkata", "state": "West Bengal", "aliases": ["Calcutta"]},
    {"name": "Indore", "type": "Village", "district": "Bankura", "state": "West Bengal"},
    {"name": "Guwahati", "type": "City", "district": "Kamrup Metropolitan", "state": "Assam"},

    # Tamil Nadu, Kerala, Telangana, AP
    {"name": "Chennai", "type": "City", "district": "Chennai", "state": "Tamil Nadu", "aliases": ["Madras"]},
    {"name": "Dharmapuri", "type": "City", "district": "Dharmapuri", "state": "Tamil Nadu"},
    {"name": "Coimbatore", "type": "City", "district": "Coimbatore", "state": "Tamil Nadu"},
    {"name": "Madurai", "type": "City", "district": "Madurai", "state": "Tamil Nadu"},
    {"name": "Hyderabad", "type": "City", "district": "Hyderabad", "state": "Telangana"},
    {"name": "Secunderabad", "type": "City", "district": "Hyderabad", "state": "Telangana"},
    {"name": "Warangal", "type": "City", "district": "Warangal", "state": "Telangana"},
    {"name": "Visakhapatnam", "type": "City", "district": "Visakhapatnam", "state": "Andhra Pradesh", "aliases": ["Vizag"]},
    {"name": "Vijayawada", "type": "City", "district": "NTR", "state": "Andhra Pradesh"},
    {"name": "Kochi", "type": "City", "district": "Ernakulam", "state": "Kerala", "aliases": ["Cochin"]},
    {"name": "Thiruvananthapuram", "type": "City", "district": "Thiruvananthapuram", "state": "Kerala", "aliases": ["Trivandrum"]}
]

def format_location_name(name, district, state, loc_type):
    if loc_type in ['State', 'Union Territory']:
        return f"{name}, India"
    elif loc_type == 'District':
        return f"{name} District, {state}"
    elif district and district != name:
        return f"{name}, {district}, {state}"
    else:
        return f"{name}, {state}"

def prepare_all_location_records():
    records = []
    seen = set()

    # 1. Add States & UTs
    for state_name, loc_type in INDIAN_STATES_AND_UTS:
        key = (state_name.lower(), loc_type.lower(), "", state_name.lower())
        if key not in seen:
            seen.add(key)
            records.append({
                "name": state_name,
                "type": loc_type,
                "district": None,
                "state": state_name,
                "country": "India",
                "formatted": f"{state_name}, India",
                "aliases": None
            })

    # 2. Add Districts
    for dist_name, state_name in DISTRICTS:
        key = (dist_name.lower(), "district", dist_name.lower(), state_name.lower())
        if key not in seen:
            seen.add(key)
            records.append({
                "name": dist_name,
                "type": "District",
                "district": dist_name,
                "state": state_name,
                "country": "India",
                "formatted": f"{dist_name} District, {state_name}",
                "aliases": None
            })

    # 3. Add Cities, Towns, Villages
    for item in CITIES_TOWNS_VILLAGES:
        name = item["name"]
        loc_type = item["type"]
        district = item.get("district")
        state = item["state"]
        aliases = item.get("aliases")
        formatted = format_location_name(name, district, state, loc_type)

        key = (name.lower(), loc_type.lower(), (district or "").lower(), state.lower())
        if key not in seen:
            seen.add(key)
            records.append({
                "name": name,
                "type": loc_type,
                "district": district,
                "state": state,
                "country": "India",
                "formatted": formatted,
                "aliases": aliases
            })

    return records

def seed_to_supabase(records):
    print(f"Total locations to insert into Supabase: {len(records)}")
    url = f"{SUPABASE_URL}/rest/v1/locations"
    
    # Insert in batches of 100
    batch_size = 100
    headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }

    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    inserted = 0
    for i in range(0, len(records), batch_size):
        chunk = records[i:i+batch_size]
        data_json = json.dumps(chunk).encode("utf-8")

        req = urllib.request.Request(url, data=data_json, headers=headers, method="POST")
        try:
            with urllib.request.urlopen(req, context=ctx) as response:
                if response.status in [200, 201]:
                    inserted += len(chunk)
                    print(f"Batch {i//batch_size + 1}: Inserted {inserted}/{len(records)} locations...")
        except urllib.error.HTTPError as e:
            print(f"Error inserting batch {i}: {e.read().decode()}")
            sys.exit(1)

    print("✅ All locations successfully inserted into Supabase `locations` table!")

if __name__ == "__main__":
    records = prepare_all_location_records()
    seed_to_supabase(records)
