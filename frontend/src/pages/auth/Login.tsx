import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff, GraduationCap, Loader, Mail, Lock, Shield, Users, BookOpen } from 'lucide-react';
import { Card, Button, Input } from '../../components/ui';
import { SchoolLogo } from '../../components/branding/SchoolLogo';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

export function Login() {
  const { getSettingValue } = useSettings();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const schoolName = getSettingValue('general', 'school.name', 'Seven Star English Boarding School');
  const requestedRole = new URLSearchParams(location.search).get('role') as 'admin' | 'teacher' | 'student' | null;
  const portalLabel = requestedRole === 'admin' ? 'Admin Portal' : requestedRole === 'teacher' ? 'Teacher Portal' : requestedRole === 'student' ? 'Student Portal' : 'School Portal';
  const portalDescription = requestedRole === 'admin' ? 'Sign in to manage the school website and administration.' : requestedRole === 'teacher' ? 'Sign in to access teaching and result-entry tools.' : requestedRole === 'student' ? 'Sign in to access your student portal.' : 'Sign in to your school portal.';
  const tagline = getSettingValue('general', 'school.tagline', 'Official school information and updates');

  const validateForm = () => {
    const next: Record<string, string> = {};
    if (!formData.email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) next.email = 'Enter a valid email address';
    if (!formData.password) next.password = 'Password is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    setError(null);
    try {
      const loggedInUser = await login(formData.email.trim(), formData.password, formData.rememberMe);
      const destination = (location.state as any)?.from?.pathname || (loggedInUser?.role === 'admin' ? '/admin' : loggedInUser?.role === 'teacher' ? '/teacher' : '/dashboard');
      navigate(destination, { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Unable to sign in. Please check your email and password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login | {schoolName}</title>
        <meta name="description" content={`Secure portal login for ${schoolName}.`} />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-7">
            <Link to="/" className="inline-flex items-center gap-3">
              <SchoolLogo size="lg" />
              <div className="text-left"><h1 className="font-heading font-bold text-xl text-gray-900">{schoolName}</h1><p className="text-xs text-gray-500">{tagline}</p></div>
            </Link>
            <h2 className="font-heading font-bold text-3xl text-gray-900 mt-7">{portalLabel}</h2>
            <p className="text-gray-600 mt-2">{portalDescription}</p>
          </div>

          <Card className="bg-white/95 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="p-7 space-y-5">
              {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex gap-3"><AlertCircle className="w-5 h-5 shrink-0" />{error}</div>}
              <Input label="Email address" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} error={errors.email} placeholder="you@example.com" leftIcon={<Mail className="w-5 h-5" />} autoComplete="email" />
              <Input label="Password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} error={errors.password} placeholder="Enter your password" leftIcon={<Lock className="w-5 h-5" />} rightIcon={<button type="button" onClick={() => setShowPassword((value) => !value)} className="text-gray-400 hover:text-gray-600" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>} autoComplete="current-password" />
              <div className="flex items-center justify-between gap-4"><label className="flex items-center gap-2 text-sm text-gray-600"><input type="checkbox" checked={formData.rememberMe} onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })} className="w-4 h-4" />Remember me</label><Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 font-medium">Forgot password?</Link></div>
              <Button type="submit" loading={submitting} className="w-full">{submitting ? <><Loader className="w-4 h-4 mr-2 animate-spin" />Signing in…</> : 'Sign In'}</Button>
              <div className="pt-2 text-center text-sm text-gray-600">New to the portal? <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700">Create an account</Link></div>
            </form>
          </Card>

          <div className="grid grid-cols-3 gap-3 mt-5">
            <Link to="/admissions" className="rounded-xl bg-white border border-gray-100 p-3 text-center hover:-translate-y-0.5 transition-transform"><GraduationCap className="w-5 h-5 text-primary-600 mx-auto" /><span className="block text-xs text-gray-600 mt-1">Admission</span></Link>
            <Link to="/results" className="rounded-xl bg-white border border-gray-100 p-3 text-center hover:-translate-y-0.5 transition-transform"><BookOpen className="w-5 h-5 text-primary-600 mx-auto" /><span className="block text-xs text-gray-600 mt-1">Results</span></Link>
            <Link to="/contact" className="rounded-xl bg-white border border-gray-100 p-3 text-center hover:-translate-y-0.5 transition-transform"><Users className="w-5 h-5 text-primary-600 mx-auto" /><span className="block text-xs text-gray-600 mt-1">Contact</span></Link>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-6"><Shield className="w-4 h-4" /> Secure school portal</div>
        </div>
      </div>
    </>
  );
}
