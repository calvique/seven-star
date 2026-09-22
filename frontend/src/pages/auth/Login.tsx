import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader, AlertCircle, CheckCircle, GraduationCap, Shield, Star, Users, BookOpen } from 'lucide-react';
import { Card, Button, Input, Badge } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

export function Login() {
  const { getSettingValue } = useSettings();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const schoolName = getSettingValue('general', 'school.name', 'Seven Star English Boarding School');
  const tagline = getSettingValue('general', 'school.tagline', 'Shaping Future Leaders');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setSubmitting(true);
    setError(null);
    try {
      await login(formData.email, formData.password, formData.rememberMe);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - {schoolName}</title>
        <meta name="description" content={`Login to ${schoolName} - Access your student, teacher, or admin dashboard.`} />
        <meta property="og:title" content={`Login - ${schoolName}`} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo & Brand */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3 mb-6">
              <div className="w-14 h-14 bg-primary-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="font-heading font-bold text-xl text-gray-900">{schoolName}</h1>
                <p className="text-xs text-gray-500">{tagline}</p>
              </div>
            </Link>
            
            <h2 className="font-heading font-bold text-2xl text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to access your dashboard</p>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm">
            <div className="p-8">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 animate-slide-down">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  error={errors.email}
                  placeholder="you@email.com"
                  leftIcon={<Mail className="w-5 h-5" />}
                  autoComplete="email"
                />

                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  error={errors.password}
                  placeholder="Enter your password"
                  leftIcon={<Lock className="w-5 h-5" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  }
                  autoComplete="current-password"
                />

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                      className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                    Forgot Password?
                  </Link>
                </div>

                <Button type="submit" loading={submitting} className="w-full">
                  {submitting ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin mr-2" />
                      Signing in...
                    </>
                  ) : 'Sign In'}
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    <Google className="w-5 h-5" />
                    Google
                  </button>
                  <button className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    <Facebook className="w-5 h-5" />
                    Facebook
                  </button>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                    Register
                  </Link>
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  By signing in, you agree to our{' '}
                  <Link to="/terms" className="text-primary-600 hover:underline">Terms of Service</Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>
                </p>
              </div>
            </div>
          </Card>

          {/* Quick Links */}
          <div className="mt-6 space-y-3 text-center text-sm">
            <Link to="/admissions" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium">
              <GraduationCap className="w-4 h-4" />
              Apply for Admission
            </Link>
            <Link to="/results" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium">
              <FileText className="w-4 h-4" />
              Check Results
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium">
              <Mail className="w-4 h-4" />
              Contact Us
            </Link>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-primary-50 rounded-lg">
              <Shield className="w-6 h-6 text-primary-600 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Secure Login</p>
            </div>
            <div className="p-3 bg-secondary-50 rounded-lg">
              <Star className="w-6 h-6 text-secondary-600 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Quick Access</p>
            </div>
            <div className="p-3 bg-accent-50 rounded-lg">
              <Users className="w-6 h-6 text-accent-600 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Multi-Role</p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          © {new Date().getFullYear()} {schoolName}. All rights reserved.
        </p>
      </div>
    </>
  );
}

// Need to import missing icons
import { Mail, Lock, Google, Facebook, Lock as LockIcon } from 'lucide-react';