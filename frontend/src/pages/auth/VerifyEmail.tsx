import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import { Card, Spinner } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { SiteSeo } from '../../components/seo/SiteSeo';

export function VerifyEmail() {
  const { verifyEmail, resendVerification } = useAuth();
  const { getSettingValue } = useSettings();
  const [params] = useSearchParams();
  const schoolName = getSettingValue('general', 'school.name', 'Seven Star English Boarding School');
  const token = params.get('token') || '';
  const [state, setState] = useState<'loading'|'success'|'error'>('loading');
  const [email, setEmail] = useState('');
  const [resend, setResend] = useState(false);
  useEffect(() => { if (!token) { setState('error'); return; } verifyEmail(token).then(() => setState('success')).catch(() => setState('error')); }, [token]);
  const handleResend = async () => { if (!email) return; setResend(true); try { await resendVerification(email); } finally { setResend(false); } };
  return <>
    <SiteSeo title="Verify Email" description={`Verify your email for ${schoolName}.`} />
    <div className="min-h-[70vh] flex items-center justify-center py-12"><Card className="w-full max-w-md text-center">
      {state === 'loading' && <div className="py-10"><Spinner size="lg" /><p className="mt-4 text-gray-600">Verifying your email…</p></div>}
      {state === 'success' && <div className="py-6"><CheckCircle className="w-14 h-14 mx-auto text-green-600" /><h1 className="font-heading text-2xl font-bold mt-4">Email verified</h1><p className="text-gray-600 mt-2">Your account is ready to use.</p><Link to="/login" className="inline-flex mt-6 px-5 py-3 rounded-xl bg-primary-600 text-white">Go to login</Link></div>}
      {state === 'error' && <div className="py-6"><XCircle className="w-14 h-14 mx-auto text-red-500" /><h1 className="font-heading text-2xl font-bold mt-4">Verification failed</h1><p className="text-gray-600 mt-2">The link is invalid or expired.</p><div className="mt-6 flex gap-2"><input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="Your email" className="flex-1 rounded-xl border px-3 py-2" /><button disabled={resend || !email} onClick={handleResend} className="px-4 rounded-xl bg-gray-900 text-white disabled:opacity-50">{resend ? 'Sending…' : 'Resend'}</button></div></div>}
    </Card></div>
  </>;
}
