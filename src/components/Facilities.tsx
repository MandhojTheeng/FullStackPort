"use client";

import { motion } from 'framer-motion';

const facilities = [
  {
    id: 1,
    title: 'Smart Classrooms',
    description: 'Modern lecture halls equipped with interactive smart boards, projectors, and audio systems for enhanced learning.',
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    color: 'bg-blue-100 text-blue-600',
  },
  {
    id: 2,
    title: 'Advanced Laboratories',
    description: 'Well-equipped labs for each department with latest software and hardware for practical learning.',
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    color: 'bg-purple-100 text-purple-600',
  },
  {
    id: 3,
    title: 'Central Library',
    description: 'A vast collection of books, journals, and digital resources with reading rooms and study spaces.',
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    color: 'bg-orange-100 text-orange-600',
  },
  {
    id: 4,
    title: 'Sports Complex',
    description: 'Indoor and outdoor sports facilities including gymnasium, basketball court, and cricket ground.',
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'bg-green-100 text-green-600',
  },
  {
    id: 5,
    title: 'Hostel Facilities',
    description: 'Separate hostels for boys and girls with modern amenities, Wi-Fi, and 24/7 security.',
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    color: 'bg-pink-100 text-pink-600',
  },
  {
    id: 6,
    title: 'Transport Facility',
    description: 'Fleet of buses covering major routes in the city for easy commute of students and staff.',
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    color: 'bg-yellow-100 text-yellow-600',
  },
];

export default function Facilities() {
  return (
    <section id="facilities" className="py-20 bg-slate-50">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-institute-100 text-institute-700 mb-4">
            Infrastructure
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            World-Class <span className="text-institute-600">Facilities</span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            We provide state-of-the-art infrastructure to ensure our students have the best learning environment.
          </p>
        </motion.div>

        {/* Facilities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((facility, index) => (
            <motion.div
              key={facility.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all group"
            >
              <div className={`w-20 h-20 rounded-2xl ${facility.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {facility.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{facility.title}</h3>
              <p className="text-slate-600 leading-relaxed">
                {facility.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Campus Tour CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-gradient-to-r from-institute-600 to-institute-700 rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Schedule a Campus Visit</h3>
            <p className="text-institute-100 max-w-2xl mx-auto mb-6">
              Experience our campus firsthand. Book a guided tour and explore our world-class facilities.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-institute-600 font-semibold rounded-lg hover:bg-institute-50 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Book Campus Tour
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
