"use client";

import { motion } from 'framer-motion';

const placementStats = [
  { value: '95%', label: 'Placement Rate', icon: '📈' },
  { value: '500+', label: 'Companies Visited', icon: '🏢' },
  { value: '50L', label: 'Highest Package', icon: '💰' },
  { value: '15L', label: 'Average Package', icon: '📊' },
];

const topRecruiters = [
  'Google', 'Microsoft', 'Amazon', 'TCS', 'Infosys', 'Wipro', 
  'Accenture', 'Cognizant', 'Tech Mahindra', 'HCL', 'IBM', 'Deloitte'
];

const placementHighlights = [
  {
    title: 'Industry Leaders',
    description: 'Our students are recruited by top multinational companies offering competitive packages.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Career Support',
    description: 'Dedicated placement cell provides training, mock interviews, and career guidance.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Internship Opportunities',
    description: 'Strong industry connections ensure valuable internship opportunities for all students.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
];

export default function Placements() {
  return (
    <section id="placements" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-accent-100 text-accent-700 mb-4">
            Careers
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Placement <span className="text-institute-600">Record</span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Our track record speaks for itself. We ensure our students get placed in top companies with competitive packages.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {placementStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 text-center border border-slate-200 hover:border-institute-300 transition-colors"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-4xl font-bold text-institute-600 mb-1">{stat.value}</div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Top Recruiters */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-xl font-bold text-slate-800 text-center mb-8">
            Top Recruiting Companies
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {topRecruiters.map((company, index) => (
              <motion.div
                key={company}
                className="px-6 py-3 bg-slate-100 rounded-lg text-slate-700 font-medium hover:bg-institute-600 hover:text-white transition-colors cursor-default"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                {company}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Why Choose Us */}
        <div className="grid md:grid-cols-3 gap-8">
          {placementHighlights.map((highlight, index) => (
            <motion.div
              key={highlight.title}
              className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border border-slate-200 hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            >
              <div className="w-16 h-16 rounded-xl bg-institute-100 text-institute-600 flex items-center justify-center mb-4">
                {highlight.icon}
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-2">{highlight.title}</h4>
              <p className="text-slate-600">{highlight.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-all"
          >
            Start Your Career Journey
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
