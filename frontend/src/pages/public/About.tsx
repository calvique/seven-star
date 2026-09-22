import React from 'react';
import { Helmet } from 'react-helmet-async';
import { GraduationCap, Award, Users, BookOpen, MapPin, Calendar, Target, Heart, Phone } from 'lucide-react';
import { Card, Badge } from '../../components/ui';
import { useSettings } from '../../context/SettingsContext';

export function About() {
  const { getSettingValue } = useSettings();

  const schoolName = getSettingValue('general', 'school.name', 'Seven Star English Boarding School');
  const tagline = getSettingValue('general', 'school.tagline', 'Shaping Future Leaders');
  const established = getSettingValue('general', 'school.established', '2063 B.S.');
  const address = getSettingValue('general', 'school.address', 'Devdaha-2, Rupandehi, Nepal');
  const phone = getSettingValue('general', 'school.phone', '9857078448');
  const email = getSettingValue('general', 'school.email', 'sevenstar.school2063@gmail.com');

  const milestones = [
    { year: '2063 B.S.', title: 'Foundation', description: 'School established in Devdaha-2, Rupandehi with a vision for quality education.' },
    { year: '2065 B.S.', title: 'First Batch', description: 'First batch of students enrolled from Nursery to Grade 5.' },
    { year: '2070 B.S.', title: 'Secondary Level', description: 'Upgraded to secondary level (Grade 10) with NEB affiliation.' },
    { year: '2075 B.S.', title: '+2 Programs', description: 'Launched NEB affiliated +2 programs in Science, Management, and Hotel Management.' },
    { year: '2078 B.S.', title: '100% SEE Pass', description: 'Achieved 100% SEE pass rate consecutively for 5+ years.' },
    { year: '2080 B.S.', title: 'Modern Campus', description: 'New academic block, science labs, computer lab, and sports complex inaugurated.' },
  ];

  const coreValues = [
    { icon: Target, title: 'Academic Excellence', description: 'Rigorous curriculum aligned with NEB standards producing top results.' },
    { icon: Heart, title: 'Character Building', description: 'Values-based education fostering integrity, respect, and responsibility.' },
    { icon: Users, title: 'Holistic Development', description: 'Balanced focus on academics, sports, arts, and leadership.' },
    { icon: Award, title: 'Innovation', description: 'Modern teaching methods with technology integration.' },
    { icon: BookOpen, title: 'Inclusivity', description: 'Equal opportunities for all students regardless of background.' },
    { icon: GraduationCap, title: 'Lifelong Learning', description: 'Instilling curiosity and love for learning beyond classroom.' },
  ];

  const leadership = [
    { name: 'Mr. Prajapati Sapkota', role: 'Chairman', phone: '9857024293', email: 'sevenstar.school2063@gmail.com' },
    { name: 'Mr. Tikaram Chapagain', role: 'Principal / Secretary', phone: '9857078448', email: 'tikaramchapain238@gmail.com' },
    { name: 'Mr. Mohan Giri', role: 'Vice Principal', phone: '9851206206', email: '' },
    { name: 'Mr. Muktiram Chapagain', role: 'Board Member', phone: '', email: '' },
  ];

  return (
    <>
      <Helmet>
        <title>About Us - {schoolName}</title>
        <meta name="description" content={`Learn about ${schoolName} - established in ${established}, located in ${address}. ${tagline} with NEB affiliated +2 programs.`} />
        <meta property="og:title" content={`About Us - ${schoolName}`} />
        <meta property="og:description" content={`Established in ${established}, ${schoolName} has been shaping future leaders with quality education.`} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20 lg:py-32">
          <div className="container-custom">
            <div className="max-w-3xl">
              <Badge variant="secondary" className="mb-6">About Our School</Badge>
              <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
                A Legacy of Excellence in Education
              </h1>
              <p className="text-lg md:text-xl text-primary-100 mb-8">
                Since {established}, {schoolName} has been committed to nurturing confident, disciplined and capable learners.
              </p>
              <div className="flex flex-wrap gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>Est. {established}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  <span>{phone}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision Preview */}
        <section className="section bg-gray-50">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <Badge variant="primary" className="mb-4">Our Mission</Badge>
                <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 mb-6">
                  Empowering Students for a Brighter Future
                </h2>
                <div className="space-y-4 text-gray-600">
                  <p>To provide quality education that develops intellectual curiosity, critical thinking, and moral character.</p>
                  <p>To create a supportive learning environment where every student can achieve their full potential.</p>
                  <p>To foster innovation, creativity, and leadership skills necessary for success in the 21st century.</p>
                  <p>To build strong partnerships with parents and community for holistic student development.</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-lg">
                <div className="w-16 h-16 bg-accent-100 rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-accent-600" />
                </div>
                <h3 className="font-heading font-bold text-2xl text-gray-900 mb-4">Our Vision</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  To be a premier educational institution in Nepal recognized for academic excellence, character development, and producing responsible global citizens who contribute positively to society.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="section bg-white">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="primary" className="mb-4">Core Values</Badge>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 mb-4">
                Principles That Guide Us
              </h2>
              <p className="text-lg text-gray-600">
                These values form the foundation of everything we do at Seven Star.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreValues.map((value) => (
                <Card key={value.title} hover className="h-full">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Milestones */}
        <section className="section bg-gray-50">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="primary" className="mb-4">Our Journey</Badge>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 mb-4">
                Milestones & Achievements
              </h2>
              <p className="text-lg text-gray-600">
                Key moments that have shaped our school's legacy of excellence.
              </p>
            </div>
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary-200" />
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div key={milestone.year} className="relative pl-20">
                    <div className="absolute left-0 top-2 w-16 text-right pr-4">
                      <span className="font-heading font-bold text-lg text-primary-600">{milestone.year}</span>
                    </div>
                    <div className="absolute left-8 top-6 w-4 h-4 bg-primary-600 rounded-full border-4 border-white shadow-lg" />
                    <Card className="bg-gray-50 border-l-4 border-primary-500">
                      <h3 className="font-heading font-semibold text-xl text-gray-900 mb-1">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Leadership */}
        <section className="section bg-white">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="primary" className="mb-4">School Leadership</Badge>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 mb-4">
                Meet Our Leadership Team
              </h2>
              <p className="text-lg text-gray-600">
                Dedicated educators and administrators guiding our school's vision.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {leadership.map((leader) => (
                <Card key={leader.name} hover className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-10 h-10 text-primary-600" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-gray-900">{leader.name}</h3>
                  <p className="text-primary-600 text-sm font-medium mb-2">{leader.role}</p>
                  <div className="text-sm text-gray-500 space-y-1">
                    {leader.phone && <p>📞 {leader.phone}</p>}
                    {leader.email && <p>✉️ {leader.email}</p>}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-primary-600 text-white py-16">
          <div className="container-custom">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="font-heading font-bold text-4xl md:text-5xl">900+</p>
                <p className="text-primary-200 mt-2">Students Enrolled</p>
              </div>
              <div>
                <p className="font-heading font-bold text-4xl md:text-5xl">100%</p>
                <p className="text-primary-200 mt-2">SEE Pass Rate</p>
              </div>
              <div>
                <p className="font-heading font-bold text-4xl md:text-5xl">80+</p>
                <p className="text-primary-200 mt-2">Qualified Teachers</p>
              </div>
              <div>
                <p className="font-heading font-bold text-4xl md:text-5xl">19+</p>
                <p className="text-primary-200 mt-2">Years Excellence</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section bg-gray-50 text-center">
          <div className="container-custom max-w-2xl">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 mb-4">
              Want to Know More About Us?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Explore our detailed messages from the Chairman and Principal, our mission & vision, and school history.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/about/chairman" className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
                Chairman's Message
              </a>
              <a href="/about/principal" className="px-6 py-3 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium">
                Principal's Message
              </a>
              <a href="/about/mission-vision" className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium">
                Mission & Vision
              </a>
              <a href="/about/history" className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium">
                Our History
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}