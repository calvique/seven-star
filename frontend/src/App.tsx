import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';

// Layouts
import { MainLayout, AuthLayout, AdminLayout, TeacherLayout } from './components/layout/Layouts';

// Public Pages
import { 
  Home, About, ChairmanMessage, PrincipalMessage, MissionVision, History,
  Academics, Facilities, Gallery, Activities, Achievements, Notices,
  Admissions, Contact, Downloads
} from './pages/public';

// Auth Pages
import { Login, Register, ForgotPassword, ResetPassword, VerifyEmail } from './pages/auth';

// Results Pages
import { ResultSearch } from './pages/results/ResultSearch';

// Dashboard Pages
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';

// Styles
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <ThemeProvider>
          <SettingsProvider>
            <AuthProvider>
              <BrowserRouter>
                <Routes>
                  {/* Public Routes with Main Layout */}
                  <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/about/chairman" element={<ChairmanMessage />} />
                    <Route path="/about/principal" element={<PrincipalMessage />} />
                    <Route path="/about/mission-vision" element={<MissionVision />} />
                    <Route path="/about/history" element={<History />} />
                    <Route path="/academics" element={<Academics />} />
                    <Route path="/facilities" element={<Facilities />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/activities" element={<Activities />} />
                    <Route path="/achievements" element={<Achievements />} />
                    <Route path="/notices" element={<Notices />} />
                    <Route path="/admissions" element={<Admissions />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/downloads" element={<Downloads />} />
                    
                    {/* Results Portal - Public Access */}
                    <Route path="/results" element={<ResultSearch />} />
                    <Route path="/results/:examId" element={<ResultSearch />} />
                  </Route>

                  {/* Auth Routes with Auth Layout */}
                  <Route element={<AuthLayout />}>
                    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                    <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
                    <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                  </Route>

                  {/* Teacher Dashboard */}
                  <Route element={<TeacherLayout />}>
                    <Route path="/teacher" element={<ProtectedRoute allowedRoles={['teacher', 'admin']}><TeacherDashboard /></ProtectedRoute>} />
                    <Route path="/teacher/*" element={<ProtectedRoute allowedRoles={['teacher', 'admin']}><TeacherDashboard /></ProtectedRoute>} />
                  </Route>

                  {/* Admin Dashboard */}
                  <Route element={<AdminLayout />}>
                    <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/admin/*" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                  </Route>

                  {/* Student/Parent Dashboard - placeholder */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Navigate to="/" replace />
                    </ProtectedRoute>
                  } />

                  {/* 404 */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: { background: '#1f2937', color: '#fff' },
                    success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
                    error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
                  }}
                />
              </BrowserRouter>
            </AuthProvider>
          </SettingsProvider>
        </ThemeProvider>
      </HelmetProvider>
    </QueryClientProvider>
    );
  }

export default App;