import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Mail, Phone, Award, Users, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, Badge } from '../../components/ui';
import { useSettings } from '../../context/SettingsContext';

export function ChairmanMessage() {
  const { getSettingValue } = useSettings();

  const schoolName = getSettingValue('general', 'school.name', 'Seven Star English Boarding School');
  const tagline = getSettingValue('general', 'school.tagline', 'Shaping Future Leaders');
  const established = getSettingValue('general', 'school.established', '2063 B.S.');
  const address = getSettingValue('general', 'school.address', 'Devdaha-2, Rupandehi, Nepal');
  const phone = getSettingValue('general', 'school.phone', '9857078448');
  const email = getSettingValue('general', 'school.email', 'sevenstar.school2063@gmail.com');

  const chairman = {
    name: 'Mr. Prajapati Sapkota',
    role: 'Chairman',
    phone: '9857024293',
    email: 'sevenstar.school2063@gmail.com',
    message: `Dear Students, Parents, and Well-wishers,

It gives me immense pleasure to welcome you to Seven Star English Boarding School. Since our establishment in 2063 B.S., we have been on a remarkable journey of transforming young minds and shaping future leaders.

Our school was founded with a simple yet powerful vision: to provide quality education that goes beyond textbooks and examinations. We believe that true education nurtures not just academic excellence, but also character, creativity, critical thinking, and compassion.

Over the past 19+ years, we have witnessed countless success stories. Our students have consistently achieved 100% pass rates in SEE examinations, with many securing top positions at district and national levels. Our +2 programs in Science, Management, and Hotel Management have produced graduates who are now excelling in universities across Nepal and abroad.

But our proudest achievements are not just in numbers. They are in the confident, responsible, and compassionate young adults who graduate from our halls. They carry with them the values of integrity, respect, perseverance, and service to community - the true hallmarks of a Seven Star education.

As Chairman, I am committed to ensuring that our school continues to evolve with the changing educational landscape while staying true to our core values. We are investing in modern infrastructure, technology integration, faculty development, and innovative teaching methodologies to provide our students with the best possible learning experience.

To our parents and guardians: thank you for entrusting us with your children's education. Your partnership is invaluable in this journey.

To our students: dream big, work hard, and remember that every challenge is an opportunity to grow. You are the future leaders of our nation, and we are honored to be part of your journey.

To our dedicated teachers and staff: your passion and commitment make all the difference. Thank you for inspiring excellence every day.

Together, let us continue to shine as Seven Stars, illuminating the path for generations to come.

With warm regards and best wishes,

Mr. Prajapati Sapkota
Chairman
Seven Star English Boarding School`,
  };

  return (
    <>
      <Helmet>
        <title>Chairman's Message - {schoolName}</title>
        <meta name="description" content={`Message from the Chairman of ${schoolName}, Mr. Prajapati Sapkota. Learn about our vision, mission, and commitment to quality education since ${established}.`} />
        <meta property="og:title" content={`Chairman's Message - ${schoolName}`} />
        <meta property="og:description" content={chairman.message.substring(0, 160)} />
        <meta property="og:type" content="article" />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20 lg:py-32">
          <div className="container-custom">
            <div className="max-w-3xl">
              <Link to="/about" className="inline-flex items-center gap-2 text-primary-100 hover:text-white mb-6 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                Back to About
              </Link>
              <Badge variant="secondary" className="mb-6">Leadership Message</Badge>
              <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
                Chairman's Message
              </h1>
              <div className="flex items-center gap-6 text-primary-200">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  <a href={`mailto:${chairman.email}`} className="hover:text-white transition-colors">{chairman.email}</a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  <a href={`tel:${chairman.phone}`} className="hover:text-white transition-colors">{chairman.phone}</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Message Content */}
        <section className="section bg-white">
          <div className="container-custom">
            <div className="grid lg:grid-cols-4 gap-12">
              {/* Sidebar */}
              <aside className="lg:col-span-1">
                <Card className="sticky top-28">
                  <div className="text-center mb-6">
                    <div className="w-28 h-28 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                      <GraduationCap className="w-12 h-12 text-primary-600" />
                    </div>
                    <h3 className="font-heading font-bold text-xl text-gray-900">{chairman.name}</h3>
                    <p className="text-primary-600 font-medium">{chairman.role}</p>
                    <p className="text-sm text-gray-500 mt-1">{schoolName}</p>
                  </div>
                  <div className="border-t border-gray-100 pt-6 space-y-4">
                    <a href={`tel:${chairman.phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors">
                      <Phone className="w-4 h-4" />
                      <span>{chairman.phone}</span>
                    </a>
                    <a href={`mailto:${chairman.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors">
                      <Mail className="w-4 h-4" />
                      <span>{chairman.email}</span>
                    </a>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{address}</span>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 pt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Quick Links</h4>
                    <nav className="space-y-2">
                      <Link to="/about/principal" className="block text-sm text-gray-600 hover:text-primary-600 transition-colors">Principal's Message</Link>
                      <Link to="/about/mission-vision" className="block text-sm text-gray-600 hover:text-primary-600 transition-colors">Mission & Vision</Link>
                      <Link to="/about/history" className="block text-sm text-gray-600 hover:text-primary-600 transition-colors">Our History</Link>
                      <Link to="/admissions" className="block text-sm text-gray-600 hover:text-primary-600 transition-colors">Admissions</Link>
                    </nav>
                  </div>
                </Card>
              </aside>

              {/* Main Content */}
              <div className="lg:col-span-3">
                <Card className="prose prose-gray max-w-none">
                  <div className="whitespace-pre-wrap leading-relaxed text-gray-700 text-lg">
                    {chairman.message.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="mb-6">{paragraph}</p>
                    ))}
                  </div>
                  <div className="border-t border-gray-200 pt-6 mt-8">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-heading font-bold text-lg text-gray-900">{chairman.name}</p>
                        <p className="text-primary-600">{chairman.role}</p>
                        <p className="text-sm text-gray-500">{schoolName}</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Key Highlights */}
                <div className="mt-8 grid md:grid-cols-3 gap-6">
                  <Card className="text-center bg-primary-50 border-primary-200">
                    <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Award className="w-7 h-7 text-primary-600" />
                    </div>
                    <h4 className="font-heading font-semibold text-gray-900 mb-1">Academic Excellence</h4>
                    <p className="text-sm text-gray-600">100% SEE pass rate for 8+ consecutive years</p>
                  </Card>
                  <Card className="text-center bg-accent-50 border-accent-200">
                    <div className="w-14 h-14 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-7 h-7 text-accent-600" />
                    </div>
                    <h4 className="font-heading font-semibold text-gray-900 mb-1">Student Community</h4>
                    <p className="text-sm text-gray-600">900+ students from Nursery to Grade 12</p>
                  </Card>
                  <Card className="text-center bg-secondary-50 border-secondary-200">
                    <div className="w-14 h-14 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <GraduationCap className="w-7 h-7 text-secondary-600" />
                    </div>
                    <h4 className="font-heading font-semibold text-gray-900 mb-1">Experienced Faculty</h4>
                    <p className="text-sm text-gray-600">80+ qualified teachers with B.Ed/M.Ed degrees</p>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}