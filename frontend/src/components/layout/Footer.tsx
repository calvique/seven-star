import React from 'react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { Facebook, Youtube, Instagram, Twitter, MapPin, Phone, Mail, GraduationCap, Award, Users, BookOpen } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export function Footer() {
  const { getSettingValue } = useSettings();

  const schoolName = getSettingValue('general', 'school.name', 'Seven Star English Boarding School');
  const tagline = getSettingValue('general', 'school.tagline', 'Shaping Future Leaders');
  const established = getSettingValue('general', 'school.established', '2063 B.S.');
  const address = getSettingValue('general', 'school.address', 'Devdaha-2, Rupandehi, Nepal');
  const phone = getSettingValue('general', 'school.phone', '9857078448');
  const email = getSettingValue('general', 'school.email', 'sevenstar.school2063@gmail.com');
  const officeHours = getSettingValue('general', 'school.officeHours', 'Sun - Fri: 9:00 AM - 5:00 PM');
  const facebookUrl = getSettingValue('social', 'social.facebook', 'https://www.facebook.com/sevenstar.boarding');

  const footerLinks = {
    explore: [
      { label: 'About Us', path: '/about' },
      { label: 'Gallery', path: '/gallery' },
      { label: 'Testimonials', path: '/testimonials' },
      { label: 'Weekly ECA', path: '/activities' },
      { label: 'Sports', path: '/activities?category=sports' },
      { label: 'Achievements', path: '/achievements' },
    ],
    school: [
      { label: 'Student Life', path: '/student-life' },
      { label: 'Facilities', path: '/facilities' },
      { label: 'Admissions', path: '/admissions' },
      { label: 'Academics', path: '/academics' },
      { label: 'Notices', path: '/notices' },
      { label: 'Downloads', path: '/downloads' },
    ],
    quickLinks: [
      { label: 'Chairman Message', path: '/about/chairman' },
      { label: 'Principal Message', path: '/about/principal' },
      { label: 'Mission & Vision', path: '/about/mission-vision' },
      { label: 'History', path: '/about/history' },
      { label: 'Contact', path: '/contact' },
    ],
  };

  const stats = [
    { icon: Users, value: '900+', label: 'Students' },
    { icon: Award, value: '100%', label: 'SEE Pass Rate' },
    { icon: BookOpen, value: '80+', label: 'Qualified Teachers' },
    { icon: Award, value: '19+', label: 'Years Excellence' },
  ];

  return (
    <footer className="bg-gray-900 text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6" aria-label={`${schoolName} Home`}>
              <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-xl text-white">{schoolName}</h2>
                <p className="text-secondary-400 text-sm">{tagline}</p>
              </div>
            </Link>
            <p className="text-gray-400 text-sm mb-6 max-w-xs">
              A distinguished private educational institution located in Devdaha Municipality-2, Rupandehi District, Lumbini Province, Nepal. Committed to providing quality education since 2063 B.S.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
              <MapPin className="w-4 h-4 text-secondary-400" />
              <span>{address}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <Phone className="w-4 h-4 text-secondary-400" />
              <a href={`tel:${phone}`} className="hover:text-white transition-colors">{phone}</a>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
              <Mail className="w-4 h-4 text-secondary-400" />
              <a href={`mailto:${email}`} className="hover:text-white transition-colors">{email}</a>
            </div>
            <div className="flex items-center gap-4">
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-secondary-500 transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-secondary-500 transition-colors" aria-label="YouTube">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-secondary-500 transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-secondary-500 transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="hidden lg:block">
            <h3 className="font-heading font-semibold text-lg mb-6">At a Glance</h3>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-gray-800/50 rounded-lg p-4 text-center">
                  <stat.icon className="w-6 h-6 text-secondary-400 mx-auto mb-2" />
                  <p className="font-heading font-bold text-2xl text-white">{stat.value}</p>
                  <p className="text-xs text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-6">Explore</h3>
            <nav aria-label="Explore links">
              <ul className="space-y-3">
                {footerLinks.explore.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* School */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-6">School</h3>
            <nav aria-label="School links">
              <ul className="space-y-3">
                {footerLinks.school.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-6">Quick Links</h3>
            <nav aria-label="Quick links">
              <ul className="space-y-3">
                {footerLinks.quickLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} {schoolName}. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm">
              Designed with pride for Seven Star E.B.S.S.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {email}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {phone}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {address}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}