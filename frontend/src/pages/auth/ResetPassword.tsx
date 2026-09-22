import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Eye, EyeOff, Lock } from 'lucide-react';
import { Button, Card, Input } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { SiteSeo } from '../../components/seo/SiteSeo';

export function ResetPassword() {
  const { resetPassword } = useAuth();
  const { getSettingValue } = useSettings();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token') || '';
  const schoolName = getSettingValue('general', 'school.name', 'Seven Star English Boarding School');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!token) return setError('This password reset link is invalid or missing.');
    if (password.length < 8) return setError('Password must be at least 8 characters.');
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      return setError('Use at least one uppercase letter, one lowercase letter and one number.');
    }
    if (password !== confirm) return setError('Passwords do not match.');
    setLoading(true);
    try {
      await resetPassword(token, password);
      navigate('/login?reset=success', { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Unable to reset password. The link may have expired.');
    } finally { setLoading(false); }
  };

  return <>
    <SiteSeo title="Reset Password" description={`Reset your password for ${schoolName}.`} />
    <div className="min-h-[70vh] flex items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-6"><div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center"><Lock className="w-5 h-5 text-primary-600" /></div><div><h1 className="font-heading text-2xl font-bold">Reset password</h1><p className="text-sm text-gray-500">Create a new secure password.</p></div></div>
        {error && <div className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700 flex gap-2"><AlertCircle className="w-5 h-5 shrink-0" />{error}</div>}
        <form onSubmit={submit} className="space-y-4">
          <Input label="New password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} rightIcon={<button type="button" onClick={() => setShowPassword((v) => !v)}>{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>} />
          <Input label="Confirm password" type={showConfirm ? 'text' : 'password'} value={confirm} onChange={(e) => setConfirm(e.target.value)} rightIcon={<button type="button" onClick={() => setShowConfirm((v) => !v)}>{showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>} />
          <Button type="submit" loading={loading} className="w-full">Update password</Button>
        </form>
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-primary-600 hover:underline mt-5"><ArrowLeft className="w-4 h-4" /> Back to login</Link>
      </Card>
    </div>
  </>;
}
