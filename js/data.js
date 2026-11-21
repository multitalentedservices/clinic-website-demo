/* Sehat Family Clinic (Demo) — fictional demo data only. No real practitioners, no real patients. */
(function (global) {
  'use strict';
  var DEPARTMENTS = [
    { id: 'general', name: 'General Medicine', blurb: 'Everyday health concerns, check-ups and follow-up visits with a family doctor.' },
    { id: 'children', name: "Children's Health", blurb: 'Consultations, vaccination visits and growth checks for infants, children and teenagers.' },
    { id: 'dental', name: 'Dental Care', blurb: 'Examinations, cleaning and everyday dental treatment in a calm treatment room.' },
    { id: 'skin', name: 'Skin & Wellness', blurb: 'Skin consultations and personal care plans. Advice is general and a visit never promises a result.' }
  ];
  var SERVICES = [
    { id: 'gen-consult', dept: 'general', name: 'General Consultation', desc: 'A full consultation for a new or ongoing health concern, with time to talk it through.', duration: 30, fee: 1500 },
    { id: 'gen-follow', dept: 'general', name: 'Follow-up Visit', desc: 'A shorter review visit after a recent consultation, to check progress and next steps.', duration: 20, fee: 1000 },
    { id: 'gen-check', dept: 'general', name: 'Annual Health Check', desc: 'A yearly once-over: history, basic measurements and a written summary of findings.', duration: 60, fee: 4500 },
    { id: 'child-consult', dept: 'children', name: 'Child Consultation', desc: 'A consultation for your child with our children\u2019s doctor, parents welcome throughout.', duration: 30, fee: 1800 },
    { id: 'child-vacc', dept: 'children', name: 'Vaccination Visit', desc: 'A scheduled vaccination visit. Please bring your child\u2019s vaccination record card.', duration: 20, fee: 1200 },
    { id: 'child-growth', dept: 'children', name: 'Growth & Development Check', desc: 'Height, weight and development milestones recorded and discussed with parents.', duration: 30, fee: 2000 },
    { id: 'dent-exam', dept: 'dental', name: 'Dental Examination & Cleaning', desc: 'A complete dental examination with a professional clean and practical home-care advice.', duration: 45, fee: 3500 },
    { id: 'dent-filling', dept: 'dental', name: 'Dental Filling', desc: 'Treatment of a cavity with a filling. The dentist confirms suitability at examination first.', duration: 45, fee: 5000 },
    { id: 'dent-child', dept: 'dental', name: 'Child Dental Check', desc: 'A gentle first dental check for children, at their pace, with parents in the room.', duration: 30, fee: 2500 },
    { id: 'skin-consult', dept: 'skin', name: 'Skin Consultation', desc: 'A consultation about a skin concern, with an honest discussion of options and next steps.', duration: 30, fee: 2500 },
    { id: 'skin-review', dept: 'skin', name: 'Skin Review Visit', desc: 'A follow-up review of a concern seen at this clinic, to check how things are going.', duration: 20, fee: 1800 },
    { id: 'skin-plan', dept: 'skin', name: 'Personal Skin-Care Plan', desc: 'A written everyday skin-care plan built around your skin type and routine.', duration: 40, fee: 3000 }
  ];
  /* days: JS weekday numbers (0=Sunday). Clinic closed Sundays. */
  var DOCTORS = [
    { id: 'amina', name: 'Dr Amina Sheikh', dept: 'general', speciality: 'Family Medicine', quals: 'MBBS, FCPS (Family Medicine) — fictional demo credentials', days: [1, 2, 3, 4, 5], img: 'assets/doctor-amina.jpg', alt: 'Portrait of Dr Amina Sheikh (fictional practitioner, demo photo)', note: 'Sees families and older patients; known for unhurried consultations.' },
    { id: 'sana', name: 'Dr Sana Tariq', dept: 'children', speciality: "Children's Health", quals: 'MBBS, FCPS (Paediatrics) — fictional demo credentials', days: [1, 2, 3, 4, 5], img: 'assets/doctor-sana.jpg', alt: 'Portrait of Dr Sana Tariq (fictional practitioner, demo photo)', note: 'Children of all ages; parents stay in the room for every visit.' },
    { id: 'omar', name: 'Dr Omar Farooq', dept: 'dental', speciality: 'Dental Care', quals: 'BDS — fictional demo credentials', days: [2, 3, 4, 5, 6], img: 'assets/doctor-omar.jpg', alt: 'Portrait of Dr Omar Farooq (fictional practitioner, demo photo)', note: 'Everyday dentistry with a gentle approach for nervous patients.' },
    { id: 'bilal', name: 'Dr Bilal Ahmed', dept: 'skin', speciality: 'Skin & Wellness', quals: 'MBBS, Diploma in Dermatology — fictional demo credentials', days: [1, 3, 4, 6], img: 'assets/doctor-bilal.jpg', alt: 'Portrait of Dr Bilal Ahmed (fictional practitioner, demo photo)', note: 'Skin consultations with honest, general advice — never promises.' }
  ];
  var FAQS = [
    { q: 'How do I book an appointment?', a: 'Use the Book Appointment page: choose a service, a practitioner (or first available), a date and time, then your name and phone number. This demo saves the booking only in your own browser — no real appointment is made.' },
    { q: 'What should I bring to my first visit?', a: 'Please bring any previous reports or prescriptions you have, a list of medicines you currently take, and your child\u2019s vaccination card for children\u2019s visits.' },
    { q: 'Can I see a specific doctor?', a: 'Yes. Every practitioner page lists the days each doctor is available, and the booking calendar only offers those days.' },
    { q: 'What does a visit cost?', a: 'Every service page lists its consultation fee in PKR before you book, and the booking review shows the exact fee again. There are no hidden charges in this demo.' },
    { q: 'Is this a real clinic?', a: 'No. Sehat Family Clinic is a fictional clinic created for a website demo. Names, credentials, fees and availability are demo data, and no real appointment is booked through this site.' }
  ];
  global.CLINIC_DATA = { DEPARTMENTS: DEPARTMENTS, SERVICES: SERVICES, DOCTORS: DOCTORS, FAQS: FAQS };
  if (typeof module !== 'undefined' && module.exports) module.exports = global.CLINIC_DATA;
})(typeof window !== 'undefined' ? window : globalThis);
