import React, { useState } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  Menu, X, ChevronLeft, ChevronDown, GraduationCap, Users, UserGroup, Building,
  BookOpen, FileText, ClipboardList, Megaphone, Images, UserPlus, Download,
  Calendar, Trophy, Building2, MessageSquare, Mail, Settings, LayoutDashboard,
  LogOut, User
} from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Avatar, Dropdown } from '../ui';
import { useAuth } from '../../context/AuthContext';

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-32 lg:pt-28" id="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-xl text-gray-900">Seven Star</h1>
              <p className="text-xs text-gray-500">English Boarding School</p>
            </div>
          </Link>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <Outlet />
        </div>
        <p className="text-center text-sm text-gray-500 mt-6">
          © {new Date().getFullYear()} Seven Star English Boarding School. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export function AdminLayout() {
  const { user, isAuthenticated, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Teachers', path: '/admin/teachers', icon: GraduationCap },
    { label: 'Students', path: '/admin/students', icon: UserGroup },
    { label: 'Classes', path: '/admin/classes', icon: Building },
    { label: 'Subjects', path: '/admin/subjects', icon: BookOpen },
    { label: 'Exams', path: '/admin/exams', icon: FileText },
    { label: 'Results', path: '/admin/results', icon: ClipboardList },
    { label: 'Notices', path: '/admin/notices', icon: Megaphone },
    { label: 'Galleries', path: '/admin/galleries', icon: Images },
    { label: 'Admissions', path: '/admin/admissions', icon: UserPlus },
    { label: 'Downloads', path: '/admin/downloads', icon: Download },
    { label: 'Activities', path: '/admin/activities', icon: Calendar },
    { label: 'Achievements', path: '/admin/achievements', icon: Trophy },
    { label: 'Facilities', path: '/admin/facilities', icon: Building2 },
    { label: 'Suggestions', path: '/admin/suggestions', icon: MessageSquare },
    { label: 'Contacts', path: '/admin/contacts', icon: Mail },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed lg:static inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transition-all duration-300 flex flex-col',
          sidebarOpen ? 'w-64' : 'w-20',
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        aria-label="Admin sidebar"
      >
        {/* Logo */}
        <div className={clsx('flex items-center gap-3 p-4 border-b border-gray-100', !sidebarOpen && 'justify-center')}>
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          {sidebarOpen && (
            <div>
              <h1 className="font-heading font-bold text-lg text-gray-900">Seven Star</h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto" aria-label="Admin navigation">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                  !sidebarOpen && 'justify-center px-2'
                )}
                aria-current={isActive ? 'page' : undefined}
                title={sidebarOpen ? undefined : item.label}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Collapse */}
        <div className="p-4 border-t border-gray-100">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <Avatar src={user?.avatar} name={user?.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
          ) : (
            <Avatar src={user?.avatar} name={user?.name} size="sm" className="mx-auto" />
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={clsx('mt-3 w-full p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors', !sidebarOpen && 'mx-auto')}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            aria-expanded={sidebarOpen}
          >
            <ChevronLeft className={clsx('w-5 h-5', sidebarOpen && 'rotate-180')} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={clsx('lg:pl-64 transition-all duration-300', sidebarOpen ? 'pl-20' : 'pl-64')}>
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                onClick={() => setMobileSidebarOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="font-heading font-semibold text-xl text-gray-900 hidden sm:block">
                {navItems.find((i) => location.pathname === i.path || location.pathname.startsWith(i.path + '/'))?.label || 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-gray-50 rounded-lg text-sm text-gray-600">
                <span className="font-medium text-gray-900">{user?.name}</span>
                <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full text-xs font-medium capitalize">{user?.role}</span>
              </div>
              <Dropdown
                trigger={
                  <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <Avatar src={user?.avatar} name={user?.name} size="sm" />
                  </button>
                }
                options={[
                  { value: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
                  { value: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
                  { value: 'logout', label: 'Logout', icon: <LogOut className="w-4 h-4" />, danger: true },
                ]}
                onSelect={(value) => {
                  if (value === 'logout') logout();
                }}
                align="right"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export function TeacherLayout() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || user?.role !== 'teacher') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/teacher" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="font-heading font-semibold text-xl text-gray-900">Teacher Portal</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Dropdown
              trigger={
                <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <Avatar src={user?.avatar} name={user?.name} size="sm" />
                </button>
              }
              options={[
                { value: 'profile', label: 'My Profile', icon: <User className="w-4 h-4" /> },
                { value: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
                { value: 'logout', label: 'Logout', icon: <LogOut className="w-4 h-4" />, danger: true },
              ]}
              onSelect={(value) => {
                if (value === 'logout') logout();
              }}
              align="right"
            />
          </div>
        </div>
      </header>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}