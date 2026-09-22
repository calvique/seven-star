import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, GraduationCap, Award, Users, BookOpen, Shield, MapPin, Phone, Mail } from 'lucide-react';
import { Button, Card, Badge } from '../../components/ui';
import { useSettings } from '../../context/SettingsContext';

export function Home() {
  const { getSettingValue } = useSettings();

  const schoolName = getSettingValue('general', 'school.name', 'Seven Star English Boarding School');
  const tagline = getSettingValue('general', 'school.tagline', 'Shaping Future Leaders');
  const established = getSettingValue('general', 'school.established', '2063 B.S.');
  const address = getSettingValue('general', 'school.address', 'Devdaha-2, Rupandehi, Nepal');
  const phone = getSettingValue('general', 'school.phone', '9857078448');
  const email = getSettingValue('general', 'school.email', 'sevenstar.school2063@gmail.com');

  const features = [
    {
      icon: Award,
      title: 'Academic Excellence',
      description: 'NEB affiliated +2 programs with consistent 100% SEE pass rate and outstanding board results.',
    },
    {
      icon: Users,
      title: 'Experienced Faculty',
      description: '80+ qualified teachers with B.Ed/M.Ed degrees dedicated to student success.',
    },
    {
      icon: BookOpen,
      title: 'Modern Infrastructure',
      description: 'Well-equipped labs, library, computer lab, sports complex, and auditorium.',
    },
    {
      icon: Shield,
      title: 'Safe Environment',
      description: 'Secure boarding facilities with 24/7 supervision, CCTV, and medical support.',
    },
  ];

  const stats = [
    { value: '900+', label: 'Students Enrolled', icon: Users },
    { value: '100%', label: 'SEE Pass Rate', icon: Award },
    { value: '80+', label: 'Qualified Teachers', icon: GraduationCap },
    { value: '19+', label: 'Years of Excellence', icon: Award },
  ];

  const quickLinks = [
    { label: 'Admissions Open', path: '/admissions', icon: ArrowRight, variant: 'primary' },
    { label: 'View Results', path: '/results', icon: ArrowRight, variant: 'outline' },
    { label: 'Latest Notices', path: '/notices', icon: ArrowRight, variant: 'ghost' },
    { label: 'Photo Gallery', path: '/gallery', icon: ArrowRight, variant: 'ghost' },
  ];

  return (
    <>
      <Helmet>
        <title>{schoolName} - {tagline} | Devdaha, Rupandehi, Nepal</title>
        <meta name="description" content={`${schoolName} - ${tagline}. NEB Affiliated +2 Programs. Quality Education from Nursery to Grade 12 with 100% SEE Pass Rate. Devdaha-2, Rupandehi, Nepal.`} />
        <meta name="keywords" content="Seven Star School, Devdaha, Rupandehi, Nepal, Education, Boarding School, +2, SEE, NEB" />
        <meta property="og:title" content={`${schoolName} - ${tagline}`} />
        <meta property="og:description" content="NEB Affiliated +2 Programs. Quality Education from Nursery to Grade 12 with 100% SEE Pass Rate." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://sevenstar.edu.np/" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'EducationalOrganization',
            name: schoolName,
            description: tagline,
            address: {
              '@type': 'PostalAddress',
              streetAddress: address,
              addressLocality: 'Devdaha',
              addressRegion: 'Rupandehi',
              addressCountry: 'NP',
            },
            telephone: phone,
            email: email,
            foundingDate: '2006', // 2063 BS = 2006 AD
            url: 'https://sevenstar.edu.np/',
            sameAs: [
              'https://www.facebook.com/sevenstar.boarding',
            ],
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width%3D%2260%22 height%3D%2260%22 viewBox%3D%220 0 60 60%22 xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg fill%3D%22none%22 fill-rule%3D%22evenodd%22%3E%3Cg fill%3D%22%239C92AC%22 fill-opacity%3D%220.03%22%3E%3Cpath d%3D%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="animate-fade-in">
              <Badge variant="accent" className="mb-6 inline-flex items-center gap-2">
                <span className="w-2 h-2 bg-accent-500 rounded-full animate-pulse" />
                Admissions Open for 2082 B.S. (2025/26)
              </Badge>
              <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl leading-tight text-gray-900 mb-6">
                {tagline}
                <br />
                <span className="text-primary-600">With Quality Education</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl">
                {schoolName} has been committed to nurturing confident, disciplined and capable learners since {established}. We combine academic excellence with character, creativity, and meaningful co-curricular experiences.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/admissions">
                  <Button size="lg" className="gap-2">
                    Get Started
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="gap-2">
                    Learn More About Us
                  </Button>
                </Link>
              </div>
              <div className="mt-10 flex flex-wrap gap-8">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-heading font-bold text-2xl text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative animate-slide-up">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white">
                <div className="aspect-[4/3] bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                  <GraduationCap className="w-32 h-32 text-primary-200" />
                </div>
                <div className="absolute -bottom-6 -left-6 -right-6 bg-white rounded-2xl shadow-xl p-6 mx-6 max-w-md">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-accent-100 rounded-full flex items-center justify-center">
                      <Award className="w-7 h-7 text-accent-600" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-lg text-gray-900">Academic Excellence Award</h3>
                      <p className="text-sm text-gray-500">8 consecutive years of 100% SEE pass rate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowRight className="w-6 h-6 text-gray-400 rotate-90" />
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="primary" className="mb-4">Why Choose Seven Star?</Badge>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 mb-4">
              Building Future Leaders Through Excellence
            </h2>
            <p className="text-lg text-gray-600">
              We provide a holistic education that goes beyond academics, fostering character, creativity, and leadership.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} hover className="h-full">
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="font-heading font-semibold text-xl text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-6">
            {quickLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <Card hover className="h-full text-center p-8 group">
                  <div className="w-16 h-16 mx-auto bg-primary-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                    <link.icon className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-gray-900">{link.label}</h3>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-primary-600">
        <div className="container-custom text-center">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-4">
            Ready to Join Seven Star Family?
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
            Give your child the gift of quality education. Apply now for admission to Seven Star English Boarding School.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/admissions">
              <Button size="lg" variant="secondary" className="gap-2">
                Start Application
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 gap-2">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Info Bar */}
      <section className="bg-gray-900 text-white py-6">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <MapPin className="w-6 h-6 text-secondary-400" />
              <div>
                <p className="font-medium">Visit Us</p>
                <p className="text-sm text-gray-400">{address}</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-center gap-3">
              <Phone className="w-6 h-6 text-secondary-400" />
              <div>
                <p className="font-medium">Call Us</p>
                <a href={`tel:${phone}`} className="text-sm text-gray-400 hover:text-white transition-colors">{phone}</a>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-end gap-3">
              <Mail className="w-6 h-6 text-secondary-400" />
              <div>
                <p className="font-medium">Email Us</p>
                <a href={`mailto:${email}`} className="text-sm text-gray-400 hover:text-white transition-colors">{email}</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}