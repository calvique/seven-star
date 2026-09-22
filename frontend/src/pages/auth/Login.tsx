import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { Button, Input } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

export function Login() {
  const { login } = useAuth();
  const { getSettingValue } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const schoolName = getSettingValue('general', 'school.name', 'Seven Star English Boarding School');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    try { await login(email, password, remember); navigate(from, { replace: true }); }
    catch (err: any) { setError(err?.response?.data?.message || err?.message || 'Login failed.'); }
    finally { setLoading(false); }
  };

  return <><Helmet><title>Login | {schoolName}</title><meta name="description" content={`Secure login for ${schoolName} portals.`} /></Helmet><div><h2 className="font-heading text-2xl font-bold text-gray-900">Welcome back</h2><p className="text-gray-500 mt-1">Sign in to your school account.</p>{error && <div className="mt-5 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}<form onSubmit={submit} className="mt-6 space-y-5"><Input label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email" /><Input label="Password" type={showPassword ? 'text' : 'password'} value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="current-password" rightIcon={showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />} /><label className="flex items-center gap-2 text-sm text-gray-600"><input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)} /> Remember me</label><Button type="submit" loading={loading} className="w-full"><LogIn className="w-4 h-4 mr-2"/> Sign in</Button></form><div className="flex justify-between text-sm mt-5"><Link to="/register" className="text-primary-600 hover:underline">Create account</Link><Link to="/forgot-password" className="text-primary-600 hover:underline">Forgot password?</Link></div></div></>;
}
