import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Target, Eye, Award, Users, BookOpen, Heart, Lightbulb, Shield, Globe, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, Badge } from '../../components/ui';
import { useSettings } from '../../context/SettingsContext';

export function MissionVision() {
  const { getSettingValue } = useSettings();

  const schoolName = getSettingValue('general', 'school.name', 'Seven Star English Boarding School');
  const tagline = getSettingValue('general', 'school.tagline', 'Shaping Future Leaders');
  const established = getSettingValue('general', 'school.established', '2063 B.S.');

  const mission = {
    statement: 'To provide quality education that develops intellectual curiosity, critical thinking, and moral character in a supportive learning environment where every student achieves their full potential.',
    pillars: [
      { icon: Target, title: 'Academic Excellence', description: 'Rigorous NEB-aligned curriculum with innovative teaching methods ensuring deep conceptual understanding and outstanding results.' },
      { icon: Heart, title: 'Character Development', description: 'Values-based education fostering integrity, empathy, respect, responsibility, and social awareness.' },
      { icon: Users, title: 'Holistic Growth', description: 'Balanced focus on academics, sports, arts, leadership, and life skills for well-rounded individuals.' },
      { icon: Lightbulb, title: 'Innovation & Creativity', description: 'Modern pedagogy with technology integration, project-based learning, and encouragement of creative thinking.' },
      { icon: Globe, title: 'Global Citizenship', description: 'Preparing students for an interconnected world with cultural awareness, communication skills, and global perspective.' },
      { icon: Shield, title: 'Safe & Inclusive Environment', description: 'Secure campus with equal opportunities, anti-bullying policies, and support for diverse learning needs.' },
    ],
  };

  const vision = {
    statement: 'To be a premier educational institution in Nepal recognized for academic excellence, character development, and producing responsible global citizens who contribute positively to society.',
    goals: [
      { icon: Award, title: 'Academic Leadership', description: 'Maintain 100% pass rates and produce district/national toppers in SEE and +2 examinations consistently.' },
      { icon: GraduationCap, title: 'Alumni Success', description: 'Graduates excelling in top universities nationally and internationally across diverse fields.' },
      { icon: BookOpen, title: 'Curriculum Innovation', description: 'Continuous curriculum enhancement with STEM focus, digital literacy, and 21st-century skills.' },
      { icon: Users, title: 'Faculty Excellence', description: 'Ongoing professional development, research culture, and teacher retention for sustained quality.' },
      { icon: Heart, title: 'Community Impact', description: 'Active community engagement, social service programs, and partnerships for societal development.' },
      { icon: Globe, title: 'Global Partnerships', description: 'International collaborations, exchange programs, and global accreditation for broader horizons.' },
    ],
  };

  const coreValues = [
    { icon: Target, value: 'Excellence', description: 'Striving for the highest standards in all endeavors' },
    { icon: Heart, value: 'Integrity', description: 'Honesty, transparency, and ethical conduct always' },
    { icon: Users, value: 'Respect', description: 'Valuing diversity, dignity, and perspectives of all' },
    { icon: Lightbulb, value: 'Innovation', description: 'Embracing change, creativity, and continuous improvement' },
    { icon: Shield, value: 'Responsibility', description: 'Accountability to students, parents, and society' },
    { icon: Globe, value: 'Compassion', description: 'Empathy, kindness, and service to others' },
  ];

  return (
    <>
      <Helmet>
        <title>Mission & Vision - {schoolName}</title>
        <meta name="description" content={`Mission and Vision of ${schoolName} - committed to academic excellence, character development, and producing responsible global citizens since ${established}.`} />
        <meta property="og:title" content={`Mission & Vision - ${schoolName}`} />
        <meta property="og:description" content={mission.statement} />
        <meta property="og:type" content="website" />
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
              <Badge variant="secondary" className="mb-6">Our Purpose</Badge>
              <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
                Mission & Vision
              </h1>
              <p className="text-lg md:text-xl text-primary-100 mb-8">
                Guiding principles that drive every decision and action at Seven Star.
              </p>
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  <span>Vision</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  <span>Mission</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  <span>Values</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="section bg-white">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div className="lg:sticky lg:top-28">
                <Badge variant="primary" className="mb-4">Our Mission</Badge>
                <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 mb-6">
                  Empowering Students for a Brighter Future
                </h2>
                <div className="prose prose-gray max-w-none mb-8">
                  <p className="text-xl text-gray-700 leading-relaxed">
                    {mission.statement}
                  </p>
                </div>
                <div className="bg-primary-50 rounded-xl p-6 border border-primary-100">
                  <h3 className="font-heading font-semibold text-lg text-primary-900 mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5" /> Our Commitment
                  </h3>
                  <ul className="space-y-2 text-primary-800">
                    <li className="flex items-center gap-2">• Every student known, valued, and challenged</li>
                    <li className="flex items-center gap-2">• Quality education accessible to all</li>
                    <li className="flex items-center gap-2">• Partnership with parents and community</li>
                    <li className="flex items-center gap-2">• Continuous improvement and innovation</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-6">
                {mission.pillars.map((pillar) => (
                  <Card key={pillar.title} hover className="h-full">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                      <pillar.icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <h3 className="font-heading font-semibold text-lg text-gray-900 mb-2">{pillar.title}</h3>
                    <p className="text-gray-600">{pillar.description}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="section bg-gray-50">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-6">
                {vision.goals.map((goal) => (
                  <Card key={goal.title} hover className="h-full">
                    <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center mb-4">
                      <goal.icon className="w-6 h-6 text-accent-600" />
                    </div>
                    <h3 className="font-heading font-semibold text-lg text-gray-900 mb-2">{goal.title}</h3>
                    <p className="text-gray-600">{goal.description}</p>
                  </Card>
                ))}
              </div>
              <div className="lg:sticky lg:top-28">
                <Badge variant="accent" className="mb-4">Our Vision</Badge>
                <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 mb-6">
                  A Premier Institution for Generations
                </h2>
                <div className="prose prose-gray max-w-none mb-8">
                  <p className="text-xl text-gray-700 leading-relaxed">
                    {vision.statement}
                  </p>
                </div>
                <div className="bg-accent-50 rounded-xl p-6 border border-accent-100">
                  <h3 className="font-heading font-semibold text-lg text-accent-900 mb-3 flex items-center gap-2">
                    <Eye className="w-5 h-5" /> Where We Are Headed
                  </h3>
                  <ul className="space-y-2 text-accent-800">
                    <li className="flex items-center gap-2">• Top-ranked school in Lumbini Province</li>
                    <li className="flex items-center gap-2">• International curriculum options</li>
                    <li className="flex items-center gap-2">• State-of-the-art STEM facilities</li>
                    <li className="flex items-center gap-2">• Global university partnerships</li>
                  </ul>
                </div>
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
                Principles That Define Us
              </h2>
              <p className="text-lg text-gray-600">
                These six values are the foundation of our school culture and guide every decision we make.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreValues.map((cv) => (
                <Card key={cv.value} hover className="h-full text-center">
                  <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <cv.icon className="w-7 h-7 text-primary-600" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-gray-900 mb-2">{cv.value}</h3>
                  <p className="text-gray-600">{cv.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section bg-primary-600 text-white text-center">
          <div className="container-custom max-w-3xl">
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
              Join Us in Our Mission
            </h2>
            <p className="text-primary-100 text-lg mb-8">
              Be part of a community that's shaping future leaders through excellence in education.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/admissions" className="px-8 py-3 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors font-medium">
                Apply for Admission
              </Link>
              <Link to="/contact" className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-medium">
                Get in Touch
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}