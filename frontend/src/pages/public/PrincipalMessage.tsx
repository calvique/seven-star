import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Mail, Phone, Award, Users, GraduationCap, BookOpen, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, Badge } from '../../components/ui';
import { useSettings } from '../../context/SettingsContext';

export function PrincipalMessage() {
  const { getSettingValue } = useSettings();

  const schoolName = getSettingValue('general', 'school.name', 'Seven Star English Boarding School');
  const tagline = getSettingValue('general', 'school.tagline', 'Shaping Future Leaders');
  const established = getSettingValue('general', 'school.established', '2063 B.S.');
  const address = getSettingValue('general', 'school.address', 'Devdaha-2, Rupandehi, Nepal');
  const phone = getSettingValue('general', 'school.phone', '9857078448');
  const email = getSettingValue('general', 'school.email', 'sevenstar.school2063@gmail.com');

  const principal = {
    name: 'Mr. Tikaram Chapagain',
    role: 'Principal / Secretary',
    phone: '9857078448',
    email: 'tikaramchapain238@gmail.com',
    message: `Dear Students, Parents, Teachers, and Friends of Seven Star,

Welcome to Seven Star English Boarding School - a place where dreams take flight and potential finds its purpose.

As Principal, I have the privilege of witnessing the daily transformation that happens within our school walls. Every morning, I see bright-eyed children stepping through our gates, carrying hopes, curiosity, and the promise of tomorrow. It is our solemn responsibility to nurture that promise and guide it toward fruition.

Since our establishment in 2063 B.S., Seven Star has stood as a beacon of quality education in Devdaha, Rupandehi. Our journey from a modest beginning to a premier institution offering Nursery through Grade 12 with NEB-affiliated +2 programs in Science, Management, and Hotel Management is a testament to the dedication of our founders, the tireless efforts of our faculty, and the unwavering trust of our parent community.

What makes Seven Star special? It is our unwavering commitment to the holistic development of every child. We understand that education is not merely about academic scores - though we take great pride in our 100% SEE pass rate for eight consecutive years and our students' outstanding achievements in +2 board examinations. True education, as we practice it here, encompasses:

**Academic Rigor:** Our curriculum goes beyond NEB requirements, incorporating critical thinking, problem-solving, and project-based learning that prepares students for higher education and beyond.

**Character Formation:** We instill values of integrity, empathy, respect, and social responsibility. Our students learn that success is meaningful only when coupled with service to others.

**Co-curricular Excellence:** From sports to arts, debates to science fairs, leadership programs to community service - we provide platforms for every talent to shine.

**Technology Integration:** Modern classrooms, well-equipped labs, and digital resources ensure our students are future-ready.

**Individual Attention:** With a favorable student-teacher ratio, our educators know each student's strengths, challenges, and aspirations.

To our students: You are the reason this school exists. Your questions, your struggles, your victories - they are the heartbeat of Seven Star. Embrace every opportunity, learn from every setback, and never stop believing in your potential.

To our parents: You are our partners in this noble endeavor. Your trust, support, and active involvement make our educational ecosystem complete. Together, we can achieve what neither can alone.

To my dedicated colleagues: Thank you for your passion, patience, and perseverance. You are the architects of tomorrow, one lesson at a time.

As we look to the future, we are excited about new initiatives - expanded STEM programs, enhanced career counseling, international collaborations, and continued infrastructure development. Our commitment remains steadfast: to provide an education that empowers, inspires, and transforms.

Visit our campus, meet our community, and experience the Seven Star difference. Let us work together to shape not just successful careers, but meaningful lives.

With dedication and hope,

Mr. Tikaram Chapagain
Principal / Secretary
Seven Star English Boarding School`,
  };

  return (
    <>
      <Helmet>
        <title>Principal's Message - {schoolName}</title>
        <meta name="description" content={`Message from the Principal of ${schoolName}, Mr. Tikaram Chapagain. Learn about our educational philosophy, academic programs, and commitment to student success.`} />
        <meta property="og:title" content={`Principal's Message - ${schoolName}`} />
        <meta property="og:description" content={principal.message.substring(0, 160)} />
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
                Principal's Message
              </h1>
              <div className="flex items-center gap-6 text-primary-200">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  <a href={`mailto:${principal.email}`} className="hover:text-white transition-colors">{principal.email}</a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  <a href={`tel:${principal.phone}`} className="hover:text-white transition-colors">{principal.phone}</a>
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
                    <h3 className="font-heading font-bold text-xl text-gray-900">{principal.name}</h3>
                    <p className="text-primary-600 font-medium">{principal.role}</p>
                    <p className="text-sm text-gray-500 mt-1">{schoolName}</p>
                  </div>
                  <div className="border-t border-gray-100 pt-6 space-y-4">
                    <a href={`tel:${principal.phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors">
                      <Phone className="w-4 h-4" />
                      <span>{principal.phone}</span>
                    </a>
                    <a href={`mailto:${principal.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors">
                      <Mail className="w-4 h-4" />
                      <span>{principal.email}</span>
                    </a>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{address}</span>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 pt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Quick Links</h4>
                    <nav className="space-y-2">
                      <Link to="/about/chairman" className="block text-sm text-gray-600 hover:text-primary-600 transition-colors">Chairman's Message</Link>
                      <Link to="/about/mission-vision" className="block text-sm text-gray-600 hover:text-primary-600 transition-colors">Mission & Vision</Link>
                      <Link to="/about/history" className="block text-sm text-gray-600 hover:text-primary-600 transition-colors">Our History</Link>
                      <Link to="/academics" className="block text-sm text-gray-600 hover:text-primary-600 transition-colors">Academic Programs</Link>
                    </nav>
                  </div>
                </Card>
              </aside>

              {/* Main Content */}
              <div className="lg:col-span-3">
                <Card className="prose prose-gray max-w-none">
                  <div className="whitespace-pre-wrap leading-relaxed text-gray-700 text-lg">
                    {principal.message.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="mb-6">{paragraph}</p>
                    ))}
                  </div>
                  <div className="border-t border-gray-200 pt-6 mt-8">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-heading font-bold text-lg text-gray-900">{principal.name}</p>
                        <p className="text-primary-600">{principal.role}</p>
                        <p className="text-sm text-gray-500">{schoolName}</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Educational Philosophy */}
                <div className="mt-8">
                  <h3 className="font-heading font-bold text-2xl text-gray-900 mb-6">Our Educational Philosophy</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      { icon: Target, title: 'Student-Centered Learning', description: 'Every child learns differently. Our teachers adapt methods to suit individual learning styles.' },
                      { icon: BookOpen, title: 'Conceptual Understanding', description: 'We go beyond rote memorization to develop deep understanding and critical thinking.' },
                      { icon: Award, title: 'Continuous Assessment', description: 'Regular formative assessments guide instruction and support student growth.' },
                      { icon: Users, title: 'Collaborative Environment', description: 'Learning thrives in community. We foster teamwork, peer learning, and mutual respect.' },
                    ].map((item) => (
                      <Card key={item.title} hover className="h-full">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mb-3">
                          <item.icon className="w-5 h-5 text-primary-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}