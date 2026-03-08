"use client";

import { motion } from 'framer-motion';

export default function InstituteAbout() {
  return (
    <section id="about" className="py-20 bg-white">
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
            About Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Building Leaders Through <span className="text-institute-600">Excellence</span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            We are committed to providing world-class engineering education that empowers students to become industry leaders.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left - History */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gradient-to-br from-institute-50 to-white rounded-2xl p-8 border border-slate-100 shadow-lg">
              <h3 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
                <span className="w-12 h-12 rounded-lg bg-institute-600 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </span>
                Our History
              </h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                Founded in 2010, our institute has been at the forefront of engineering education for over 15 years. 
                We started with a vision to create an institution that combines theoretical knowledge with practical skills, 
                preparing students for the real-world challenges of the engineering industry.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Today, we stand proud as one of the leading engineering colleges in the region, with state-of-the-art 
                infrastructure, world-class faculty, and a legacy of producing successful engineers.
              </p>
            </div>
          </motion.div>

          {/* Right - Mission & Vision */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Mission */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-800 mb-2">Our Mission</h4>
                  <p className="text-slate-600">
                    To provide quality engineering education through innovative teaching methods, 
                    research, and industry collaboration, fostering holistic development of students 
                    to meet global challenges.
                  </p>
                </div>
              </div>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-institute-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-institute-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-800 mb-2">Our Vision</h4>
                  <p className="text-slate-600">
                    To be a center of excellence in engineering education and research, 
                    producing ethical and competent engineers who contribute to societal development.
                  </p>
                </div>
              </div>
            </div>

            {/* Values */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-800 mb-2">Our Values</h4>
                  <p className="text-slate-600">
                    Integrity, Innovation, Excellence, and Service. We believe in nurturing 
                    not just engineers, but responsible citizens who make a positive impact.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Achievements */}
        <motion.div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {[
            { number: '15+', label: 'Years of Excellence', icon: '🏆' },
            { number: '5000+', label: 'Alumni Worldwide', icon: '👥' },
            { number: '50+', label: 'Industry Partners', icon: '🤝' },
            { number: '25+', label: 'Awards & Recognitions', icon: '⭐' },
          ].map((item, index) => (
            <div
              key={item.label}
              className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-6 text-center border border-slate-200 hover:border-institute-300 transition-colors"
            >
              <div className="text-4xl mb-2">{item.icon}</div>
              <div className="text-3xl font-bold text-institute-600 mb-1">{item.number}</div>
              <div className="text-sm text-slate-600">{item.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
