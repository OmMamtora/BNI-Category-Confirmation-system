// BNI Lakshya - Member Import Script
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import serviceAccount from "./serviceAccountKey.json" with { type: "json" };

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

const members = [
  { slNo: 1, name: "Abhinav Rukmangad", businessName: "Swastik Enterprises", profession: "Commercial Washing and Housekeeping Machines", location: "WAKAD", email: "bizwithswastik@gmail.com", mobile: "9766017381", chapter: "BNI Lakshya" },
  { slNo: 2, name: "Abhishek Kale", businessName: "ARK Aesthetic", profession: "Interior Contracting", location: "SHIVAJI NAGAR", email: "arkaesthetic.enquiry@gmail.com", mobile: "7709110332", chapter: "BNI Lakshya" },
  { slNo: 3, name: "Abizer Engineer", businessName: "Precendence Offsets", profession: "Packaging (Ink Printing)", location: "HADAPSAR", email: "abizer.eng@gmail.com", mobile: "9764444610", chapter: "BNI Lakshya" },
  { slNo: 4, name: "Aditya Dugad", businessName: "Aditya Dugad Architects", profession: "Architecture Residential", location: "BIBEWADI", email: "dugadaditya@gmail.com", mobile: "9922161324", chapter: "BNI Lakshya" },
  { slNo: 5, name: "Ajinkya Chaudhary", businessName: "Hishobnis Services Private Limited", profession: "Virtual CFO", location: "KOTHRUD", email: "ajinkya@hishobnis.com", mobile: "9561272064", chapter: "BNI Lakshya" },
  { slNo: 6, name: "Akshay Natekar", businessName: "Akshay Pyramid Mantra", profession: "Vastu Consultant", location: "SHIVAJINAGAR", email: "akshaynatekar@gmail.com", mobile: "9822293618", chapter: "BNI Lakshya" },
  { slNo: 7, name: "Aliasgar Poonawala", businessName: "Blockrise", profession: "Real Estate (Industrial)", location: "NIBM", email: "aliasgarpoonawala572@gmail.com", mobile: "9552179755", chapter: "BNI Lakshya" },
  { slNo: 8, name: "Amit Kothari", businessName: "Labdox Private Limited", profession: "Training - Engineering", location: "NIBM", email: "connect@labdox.com", mobile: "9674624745", chapter: "BNI Lakshya" },
  { slNo: 9, name: "Amit Nahar", businessName: "Universal Stationery Mfg. Co.", profession: "Stationery Manufacturer", location: "JEJURI", email: "amit@2dooarts.com", mobile: "9370039303", chapter: "BNI Lakshya" },
  { slNo: 10, name: "Aniruddha Kulkarni", businessName: "Golden Glez Entertainment", profession: "Videography (Ads Shooting)", location: "KOTHRUD", email: "reach@goldenglez.com", mobile: "8177885278", chapter: "BNI Lakshya" },
  { slNo: 11, name: "Ashish Patil", businessName: "Autzilla Detailing Studio", profession: "Auto/Car Detailing", location: "SHIVAJI NAGAR", email: "ashish.p.89@gmail.com", mobile: "7977235048", chapter: "BNI Lakshya" },
  { slNo: 12, name: "Atharva Raje", businessName: "Argio Private Limited", profession: "EV Charging Manufacturing", location: "SINHGAD ROAD", email: "atharva.argio@gmail.com", mobile: "7083664971", chapter: "BNI Lakshya" },
  { slNo: 13, name: "Azhar Sayyed", businessName: "G. N. Sales Corporation", profession: "Batteries & Invertors UPS", location: "HADAPSAR", email: "azharss99@gmail.com", mobile: "9011061657", chapter: "BNI Lakshya" },
  { slNo: 14, name: "Bhavik Shah", businessName: "Holidaybookie.com", profession: "Travel Agent", location: "KHADKI", email: "bhavik@holidaybookie.com", mobile: "9960689051", chapter: "BNI Lakshya" },
  { slNo: 15, name: "Chaitali Bhalerao", businessName: "Wooditalia by MadEarthlabs Pvt Ltd", profession: "Sofa Manufacturer", location: "Viman Nagar", email: "chaitalisb98@gmail.com", mobile: "8237853036", chapter: "BNI Lakshya" },
  { slNo: 16, name: "Chanakya Wable", businessName: "Wable does weddings", profession: "Photography (Wedding)", location: "DECCAN", email: "chanakyawable@gmail.com", mobile: "7387558859", chapter: "BNI Lakshya" },
  { slNo: 17, name: "Darshan Parmar", businessName: "Modileo Spaces Pvt Ltd", profession: "Modular Furniture Residential", location: "TIMBER MARKET", email: "ccare@modileospaces.com", mobile: "9822624498", chapter: "BNI Lakshya" },
  { slNo: 18, name: "Deep Bendale", businessName: "Marketing Guruz", profession: "Performance Marketing", location: "NARAYAN PETH", email: "deep.bendale@marketingguruz.com", mobile: "9545510508", chapter: "BNI Lakshya" },
  { slNo: 19, name: "Dhruman Shah", businessName: "Shah Insurance and Investments", profession: "General Insurance", location: "TALEGAON", email: "dhrumanshah1991@gmail.com", mobile: "9860022816", chapter: "BNI Lakshya" },
  { slNo: 20, name: "Dr Shailesh Dasari", businessName: "Daily Dental", profession: "Dentist", location: "Aundh", email: "drdasaridentistry@gmail.com", mobile: "8149758656", chapter: "BNI Lakshya" },
  { slNo: 21, name: "Dhaval Mehta", businessName: "Sheeji Computers", profession: "Computer Sales and Service", location: "Rasta Peth", email: "dhaval@shreejicomputersc.co.in", mobile: "9372290504", chapter: "BNI Lakshya" },
  { slNo: 22, name: "Farhaan Eajaz Mulla", businessName: "Inner Space", profession: "Commercial - Modular Furniture", location: "HAPADSAR", email: "info@innerspace.in", mobile: "8657008798", chapter: "BNI Lakshya" },
  { slNo: 23, name: "Hussain Battiwala", businessName: "J K KITCHENS", profession: "Manufacturing (Other)", location: "KHADI MACHINE CHOWK", email: "jkkitchensindia@gmail.com", mobile: "8830231631", chapter: "BNI Lakshya" },
  { slNo: 24, name: "Jatin Kalra", businessName: "Nexus Realttors", profession: "Real Estate Consultant (EAST)", location: "East Pune", email: "jatinkalra88@gmail.com", mobile: "7798788188", chapter: "BNI Lakshya" },
  { slNo: 25, name: "Jatin Kinger", businessName: "Ajantha Enterprises", profession: "Optician", location: "WANOWRIE", email: "jatin.kinger98@gmail.com", mobile: "7972719277", chapter: "BNI Lakshya" },
  { slNo: 26, name: "Jayesh Oswal", businessName: "Crystal Glass House", profession: "Architectural Glass Work", location: "SWARGATE", email: "crystalglasshouse1@gmail.com", mobile: "9028793231", chapter: "BNI Lakshya" },
  { slNo: 27, name: "Jitmanyu Gandhi", businessName: "Western Metal Industries Pvt. Ltd.", profession: "Basic Metals", location: "HADAPSAR", email: "jeet_gandhi@yahoo.com", mobile: "9657135551", chapter: "BNI Lakshya" },
  { slNo: 28, name: "Kevin Monteiro", businessName: "Zaff Décor", profession: "Home Furnishings", location: "NIBM", email: "zaffdecor@gmail.com", mobile: "8888882299", chapter: "BNI Lakshya" },
  { slNo: 29, name: "Machindra Hargude", businessName: "Shree Bhairavnath Packaging", profession: "Packaging", location: "", email: "machindrahargude@yahoo.com", mobile: "9975657167", chapter: "BNI Lakshya" },
  { slNo: 30, name: "Mahendra Rajpurohit", businessName: "Amit Electronics", profession: "White Goods", location: "SADASHIV PETH", email: "amitdistributors12@gmail.com", mobile: "9922412225", chapter: "BNI Lakshya" },
  { slNo: 31, name: "Mahesh Mulik", businessName: "Social Imli Pvt. Ltd.", profession: "Digital Marketing", location: "AUNDH", email: "mahesh@socialimli.com", mobile: "8806082496", chapter: "BNI Lakshya" },
  { slNo: 32, name: "Megha Soni", businessName: "Dhiraj Rathi & Co.", profession: "Accounting Services", location: "SWARGATE", email: "arsclients@gmail.com", mobile: "8888331000", chapter: "BNI Lakshya" },
  { slNo: 33, name: "Milind Morey", businessName: "Optimized Infotech", profession: "SEO", location: "Wakad", email: "milind.morey1983@gmail.com", mobile: "8007122667", chapter: "BNI Lakshya" },
  { slNo: 34, name: "Mohit Mathur", businessName: "M Square Production", profession: "Wedding Planner & Events Production Services", location: "NIBM", email: "mohitmeventplanner2009@gmail.com", mobile: "8384998038", chapter: "BNI Lakshya" },
  { slNo: 35, name: "Naman Mutha", businessName: "PF Products", profession: "Food Products", location: "NARHEGAON", email: "muthanaman000@gmail.com", mobile: "8830384821", chapter: "BNI Lakshya" },
  { slNo: 36, name: "Namrata Mankar", businessName: "Ms Namrata Mankar", profession: "Company Secretary", location: "SINHGAD ROAD", email: "namratamankar@gmail.com", mobile: "7798014778", chapter: "BNI Lakshya" },
  { slNo: 37, name: "Nanasaheb Kunjir", businessName: "Mukta Innovations", profession: "Housekeeping and Cleaning Chemicals", location: "Pashan", email: "nanakunjir@rediffmail.com", mobile: "9049992989", chapter: "BNI Lakshya" },
  { slNo: 38, name: "Nandini Shah", businessName: "Svarasa Bespoke Catering", profession: "Food & Beverage, Caterer", location: "Salisbury Park", email: "svarasabespokecatering@gmail.com", mobile: "9822502323", chapter: "BNI Lakshya" },
  { slNo: 39, name: "Navnath Awhale", businessName: "Swaraj Developers", profession: "Real Estate Developers", location: "SWARGATE", email: "navnath.awhale@gmail.com", mobile: "9011715239", chapter: "BNI Lakshya" },
  { slNo: 40, name: "Neelam Dhanani", businessName: "UPSIMPL", profession: "Advertising & Marketing (UI/UX)", location: "Baner", email: "hi@upsimpl.com", mobile: "9049552244", chapter: "BNI Lakshya" },
  { slNo: 41, name: "Neha Kataria", businessName: "Perpetual Distribution Services LLP", profession: "Finance & Insurance, Wealth Management", location: "MUKUND NAGAR", email: "neha@perpetualwealth.in", mobile: "9764998410", chapter: "BNI Lakshya" },
  { slNo: 42, name: "Nijanand Palankar", businessName: "Mukul Enterprises", profession: "Sign Company", location: "KHADKI", email: "chaitalisb98@gmail.com", mobile: "8698777022", chapter: "BNI Lakshya" },
  { slNo: 43, name: "Nikhil Laddha", businessName: "Kinder Sports", profession: "Sports Goods & Coaching", location: "BANER", email: "nikhil@kindersports.in", mobile: "9623369464", chapter: "BNI Lakshya" },
  { slNo: 44, name: "Nilesh Damle", businessName: "Investeye Financial Solutions", profession: "Life Insurance", location: "NARHE", email: "nileshdamle.2011@yahoo.in", mobile: "9325834714", chapter: "BNI Lakshya" },
  { slNo: 45, name: "Nisha Nayak", businessName: "Progressia Business Advisory Services LLP", profession: "Accounting", location: "Viman Nagar", email: "nishanayak828@gmail.com", mobile: "7987534078", chapter: "BNI Lakshya" },
  { slNo: 46, name: "Nisha Varde", businessName: "The Choco Monk", profession: "Chocolatier", location: "KALYANI NAGAR", email: "varden23@gmail.com", mobile: "8806791485", chapter: "BNI Lakshya" },
  { slNo: 47, name: "Nitin Daga", businessName: "Multi Investments", profession: "Mutual Funds", location: "SHIVAJINAGAR", email: "nitin@multiinv.com", mobile: "9823059122", chapter: "BNI Lakshya" },
  { slNo: 48, name: "Adv. Nitish Chorbele", businessName: "Bansal Chorbele Law Chambers", profession: "Lawyer", location: "SHIVAJINAGAR", email: "mail@bclawchambers.com", mobile: "9422320820", chapter: "BNI Lakshya" },
  { slNo: 49, name: "Pallavi Bhamare", businessName: "Anant Urban Co Operative Credit Society Limited", profession: "Banking", location: "VIMAN NAGAR", email: "pallavimore19@gmail.com", mobile: "7030007373", chapter: "BNI Lakshya" },
  { slNo: 50, name: "Popat Dherenge", businessName: "Pasa Technologies", profession: "Laser Cutting & Sheet Metal Fabrication Work", location: "SHIRUR", email: "pasatech7@gmail.com", mobile: "9922385777", chapter: "BNI Lakshya" },
  { slNo: 51, name: "Prachi Thorat", businessName: "J D Thorat & Chartered Accountant", profession: "CA - Direct Taxes", location: "SHIVAJINAGAR", email: "prachithorat119@gmail.com", mobile: "9766305560", chapter: "BNI Lakshya" },
  { slNo: 52, name: "Prachi Waikar", businessName: "Eurosteel Office Furniture Systems Pvt. Ltd.", profession: "Smart Locker Solutions", location: "LULLANAGAR", email: "girish@fonzel.com", mobile: "9767104321", chapter: "BNI Lakshya" },
  { slNo: 53, name: "Pranay Dhumal", businessName: "D Projects and Solutions", profession: "HVAC Contractor", location: "WARJE", email: "dhumal.pranay3@gmail.com", mobile: "9763806906", chapter: "BNI Lakshya" },
  { slNo: 54, name: "Prashant Satpute", businessName: "Omcons Engineering Pvt Ltd", profession: "Electrical Supplies & Panel Manufacturer", location: "BAVDHAN", email: "prashantsatpute@omconsengg.com", mobile: "9930990543", chapter: "BNI Lakshya" },
  { slNo: 55, name: "Prashant Dabhade", businessName: "Safe Lifts", profession: "Lift Installation & AMC", location: "MANJARI BK", email: "prashantdabhade1313@gmail.com", mobile: "8308693114", chapter: "BNI Lakshya" },
  { slNo: 56, name: "Pravin Ambekar", businessName: "CAR 24", profession: "Rental Cab Services", location: "MARKET YARD / SWARGATE", email: "pravin@carhire24.in", mobile: "7403565656", chapter: "BNI Lakshya" },
  { slNo: 57, name: "Pravin Yadav", businessName: "G2g Consulting & Services", profession: "Financial Consultancy for SMEs", location: "DHANORI", email: "pravin204@yahoo.com", mobile: "8600965160", chapter: "BNI Lakshya" },
  { slNo: 58, name: "Preeti Chandrachud", businessName: "Dnyan Prabodhini", profession: "Non-Profits/Fundraising Organizations", location: "ERANDWANE", email: "preeti1673@gmail.com", mobile: "9823717980", chapter: "BNI Lakshya" },
  { slNo: 59, name: "Ragunath Mhaske", businessName: "Panchsheel", profession: "Security & Investigation, CCTV", location: "DHANORI", email: "contact.panchsheel@gmail.com", mobile: "9049002208", chapter: "BNI Lakshya" },
  { slNo: 60, name: "Rahul Nimbalkar", businessName: "Nimbalkar Construction", profession: "Builder/General Contractor", location: "AMBEGAON", email: "nimbalkarconstruction9@gmail.com", mobile: "9822472699", chapter: "BNI Lakshya" },
  { slNo: 61, name: "Rahul Sirsat", businessName: "Dhaneshwari Electricals & Pump Services", profession: "STP", location: "DHAYARI", email: "pumps.2015@gmail.com", mobile: "9420216170", chapter: "BNI Lakshya" },
  { slNo: 62, name: "Rajesh Bagrecha", businessName: "Scalable Consulting & Soln. Pvt Ltd", profession: "Web Application Development", location: "KOTHRUD", email: "rajesh@scalablesolutions.in", mobile: "8975345245", chapter: "BNI Lakshya" },
  { slNo: 63, name: "Ratin Thakkar", businessName: "My Studio Corporate Gifts", profession: "Corporate Gifting", location: "BANER", email: "huesgifts.pune@gmail.com", mobile: "9923677301", chapter: "BNI Lakshya" },
  { slNo: 64, name: "Roland Pillay", businessName: "Garden of Eden", profession: "Florist", location: "NIBM", email: "roland.pillay84@gmail.com", mobile: "7083318895", chapter: "BNI Lakshya" },
  { slNo: 65, name: "Ruchita Jain", businessName: "Panache Distribution Pvt Ltd", profession: "Perfumes", location: "SWARGATE", email: "ruchitagjain555@gmail.com", mobile: "9922626871", chapter: "BNI Lakshya" },
  { slNo: 66, name: "Sanjay Kulkarni", businessName: "Ecosun Energy Company", profession: "Solar", location: "DHANKAWADI", email: "ecosunenergy@yahoo.com", mobile: "9422089863", chapter: "BNI Lakshya" },
  { slNo: 67, name: "Sanket B Biyani", businessName: "Jalak Jewels", profession: "Jeweller", location: "NARAYAN PETH", email: "sanket@jalakjewels.com", mobile: "9923033300", chapter: "BNI Lakshya" },
  { slNo: 68, name: "Sanket Rathi", businessName: "Adorn Craft Exi", profession: "Wooden Gifting Solution", location: "SINHGAD ROAD", email: "adorncraftexi@gmail.com", mobile: "9404050725", chapter: "BNI Lakshya" },
  { slNo: 69, name: "Satish Belhekar", businessName: "Splendid Facility Mgt. India Pvt. Ltd.", profession: "Housekeeping Services", location: "KOREGAON PARK", email: "satish_belhekar2006@yahoo.co.in", mobile: "8551076767", chapter: "BNI Lakshya" },
  { slNo: 70, name: "Seema Seth", businessName: "Seema Seth Designs", profession: "Home Décor", location: "KHARADI", email: "hello@seemasethdesigns.com", mobile: "9890567318", chapter: "BNI Lakshya" },
  { slNo: 71, name: "Seema Garg", businessName: "The Creative Corner", profession: "Interior Design, Residential", location: "KOREGAON PARK", email: "goel.seema@gmail.com", mobile: "9730495671", chapter: "BNI Lakshya" },
  { slNo: 72, name: "Seetharam Rajamani", businessName: "Ray Enterprises", profession: "Electrical Material Supplier", location: "TALUKA HAVELI", email: "sr_rayenterprises@outlook.com", mobile: "9881403556", chapter: "BNI Lakshya" },
  { slNo: 73, name: "Shailesh Karle", businessName: "Maverick Labs Pvt. Ltd.", profession: "GPS Tracking Solutions", location: "BANER", email: "shailesh@tracko.co.in", mobile: "9096874097", chapter: "BNI Lakshya" },
  { slNo: 74, name: "Shabbir Rangwala", businessName: "Colour Café", profession: "Paints Manufacturer", location: "UNDRI", email: "colour.cafe@yahoo.com", mobile: "9822834352", chapter: "BNI Lakshya" },
  { slNo: 75, name: "Shariq Jaferani", businessName: "Odette Patisserie", profession: "Baker / Cake Shop", location: "SALUNKE VIHAR / KOREGAON PARK", email: "odettepatisserie.pune@gmail.com", mobile: "8407986502", chapter: "BNI Lakshya" },
  { slNo: 76, name: "Shikha Jha", businessName: "Lashkaara", profession: "Clothing (Sarees)", location: "NIBM ROAD", email: "jhashikha48@gmail.com", mobile: "7305568334", chapter: "BNI Lakshya" },
  { slNo: 77, name: "Shubham Borase", businessName: "Udyogo, Pune", profession: "Snacks Vending Machine", location: "Kondhwa", email: "shubham@udyogo.com", mobile: "8956938700", chapter: "BNI Lakshya" },
  { slNo: 78, name: "Shubham Panchbhai", businessName: "Shubham Guruji", profession: "Guruji - Astrology", location: "DHAYARI", email: "shubham.panchbhai03@gmail.com", mobile: "9011584166", chapter: "BNI Lakshya" },
  { slNo: 79, name: "Siddhart Mitra", businessName: "Chaitanya Corporation", profession: "Land Acquisition", location: "", email: "enquiry@chaitanyagroup.info", mobile: "9850825121", chapter: "BNI Lakshya" },
  { slNo: 80, name: "Sopan Ghadge", businessName: "CIVINT Engineering Pvt. Ltd.", profession: "Construction (Industrial)", location: "BAVDHAN", email: "sopan.ghadge@civintengg.com", mobile: "9923003257", chapter: "BNI Lakshya" },
  { slNo: 81, name: "Subodh Bhalerao", businessName: "Sazinga Digital Services Pvt Ltd", profession: "Software Solutions", location: "BANER", email: "subodh@sazingadigital.com", mobile: "9665979976", chapter: "BNI Lakshya" },
  { slNo: 82, name: "Suhas Harshe", businessName: "Suhas Harshe", profession: "Money Coach", location: "KOREGAON PARK", email: "ceo@suhasharshe.com", mobile: "8149180939", chapter: "BNI Lakshya" },
  { slNo: 83, name: "Sukhpalsingh Punjabi", businessName: "Pluto Finance", profession: "Financial - Loans Consultant", location: "ERANDWANE", email: "sukhpalsingh@plutofin.com", mobile: "8149180939", chapter: "BNI Lakshya" },
  { slNo: 84, name: "Sumit Rai", businessName: "EUG Gateway", profession: "Overseas Education", location: "KHARADI", email: "Raisumit007@gmail.com", mobile: "9970180450", chapter: "BNI Lakshya" },
  { slNo: 85, name: "Sunil Kumar", businessName: "Saarth Infosec", profession: "Cyber Security", location: "UNDRI", email: "sunil@saarthinfosec.com", mobile: "7758882655", chapter: "BNI Lakshya" },
  { slNo: 86, name: "Sunny Hapse", businessName: "Saark Exploration, Pune", profession: "Building Management System", location: "NARHE", email: "saarkexploration@gmail.com", mobile: "9423813062", chapter: "BNI Lakshya" },
  { slNo: 87, name: "Suraj Vishwasrao", businessName: "VISHWAS ROADLINES, Pune", profession: "Transport & Shipping", location: "PIMPRI", email: "sales@vishwasroadlines.in", mobile: "9823297969", chapter: "BNI Lakshya" },
  { slNo: 88, name: "Swapnil Anpat", businessName: "Floorkarft", profession: "Tiles and Granite Supplier", location: "BANER", email: "swapnealanpat@gmail.com", mobile: "9890006000", chapter: "BNI Lakshya" },
  { slNo: 89, name: "Tejas Gandhi", businessName: "Mastertej", profession: "Advertising and Marketing (Website Developer)", location: "", email: "connect@mastertej.com", mobile: "9552389123", chapter: "BNI Lakshya" },
  { slNo: 90, name: "Tejaswini Jivrag", businessName: "Fitness Trainer", profession: "Fitness Trainer", location: "KOREGAON PARK", email: "tjivrag@gmail.com", mobile: "7066728254", chapter: "BNI Lakshya" },
  { slNo: 91, name: "Terence Lawrence", businessName: "Terence Properties", profession: "Real Estate Services (WEST)", location: "BANER", email: "terencelawrencem@gmail.com", mobile: "9822081346", chapter: "BNI Lakshya" },
  { slNo: 92, name: "Tejas Shah", businessName: "Deluxe Sales Corporation", profession: "Plumbing Material Supplier", location: "TALEGAON", email: "tej.shah10@gmail.com", mobile: "9673317000", chapter: "BNI Lakshya" },
  { slNo: 93, name: "Tushar Shah", businessName: "Ashok Sales Corporation", profession: "Non Ferrous Metals", location: "", email: "tusharshah@ashoksales.com", mobile: "9764715150", chapter: "BNI Lakshya" },
  { slNo: 94, name: "Ved Mundra", businessName: "Harmony Agencies", profession: "Construction Chemicals", location: "SATARA ROAD", email: "harmonyagencies@gmail.com", mobile: "9890748483", chapter: "BNI Lakshya" },
  { slNo: 95, name: "Veena Jagnade", businessName: "Veena Jagnade", profession: "Commercial - Interior Designer", location: "KOTHRUD", email: "veena.jagnade@gmail.com", mobile: "9923113321", chapter: "BNI Lakshya" },
  { slNo: 96, name: "Vihar Kalaria", businessName: "iARAtech Solutions", profession: "Business Process Outsourcing (BPO)", location: "", email: "vkalaria@iaratechsolutions.com", mobile: "8320426489", chapter: "BNI Lakshya" },
  { slNo: 97, name: "Vijay Avhad", businessName: "Secure Wealth Management Pvt Ltd", profession: "Stock Broker", location: "MANGALWAR PETH", email: "Wealthmanager30@gmail.com", mobile: "9881149279", chapter: "BNI Lakshya" },
  { slNo: 98, name: "Vinay Pawar", businessName: "Bold Marketing", profession: "Corporate Events", location: "KOREGAON PARK", email: "vinay@boldmarketing.in", mobile: "9890778000", chapter: "BNI Lakshya" },
  { slNo: 99, name: "Virang Jain", businessName: "Arihant Plywood", profession: "Plywood and Veneers", location: "TIMBER MARKET", email: "virang.jain2@gmail.com", mobile: "9822552521", chapter: "BNI Lakshya" },
  { slNo: 100, name: "Vishal Bhosale", businessName: "Nexsel Led", profession: "LED Lights Manufacturer", location: "NARHE, AMBEGAON", email: "info@nexsel.tech", mobile: "9730253095", chapter: "BNI Lakshya" },
  { slNo: 101, name: "Yashvant Mehta", businessName: "Wealthone Consultancy", profession: "Subsidy Consultant", location: "KOREGAON PARK", email: "cayashvantmehta@gmail.com", mobile: "9552322344", chapter: "BNI Lakshya" },
  { slNo: 102, name: "Yash Lunavat", businessName: "Bluemark Promotions LLP", profession: "Manufacturing Gifts", location: "HADAPSAR", email: "marketing@bluemark.in", mobile: "8805248400", chapter: "BNI Lakshya" },
  { slNo: 103, name: "Yogesh Kankariya", businessName: "Mahavir Sales Corporation", profession: "Building Material Supplier", location: "HINJEWADI", email: "mahavirdy@gmail.com", mobile: "9823440787", chapter: "BNI Lakshya" },
];

async function importMembers() {
  const collectionRef = db.collection("members");
  const batch = db.batch();
  let count = 0;

  console.log(`Starting import of ${members.length} members...`);

  for (const member of members) {
    const docRef = collectionRef.doc(); // auto-generate ID
    batch.set(docRef, {
      ...member,
      isSubmitted: false,
      createdAt: FieldValue.serverTimestamp(),
    });
    count++;

    // Firestore batch limit is 500 operations
    if (count % 499 === 0) {
      await batch.commit();
      console.log(`Committed ${count} members so far...`);
    }
  }

  await batch.commit();
  console.log(`✅ Successfully imported all ${members.length} members to Firestore!`);
  process.exit(0);
}

importMembers().catch((err) => {
  console.error("❌ Error importing members:", err);
  process.exit(1);
});