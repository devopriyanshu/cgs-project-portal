// src/lib/constants/app.constants.ts

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';
export const APP_NAME = import.meta.env.VITE_APP_NAME ?? 'CGS Project Portal';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION ?? '1.0.0';
export const APP_ENV = import.meta.env.VITE_APP_ENV ?? 'development';

export const IS_DEV = APP_ENV === 'development';

export const FEATURE_FLAGS = {
  BATCH_ENROLLMENT:    import.meta.env.VITE_FEATURE_BATCH_ENROLLMENT === 'true',
  SATELLITE_MONITORING: import.meta.env.VITE_FEATURE_SATELLITE_MONITORING === 'true',
  SECONDARY_MARKET:    import.meta.env.VITE_FEATURE_SECONDARY_MARKET === 'true',
} as const;

// File upload limits
export const MAX_FILE_SIZE_MB = 50;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const ACCEPTED_DOCUMENT_TYPES = ['application/pdf', 'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg', 'image/png'] as const;

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10;
export const FARMER_PAGE_SIZE = 20;
export const NOTIFICATION_PAGE_SIZE = 20;

// Pricing
export const CREDIT_PRICE_CONSERVATIVE = 600;  // INR per tonne
export const CREDIT_PRICE_BASE = 850;
export const CREDIT_PRICE_OPTIMISTIC = 1200;

// Onboarding fees (in paise for Razorpay)
export const ONBOARDING_FEE_BUCKET_A = 2500000; // ₹25,000
export const ONBOARDING_FEE_BUCKET_B = 1500000; // ₹15,000
export const ONBOARDING_FEE_BUCKET_C = 1000000; // ₹10,000

// Indian states and UTs
export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
].sort() as string[];

// States with districts for Step2Location dropdowns
export const INDIA_STATES: { name: string; districts: string[] }[] = [
  { name: 'Andhra Pradesh', districts: ['Anantapur','Chittoor','East Godavari','Guntur','Krishna','Kurnool','Prakasam','Srikakulam','Visakhapatnam','Vizianagaram','West Godavari','YSR Kadapa'] },
  { name: 'Bihar', districts: ['Araria','Arwal','Aurangabad','Banka','Begusarai','Bhagalpur','Bhojpur','Buxar','Darbhanga','East Champaran','Gaya','Gopalganj','Jamui','Jehanabad','Kaimur','Katihar','Khagaria','Kishanganj','Lakhisarai','Madhepura','Madhubani','Munger','Muzaffarpur','Nalanda','Nawada','Patna','Purnia','Rohtas','Saharsa','Samastipur','Saran','Sheikhpura','Sheohar','Sitamarhi','Siwan','Supaul','Vaishali','West Champaran'] },
  { name: 'Gujarat', districts: ['Ahmedabad','Amreli','Anand','Aravalli','Banaskantha','Bharuch','Bhavnagar','Botad','Chhota Udaipur','Dahod','Dang','Devbhumi Dwarka','Gandhinagar','Gir Somnath','Jamnagar','Junagadh','Kheda','Kutch','Mahisagar','Mehsana','Morbi','Narmada','Navsari','Panchmahal','Patan','Porbandar','Rajkot','Sabarkantha','Surat','Surendranagar','Tapi','Vadodara','Valsad'] },
  { name: 'Haryana', districts: ['Ambala','Bhiwani','Charkhi Dadri','Faridabad','Fatehabad','Gurugram','Hisar','Jhajjar','Jind','Kaithal','Karnal','Kurukshetra','Mahendragarh','Nuh','Palwal','Panchkula','Panipat','Rewari','Rohtak','Sirsa','Sonipat','Yamunanagar'] },
  { name: 'Karnataka', districts: ['Bagalkot','Ballari','Belagavi','Bengaluru Rural','Bengaluru Urban','Bidar','Chamarajanagara','Chikkaballapura','Chikkamagaluru','Chitradurga','Dakshina Kannada','Davangere','Dharwad','Gadag','Hassan','Haveri','Kalaburagi','Kodagu','Kolar','Koppal','Mandya','Mysuru','Raichur','Ramanagara','Shivamogga','Tumakuru','Udupi','Uttara Kannada','Vijayapura','Yadgir'] },
  { name: 'Madhya Pradesh', districts: ['Agar Malwa','Alirajpur','Anuppur','Ashoknagar','Balaghat','Barwani','Betul','Bhind','Bhopal','Burhanpur','Chhatarpur','Chhindwara','Datia','Dewas','Dhar','Dindori','Guna','Gwalior','Harda','Hoshangabad','Indore','Jabalpur','Jhabua','Katni','Khandwa','Khargone','Mandla','Mandsaur','Morena','Narsinghpur','Neemuch','Panna','Raisen','Rajgarh','Ratlam','Rewa','Sagar','Satna','Sehore','Seoni','Shahdol','Shajapur','Sheopur','Shivpuri','Sidhi','Singrauli','Tikamgarh','Ujjain','Umaria','Vidisha'] },
  { name: 'Maharashtra', districts: ['Ahmednagar','Akola','Amravati','Aurangabad','Beed','Bhandara','Buldhana','Chandrapur','Dhule','Gadchiroli','Gondia','Hingoli','Jalgaon','Jalna','Kolhapur','Latur','Mumbai City','Mumbai Suburban','Nagpur','Nanded','Nandurbar','Nashik','Osmanabad','Palghar','Parbhani','Pune','Raigad','Ratnagiri','Sangli','Satara','Sindhudurg','Solapur','Thane','Wardha','Washim','Yavatmal'] },
  { name: 'Punjab', districts: ['Amritsar','Barnala','Bathinda','Faridkot','Fatehgarh Sahib','Fazilka','Ferozepur','Gurdaspur','Hoshiarpur','Jalandhar','Kapurthala','Ludhiana','Mansa','Moga','Mohali','Muktsar','Nawanshahr','Pathankot','Patiala','Rupnagar','Sangrur','Tarn Taran'] },
  { name: 'Rajasthan', districts: ['Ajmer','Alwar','Banswara','Baran','Barmer','Bharatpur','Bhilwara','Bikaner','Bundi','Chittorgarh','Churu','Dausa','Dholpur','Dungarpur','Hanumangarh','Jaipur','Jaisalmer','Jalore','Jhalawar','Jhunjhunu','Jodhpur','Karauli','Kota','Nagaur','Pali','Pratapgarh','Rajsamand','Sawai Madhopur','Sikar','Sirohi','Sri Ganganagar','Tonk','Udaipur'] },
  { name: 'Tamil Nadu', districts: ['Ariyalur','Chengalpattu','Chennai','Coimbatore','Cuddalore','Dharmapuri','Dindigul','Erode','Kallakurichi','Kancheepuram','Kanyakumari','Karur','Krishnagiri','Madurai','Mayiladuthurai','Nagapattinam','Namakkal','Nilgiris','Perambalur','Pudukkottai','Ramanathapuram','Ranipet','Salem','Sivaganga','Tenkasi','Thanjavur','Theni','Thoothukudi','Tiruchirappalli','Tirunelveli','Tirupathur','Tiruppur','Tiruvallur','Tiruvannamalai','Tiruvarur','Vellore','Viluppuram','Virudhunagar'] },
  { name: 'Telangana', districts: ['Adilabad','Bhadradri Kothagudem','Hyderabad','Jagtial','Jangaon','Jayashankar Bhupalpally','Jogulamba Gadwal','Kamareddy','Karimnagar','Khammam','Komaram Bheem','Mahabubabad','Mahabubnagar','Mancherial','Medak','Medchal-Malkajgiri','Mulugu','Nagarkurnool','Nalgonda','Narayanpet','Nirmal','Nizamabad','Peddapalli','Rajanna Sircilla','Rangareddy','Sangareddy','Siddipet','Suryapet','Vikarabad','Wanaparthy','Warangal Rural','Warangal Urban','Yadadri Bhuvanagiri'] },
  { name: 'Uttar Pradesh', districts: ['Agra','Aligarh','Ambalika','Ambedkar Nagar','Amethi','Amroha','Auraiya','Azamgarh','Baghpat','Bahraich','Ballia','Balrampur','Banda','Barabanki','Bareilly','Basti','Bhadohi','Bijnor','Budaun','Bulandshahr','Chandauli','Chitrakoot','Deoria','Etah','Etawah','Faizabad','Farrukhabad','Fatehpur','Firozabad','Gautam Buddha Nagar','Ghaziabad','Ghazipur','Gonda','Gorakhpur','Hamirpur','Hapur','Hardoi','Hathras','Jalaun','Hamirpur','Jaunpur','Jhansi','Kannauj','Kanpur Dehat','Kanpur Nagar','Kasganj','Kaushambi','Kushinagar','Lakhimpur Kheri','Lalitpur','Lucknow','Maharajganj','Mahoba','Mainpuri','Mathura','Mau','Meerut','Mirzapur','Moradabad','Muzaffarnagar','Pilibhit','Pratapgarh','Prayagraj','Raebareli','Rampur','Saharanpur','Sambhal','Sant Kabir Nagar','Shahjahanpur','Shamli','Shravasti','Siddharthnagar','Sitapur','Sonbhadra','Sultanpur','Unnao','Varanasi'] },
  { name: 'West Bengal', districts: ['Alipurduar','Bankura','Birbhum','Cooch Behar','Dakshin Dinajpur','Darjeeling','Hooghly','Howrah','Jalpaiguri','Jhargram','Kalimpong','Kolkata','Malda','Murshidabad','Nadia','North 24 Parganas','Paschim Bardhaman','Paschim Medinipur','Purba Bardhaman','Purba Medinipur','Purulia','South 24 Parganas','Uttar Dinajpur'] },
  { name: 'Delhi', districts: ['Central Delhi','East Delhi','New Delhi','North Delhi','North East Delhi','North West Delhi','Shahdara','South Delhi','South East Delhi','South West Delhi','West Delhi'] },
].sort((a, b) => a.name.localeCompare(b.name));

export const SDG_GOALS = [
  { id: 1, label: 'No Poverty', icon: '🏘️' },
  { id: 2, label: 'Zero Hunger', icon: '🍚' },
  { id: 3, label: 'Good Health', icon: '💊' },
  { id: 4, label: 'Quality Education', icon: '📚' },
  { id: 5, label: 'Gender Equality', icon: '⚧️' },
  { id: 6, label: 'Clean Water', icon: '💧' },
  { id: 7, label: 'Affordable Energy', icon: '⚡' },
  { id: 8, label: 'Decent Work', icon: '💼' },
  { id: 9, label: 'Industry & Innovation', icon: '🏭' },
  { id: 10, label: 'Reduced Inequalities', icon: '⚖️' },
  { id: 11, label: 'Sustainable Cities', icon: '🏙️' },
  { id: 12, label: 'Responsible Consumption', icon: '♻️' },
  { id: 13, label: 'Climate Action', icon: '🌍' },
  { id: 14, label: 'Life Below Water', icon: '🐠' },
  { id: 15, label: 'Life on Land', icon: '🌳' },
  { id: 16, label: 'Peace & Justice', icon: '🕊️' },
  { id: 17, label: 'Partnerships', icon: '🤝' },
] as const;
