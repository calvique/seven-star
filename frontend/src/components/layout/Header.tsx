import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { Menu, X, ChevronDown, MapPin, Phone, Mail } from 'lucide-react';
import { Avatar, Dropdown, Badge, Button } from '../ui';
import { SchoolLogo } from '../branding/SchoolLogo';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { getSettingValue } = useSettings();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', path: '/' },
    {
      label: 'About',
      path: '/about',
      children: [
        { label: 'Our Story', path: '/about' },
        { label: "Chairman's Message", path: '/about/chairman' },
        { label: "Principal's Message", path: '/about/principal' },
        { label: 'Mission & Vision', path: '/about/mission-vision' },
        { label: 'History', path: '/about/history' },
      ],
    },
    {
      label: 'Academics',
      path: '/academics',
      children: [
        { label: 'Curriculum', path: '/academics/curriculum' },
        { label: 'Faculty', path: '/academics/faculty' },
        { label: 'Classes', path: '/academics/classes' },
      ],
    },
    {
      label: 'Facilities',
      path: '/facilities',
    },
    {
      label: 'Student Life',
      path: '#',
      children: [
        { label: 'Gallery', path: '/gallery' },
        { label: 'Activities', path: '/activities' },
        { label: 'Achievements', path: '/achievements' },
        { label: 'Notices', path: '/notices' },
      ],
    },
    { label: 'Admissions', path: '/admissions' },
    { label: 'Contact', path: '/contact' },
    { label: 'Downloads', path: '/downloads' },
  ];

  const phone = getSettingValue('contact', 'school.phone', '9857078448');
  const email = getSettingValue('contact', 'school.email', 'sevenstar.school2063@gmail.com');
  const address = getSettingValue('general', 'school.address', 'Devdaha-2, Rupandehi, Nepal');
  const facebookUrl = getSettingValue('social', 'social.facebook', 'https://www.facebook.com/sevenstar.boarding');

  return (
    <header className={clsx('fixed top-0 left-0 right-0 z-40 transition-all duration-300', isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-white')}>
      {/* Top Bar */}
      <div className="hidden lg:flex items-center justify-between px-6 py-2 bg-primary-700 text-white text-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <a href={`tel:${phone}`} className="hover:text-secondary-200 transition-colors">{phone}</a>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <a href={`mailto:${email}`} className="hover:text-secondary-200 transition-colors">{email}</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-secondary-200 transition-colors" aria-label="Facebook">
            <span className="text-xs font-bold">f</span>
          </a>
          <a href="/" className="hover:text-secondary-200 transition-colors" aria-label="YouTube">
            <span className="text-xs font-bold">▶</span>
          </a>
          <a href="/" className="hover:text-secondary-200 transition-colors" aria-label="Instagram">
            <span className="text-xs font-bold">ig</span>
          </a>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="relative px-6 py-4 lg:py-3" aria-label="Main navigation">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3" aria-label="Seven Star School Home">
            <SchoolLogo size="md" />
            <div className="hidden sm:block">
              <h1 className="font-heading font-bold text-xl text-gray-900">Seven Star</h1>
              <p className="text-xs text-gray-500">English Boarding School</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <Dropdown
                trigger={
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
                    <Avatar src={user?.avatar} name={user?.name} size="sm" />
                    <span className="font-medium text-gray-700">{user?.name}</span>
                  </button>
                }
                options={[
                  { value: 'dashboard', label: user?.role === 'admin' ? 'Admin Dashboard' : user?.role === 'teacher' ? 'Teacher Dashboard' : 'My Portal', icon: <span className="w-4 h-4">📊</span> },
                  { value: 'results', label: 'View Results', icon: <span className="w-4 h-4">📝</span> },
                  { value: 'logout', label: 'Logout', icon: <span className="w-4 h-4">🚪</span>, danger: true },
                ]}
                onSelect={(value) => {
                  if (value === 'logout') {
                    logout();
                  } else if (value === 'dashboard') {
                    navigate(user?.role === 'admin' ? '/admin' : user?.role === 'teacher' ? '/teacher' : '/dashboard');
                  } else if (value === 'results') {
                    navigate('/results');
                  }
                }}
              />
            ) : (
              <>
                <Link to="/login" className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">Login</Link>
                <Link to="/admissions" className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors shadow-sm">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div id="mobile-menu" className="lg:hidden px-6 pb-6 border-t border-gray-100 animate-slide-down">
          <div className="py-4 space-y-2">
            {navItems.map((item) => (
              <MobileNavItem key={item.path} item={item} onClose={() => setIsMobileMenuOpen(false)} />
            ))}
            <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
              {isAuthenticated ? (
                <button
                  onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                  className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="inline-flex w-full items-center justify-center px-4 py-3 rounded-lg border-2 border-primary-600 text-primary-600 font-medium hover:bg-primary-50 transition-colors">Login</Link>
                  <Link to="/admissions" onClick={() => setIsMobileMenuOpen(false)} className="inline-flex w-full items-center justify-center px-4 py-3 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors">Get Started</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function NavItem({ item }: { item: any }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!item.children) {
    return (
      <Link
        to={item.path}
        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <button
        className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {item.label}
        <ChevronDown className="w-4 h-4" />
      </button>
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 animate-slide-down" role="menu">
          {item.children.map((child: any) => (
            <Link
              key={child.path}
              to={child.path}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600"
              role="menuitem"
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileNavItem({ item, onClose }: { item: any; onClose: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!item.children) {
    return (
      <Link
        to={item.path}
        onClick={onClose}
        className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <span>{item.label}</span>
        <ChevronDown className={clsx('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />
      </button>
      {isOpen && (
        <div className="mt-1 ml-4 space-y-1 border-l-2 border-gray-100 pl-4 animate-slide-down">
          {item.children.map((child: any) => (
            <Link
              key={child.path}
              to={child.path}
              onClick={onClose}
              className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}