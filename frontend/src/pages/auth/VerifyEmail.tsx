import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Loader, AlertCircle, CheckCircle, GraduationCap, Mail, ArrowLeft, Clock, Shield, Sparkles } from 'lucide-react';
import { Card, Button, Badge } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

export function VerifyEmail() {
  const { getSettingValue } = useSettings();
  const { verifyEmail, resendVerification } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resending, setResending] = useState(false);
  const [email, setEmail] = useState('');
  const [tokenValid, setTokenValid] = useState(true);
  const [tokenChecked, setTokenChecked] = useState(false);

  const urlToken = searchParams.get('token');
  const schoolName = getSettingValue('general', 'school.name', 'Seven Star English Boarding School');
  const tagline = getSettingValue('general', 'school.tagline', 'Shaping Future Leaders');

  useEffect(() => {
    if (urlToken) {
      setToken(urlToken);
    }
  }, [urlToken]);

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setTokenValid(false);
        setTokenChecked(true);
        return;
      }
      try {
        await verifyEmail(token);
        setSuccess(true);
        setTokenValid(true);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Invalid or expired verification token');
        setTokenValid(false);
      } finally {
        setTokenChecked(true);
      }
    };
    verify();
  }, [token]);

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    setError(null);
    try {
      await resendVerification(email);
      // Show success toast/message
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend verification email');
    } finally {
      setResending(false);
    }
  };

  const schoolName = getSettingValue('general', 'school.name', 'Seven Star English Boarding School');
  const tagline = getSettingValue('general', 'school.tagline', 'Shaping Future Leaders');

  if (!tokenChecked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto text-primary-600" />
          <p className="text-gray-600 mt-4">Verifying your email...</p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="bg-white/80 backdrop-blur-sm">
            <div className="p-8 text-center">
              <Link to="/" className="inline-flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-primary-600 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="font-heading font-bold text-xl text-gray-900">{schoolName}</h1>
                  <p className="text-xs text-gray-500">{tagline}</p>
                </div>
              </Link>

              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="font-heading font-bold text-xl text-gray-900 mb-2">Verification Failed</h2>
              <p className="text-gray-600 mb-6">{error || 'This verification link is invalid or has expired.'}</p>
              
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-left">
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Need a new verification link?
                  </h4>
                  <p className="text-sm text-blue-700 mb-3">Enter your email to receive a new verification link.</p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                      onClick={handleResend}
                      disabled={resending || !email}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {resending ? 'Sending...' : 'Resend Link'}
                    </button>
                  </div>
                </div>
                
                <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="bg-white/80 backdrop-blur-sm">
            <div className="p-8 text-center">
              <Link to="/" className="inline-flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-primary-600 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="font-heading font-bold text-xl text-gray-900">{schoolName}</h1>
                  <p className="text-xs text-gray-500">{tagline}</p>
                </div>
              </Link>

              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="font-heading font-bold text-xl text-gray-900 mb-2">Email Verified Successfully!</h2>
              <p className="text-gray-600 mb-6">Your email address has been verified. You can now access all features of your account.</p>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6 text-left">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  What's Next?
                </h4>
                <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
                  <li>Full access to your dashboard</li>
                  <li>Receive important notifications</li>
                  <li>Access to all school resources</li>
                  <li>Secure account recovery</li>
                </ul>
              </div>

              <Link to="/login" className="inline-flex items-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
                <Sparkles className="w-4 h-4" />
                Sign In to Your Account
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        <Loader className="w-8 h-8 animate-spin mx-auto text-primary-600" />
        <p className="text-gray-600 mt-4">Verifying your email...</p>
      </div>
    </div>
  );
}