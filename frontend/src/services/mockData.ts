import type { Usta, Equipment, Booking, Category, Testimonial, Review } from '../types';

// ==========================================
// KATEGORIYALAR
// ==========================================
export const categories: Category[] = [
  { id: 'santexnik', name: 'Santexnik', icon: 'Droplets', count: 45 },
  { id: 'elektrik', name: 'Elektrik', icon: 'Zap', count: 38 },
  { id: 'quruvchi', name: 'Quruvchi', icon: 'Building2', count: 52 },
  { id: 'boyoqchi', name: "Bo'yoqchi", icon: 'Paintbrush', count: 29 },
  { id: 'mebel', name: 'Mebel ustasi', icon: 'Armchair', count: 34 },
  { id: 'plitkachi', name: 'Plitkachi', icon: 'LayoutGrid', count: 27 },
  { id: 'suvokchi', name: 'Suvokchi', icon: 'PaintBucket', count: 22 },
  { id: 'duradgor', name: 'Duradgor', icon: 'Hammer', count: 19 },
  { id: 'konditsioner', name: 'Konditsioner ustasi', icon: 'Wind', count: 31 },
  { id: 'umumiy', name: 'Umumiy ta\'mirlash', icon: 'Wrench', count: 41 },
];

// ==========================================
// SHAHARLAR
// ==========================================
export const cities: string[] = [
  'Toshkent', 'Samarqand', 'Buxoro', 'Namangan', 'Andijon',
  'Farg\'ona', 'Nukus', 'Qarshi', 'Jizzax', 'Navoiy',
  'Urganch', 'Termiz', 'Guliston',
];

// ==========================================
// USTALAR (10 ta)
// ==========================================
export const mockUstalar: Usta[] = [
  {
    id: 'usta-1',
    name: 'Aziz Karimov',
    email: 'aziz@example.com',
    phone: '+998 90 123 45 67',
    avatarUrl: '',
    role: 'usta_approved',
    registeredAt: '2025-03-15',
    bio: "10 yillik tajribaga ega professional santexnik. Suv tizimlarini o'rnatish, ta'mirlash va texnik xizmat ko'rsatish bo'yicha mutaxassis. Barcha ishlarni sifatli va kafolat bilan bajaraman.",
    city: 'Toshkent',
    district: 'Chilonzor',
    experience: 10,
    skills: ['Suv quvurlari', 'Kanalizatsiya', 'Isitish tizimlari', 'Filtr o\'rnatish'],
    isVerified: true,
    category: 'Santexnik',
    services: [
      { id: 's1-1', name: 'Kran ta\'mirlash', price: 50000, description: 'Har qanday turdagi kranlarni ta\'mirlash', duration: '1-2 soat' },
      { id: 's1-2', name: 'Quvur almashtirish', price: 150000, description: 'Eski quvurlarni yangisiga almashtirish', duration: '3-5 soat' },
      { id: 's1-3', name: 'Unitaz o\'rnatish', price: 200000, description: 'Yangi unitaz o\'rnatish va ulash', duration: '2-3 soat' },
      { id: 's1-4', name: 'Filtr tizimi o\'rnatish', price: 300000, description: 'Suv filtrlash tizimini o\'rnatish', duration: '2-4 soat' },
    ],
    reviews: [],
    rating: 4.8,
    reviewCount: 47,
    completedJobs: 156,
    gallery: [],
  },
  {
    id: 'usta-2',
    name: 'Bobur Rahimov',
    email: 'bobur@example.com',
    phone: '+998 91 234 56 78',
    avatarUrl: '',
    role: 'usta_approved',
    registeredAt: '2025-01-20',
    bio: "Yuqori malakali elektrik mutaxassis. Uy va ofis elektr tarmoqlarini loyihalash, o'rnatish va ta'mirlash. Xavfsizlik standartlariga qat'iy rioya qilaman.",
    city: 'Toshkent',
    district: 'Mirzo Ulug\'bek',
    experience: 8,
    skills: ['Elektr simlar', 'Rozetka va kalitlar', 'Elektr panellari', 'LED yoritish'],
    isVerified: true,
    category: 'Elektrik',
    services: [
      { id: 's2-1', name: 'Rozetka o\'rnatish', price: 30000, description: 'Yangi rozetka yoki kalitni o\'rnatish', duration: '30 min' },
      { id: 's2-2', name: 'Elektr paneli ta\'mirlash', price: 250000, description: 'Elektr taqsimot panelini tekshirish va ta\'mirlash', duration: '2-4 soat' },
      { id: 's2-3', name: 'To\'liq simlarni almashtirish', price: 800000, description: 'Xona yoki kvartira simlarini to\'liq almashtirish', duration: '1-2 kun' },
    ],
    reviews: [],
    rating: 4.9,
    reviewCount: 63,
    completedJobs: 203,
    gallery: [],
  },
  {
    id: 'usta-3',
    name: 'Sardor Toshmatov',
    email: 'sardor@example.com',
    phone: '+998 93 345 67 89',
    avatarUrl: '',
    role: 'usta_approved',
    registeredAt: '2025-05-10',
    bio: "Professional quruvchi — uy qurilishi, ta'mirlash va rekonstruktsiya ishlari bo'yicha 15 yillik tajriba. Har qanday murakkablikdagi loyihalarni o'z vaqtida topshiraman.",
    city: 'Samarqand',
    district: 'Markaz',
    experience: 15,
    skills: ['G\'isht terish', 'Beton ishlari', 'Tom yopish', 'Fundament'],
    isVerified: true,
    category: 'Quruvchi',
    services: [
      { id: 's3-1', name: 'G\'isht terish (1 kv.m)', price: 80000, description: 'Professional g\'isht terish xizmati', duration: '—' },
      { id: 's3-2', name: 'Beton quyish', price: 120000, description: 'Beton tayyorlash va quyish ishlari (1 kub.m)', duration: '—' },
      { id: 's3-3', name: 'Tom yopish (1 kv.m)', price: 100000, description: 'Har qanday turdagi tom yopish ishlari', duration: '—' },
    ],
    reviews: [],
    rating: 4.7,
    reviewCount: 35,
    completedJobs: 89,
    gallery: [],
  },
  {
    id: 'usta-4',
    name: 'Dilshod Aliyev',
    email: 'dilshod@example.com',
    phone: '+998 94 456 78 90',
    avatarUrl: '',
    role: 'usta_approved',
    registeredAt: '2025-02-28',
    bio: "Bo'yoq va dekorativ bezash ustasi. Ichki va tashqi bo'yash, dekorativ shtukaturka, oboylarni yopish bo'yicha mutaxassisman.",
    city: 'Buxoro',
    district: 'Kogon',
    experience: 7,
    skills: ['Ichki bo\'yash', 'Tashqi bo\'yash', 'Dekorativ shtukaturka', 'Oboy yopishtirish'],
    isVerified: true,
    category: "Bo'yoqchi",
    services: [
      { id: 's4-1', name: 'Ichki bo\'yash (1 kv.m)', price: 25000, description: 'Devor va shiftni bo\'yash', duration: '—' },
      { id: 's4-2', name: 'Dekorativ shtukaturka (1 kv.m)', price: 60000, description: 'Zamonaviy dekorativ shtukaturka', duration: '—' },
      { id: 's4-3', name: 'Oboy yopishtirish (1 kv.m)', price: 35000, description: 'Oboylarni professional tarzda yopishtirish', duration: '—' },
    ],
    reviews: [],
    rating: 4.6,
    reviewCount: 28,
    completedJobs: 74,
    gallery: [],
  },
  {
    id: 'usta-5',
    name: 'Jasur Normatov',
    email: 'jasur@example.com',
    phone: '+998 95 567 89 01',
    avatarUrl: '',
    role: 'usta_approved',
    registeredAt: '2025-04-05',
    bio: "Mebel ustasi — buyurtma bo'yicha mebel tayyorlash, eski mebellarni ta'mirlash va qayta tiklash. Yog'och bilan ishlash bo'yicha yuqori mahoratga egaman.",
    city: 'Namangan',
    district: 'Markaz',
    experience: 12,
    skills: ['Buyurtma mebel', 'Oshxona mebeli', 'Shkaf va garderoб', 'Mebel ta\'mirlash'],
    isVerified: true,
    category: 'Mebel ustasi',
    services: [
      { id: 's5-1', name: 'Oshxona mebeli (to\'plam)', price: 3000000, description: 'Buyurtma bo\'yicha oshxona mebeli', duration: '5-10 kun' },
      { id: 's5-2', name: 'Shkaf yasash', price: 1500000, description: 'Individual shkaf yoki garderob', duration: '3-5 kun' },
      { id: 's5-3', name: 'Mebel ta\'mirlash', price: 200000, description: 'Singan yoki eskirgan mebelni ta\'mirlash', duration: '1-2 kun' },
    ],
    reviews: [],
    rating: 4.9,
    reviewCount: 52,
    completedJobs: 167,
    gallery: [],
  },
  {
    id: 'usta-6',
    name: 'Otabek Xasanov',
    email: 'otabek@example.com',
    phone: '+998 97 678 90 12',
    avatarUrl: '',
    role: 'usta_approved',
    registeredAt: '2025-06-01',
    bio: "Professional plitkachi — hammom, oshxona va boshqa joylar uchun plitka yotqizish. Zamonaviy dizayn va yuqori sifat kafolatlanadi.",
    city: 'Toshkent',
    district: 'Yakkasaroy',
    experience: 9,
    skills: ['Pol plitka', 'Devor plitka', 'Mozaika', 'Granit va marmar'],
    isVerified: true,
    category: 'Plitkachi',
    services: [
      { id: 's6-1', name: 'Pol plitka yotqizish (1 kv.m)', price: 70000, description: 'Professional plitka yotqizish', duration: '—' },
      { id: 's6-2', name: 'Devor plitka (1 kv.m)', price: 65000, description: 'Devorga plitka o\'rnatish', duration: '—' },
      { id: 's6-3', name: 'Mozaika ishlari (1 kv.m)', price: 120000, description: 'Dekorativ mozaika yotqizish', duration: '—' },
    ],
    reviews: [],
    rating: 4.5,
    reviewCount: 19,
    completedJobs: 53,
    gallery: [],
  },
  {
    id: 'usta-7',
    name: 'Sherzod Mirzayev',
    email: 'sherzod@example.com',
    phone: '+998 90 789 01 23',
    avatarUrl: '',
    role: 'usta_approved',
    registeredAt: '2025-03-22',
    bio: "Suvokchi — ichki va tashqi suvash ishlari, gips-karton bilan ishlash. Tekis yuzalar va zamonaviy pardozlash usullarida tajribali.",
    city: 'Farg\'ona',
    district: 'Markaz',
    experience: 11,
    skills: ['Suvash', 'Gips-karton', 'Shift montaji', 'Dekorativ pardoz'],
    isVerified: true,
    category: 'Suvokchi',
    services: [
      { id: 's7-1', name: 'Suvash ishlari (1 kv.m)', price: 35000, description: 'Devor va shiftni suvash', duration: '—' },
      { id: 's7-2', name: 'Gips-karton o\'rnatish (1 kv.m)', price: 55000, description: 'Gips-karton devor yoki shift', duration: '—' },
      { id: 's7-3', name: 'Dekorativ shift (1 kv.m)', price: 80000, description: 'Ko\'p darajali dekorativ shift', duration: '—' },
    ],
    reviews: [],
    rating: 4.7,
    reviewCount: 31,
    completedJobs: 98,
    gallery: [],
  },
  {
    id: 'usta-8',
    name: 'Ulug\'bek Ismoilov',
    email: 'ulugbek@example.com',
    phone: '+998 91 890 12 34',
    avatarUrl: '',
    role: 'usta_approved',
    registeredAt: '2025-07-12',
    bio: "Duradgor ustasi — eshik va deraza o'rnatish, yog'och konstruktsiyalar yasash. Tajribali va ishonchli mutaxassis.",
    city: 'Andijon',
    district: 'Markaz',
    experience: 6,
    skills: ['Eshik o\'rnatish', 'Deraza montaji', 'Yog\'och zinapoya', 'Yog\'och pardoz'],
    isVerified: false,
    category: 'Duradgor',
    services: [
      { id: 's8-1', name: 'Eshik o\'rnatish', price: 250000, description: 'Ichki yoki tashqi eshik o\'rnatish', duration: '2-4 soat' },
      { id: 's8-2', name: 'Deraza o\'rnatish', price: 350000, description: 'Plastik yoki yog\'och deraza montaji', duration: '3-5 soat' },
      { id: 's8-3', name: 'Yog\'och zinapoya', price: 2000000, description: 'Buyurtma bo\'yicha yog\'och zinapoya', duration: '3-7 kun' },
    ],
    reviews: [],
    rating: 4.4,
    reviewCount: 14,
    completedJobs: 38,
    gallery: [],
  },
  {
    id: 'usta-9',
    name: 'Farrux Abdullayev',
    email: 'farrux@example.com',
    phone: '+998 93 901 23 45',
    avatarUrl: '',
    role: 'usta_approved',
    registeredAt: '2025-02-10',
    bio: "Konditsioner ustasi — barcha turdagi konditsionerlarni o'rnatish, tozalash va ta'mirlash. Tez va sifatli xizmat, kafolat bilan.",
    city: 'Toshkent',
    district: 'Sergeli',
    experience: 5,
    skills: ['Konditsioner o\'rnatish', 'Freon to\'ldirish', 'Tozalash va texnik xizmat', 'Ta\'mirlash'],
    isVerified: true,
    category: 'Konditsioner ustasi',
    services: [
      { id: 's9-1', name: 'Konditsioner o\'rnatish', price: 400000, description: 'Yangi konditsionerni professional o\'rnatish', duration: '2-4 soat' },
      { id: 's9-2', name: 'Tozalash va texnik xizmat', price: 150000, description: 'Konditsionerni tozalash va tekshirish', duration: '1-2 soat' },
      { id: 's9-3', name: 'Freon to\'ldirish', price: 200000, description: 'Sovutish gazi to\'ldirish', duration: '1 soat' },
    ],
    reviews: [],
    rating: 4.8,
    reviewCount: 42,
    completedJobs: 134,
    gallery: [],
  },
  {
    id: 'usta-10',
    name: 'Nodir Sobirov',
    email: 'nodir@example.com',
    phone: '+998 94 012 34 56',
    avatarUrl: '',
    role: 'usta_approved',
    registeredAt: '2025-04-18',
    bio: "Umumiy ta'mirlash ustasi — kvartira va uy ta'mirlash ishlari bo'yicha keng tajribaga ega. Kichik ta'mirlashdan to kapital remontgacha — barchasi bir joyda.",
    city: 'Qarshi',
    district: 'Markaz',
    experience: 13,
    skills: ['Kvartira ta\'mirlash', 'Kapital remont', 'Hammom ta\'mirlash', 'Oshxona ta\'mirlash'],
    isVerified: true,
    category: 'Umumiy ta\'mirlash',
    services: [
      { id: 's10-1', name: 'Kvartira ta\'mirlash (1 kv.m)', price: 250000, description: 'Kompleks kvartira ta\'mirlash', duration: '—' },
      { id: 's10-2', name: 'Hammom ta\'mirlash', price: 5000000, description: 'Hammomni to\'liq ta\'mirlash (o\'rtacha)', duration: '7-14 kun' },
      { id: 's10-3', name: 'Kichik ta\'mirlash ishlari', price: 100000, description: 'Mayda ta\'mirlash va tuzatish ishlari', duration: '1-3 soat' },
    ],
    reviews: [],
    rating: 4.6,
    reviewCount: 37,
    completedJobs: 112,
    gallery: [],
  },
];

// ==========================================
// SHARHLAR (Reviews)
// ==========================================
export const mockReviews: Review[] = [
  { id: 'r1', ustaId: 'usta-1', clientId: 'c1', clientName: 'Malika Rashidova', rating: 5, comment: 'Juda ajoyib usta! Kran muammosini 30 daqiqada hal qildi. Tavsiya qilaman!', date: '2025-11-15' },
  { id: 'r2', ustaId: 'usta-1', clientId: 'c2', clientName: 'Sanjar Yusupov', rating: 5, comment: 'Professional va toza ish. Quvurlarni almashtirib berdi, hammasi zo\'r ishlayapti.', date: '2025-10-22' },
  { id: 'r3', ustaId: 'usta-1', clientId: 'c3', clientName: 'Nodira Karimova', rating: 4, comment: 'Yaxshi ish, lekin biroz kechikib keldi. Ammo ish sifati yuqori.', date: '2025-09-08' },
  { id: 'r4', ustaId: 'usta-2', clientId: 'c1', clientName: 'Alisher Navoiy', rating: 5, comment: 'Elektr panelini to\'liq tekshirib, xavfsiz qilib berdi. Raxmat!', date: '2025-12-01' },
  { id: 'r5', ustaId: 'usta-2', clientId: 'c4', clientName: 'Zulfiya Murodova', rating: 5, comment: 'Butun uyning elektr simlarini almashtirib berdi. Juda puxta ish.', date: '2025-11-20' },
  { id: 'r6', ustaId: 'usta-3', clientId: 'c2', clientName: 'Temur Baxtiyorov', rating: 5, comment: 'Uyimizning tomini juda chiroyli yopib berdi. Professional usta!', date: '2025-10-10' },
  { id: 'r7', ustaId: 'usta-3', clientId: 'c5', clientName: 'Gulnora Ismoilova', rating: 4, comment: 'G\'isht terish ishlarini sifatli bajardi. Narxi ham maqul.', date: '2025-09-15' },
  { id: 'r8', ustaId: 'usta-4', clientId: 'c3', clientName: 'Rustam Qodirov', rating: 5, comment: 'Devorlarni dekorativ shtukaturka bilan bezab berdi. Juda chiroyli chiqdi!', date: '2025-11-05' },
  { id: 'r9', ustaId: 'usta-5', clientId: 'c1', clientName: 'Shahlo Rahimova', rating: 5, comment: 'Oshxona mebelini buyurtma qildik — ajoyib sifat! Dizayni ham zamonaviy.', date: '2025-12-10' },
  { id: 'r10', ustaId: 'usta-5', clientId: 'c4', clientName: 'Bekzod Tursunov', rating: 5, comment: 'Shkaf yasab berdi — juda puxta va chiroyli. Tavsiya qilaman!', date: '2025-11-28' },
  { id: 'r11', ustaId: 'usta-6', clientId: 'c2', clientName: 'Dildora Xasanova', rating: 4, comment: 'Hammomga plitka yotqizib berdi. Yaxshi ish, lekin bir-ikki joyda choklar teng emas.', date: '2025-10-18' },
  { id: 'r12', ustaId: 'usta-7', clientId: 'c5', clientName: 'Kamol Mirzo', rating: 5, comment: 'Gips-karton shiftni juda chiroyli qilib berdi. Vaqtida topshirdi.', date: '2025-11-12' },
  { id: 'r13', ustaId: 'usta-9', clientId: 'c1', clientName: 'Ozoda Sultonova', rating: 5, comment: 'Konditsionerni tez va sifatli o\'rnatib berdi. Professional yondashuv!', date: '2025-12-05' },
  { id: 'r14', ustaId: 'usta-9', clientId: 'c3', clientName: 'Baxtiyor Ergashev', rating: 4, comment: 'Tozalash xizmatidan foydalandim. Yaxshi ishladi, tavsiya qilaman.', date: '2025-11-25' },
  { id: 'r15', ustaId: 'usta-10', clientId: 'c2', clientName: 'Nargiza Umarova', rating: 5, comment: 'Kvartira ta\'mirlashni to\'liq ishonib topshirdik. Natija ajoyib chiqdi!', date: '2025-10-30' },
  { id: 'r16', ustaId: 'usta-10', clientId: 'c4', clientName: 'Xurshid Toshev', rating: 4, comment: 'Hammom ta\'mirlash ishlarini yaxshi bajardi. Biroz qimmatroq, lekin sifatli.', date: '2025-09-20' },
];

// Har bir ustaga tegishli sharhlarni biriktirish
mockUstalar.forEach(usta => {
  usta.reviews = mockReviews.filter(r => r.ustaId === usta.id);
});

// ==========================================
// TEXNIKALAR (Equipments) — 6 ta
// ==========================================
export const mockEquipment: Equipment[] = [
  {
    id: 'eq-1',
    ownerId: 'usta-3',
    ownerName: 'Sardor Toshmatov',
    ownerRating: 4.7,
    name: 'Mini ekskavator JCB 8026',
    category: 'Qazish texnikasi',
    description: 'Kichik qurilish maydonchalari uchun ideal mini ekskavator. Tor joylarda ishlash uchun qulay, yoqilg\'i sarfi past.',
    specs: { 'Og\'irligi': '2,650 kg', 'Qazish chuqurligi': '2.97 m', 'Dvigatel': 'Perkins 403J-11', 'Yoqilg\'i sig\'imi': '34 litr' },
    dailyPrice: 800000,
    weeklyPrice: 4500000,
    city: 'Toshkent',
    district: 'Olmaliq',
    images: [],
    available: true,
    createdAt: '2025-08-15',
  },
  {
    id: 'eq-2',
    ownerId: 'usta-3',
    ownerName: 'Sardor Toshmatov',
    ownerRating: 4.7,
    name: 'Beton aralashtirgich (500 litr)',
    category: 'Beton uskunalari',
    description: 'Yuqori samarali beton aralashtirgich — qurilish maydonchalari uchun. Tez va sifatli beton tayyorlash imkonini beradi.',
    specs: { 'Sig\'imi': '500 litr', 'Quvvati': '2.2 kVt', 'Og\'irligi': '185 kg', 'Elektr manba': '380V' },
    dailyPrice: 250000,
    weeklyPrice: 1400000,
    city: 'Samarqand',
    images: [],
    available: true,
    createdAt: '2025-09-01',
  },
  {
    id: 'eq-3',
    ownerId: 'usta-10',
    ownerName: 'Nodir Sobirov',
    ownerRating: 4.6,
    name: 'Avtopodemnik (avtovishka) 18m',
    category: 'Ko\'tarish texnikasi',
    description: 'Balandlikda ishlash uchun avtopodemnik. Tashqi pardozlash, reklama montaji va fasad ishlari uchun ideal.',
    specs: { 'Ko\'tarish balandligi': '18 m', 'Yuk ko\'tarish': '200 kg', 'Platforma': '1.5 x 0.7 m', 'Turi': 'Teleskopik' },
    dailyPrice: 1200000,
    weeklyPrice: 7000000,
    city: 'Toshkent',
    district: 'Yakkasaroy',
    images: [],
    available: true,
    createdAt: '2025-07-20',
  },
  {
    id: 'eq-4',
    ownerId: 'usta-2',
    ownerName: 'Bobur Rahimov',
    ownerRating: 4.9,
    name: 'Dizel generator 50 kVt',
    category: 'Energetik uskunalar',
    description: 'Ishonchli dizel generator — qurilish maydonchalari va tadbirlar uchun doimiy elektr ta\'minoti.',
    specs: { 'Quvvati': '50 kVt', 'Yoqilg\'i turi': 'Dizel', 'Yoqilg\'i sarfi': '12 l/soat', 'Og\'irligi': '780 kg' },
    dailyPrice: 600000,
    weeklyPrice: 3500000,
    city: 'Toshkent',
    district: 'Mirzo Ulug\'bek',
    images: [],
    available: true,
    createdAt: '2025-10-05',
  },
  {
    id: 'eq-5',
    ownerId: 'usta-1',
    ownerName: 'Aziz Karimov',
    ownerRating: 4.8,
    name: 'Shtrobarez (devor kesish)',
    category: 'Qurilish asboblari',
    description: 'Professional shtrobarez — devorga ariq ochish uchun. Elektr simlar va quvurlar uchun toza va tekis ariqlar.',
    specs: { 'Quvvati': '2400 Vt', 'Disklar soni': '2 ta', 'Kesish chuqurligi': '45 mm', 'Disk o\'lchami': '150 mm' },
    dailyPrice: 150000,
    weeklyPrice: 800000,
    city: 'Toshkent',
    district: 'Chilonzor',
    images: [],
    available: true,
    createdAt: '2025-11-12',
  },
  {
    id: 'eq-6',
    ownerId: 'usta-8',
    ownerName: 'Ulug\'bek Ismoilov',
    ownerRating: 4.4,
    name: 'Svarka apparati (invertor)',
    category: 'Payvandlash uskunalari',
    description: 'Professional invertor svarka apparati — metall konstruktsiyalar, trubalar va boshqa payvandlash ishlari uchun.',
    specs: { 'Svarka toki': '20-250 A', 'Tarmoq kuchlanishi': '220V', 'KPI': '60%', 'Og\'irligi': '5.2 kg' },
    dailyPrice: 100000,
    weeklyPrice: 550000,
    city: 'Andijon',
    images: [],
    available: true,
    createdAt: '2025-10-28',
  },
];

// ==========================================
// BOOKINGLAR (namuna)
// ==========================================
export const mockBookings: Booking[] = [
  {
    id: 'b1',
    clientId: 'client-1',
    clientName: 'Malika Rashidova',
    ustaId: 'usta-1',
    ustaName: 'Aziz Karimov',
    serviceType: 'Kran ta\'mirlash',
    date: '2026-01-15',
    time: '10:00',
    address: 'Toshkent, Chilonzor 7-kvartal, 14-uy',
    notes: 'Oshxonadagi kran oqyapti, tezroq kelib bering',
    status: 'completed',
    totalPrice: 50000,
    createdAt: '2026-01-10',
  },
  {
    id: 'b2',
    clientId: 'client-1',
    clientName: 'Malika Rashidova',
    ustaId: 'usta-2',
    ustaName: 'Bobur Rahimov',
    serviceType: 'Rozetka o\'rnatish',
    date: '2026-02-20',
    time: '14:00',
    address: 'Toshkent, Mirzo Ulug\'bek tumani, Bog\'ishamol ko\'chasi',
    status: 'confirmed',
    totalPrice: 30000,
    createdAt: '2026-02-18',
  },
  {
    id: 'b3',
    clientId: 'client-2',
    clientName: 'Sanjar Yusupov',
    ustaId: 'usta-5',
    ustaName: 'Jasur Normatov',
    serviceType: 'Oshxona mebeli (to\'plam)',
    date: '2026-03-01',
    time: '09:00',
    address: 'Namangan, Markaz tumani, Navbahor ko\'chasi 45',
    notes: 'Oshxona o\'lchami 3x4 metr, modern dizayn',
    status: 'pending',
    totalPrice: 3000000,
    createdAt: '2026-02-25',
  },
  {
    id: 'b4',
    clientId: 'client-3',
    clientName: 'Nodira Karimova',
    ustaId: 'usta-9',
    ustaName: 'Farrux Abdullayev',
    serviceType: 'Konditsioner o\'rnatish',
    date: '2026-04-10',
    time: '11:00',
    address: 'Toshkent, Sergeli tumani, 5-mavze',
    status: 'confirmed',
    totalPrice: 400000,
    createdAt: '2026-04-05',
  },
  {
    id: 'b5',
    clientId: 'client-2',
    clientName: 'Sanjar Yusupov',
    ustaId: 'usta-10',
    ustaName: 'Nodir Sobirov',
    serviceType: 'Kvartira ta\'mirlash (1 kv.m)',
    date: '2026-05-15',
    time: '08:00',
    address: 'Qarshi, Markaz tumani, Mustaqillik ko\'chasi 12',
    notes: 'Ikki xonali kvartira, 65 kv.m',
    status: 'pending',
    totalPrice: 16250000,
    createdAt: '2026-05-10',
  },
];

// ==========================================
// TESTIMONIALLAR (Landing page uchun)
// ==========================================
export const mockTestimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Dilnoza Alimova',
    rating: 5,
    comment: 'UstaFind orqali uyimiz uchun ajoyib santexnik topdik. Platforma juda qulay va tushunarliy. Endi har doim shu yerdan qidiraman!',
    role: 'Mijoz',
  },
  {
    id: 't2',
    name: 'Baxrom Toshpulatov',
    rating: 5,
    comment: 'Men mebel ustasi sifatida ro\'yxatdan o\'tdim va bir oy ichida 5 ta buyurtma oldim. UstaFind usta va mijozlarni bog\'lashda zo\'r platforma!',
    role: 'Usta',
  },
  {
    id: 't3',
    name: 'Sevara Mahmudova',
    rating: 4,
    comment: 'Kvartira ta\'mirlash uchun usta qidirdim — reyting va sharhlar orqali eng yaxshisini tanladim. Natija ajoyib! Tavsiya qilaman.',
    role: 'Mijoz',
  },
];

// ==========================================
// ADMIN EMAIL
// ==========================================
export const ADMIN_EMAILS = ['admin@ustafind.uz'];

// ==========================================
// MOCK TEXNIKA ARENDASI
// ==========================================
export const mockEquipmentRentals = [
  {
    id: 'er1',
    equipmentId: 'eq-1',
    equipmentName: 'Mini ekskavator JCB 8026',
    renterId: 'client-1',
    renterName: 'Malika Rashidova',
    ownerId: 'usta-3',
    startDate: '2026-03-01',
    endDate: '2026-03-05',
    totalPrice: 4000000,
    status: 'completed' as const,
    createdAt: '2026-02-28',
  },
];

// ==========================================
// HELPER FUNCTIONS
// ==========================================

export function getUstaById(id: string): Usta | undefined {
  return mockUstalar.find(u => u.id === id);
}

export function getEquipmentById(id: string): Equipment | undefined {
  return mockEquipment.find(e => e.id === id);
}

export function getUstalarByCategory(category: string): Usta[] {
  return mockUstalar.filter(u => u.category === category);
}

export function getReviewsByUstaId(ustaId: string): Review[] {
  return mockReviews.filter(r => r.ustaId === ustaId);
}

export function searchUstalar(query: string): Usta[] {
  const q = query.toLowerCase();
  return mockUstalar.filter(u =>
    u.name.toLowerCase().includes(q) ||
    u.category.toLowerCase().includes(q) ||
    u.city?.toLowerCase().includes(q) ||
    u.skills?.some(s => s.toLowerCase().includes(q))
  );
}

export function searchEquipment(query: string): Equipment[] {
  const q = query.toLowerCase();
  return mockEquipment.filter(e =>
    e.name.toLowerCase().includes(q) ||
    e.category.toLowerCase().includes(q) ||
    e.city.toLowerCase().includes(q)
  );
}

export function formatPrice(price: number): string {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' so\'m';
}
