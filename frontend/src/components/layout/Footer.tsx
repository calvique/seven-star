import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { SchoolLogo } from '../branding/SchoolLogo';
import { SCHOOL_FACEBOOK_URL } from '../../config/branding';

export function Footer() {
  const { getSettingValue } = useSettings();

  const schoolName = getSettingValue('general', 'school.name', 'Seven Star English Boarding School');
  const tagline = getSettingValue('general', 'school.tagline', 'Official school information and updates');
  const address = getSettingValue('general', 'school.address', 'Devdaha-2, Rupandehi, Nepal');
  const phone = getSettingValue('general', 'school.phone', '');
  const email = getSettingValue('general', 'school.email', '');
  const facebookUrl = getSettingValue('social', 'social.facebook', SCHOOL_FACEBOOK_URL);

  const footerLinks = {
    explore: [
      { label: 'About Us', path: '/about' },
      { label: 'Gallery', path: '/gallery' },
      { label: 'Suggestions', path: '/suggestions' },
      { label: 'Weekly ECA', path: '/activities' },
      { label: 'Sports', path: '/activities?category=sports' },
      { label: 'Achievements', path: '/achievements' },
    ],
    school: [
      { label: 'Student Life', path: '/activities' },
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


  return (
    <footer className="bg-gray-900 text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6" aria-label={`${schoolName} Home`}>
              <SchoolLogo size="md" />
              <div>
                <h2 className="font-heading font-bold text-xl text-white">{schoolName}</h2>
                <p className="text-secondary-400 text-sm">{tagline}</p>
              </div>
            </Link>
            <p className="text-gray-400 text-sm mb-6 max-w-xs">
              Official school information, admissions, notices, activities, gallery and results for the Seven Star school community.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
              <MapPin className="w-4 h-4 text-secondary-400" />
              <span>{address}</span>
            </div>
            {phone && <div className="flex items-center gap-2 text-sm text-gray-400 mb-2"><Phone className="w-4 h-4 text-secondary-400" /><a href={`tel:${phone}`} className="hover:text-white transition-colors">{phone}</a></div>}
            {email && <div className="flex items-center gap-2 text-sm text-gray-400 mb-6"><Mail className="w-4 h-4 text-secondary-400" /><a href={`mailto:${email}`} className="hover:text-white transition-colors">{email}</a></div>}
            <div className="flex items-center gap-4">
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-secondary-500 transition-colors" aria-label="Facebook">
                <span className="text-xs font-bold">f</span>
              </a>
              <a href="/" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-secondary-500 transition-colors" aria-label="YouTube">
                <span className="text-xs font-bold">▶</span>
              </a>
              <a href="/" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-secondary-500 transition-colors" aria-label="Instagram">
                <span className="text-xs font-bold">ig</span>
              </a>
              <a href="/" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-secondary-500 transition-colors" aria-label="Twitter">
                <span className="text-xs font-bold">x</span>
              </a>
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
            <div className="flex items-center gap-3 text-gray-500 text-sm"><MessageSquare className="w-4 h-4" /><Link to="/suggestions" className="hover:text-white">Send a suggestion</Link></div>
            <div className="flex items-center gap-6 text-sm text-gray-500"><span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{address}</span></div>
          </div>
        </div>
      </div>
    </footer>
  );
}