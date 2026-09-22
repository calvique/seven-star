import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, GraduationCap, UserGroup, Building, BookOpen, FileText, ClipboardList, Megaphone, Images, UserPlus, Download, Calendar, Trophy, Building2, MessageSquare, Mail, Settings, LogOut, Menu, ChevronLeft, BarChart2, TrendingUp, Award, User, Bell } from 'lucide-react';
import { Card, Badge, Button, Avatar, Dropdown, Table } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { SchoolLogo } from '../../components/branding/SchoolLogo';

export function AdminDashboard() {
  const { getSettingValue } = useSettings();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const schoolName = getSettingValue('general', 'school.name', 'Seven Star English Boarding School');

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

  const stats = [
    { label: 'Total Students', value: '942', change: '+12%', icon: UserGroup, color: 'primary' },
    { label: 'Active Teachers', value: '78', change: '+3', icon: GraduationCap, color: 'secondary' },
    { label: 'Published Notices', value: '24', change: '+5', icon: Megaphone, color: 'accent' },
    { label: 'Pending Admissions', value: '18', change: '+7', icon: UserPlus, color: 'purple' },
  ];

  const recentActivities = [
    { user: 'Mr. Tikaram Chapagain', action: 'Published notice', target: 'Exam Schedule 2082', time: '2 hours ago', icon: Megaphone, color: 'primary' },
    { user: 'Mrs. Sarita Sharma', action: 'Submitted results', target: 'Class 10 Science', time: '4 hours ago', icon: ClipboardList, color: 'secondary' },
    { user: 'Mr. Mohan Giri', action: 'Approved admission', target: 'ADM2024XYZ', time: '6 hours ago', icon: UserPlus, color: 'accent' },
    { user: 'System', action: 'Backup completed', target: 'Database', time: '1 day ago', icon: Database, color: 'gray' },
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - {schoolName}</title>
        <meta name="description" content="Admin dashboard for managing school operations, users, and content." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transition-all duration-300 flex flex-col
            ${sidebarOpen ? 'w-64' : 'w-20'}
            ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <div className={`flex items-center gap-3 p-4 border-b border-gray-100 ${!sidebarOpen && 'justify-center'}`}>
            <SchoolLogo size="sm" />
            {sidebarOpen && (
              <div>
                <h1 className="font-heading font-bold text-lg text-gray-900">{schoolName}</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            )}
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = false; // Would check current path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  } ${!sidebarOpen && 'justify-center px-2'}`}
                  title={sidebarOpen ? undefined : item.label}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

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
              className={`mt-3 w-full p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors ${!sidebarOpen && 'mx-auto'}`}
              aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              aria-expanded={sidebarOpen}
            >
              <ChevronLeft className={`w-5 h-5 ${sidebarOpen && 'rotate-180'}`} />
            </button>
          </div>
        </aside>

        <div className={`${sidebarOpen ? 'lg:pl-64' : 'lg:pl-20'} transition-all duration-300`}>
          {/* Mobile Sidebar Overlay */}
          {mobileSidebarOpen && (
            <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
          )}

          {/* Top Bar */}
          <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100" onClick={() => setMobileSidebarOpen(true)}>
                  <Menu className="w-6 h-6" />
                </button>
                <h1 className="font-heading font-semibold text-xl text-gray-900 hidden sm:block">
                  Admin Dashboard
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <button className="relative p-2 rounded-lg hover:bg-gray-100">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
                </button>
                <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-gray-50 rounded-lg text-sm text-gray-600">
                  <span className="font-medium text-gray-900">{user?.name}</span>
                  <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full text-xs font-medium capitalize">{user?.role}</span>
                </div>
                <Dropdown
                  trigger={
                    <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
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
    </>
  );
}

// Need to import Database
import { Database } from 'lucide-react';