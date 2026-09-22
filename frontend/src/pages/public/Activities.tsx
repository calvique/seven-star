import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Trophy, BookOpen, Music, Dumbbell, Palette, Mic, Target, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, Badge, Tabs, TabPanel } from '../../components/ui';
import { useSettings } from '../../context/SettingsContext';
import { api } from '../../services/api';
import type { Activity } from '../../types';

export function Activities() {
  const { getSettingValue } = useSettings();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const schoolName = getSettingValue('general', 'school.name', 'Seven Star English Boarding School');

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const categories = [
    { id: 'all', label: 'All Activities', icon: Star },
    { id: 'sports', label: 'Sports', icon: Dumbbell },
    { id: 'cultural', label: 'Cultural', icon: Music },
    { id: 'academic', label: 'Academic', icon: BookOpen },
    { id: 'club', label: 'Clubs', icon: Target },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'leadership', label: 'Leadership', icon: Trophy },
    { id: 'creative', label: 'Creative', icon: Palette },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get<Activity>('/activities/published', { isPublished: true, isActive: true });
        if (res.success) setActivities(res.data.activities || []);
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredActivities = activeCategory === 'all' 
    ? activities 
    : activities.filter(a => a.category === activeCategory);

  const weeklyECA = activities.filter(a => a.frequency === 'weekly' && a.isActive && a.isPublished);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const featuredActivities = [
    {
      title: 'Inter-House Sports Competition',
      category: 'sports',
      description: 'Annual inter-house sports meet featuring athletics, football, basketball, volleyball, and table tennis. Students compete in house teams fostering team spirit and healthy competition.',
      schedule: 'Annual (Term 2)',
      participants: 'All students Grades 1-12',
      image: '/activities/sports-competition.jpg',
    },
    {
      title: 'Annual Cultural Festival',
      category: 'cultural',
      description: 'Week-long celebration of Nepali culture and diversity with dance, music, drama, poetry, and traditional food. Students showcase talents and learn about cultural heritage.',
      schedule: 'Annual (Dashain/Tihar)',
      participants: 'All students',
      image: '/activities/cultural-fest.jpg',
    },
    {
      title: 'Science Exhibition',
      category: 'academic',
      description: 'Students present innovative science projects, models, and experiments. Judges from local universities evaluate projects. Winners represent school at district/provincial levels.',
      schedule: 'Annual (Term 1)',
      participants: 'Grades 6-12',
      image: '/activities/science-exhibition.jpg',
    },
    {
      title: 'Debate & Public Speaking Club',
      category: 'club',
      description: 'Weekly sessions developing critical thinking, argumentation, and presentation skills. Participates in inter-school debate competitions and Model UN simulations.',
      schedule: 'Every Friday 3:30-5:00 PM',
      participants: 'Grades 8-12',
      image: '/activities/debate-club.jpg',
    },
    {
      title: 'Community Service Program',
      category: 'community',
      description: 'Regular community outreach including cleanliness drives, health camps, tree plantation, and support for underprivileged schools. Develops social responsibility and empathy.',
      schedule: 'Monthly (Last Saturday)',
      participants: 'Grades 9-12 + Teachers',
      image: '/activities/community-service.jpg',
    },
    {
      title: 'Student Leadership Council',
      category: 'leadership',
      description: 'Elected student representatives from each class forming the school parliament. Organizes events, represents student voice, and develops leadership skills through real responsibility.',
      schedule: 'Elected annually, meets weekly',
      participants: 'Elected representatives Grades 6-12',
      image: '/activities/student-council.jpg',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Activities & ECA - {schoolName}</title>
        <meta name="description" content={`Extracurricular activities at ${schoolName} - Sports, cultural events, clubs, community service, and leadership programs for holistic development.`} />
        <meta property="og:title" content={`Activities & ECA - ${schoolName}`} />
        <meta property="og:description" content="Sports, cultural events, clubs, community service, and leadership programs." />
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
              <Badge variant="secondary" className="mb-6">Student Life</Badge>
              <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
                Activities & ECA
              </h1>
              <p className="text-lg md:text-xl text-primary-100 mb-8">
                Holistic development through sports, culture, clubs, community service, and leadership.
              </p>
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  <span>Inter-House Competitions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>Weekly ECA Schedule</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>15+ Active Clubs</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Weekly ECA Schedule */}
        <section className="section bg-gray-50">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <Badge variant="primary" className="mb-4">Weekly ECA Schedule</Badge>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 mb-4">
                Extra-Curricular Activities Timetable
              </h2>
              <p className="text-lg text-gray-600">
                Structured weekly activities ensuring every student participates in holistic development.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-primary-600 text-white">
                    <th className="px-6 py-4 text-left font-medium">Time / Day</th>
                    {dayNames.map(day => (
                      <th key={day} className="px-6 py-4 text-center font-medium">{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { time: '6:30 - 7:30 AM', activities: ['Morning PT/Yoga', 'Morning PT/Yoga', 'Morning PT/Yoga', 'Morning PT/Yoga', 'Morning PT/Yoga', 'Morning PT/Yoga', 'Free/Rest'] },
                    { time: '3:30 - 5:00 PM', activities: ['Football/Basketball', 'Table Tennis/Badminton', 'Dance/Music Practice', 'Debate/Quiz Club', 'Science/IT Club', 'Art/Craft Club', 'Community Service*'] },
                    { time: '5:00 - 6:00 PM', activities: ['Athletics Training', 'Swimming*', 'Music/Choir', 'Drama/Theater', 'Robotics/STEM', 'Reading Club', 'Leadership Meet*'] },
                    { time: '7:00 - 8:00 PM', activities: ['Study Hour', 'Study Hour', 'Study Hour', 'Study Hour', 'Study Hour', 'Movie/Cultural Night', 'Free Time'] },
                  ].map((row) => (
                    <tr key={row.time} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{row.time}</td>
                      {row.activities.map((activity, idx) => (
                        <td key={idx} className="px-4 py-3 text-center text-sm">
                          {activity && activity !== 'Free/Rest' && activity !== 'Free Time' ? (
                            <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-medium ${
                              idx === 6 ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {activity}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                ))}
                  <tr className="bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900">*Optional/Seasonal</td>
                    <td colSpan={7} className="px-6 py-3 text-center text-sm text-gray-500">
                      Activities marked with * are seasonal or optional. Schedule may vary by term.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-8 grid md:grid-cols-3 gap-6">
              <Card className="text-center">
                <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Morning Assembly</h3>
                <p className="text-sm text-gray-600">Daily 6:30 AM - News, Thought, Pledge</p>
              </Card>
              <Card className="text-center">
                <div className="w-14 h-14 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-7 h-7 text-accent-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Library Hour</h3>
                <p className="text-sm text-gray-600">Weekly scheduled reading periods</p>
              </Card>
              <Card className="text-center">
                <div className="w-14 h-14 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Music className="w-7 h-7 text-secondary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Creative Arts</h3>
                <p className="text-sm text-gray-600">Art, Craft, Music, Dance integration</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Activities */}
        <section className="section bg-white">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <Badge variant="primary" className="mb-4">Featured Programs</Badge>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 mb-4">
                Signature Activities
              </h2>
              <p className="text-lg text-gray-600">
                Our flagship programs that define the Seven Star student experience.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredActivities.map((activity) => (
                <Card key={activity.title} hover className="h-full">
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl mb-4 flex items-center justify-center">
                    {activity.category === 'sports' ? (
                      <Dumbbell className="w-12 h-12 text-primary-200" />
                    ) : activity.category === 'cultural' ? (
                      <Music className="w-12 h-12 text-primary-200" />
                    ) : activity.category === 'academic' ? (
                      <BookOpen className="w-12 h-12 text-primary-200" />
                    ) : activity.category === 'club' ? (
                      <Target className="w-12 h-12 text-primary-200" />
                    ) : activity.category === 'community' ? (
                      <Users className="w-12 h-12 text-primary-200" />
                    ) : (
                      <Trophy className="w-12 h-12 text-primary-200" />
                    )}
                  </div>
                  <Badge variant="primary" className="mb-3">{activity.category}</Badge>
                  <h3 className="font-heading font-bold text-lg text-gray-900 mb-2">{activity.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{activity.description}</p>
                  <div className="space-y-1 text-sm text-gray-500 mb-4">
                    <p className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {activity.schedule}</p>
                    <p className="flex items-center gap-1"><Users className="w-3 h-3" /> {activity.participants}</p>
                  </div>
                  <Link to="/activities" className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium text-sm">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* All Activities by Category */}
        <section className="section bg-gray-50">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-8">
              <Badge variant="primary" className="mb-4">All Activities</Badge>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 mb-4">
                Complete Activity Directory
              </h2>
            </div>

            <Tabs
              tabs={categories.map(c => ({ id: c.id, label: c.label, icon: <c.icon className="w-5 h-5" /> }))}
              activeTab={activeCategory}
              onChange={setActiveCategory}
              variant="pills"
            />

            <div className="mt-8">
              {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse h-48" />
                  ))}
                </div>
              ) : filteredActivities.length === 0 ? (
                <div className="text-center py-12">
                  <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-500">No activities in this category</h3>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredActivities.map((activity) => (
                    <Card key={activity._id} hover className="h-full">
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          activity.category === 'sports' ? 'bg-secondary-100 text-secondary-600' :
                          activity.category === 'cultural' ? 'bg-accent-100 text-accent-600' :
                          activity.category === 'academic' ? 'bg-primary-100 text-primary-600' :
                          activity.category === 'club' ? 'bg-purple-100 text-purple-600' :
                          activity.category === 'community' ? 'bg-green-100 text-green-600' :
                          activity.category === 'leadership' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {activity.category === 'sports' ? <Dumbbell className="w-5 h-5" /> :
                           activity.category === 'cultural' ? <Music className="w-5 h-5" /> :
                           activity.category === 'academic' ? <BookOpen className="w-5 h-5" /> :
                           activity.category === 'club' ? <Target className="w-5 h-5" /> :
                           activity.category === 'community' ? <Users className="w-5 h-5" /> :
                           activity.category === 'leadership' ? <Trophy className="w-5 h-5" /> :
                           <Star className="w-5 h-5" />}
                        </div>
                        <div>
                          <Badge variant="primary" className="mb-1">{activity.category}</Badge>
                          <p className="text-xs text-gray-500">{activity.frequency}</p>
                        </div>
                      </div>
                      <h3 className="font-heading font-semibold text-lg text-gray-900 mb-2">{activity.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{activity.description}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        {activity.schedule && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {activity.schedule}</span>}
                        {activity.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {activity.location}</span>}
                        {activity.maxParticipants && <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Max {activity.maxParticipants}</span>}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary-600 text-white py-16">
          <div className="container-custom text-center">
            <Badge variant="secondary" className="mb-4">Join the Action</Badge>
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
              Discover Your Passion
            </h2>
            <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
              Every student finds their place at Seven Star. From sports fields to debate halls, from art studios to community fields.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/admissions" className="px-8 py-3 bg-white text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium">
                Join Seven Star
              </Link>
              <Link to="/contact" className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-medium">
                Learn More
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}