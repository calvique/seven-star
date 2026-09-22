import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, BookOpen, GraduationCap, Award, Users, Target, Clock, CheckCircle, Star, Building2, FlaskConical, Music, Dumbbell, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, Badge, Tabs, TabPanel } from '../../components/ui';
import { useSettings } from '../../context/SettingsContext';
import { api } from '../../services/api';
import type { Class, Subject } from '../../types';

export function Academics() {
  const { getSettingValue } = useSettings();
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLevel, setActiveLevel] = useState('all');

  const schoolName = getSettingValue('general', 'school.name', 'Seven Star English Boarding School');
  const established = getSettingValue('general', 'school.established', '2063 B.S.');

  const levels = [
    { id: 'all', label: 'All Levels', icon: GraduationCap },
    { id: 'pre-primary', label: 'Pre-Primary', icon: Star, desc: 'Nursery, LKG, UKG' },
    { id: 'primary', label: 'Primary', icon: BookOpen, desc: 'Grade 1-5' },
    { id: 'lower-secondary', label: 'Lower Secondary', icon: Target, desc: 'Grade 6-8' },
    { id: 'secondary', label: 'Secondary', icon: Award, desc: 'Grade 9-10 (SEE)' },
    { id: 'higher-secondary', label: 'Higher Secondary (+2)', icon: Building2, desc: 'Grade 11-12' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesRes, subjectsRes] = await Promise.all([
          api.get<Class>('/classes/published', { isActive: true }),
          api.get<Subject>('/subjects/published', { isActive: true }),
        ]);
        if (classesRes.success) setClasses(classesRes.data.classes || []);
        if (subjectsRes.success) setSubjects(subjectsRes.data.subjects || []);
      } catch (error) {
        console.error('Failed to fetch academic data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredClasses = activeLevel === 'all' 
    ? classes 
    : classes.filter(c => c.level === activeLevel);

  const groupedClasses = filteredClasses.reduce((acc, cls) => {
    const level = cls.level;
    if (!acc[level]) acc[level] = [];
    acc[level].push(cls);
    return acc;
  }, {} as Record<string, Class[]>);

  const levelOrder = ['pre-primary', 'primary', 'lower-secondary', 'secondary', 'higher-secondary'];

  const programs = [
    { id: 'science', title: '+2 Science', icon: FlaskConical, color: 'primary', subjects: ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English', 'Nepali', 'Computer Science'], desc: 'For aspiring doctors, engineers, and researchers' },
    { id: 'management', title: '+2 Management', icon: Globe, color: 'secondary', subjects: ['Accountancy', 'Economics', 'Business Studies', 'English', 'Nepali', 'Computer Science', 'Hotel Management (optional)'], desc: 'For future business leaders and entrepreneurs' },
    { id: 'hotel-management', title: '+2 Hotel Management', icon: Music, color: 'accent', subjects: ['Hotel Management', 'English', 'Nepali', 'Food & Beverage', 'Housekeeping', 'Front Office', 'Computer Application'], desc: 'For hospitality and tourism careers' },
  ];

  return (
    <>
      <Helmet>
        <title>Academics - {schoolName}</title>
        <meta name="description" content={`Academic programs at ${schoolName} - from Nursery to Grade 12 with NEB affiliated +2 programs in Science, Management, and Hotel Management.`} />
        <meta property="og:title" content={`Academics - ${schoolName}`} />
        <meta property="og:description" content="Quality education from Nursery to Grade 12 with NEB affiliated +2 programs." />
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
              <Badge variant="secondary" className="mb-6">Academic Excellence</Badge>
              <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
                Academic Programs
              </h1>
              <p className="text-lg md:text-xl text-primary-100 mb-8">
                Comprehensive curriculum from Nursery to Grade 12 with NEB affiliated +2 programs.
              </p>
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  <span>Nursery to Grade 12</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  <span>NEB Affiliated</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>80+ Qualified Teachers</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* +2 Programs */}
        <section className="section bg-white">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="primary" className="mb-4">Higher Secondary (+2)</Badge>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 mb-4">
                NEB Affiliated +2 Programs
              </h2>
              <p className="text-lg text-gray-600">
                Three specialized streams designed for diverse career aspirations.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {programs.map((program) => (
                <Card key={program.id} hover className="h-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-transparent to-primary-100 rounded-bl-full" />
                  <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-4 relative z-10">
                    <program.icon className="w-7 h-7" style={{ color: `var(--color-${program.color}-600)` }} />
                  </div>
                  <Badge variant={program.color as any} className="mb-3">{program.title}</Badge>
                  <h3 className="font-heading font-bold text-xl text-gray-900 mb-2">{program.title}</h3>
                  <p className="text-gray-600 mb-4">{program.desc}</p>
                  <div className="space-y-2 mb-6">
                    {program.subjects.map((subject) => (
                      <Badge key={subject} variant="gray" className="text-xs justify-start w-full">{subject}</Badge>
                    ))}
                  </div>
                  <Link to="/admissions" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium">
                    Apply Now <ArrowRight className="w-4 h-4" />
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Academic Levels */}
        <section className="section bg-gray-50">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <Badge variant="primary" className="mb-4">Academic Levels</Badge>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 mb-4">
                Complete Educational Journey
              </h2>
              <p className="text-lg text-gray-600">
                Seamless progression from early childhood to pre-university education.
              </p>
            </div>

            <Tabs
              tabs={levels.map(l => ({ id: l.id, label: l.label, icon: <l.icon className="w-5 h-5" /> }))}
              activeTab={activeLevel}
              onChange={setActiveLevel}
              variant="pills"
              fullWidth={false}
            />

            <div className="mt-8">
              {activeLevel === 'all' ? (
                <div className="space-y-10">
                  {levelOrder.map((levelId) => {
                    const levelClasses = groupedClasses[levelId] || [];
                    const levelInfo = levels.find(l => l.id === levelId);
                    if (levelClasses.length === 0 && !levelInfo) return null;
                    return (
                      <div key={levelId}>
                        <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200">
                          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                            {(() => {
                              const Icon = levelInfo?.icon;
                              return Icon ? <Icon className="w-5 h-5 text-primary-600" /> : null;
                            })()}
                          </div>
                          <div>
                            <h3 className="font-heading font-semibold text-xl text-gray-900">{levelInfo?.label || levelId}</h3>
                            <p className="text-sm text-gray-500">{levelInfo?.desc}</p>
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {levelClasses.map((cls) => (
                            <Card key={cls._id} hover className="h-full">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <Badge variant="primary" className="mb-2">{cls.name}</Badge>
                                  {cls.section && <Badge variant="gray" className="text-xs">Section {cls.section}</Badge>}
                                </div>
                                <Badge variant="accent">{cls.currentStrength}/{cls.capacity}</Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">Grade {cls.grade}</p>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>{cls.subjects.length} Subjects</span>
                                {cls.classTeacher && <span>• Class Teacher Assigned</span>}
                              </div>
                            </Card>
                          ))}
                          {levelClasses.length === 0 && (
                            <div className="col-span-full text-center py-8 text-gray-500">
                              No classes published for this level yet.
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredClasses.map((cls) => (
                    <Card key={cls._id} hover className="h-full">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <Badge variant="primary" className="mb-2">{cls.name}</Badge>
                          {cls.section && <Badge variant="gray" className="text-xs">Section {cls.section}</Badge>}
                        </div>
                        <Badge variant="accent">{cls.currentStrength}/{cls.capacity}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Grade {cls.grade}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{cls.subjects.length} Subjects</span>
                        {cls.classTeacher && <span>• Class Teacher Assigned</span>}
                      </div>
                    </Card>
                  ))}
                  {filteredClasses.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-500">
                      No classes found for this level.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="section bg-primary-600 text-white">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <Badge variant="secondary" className="mb-4">Why Our Academics?</Badge>
              <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
                Excellence in Every Classroom
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Target, title: 'Conceptual Learning', desc: 'Focus on deep understanding over rote memorization' },
                { icon: Award, title: 'Continuous Assessment', desc: 'Regular formative and summative evaluations' },
                { icon: Users, title: 'Individual Attention', desc: 'Favorable student-teacher ratio for personalized guidance' },
                { icon: BookOpen, title: 'Modern Resources', desc: 'Digital labs, library, and online learning platforms' },
                { icon: Clock, title: 'Remedial Support', desc: 'Extra classes and tutoring for struggling students' },
                { icon: CheckCircle, title: 'Career Guidance', desc: 'Counseling for +2 stream selection and higher education' },
              ].map((feature) => (
                <div key={feature.title} className="text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-primary-100">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section bg-gray-50 text-center">
          <div className="container-custom max-w-2xl">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 mb-4">
              Ready to Begin Your Academic Journey?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of successful students at Seven Star English Boarding School.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/admissions">
                <Button size="lg" className="gap-2">
                  Apply Now
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/contact" className="px-6 py-3 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}