import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Loader, AlertCircle, CheckCircle, GraduationCap, Mail, Lock, ArrowLeft, RotateCcw } from 'lucide-react';
import { Card, Button, Input, Badge } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

export function ForgotPassword() {
  const { getSettingValue } = useSettings();
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const schoolName = getSettingValue('general', 'school.name', 'Seven Star English Boarding School');
  const tagline = getSettingValue('general', 'school.tagline', 'Shaping Future Leaders');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setSubmitting(true);
    setError(null);
    try {
      await forgotPassword(formData.email);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await forgotPassword(formData.email);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend link. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderSubmitted = () => (
    <div className="text-center py-4">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="font-heading font-bold text-xl text-gray-900 mb-2">Reset Link Sent!</h3>
      <p className="text-gray-600 mb-6">
        We've sent a password reset link to <strong className="text-gray-900">{formData.email}</strong>.
        Please check your inbox (and spam folder) and follow the instructions.
      </p>
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6 text-left">
        <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
          <Mail className="w-4 h-4" />
          Didn't receive the email?
        </h4>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li>Check your spam/junk folder</li>
          <li>Make sure you entered the correct email</li>
          <li>Wait a few minutes for delivery</li>
          <li>Contact support if still not received</li>
        </ul>
      </div>
      <Button variant="outline" onClick={handleResend} loading={submitting} className="w-full mb-3">
        {submitting ? (
          <>
            <RotateCcw className="w-4 h-4 animate-spin mr-2" />
            Resending...
          </>
        ) : (
          <>
            <RotateCcw className="w-4 h-4 mr-2" />
            Resend Link
          </>
        )}
      </Button>
      <Button variant="ghost" onClick={() => { setSubmitted(false); setFormData({ email: '' }); }} className="w-full">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Enter Different Email
      </Button>
    </div>
  );

  const renderForm = () => (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary-600" />
          Enter Your Email
        </h3>

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

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Button type="submit" loading={submitting} className="w-full">
          {submitting ? (
            <>
              <Loader className="w-4 h-4 animate-spin mr-2" />
              Sending Link...
            </>
          ) : (
            <>
              <Mail className="w-4 h-4 mr-2" />
              Send Reset Link
            </>
          )}
        </Button>
      </form>
    </div>
  );

  const schoolName = getSettingValue('general', 'school.name', 'Seven Star English Boarding School');
  const tagline = getSettingValue('general', 'school.tagline', 'Shaping Future Leaders');

  return (
    <>
      <Helmet>
        <title>Forgot Password - {schoolName}</title>
        <meta name="description" content={`Reset your password for ${schoolName} - Enter your email to receive a password reset link.`} />
        <meta property="og:title" content={`Forgot Password - ${schoolName}`} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
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
            
            <Link to="/login" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
            
            <h2 className="font-heading font-bold text-2xl text-gray-900 mb-2">
              {submitted ? 'Check Your Email' : 'Forgot Password?'}
            </h2>
            <p className="text-gray-600">
              {submitted 
                ? 'We\'ve sent a password reset link to your email address.' 
                : 'Enter your email address and we\'ll send you a link to reset your password.'}
            </p>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm">
            <div className="p-8">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 animate-slide-down">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {submitted ? renderSubmitted() : renderForm()}

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  What happens next?
                </h4>
                <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                  <li>We'll send a secure reset link to your email</li>
                  <li>The link expires in 1 hour for security</li>
                  <li>Click the link to set a new password</li>
                  <li>If you don't see it, check your spam folder</li>
                </ul>
              </div>
            </div>
          </Card>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Remember your password?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Back to Login
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-gray-400 mt-8">
            © {new Date().getFullYear()} {schoolName}. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}