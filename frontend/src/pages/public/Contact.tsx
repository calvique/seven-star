import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, MapPin, Phone, Mail, Clock, Send, Loader, CheckCircle, AlertCircle, Building, Users, GraduationCap, Shield, Star, Globe2, PlayCircle, Camera, MapPin as MapPinIcon, Phone as PhoneIcon, Mail as MailIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, Badge, Button, Input, Textarea, Select } from '../../components/ui';
import { useSettings } from '../../context/SettingsContext';
import { api } from '../../services/api';

export function Contact() {
  const { getSettingValue } = useSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    category: 'general',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const schoolName = getSettingValue('general', 'school.name', 'Seven Star English Boarding School');
  const tagline = getSettingValue('general', 'school.tagline', 'Shaping Future Leaders');
  const address = getSettingValue('general', 'school.address', 'Devdaha-2, Rupandehi, Nepal');
  const phone = getSettingValue('general', 'school.phone', '9857078448');
  const email = getSettingValue('general', 'school.email', 'sevenstar.school2063@gmail.com');
  const officeHours = getSettingValue('general', 'school.officeHours', 'Sun - Fri: 9:00 AM - 5:00 PM');
  const principalName = getSettingValue('contact', 'contact.principal.name', 'Mr. Tikaram Chapagain');
  const principalPhone = getSettingValue('contact', 'contact.principal.phone', '9857078448');
  const principalEmail = getSettingValue('contact', 'contact.principal.email', 'tikaramchapain238@gmail.com');
  const chairmanName = getSettingValue('contact', 'contact.chairman.name', 'Mr. Prajapati Sapkota');
  const chairmanPhone = getSettingValue('contact', 'contact.chairman.phone', '9857024293');
  const vicePrincipalName = getSettingValue('contact', 'contact.vicePrincipal.name', 'Mr. Mohan Giri');
  const vicePrincipalPhone = getSettingValue('contact', 'contact.vicePrincipal.phone', '9851206206');
  const facebookUrl = getSettingValue('social', 'social.facebook', 'https://www.facebook.com/sevenstar.boarding');

  const categories = [
    { value: 'admission', label: 'Admission Inquiry' },
    { value: 'general', label: 'General Inquiry' },
    { value: 'academic', label: 'Academic Related' },
    { value: 'facility', label: 'Facility Related' },
    { value: 'complaint', label: 'Complaint' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'other', label: 'Other' },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    else if (formData.message.trim().length < 10) newErrors.message = 'Message must be at least 10 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setSubmitting(true);
    try {
      await api.post('/contacts', formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '', category: 'general' });
    } catch (error: any) {
      console.error('Contact submission failed:', error);
      alert(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - {schoolName}</title>
        <meta name="description" content={`Contact ${schoolName} - Devdaha-2, Rupandehi, Nepal. Phone: ${phone}, Email: ${email}. Get in touch for admissions, academics, or general inquiries.`} />
        <meta property="og:title" content={`Contact Us - ${schoolName}`} />
        <meta property="og:description" content="Get in touch with Seven Star English Boarding School for admissions, academics, or general inquiries." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20 lg:py-32">
          <div className="container-custom">
            <div className="max-w-3xl">
              <Link to="/" className="inline-flex items-center gap-2 text-primary-100 hover:text-white mb-6 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                Back to Home
              </Link>
              <Badge variant="secondary" className="mb-6">Get in Touch</Badge>
              <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
                Contact Us
              </h1>
              <p className="text-lg md:text-xl text-primary-100 mb-8">
                We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="section bg-gray-50 -mt-8">
          <div className="container-custom">
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <Card className="text-center">
                <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPinIcon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="font-heading font-bold text-xl text-gray-900 mb-1">Visit Us</h3>
                <p className="text-sm text-gray-500">{address}</p>
              </Card>
              <Card className="text-center">
                <div className="w-14 h-14 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <PhoneIcon className="w-7 h-7 text-secondary-600" />
                </div>
                <h3 className="font-heading font-bold text-xl text-gray-900 mb-1">Call Us</h3>
                <a href={`tel:${phone}`} className="text-sm text-gray-500 hover:text-secondary-600 transition-colors">{phone}</a>
              </Card>
              <Card className="text-center">
                <div className="w-14 h-14 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MailIcon className="w-7 h-7 text-accent-600" />
                </div>
                <h3 className="font-heading font-bold text-xl text-gray-900 mb-1">Email Us</h3>
                <a href={`mailto:${email}`} className="text-sm text-gray-500 hover:text-accent-600 transition-colors">{email}</a>
              </Card>
              <Card className="text-center">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="font-heading font-bold text-xl text-gray-900 mb-1">Office Hours</h3>
                <p className="text-sm text-gray-500">{officeHours}</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="section bg-white">
          <div className="container-custom">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card className="h-full">
                  <div className="p-6">
                    {!submitted ? (
                      <>
                        <h2 className="font-heading font-bold text-2xl text-gray-900 mb-2">Send us a Message</h2>
                        <p className="text-gray-600 mb-8">Fill out the form below and we'll get back to you within 24 hours.</p>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                          <div className="grid md:grid-cols-2 gap-6">
                            <Input
                              label="Full Name *"
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                              error={errors.name}
                              placeholder="Your full name"
                            />
                            <Input
                              label="Email Address *"
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              error={errors.email}
                              placeholder="your@email.com"
                            />
                          </div>
                          <div className="grid md:grid-cols-2 gap-6">
                            <Input
                              label="Phone Number"
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                              placeholder="98XXXXXXXX"
                            />
                            <Select
                              label="Category *"
                              value={formData.category}
                              onChange={(e) => setFormData({...formData, category: e.target.value})}
                              options={categories}
                              placeholder="Select category"
                            />
                          </div>
                          <Input
                            label="Subject *"
                            value={formData.subject}
                            onChange={(e) => setFormData({...formData, subject: e.target.value})}
                            error={errors.subject}
                            placeholder="Brief subject of your inquiry"
                          />
                          <Textarea
                            label="Message *"
                            value={formData.message}
                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                            error={errors.message}
                            placeholder="Describe your inquiry in detail..."
                            rows={5}
                          />
                          <Button type="submit" loading={submitting} className="w-full">
                            {submitting ? (
                              <>
                                <Loader className="w-4 h-4 animate-spin mr-2" />
                                Sending...
                              </>
                            ) : 'Send Message'}
                          </Button>
                        </form>
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="font-heading font-bold text-xl text-gray-900 mb-2">Message Sent Successfully!</h3>
                        <p className="text-gray-600 mb-6">Thank you for contacting us. We'll get back to you within 24 hours.</p>
                        <Button variant="outline" onClick={() => setSubmitted(false)}>
                          Send Another Message
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              {/* Contact Info */}
              <div className="lg:col-span-1 space-y-6">
                {/* School Leadership */}
                <Card>
                  <div className="p-6">
                    <h3 className="font-heading font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-primary-600" />
                      School Leadership
                    </h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-900">Mr. Prajapati Sapkota</h4>
                        <p className="text-primary-600 text-sm mb-2">Chairman</p>
                        <div className="space-y-1 text-sm text-gray-600">
                          <a href={`tel:${chairmanPhone}`} className="flex items-center gap-2 hover:text-primary-600 transition-colors">
                            <Phone className="w-4 h-4" /> {chairmanPhone}
                          </a>
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-900">Mr. Tikaram Chapagain</h4>
                        <p className="text-primary-600 text-sm mb-2">Principal / Secretary</p>
                        <div className="space-y-1 text-sm text-gray-600">
                          <a href={`tel:${principalPhone}`} className="flex items-center gap-2 hover:text-primary-600 transition-colors">
                            <Phone className="w-4 h-4" /> {principalPhone}
                          </a>
                          <a href={`mailto:${principalEmail}`} className="flex items-center gap-2 hover:text-primary-600 transition-colors">
                            <Mail className="w-4 h-4" /> {principalEmail}
                          </a>
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-900">Mr. Mohan Giri</h4>
                        <p className="text-primary-600 text-sm mb-2">Vice Principal</p>
                        <div className="space-y-1 text-sm text-gray-600">
                          <a href={`tel:${vicePrincipalPhone}`} className="flex items-center gap-2 hover:text-primary-600 transition-colors">
                            <Phone className="w-4 h-4" /> {vicePrincipalPhone}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Quick Links */}
                <Card>
                  <div className="p-6">
                    <h3 className="font-heading font-semibold text-lg text-gray-900 mb-4">Quick Links</h3>
                    <nav className="space-y-3">
                      <Link to="/admissions" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <GraduationCap className="w-5 h-5 text-primary-600" />
                        <span className="text-gray-700">Admissions</span>
                      </Link>
                      <Link to="/academics" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <GraduationCap className="w-5 h-5 text-primary-600" />
                        <span className="text-gray-700">Academic Programs</span>
                      </Link>
                      <Link to="/facilities" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <Building className="w-5 h-5 text-primary-600" />
                        <span className="text-gray-700">Facilities</span>
                      </Link>
                      <Link to="/gallery" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <Image className="w-5 h-5 text-primary-600" />
                        <span className="text-gray-700">Photo Gallery</span>
                      </Link>
                      <Link to="/downloads" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <Download className="w-5 h-5 text-primary-600" />
                        <span className="text-gray-700">Downloads</span>
                      </Link>
                      <Link to="/notices" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <Bell className="w-5 h-5 text-primary-600" />
                        <span className="text-gray-700">Notices</span>
                      </Link>
                    </nav>
                  </div>
                </Card>

                {/* Social Media */}
                <Card>
                  <div className="p-6">
                    <h3 className="font-heading font-semibold text-lg text-gray-900 mb-4">Follow Us</h3>
                    <div className="space-y-3">
                      <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                        <Globe2 className="w-6 h-6 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">Facebook</p>
                          <p className="text-sm text-gray-500">@sevenstar.boarding</p>
                        </div>
                      </a>
                      <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-red-50 hover:bg-red-100 transition-colors">
                        <PlayCircle className="w-6 h-6 text-red-600" />
                        <div>
                          <p className="font-medium text-gray-900">YouTube</p>
                          <p className="text-sm text-gray-500">Seven Star School</p>
                        </div>
                      </a>
                      <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-pink-50 hover:bg-pink-100 transition-colors">
                        <Camera className="w-6 h-6 text-pink-600" />
                        <div>
                          <p className="font-medium text-gray-900">Instagram</p>
                          <p className="text-sm text-gray-500">@sevenstarschool</p>
                        </div>
                      </a>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Map Placeholder */}
        <section className="section bg-gray-50">
          <div className="container-custom">
            <Card className="overflow-hidden">
              <div className="aspect-[16/9] bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center relative">
                <MapPin className="w-16 h-16 text-primary-200" />
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-heading font-semibold text-gray-900 mb-1">{schoolName}</h3>
                  <p className="text-gray-600 text-sm">{address}</p>
                  <p className="text-primary-600 text-sm font-medium mt-1">View on Google Maps →</p>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
}