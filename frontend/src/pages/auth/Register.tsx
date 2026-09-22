import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Loader, AlertCircle, CheckCircle, GraduationCap, Shield, Star, BookOpen, Mail, Lock, User, Eye, EyeOff, Phone } from 'lucide-react';
import { Card, Button, Input, Select, Badge } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

export function Register() {
  const { getSettingValue } = useSettings();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'student',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const schoolName = getSettingValue('general', 'school.name', 'Seven Star English Boarding School');
  const tagline = getSettingValue('general', 'school.tagline', 'Shaping Future Leaders');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    else if (formData.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    else if (!/[A-Z]/.test(formData.password)) newErrors.password = 'Password must contain at least one uppercase letter';
    else if (!/[a-z]/.test(formData.password)) newErrors.password = 'Password must contain at least one lowercase letter';
    else if (!/[0-9]/.test(formData.password)) newErrors.password = 'Password must contain at least one number';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (formData.phone && !/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?[-\s\.]?[0-9]{4,6}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim() || undefined,
        role: formData.role,
      });
      if (result.pendingApproval) {
        setSuccess('Teacher registration received. Your account is stored in the school system and must be approved by an administrator before you can log in.');
        return;
      }
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const passwordStrength = () => {
    let strength = 0;
    if (formData.password.length >= 8) strength++;
    if (/[A-Z]/.test(formData.password)) strength++;
    if (/[a-z]/.test(formData.password)) strength++;
    if (/[0-9]/.test(formData.password)) strength++;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength++;
    return strength;
  };

  return (
    <>
      <Helmet>
        <title>Register - {schoolName}</title>
        <meta name="description" content={`Register for ${schoolName} - Create your account to access student, teacher, or parent portal.`} />
        <meta property="og:title" content={`Register - ${schoolName}`} />
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
            
            <h2 className="font-heading font-bold text-2xl text-gray-900 mb-2">Create Your Account</h2>
            <p className="text-gray-600">Join the Seven Star family today</p>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm">
            <div className="p-8">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 animate-slide-down">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 text-green-800">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{success}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-primary-600" />
                    Personal Information
                  </h3>
                </div>

                <Input
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  error={errors.name}
                  placeholder="Enter your full name"
                  leftIcon={<User className="w-5 h-5" />}
                  autoComplete="name"
                />

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
                  label="Phone Number (Optional)"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  error={errors.phone}
                  placeholder="98XXXXXXXX"
                  leftIcon={<Phone className="w-5 h-5" />}
                  autoComplete="tel"
                />

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-primary-600" />
                    Account Security
                  </h3>
                </div>

                <Select
                  label="Register As"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  options={[{ value: 'teacher', label: 'Teacher (requires approval)' }]}
                  
                  placeholder="Select your role"
                  leftIcon={<User className="w-5 h-5" />}
                />

                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  error={errors.password}
                  placeholder="Create a strong password"
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
                  autoComplete="new-password"
                />

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-1">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1.5 flex-1 rounded transition-colors ${
                            passwordStrength() >= level
                              ? level <= 2 ? 'bg-red-500' : level <= 3 ? 'bg-yellow-500' : level <= 4 ? 'bg-blue-500' : 'bg-green-500'
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {passwordStrength() <= 2 ? 'Weak' : passwordStrength() <= 3 ? 'Fair' : passwordStrength() <= 4 ? 'Good' : 'Strong'}
                    </p>
                  </div>
                )}

                <Input
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  error={errors.confirmPassword}
                  placeholder="Confirm your password"
                  leftIcon={<Lock className="w-5 h-5" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-gray-400 hover:text-gray-600"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  }
                  autoComplete="new-password"
                />

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the school's account and portal terms.
                  </label>
                </div>

                <Button type="submit" loading={submitting} className="w-full">
                  {submitting ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin mr-2" />
                      Creating Account...
                    </>
                  ) : 'Create Account'}
                </Button>

                <div className="text-center text-sm text-gray-500">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                    Sign In
                  </Link>
                </div>
              </form>
            </div>
          </Card>

          {/* Benefits */}
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-primary-50 rounded-lg">
              <Shield className="w-5 h-5 text-primary-600 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Secure & Private</p>
            </div>
            <div className="p-3 bg-secondary-50 rounded-lg">
              <Star className="w-5 h-5 text-secondary-600 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Instant Access</p>
            </div>
            <div className="p-3 bg-accent-50 rounded-lg">
              <BookOpen className="w-5 h-5 text-accent-600 mx-auto mb-1" />
              <p className="text-xs text-gray-600">All Resources</p>
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

// Need to import Phone
import { Phone, Mail, Lock, User, Eye, EyeOff, Google, Facebook } from 'lucide-react';