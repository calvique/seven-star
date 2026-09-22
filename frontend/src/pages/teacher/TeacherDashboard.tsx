import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { LayoutDashboard, GraduationCap, Users, BookOpen, FileText, Settings, LogOut, Menu, X, ChevronDown, Bell, Award, ClipboardList, Calendar, User, ArrowRight } from 'lucide-react';
import { Card, Badge, Button, Avatar, Dropdown, Table } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { SchoolLogo } from '../../components/branding/SchoolLogo';

export function TeacherDashboard() {
  const { getSettingValue } = useSettings();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const schoolName = getSettingValue('general', 'school.name', 'Seven Star English Boarding School');

  const navItems = [
    { label: 'Dashboard', path: '/teacher', icon: LayoutDashboard },
    { label: 'My Classes', path: '/teacher/classes', icon: Users },
    { label: 'My Subjects', path: '/teacher/subjects', icon: BookOpen },
    { label: 'Enter Results', path: '/teacher/enter-results', icon: FileText },
    { label: 'View Results', path: '/teacher/view-results', icon: ClipboardList },
    { label: 'Exam Schedule', path: '/teacher/exams', icon: Calendar },
    { label: 'Profile', path: '/teacher/profile', icon: User },
    { label: 'Settings', path: '/teacher/settings', icon: Settings },
  ];

  const stats = [
    { label: 'Assigned Classes', value: '3', icon: Users, color: 'primary' },
    { label: 'Assigned Subjects', value: '5', icon: BookOpen, color: 'secondary' },
    { label: 'Pending Results', value: '12', icon: FileText, color: 'accent' },
    { label: 'Upcoming Exams', value: '2', icon: Calendar, color: 'purple' },
  ];

  return (
    <>
      <Helmet>
        <title>Teacher Dashboard - {schoolName}</title>
        <meta name="description" content="Teacher dashboard for managing classes, subjects, and results." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className="fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-all duration-300 flex flex-col">
          <div className="flex items-center gap-3 p-4 border-b border-gray-100">
            <SchoolLogo size="sm" />
            <div>
              <h1 className="font-heading font-bold text-lg text-gray-900">{schoolName}</h1>
              <p className="text-xs text-gray-500">Teacher Portal</p>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <Avatar src={user?.avatar} name={user?.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
            <Dropdown
              trigger={
                <button className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors">
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
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
            />
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:pl-64">
          <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100" onClick={() => setSidebarOpen(true)}>
                  <Menu className="w-6 h-6" />
                </button>
                <h1 className="font-heading font-semibold text-xl text-gray-900 hidden sm:block">Teacher Dashboard</h1>
              </div>
              <div className="flex items-center gap-4">
                <button className="relative p-2 rounded-lg hover:bg-gray-100">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
                </button>
                <Dropdown
                  trigger={
                    <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
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
      </div>
    </>
  );
}

// Need to import useState
import { useState } from 'react';