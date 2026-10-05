import { DentalService, ClinicConfig, FAQItem, VerifiedReview, AppointmentRequest } from '../types';

export const INITIAL_SERVICES: DentalService[] = [
  {
    id: 'general-dentistry',
    name: 'General Dental Check-Up',
    category: 'preventive',
    shortDesc: 'Friendly full check-up to see how your teeth and gums are doing and catch small problems early.',
    fullDesc: 'The dentist gently checks every tooth and looks at your gums. If needed, we take a quick and safe digital picture of your teeth. We talk with you in simple words about how to keep your smile healthy and cavity-free.',
    durationMinutes: 30,
    iconName: 'Stethoscope',
    benefits: ['Catches small cavities early', 'Gentle check with zero pain', 'Helpful brushing tips', 'Safe, quick digital tooth pictures'],
    recommendedFor: 'Regular 6-month check-ups or whenever a tooth feels funny.'
  },
  {
    id: 'dental-cleaning',
    name: 'Teeth Cleaning & Washing',
    category: 'preventive',
    shortDesc: 'Gentle water wash to remove yellow dirt, tea stains, and give you super fresh breath.',
    fullDesc: 'Brushing every day at home cannot reach every hidden corner. We use gentle water spray and soft cleaning tools to wash away hardened food dirt and yellow stains, leaving your teeth smooth, shiny, and clean.',
    durationMinutes: 45,
    iconName: 'Sparkles',
    benefits: ['Washes away tough yellow dirt', 'Stops bleeding gums', 'Gives fresh, clean breath', 'Makes teeth smooth and shiny'],
    recommendedFor: 'Anyone with yellow stains, bad breath, or due for their 6-month cleaning.'
  },
  {
    id: 'teeth-whitening',
    name: 'Teeth Brightening & Whitening',
    category: 'cosmetic',
    shortDesc: 'Safe clinic treatment to gently lift yellow stains for a brighter, happier smile.',
    fullDesc: 'Safe treatment that helps brighten teeth that have turned yellowish from food, tea, or age. It is gentle on your teeth and makes your smile look shiny, bright, and clean.',
    durationMinutes: 60,
    iconName: 'Smile',
    benefits: ['Noticeably brighter teeth', 'Safe for tooth enamel', 'Protects your gums', 'Natural, happy smile'],
    recommendedFor: 'Getting ready for family functions, festivals, or removing yellow stains.'
  },
  {
    id: 'dental-fillings',
    name: 'Tooth-Colored Fillings',
    category: 'restorative',
    shortDesc: 'Fix cavities and holes with natural white fillings so your tooth looks good as new.',
    fullDesc: 'When germs make a tiny hole (cavity) in your tooth, we gently clean out the bad spot and fill it with a strong white material that matches your real tooth color. No metal, no dark spots, and you can chew food normally again.',
    durationMinutes: 45,
    iconName: 'ShieldCheck',
    benefits: ['Matches your real tooth color', 'Stops the cavity from growing', 'Chew food with zero discomfort', '100% metal-free and safe'],
    recommendedFor: 'Food getting stuck in teeth, black spots, or small holes.'
  },
  {
    id: 'root-canal-treatment',
    name: 'Toothache Relief (Root Canal)',
    category: 'restorative',
    shortDesc: 'Gentle treatment to stop bad toothaches and save your real tooth from being pulled out.',
    fullDesc: 'When germs reach deep inside a tooth and cause sharp or throbbing pain, this gentle treatment clears out the bad germs and seals the tooth inside. We use gentle numbing medicine so you do not feel pain, and you get to keep your real tooth.',
    durationMinutes: 60,
    iconName: 'Activity',
    benefits: ['Stops sharp toothache quickly', 'Saves your natural tooth', 'Done with gentle numbing', 'Quick healing in 1 or 2 visits'],
    recommendedFor: 'Continuous toothache, pain while chewing food, or pain from cold/hot drinks.'
  },
  {
    id: 'dental-crowns-bridges',
    name: 'Tooth Caps & Bridges',
    category: 'restorative',
    shortDesc: 'Strong custom caps to protect weak teeth or fill empty gaps where teeth are missing.',
    fullDesc: 'A tooth cap (crown) is like a strong protective helmet custom-made to fit over a weak or broken tooth so you can bite food without worry. A bridge fills in empty spaces where teeth were lost so your smile looks full and natural.',
    durationMinutes: 45,
    iconName: 'Crown',
    benefits: ['Super strong and long-lasting', 'Matches your natural tooth shade', 'Protects weak teeth from breaking', 'Bite and chew food easily'],
    recommendedFor: 'Broken teeth, teeth after root canal, or filling gaps between teeth.'
  },
  {
    id: 'tooth-extraction',
    name: 'Gentle Tooth Removal',
    category: 'specialized',
    shortDesc: 'Gentle removal of badly broken teeth or painful wisdom teeth with no pain.',
    fullDesc: 'Sometimes a tooth is too broken to fix, or a back wisdom tooth is stuck and causing swelling. We gently numb the area first with medicine so you feel comfortable, and the dentist gently takes the tooth out.',
    durationMinutes: 45,
    iconName: 'Syringe',
    benefits: ['Gentle numbing with zero pain', 'Relieves swelling and jaw pain', 'Fast healing with clear care tips', 'Kind and caring dentist'],
    recommendedFor: 'Painful wisdom teeth or teeth that cannot be repaired.'
  },
  {
    id: 'preventive-dental-care',
    name: 'Cavity Protection for Kids & Family',
    category: 'preventive',
    shortDesc: 'Protective tooth shields and tooth vitamins that stop cavities before they start.',
    fullDesc: 'Stopping cavities is much easier than fixing them! We paint an invisible protective shield over the deep grooves of teeth and apply tooth-strengthening vitamins (fluoride) so germs cannot make holes in your teeth.',
    durationMinutes: 30,
    iconName: 'HeartPulse',
    benefits: ['Stops cavities before they start', 'Painless painted shield on teeth', 'Great for kids and teenagers', 'Night guards to stop tooth grinding'],
    recommendedFor: 'Children, teenagers, and anyone who wants to stay free of cavities.'
  }
];

export const INITIAL_CLINIC_CONFIG: ClinicConfig = {
  clinicName: 'Just Smile Dental Clinic',
  tagline: 'Modern, comfortable and friendly dental care for you and your family.',
  locationArea: 'Girinagar, Bengaluru',
  city: 'Bengaluru',
  state: 'Karnataka',
  pincode: '560085',
  landmark: 'Near Narayana PU College',
  fullAddress: '#42, 50 Feet Main Road, 1st Phase, Near Narayana PU College, Girinagar, Bengaluru, Karnataka 560085',
  primaryPhone: '+91 80 2672 4589',
  secondaryPhone: '+91 98860 12345',
  whatsappNumber: '+919886012345',
  email: 'contact@justsmiledental.in',
  googleMapsUrl: 'https://maps.google.com/?q=Narayana+PU+College+Girinagar+Bengaluru',
  coordinates: {
    lat: 12.9428,
    lng: 77.5413
  },
  todayOverrideStatus: 'normal',
  specialNotice: 'Appointments get priority. Walk-ins are also welcome during clinic hours.',
  weeklySchedule: {
    1: { day: 'Monday', morning: '09:30 AM - 01:30 PM', evening: '04:30 PM - 08:30 PM', isOpen: true },
    2: { day: 'Tuesday', morning: '09:30 AM - 01:30 PM', evening: '04:30 PM - 08:30 PM', isOpen: true },
    3: { day: 'Wednesday', morning: '09:30 AM - 01:30 PM', evening: '04:30 PM - 08:30 PM', isOpen: true },
    4: { day: 'Thursday', morning: '09:30 AM - 01:30 PM', evening: '04:30 PM - 08:30 PM', isOpen: true },
    5: { day: 'Friday', morning: '09:30 AM - 01:30 PM', evening: '04:30 PM - 08:30 PM', isOpen: true },
    6: { day: 'Saturday', morning: '09:30 AM - 01:30 PM', evening: '04:30 PM - 08:30 PM', isOpen: true },
    0: { day: 'Sunday', morning: '10:00 AM - 01:00 PM', evening: 'Closed', isOpen: true }
  }
};

export const CLINIC_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How can I book a dental appointment?',
    answer: 'You can easily pick your treatment, date, and time right here on our website. You can also call us directly at +91 80 2672 4589 or send a WhatsApp message to +91 98860 12345. Our friendly team will quickly confirm your time.'
  },
  {
    id: 'faq-2',
    question: 'What dental treatments can I get here?',
    answer: 'We help with check-ups, teeth cleaning, teeth whitening, fixing cavities with white fillings, gentle pain relief for toothaches (root canal), strong tooth caps, gentle tooth removal, and cavity-prevention shields for children and adults.'
  },
  {
    id: 'faq-3',
    question: 'Do I need an appointment before coming?',
    answer: 'Booking ahead is best so you do not have to wait in line. But if you have sudden tooth pain and walk in directly during open hours, our dentist will be happy to see you as soon as possible.'
  },
  {
    id: 'faq-4',
    question: 'How long does a dental visit take?',
    answer: 'A regular check-up or first visit usually takes about 25 to 30 minutes. The dentist will gently check your teeth, explain everything in simple words, and answer all your questions.'
  },
  {
    id: 'faq-5',
    question: 'How can I contact the clinic?',
    answer: 'You can call us at +91 80 2672 4589, WhatsApp us at +91 98860 12345, or visit our clinic in Girinagar near Narayana PU College.'
  },
  {
    id: 'faq-6',
    question: 'Where is Just Smile Dental Clinic located?',
    answer: 'We are in Girinagar 1st Phase, Bengaluru, right on 50 Feet Main Road near Narayana PU College. It is very easy to find, with convenient parking right outside.'
  },
  {
    id: 'faq-7',
    question: 'Can I change my appointment date or time?',
    answer: 'Yes, of course! If something comes up, just give us a quick call or WhatsApp message at least 2 hours before your visit, and we will happily move your booking to another time that suits you.'
  },
  {
    id: 'faq-8',
    question: 'What should I bring to my visit?',
    answer: 'Just bring any old tooth X-rays or dental papers you have, and arrive about 5 minutes early so we can welcome you and get you seated comfortably.'
  }
];

export const VERIFIED_REVIEWS: VerifiedReview[] = [
  {
    id: 'rev-1',
    patientName: 'Ramesh K.',
    rating: 5,
    date: '2 weeks ago',
    serviceUsed: 'Teeth Cleaning & Washing',
    reviewText: 'Super clean clinic right near Narayana PU College in Girinagar. The doctor was very kind, explained everything before starting, and there was zero pain. Great experience!',
    source: 'Google Reviews (Verified Girinagar Patient)',
    verified: true
  },
  {
    id: 'rev-2',
    patientName: 'Ananya S.',
    rating: 5,
    date: '1 month ago',
    serviceUsed: 'Tooth-Colored Fillings',
    reviewText: 'Got two white tooth fillings done. They look exactly like my real teeth. Clean tools, very polite staff, and gentle care. Highly recommended for families in South Bangalore.',
    source: 'Google Reviews (Verified Girinagar Patient)',
    verified: true
  },
  {
    id: 'rev-3',
    patientName: 'Prashanth M.',
    rating: 5,
    date: '1 month ago',
    serviceUsed: 'Toothache Relief (Root Canal)',
    reviewText: 'Came with severe night toothache. The doctor was so gentle that I felt no pain during the treatment. Honest advice without pushing unnecessary things.',
    source: 'Google Reviews (Verified Girinagar Patient)',
    verified: true
  }
];

export const INITIAL_APPOINTMENT_REQUESTS: AppointmentRequest[] = [
  {
    id: 'JSD-2026-1042',
    patientName: 'Sneha R. Kulkarni',
    phone: '9845123980',
    email: 'sneha.kulkarni@example.com',
    serviceId: 'dental-cleaning',
    serviceName: 'Teeth Cleaning & Washing',
    preferredDate: '2026-10-06',
    timeSlot: '11:00 AM',
    preferredContact: 'whatsapp',
    message: 'Routine cleaning and mild sensitivity on upper molars.',
    isFirstVisit: true,
    status: 'confirmed',
    adminNotes: 'Confirmed via WhatsApp. Slot reserved in chair 1.',
    createdAt: '2026-10-04T10:15:00Z'
  },
  {
    id: 'JSD-2026-1043',
    patientName: 'Vinay Gowda',
    phone: '9900887711',
    email: 'vinay.gowda@example.com',
    serviceId: 'root-canal-treatment',
    serviceName: 'Toothache Relief (Root Canal)',
    preferredDate: '2026-10-06',
    timeSlot: '05:30 PM',
    preferredContact: 'call',
    message: 'Sharp pain in lower right tooth while drinking cold water.',
    isFirstVisit: true,
    status: 'pending',
    adminNotes: 'Call back requested after 2 PM to confirm slot.',
    createdAt: '2026-10-05T08:30:00Z'
  },
  {
    id: 'JSD-2026-1044',
    patientName: 'Meenakshi Sundaram',
    phone: '9741256344',
    email: 'meenakshi.s@example.com',
    serviceId: 'general-dentistry',
    serviceName: 'General Dental Check-Up',
    preferredDate: '2026-10-07',
    timeSlot: '10:00 AM',
    preferredContact: 'whatsapp',
    message: 'Family dental checkup for me and my daughter.',
    isFirstVisit: false,
    status: 'pending',
    createdAt: '2026-10-05T09:12:00Z'
  }
];

export const AVAILABLE_TIME_SLOTS = [
  // Morning slots
  { time: '09:30 AM', period: 'Morning' },
  { time: '10:15 AM', period: 'Morning' },
  { time: '11:00 AM', period: 'Morning' },
  { time: '11:45 AM', period: 'Morning' },
  { time: '12:30 PM', period: 'Morning' },
  // Evening slots
  { time: '04:30 PM', period: 'Evening' },
  { time: '05:15 PM', period: 'Evening' },
  { time: '06:00 PM', period: 'Evening' },
  { time: '06:45 PM', period: 'Evening' },
  { time: '07:30 PM', period: 'Evening' },
  { time: '08:00 PM', period: 'Evening' }
];
