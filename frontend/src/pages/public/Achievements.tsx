import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Award, Trophy, Medal, Star, Calendar, MapPin, Users, BookOpen, Target, Filter, ChevronLeft, ChevronRight, X, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, Badge, Modal } from '../../components/ui';
import { useSettings } from '../../context/SettingsContext';
import { api } from '../../services/api';
import type { Achievement } from '../../types';

export function Achievements() {
  const { getSettingValue } = useSettings();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeLevel, setActiveLevel] = useState('all');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const schoolName = getSettingValue('general', 'school.name', 'Seven Star English Boarding School');

  const categories = [
    { id: 'all', label: 'All', icon: Trophy },
    { id: 'academic', label: 'Academic', icon: BookOpen },
    { id: 'sports', label: 'Sports', icon: Trophy },
    { id: 'cultural', label: 'Cultural', icon: Music },
    { id: 'leadership', label: 'Leadership', icon: Target },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'innovation', label: 'Innovation', icon: Award },
    { id: 'arts', label: 'Arts', icon: Palette },
  ];

  const levels = [
    { id: 'all', label: 'All Levels' },
    { id: 'school', label: 'School Level' },
    { id: 'district', label: 'District' },
    { id: 'provincial', label: 'Provincial' },
    { id: 'national', label: 'National' },
    { id: 'international', label: 'International' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get<Achievement>('/achievements/published', { isPublished: true });
        if (res.success) setAchievements(res.data.achievements || []);
      } catch (error) {
        console.error('Failed to fetch achievements:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredAchievements = achievements.filter((a) => {
    const matchesCategory = activeCategory === 'all' || a.category === activeCategory;
    const matchesLevel = activeLevel === 'all' || a.level === activeLevel;
    return matchesCategory && matchesLevel;
  });

  const stats = [
    { value: achievements.filter(a => a.level === 'national' || a.level === 'international').length, label: 'National/International', icon: Flag },
    { value: achievements.filter(a => a.level === 'provincial').length, label: 'Provincial', icon: Award },
    { value: achievements.filter(a => a.level === 'district').length, label: 'District', icon: Trophy },
    { value: achievements.filter(a => a.level === 'school').length, label: 'School Level', icon: Medal },
  ];

  const featuredAchievements = [
    {
      title: '8 Consecutive Years 100% SEE Pass Rate',
      category: 'academic',
      level: 'national',
      description: 'Seven Star English Boarding School has maintained a perfect 100% pass rate in the SEE (Secondary Education Examination) for eight consecutive years, a remarkable achievement recognized at the national level.',
      eventName: 'SEE Board Examination',
      eventDate: '2080 B.S.',
      position: '100% Pass Rate',
      award: 'National Recognition Certificate',
      images: ['/achievements/see-pass-rate.jpg'],
    },
    {
      title: 'Provincial Volleyball Champions - 4 Years Running',
      category: 'sports',
      level: 'provincial',
      description: 'Our girls\' volleyball team has dominated the provincial championship for four consecutive years, remaining undefeated at home courts since 2022.',
      eventName: 'Lumbini Provincial Volleyball Championship',
      eventDate: '2080 B.S.',
      position: 'Champions (Gold)',
      award: 'Provincial Championship Trophy',
      images: ['/achievements/volleyball-champions.jpg'],
    },
    {
      title: 'National Science Exhibition - First Prize',
      category: 'innovation',
      level: 'national',
      description: 'Grade 11 student Pratik Sharma won first prize at the National Science Exhibition for his innovative "Smart Irrigation System using IoT" project.',
      eventName: 'National Science & Technology Exhibition',
      eventDate: '2079 B.S.',
      position: '1st Place (Gold Medal)',
      award: 'National Innovation Award',
      images: ['/achievements/science-exhibition.jpg'],
    },
    {
      title: 'District Cultural Dance Champions',
      category: 'cultural',
      level: 'district',
      description: 'Our cultural team won the district-level folk dance competition performing traditional Magar and Tharu dances, preserving cultural heritage.',
      eventName: 'Rupandehi District Cultural Festival',
      eventDate: '2080 B.S.',
      position: '1st Position',
      award: 'District Cultural Trophy',
      images: ['/achievements/cultural-dance.jpg'],
    },
  ];

  const filteredAchievements = achievements.filter((a) => {
    const matchesCategory = activeCategory === 'all' || a.category === activeCategory;
    const matchesLevel = activeLevel === 'all' || a.level === activeLevel;
    return matchesCategory && matchesLevel;
  });

  return (
    <>
      <Helmet>
        <title>Achievements - {schoolName}</title>
        <meta name="description" content={`Achievements of ${schoolName} - Academic excellence, sports championships, cultural awards, and national recognitions in Devdaha, Rupandehi.`} />
        <meta property="og:title" content={`Achievements - ${schoolName}`} />
        <meta property="og:description" content="Academic excellence, sports championships, cultural awards, and national recognitions." />
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
              <Badge variant="secondary" className="mb-6">Celebrating Excellence</Badge>
              <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
                Achievements & Awards
              </h1>
              <p className="text-lg md:text-xl text-primary-100 mb-8">
                Celebrating the outstanding accomplishments of our students and school community.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="section bg-gray-50 -mt-8">
          <div className="container-custom">
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              {stats.map((stat) => (
                <Card key={stat.label} className="text-center">
                  <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="w-7 h-7 text-primary-600" />
                  </div>
                  <p className="font-heading font-bold text-3xl text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label} Awards</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="section bg-white -mt-8">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
                      activeCategory === cat.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <cat.icon className="w-4 h-4" />
                    {cat.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {levels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setActiveLevel(level.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeLevel === level.id
                        ? 'bg-secondary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Achievements */}
        <section className="section bg-white">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <Badge variant="primary" className="mb-4">Featured Achievements</Badge>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 mb-4">
                Hall of Fame
              </h2>
              <p className="text-lg text-gray-600">
                Our most celebrated accomplishments across academics, sports, and innovation.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredAchievements.map((achievement, index) => (
                <Card key={achievement.title} hover className="h-full relative overflow-hidden" onClick={() => { setSelectedAchievement(achievement); setModalOpen(true); }}>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-transparent to-primary-100 rounded-bl-full" />
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      achievement.category === 'academic' ? 'bg-primary-100 text-primary-600' :
                      achievement.category === 'sports' ? 'bg-secondary-100 text-secondary-600' :
                      achievement.category === 'cultural' ? 'bg-accent-100 text-accent-600' :
                      achievement.category === 'innovation' ? 'bg-purple-100 text-purple-600' :
                      achievement.category === 'cultural' ? 'bg-accent-100 text-accent-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {achievement.category === 'academic' ? <BookOpen className="w-6 h-6" /> :
                       achievement.category === 'sports' ? <Trophy className="w-6 h-6" /> :
                       achievement.category === 'cultural' ? <Music className="w-6 h-6" /> :
                       achievement.category === 'innovation' ? <Award className="w-6 h-6" /> :
                       <Star className="w-6 h-6" />}
                    </div>
                    <div>
                      <Badge variant="primary" className="mb-1">{achievement.category}</Badge>
                      <Badge variant="secondary" className="text-xs">{achievement.level}</Badge>
                    </div>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-gray-900 mb-2">{achievement.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{achievement.description}</p>
                  <div className="space-y-1 text-sm text-gray-500 mb-4">
                    <p className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {achievement.eventName} • {achievement.eventDate}</p>
                    <p className="flex items-center gap-1"><Trophy className="w-3 h-3" /> {achievement.position}</p>
                  </div>
                  <button className="w-full text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center justify-center gap-1">
                    View Details <ArrowRight className="w-4 h-4" />
                  </button>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* All Achievements */}
        <section className="section bg-gray-50">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-8">
              <Badge variant="primary" className="mb-4">All Achievements</Badge>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 mb-4">
                Complete Achievement Record
              </h2>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex flex-wrap gap-2 flex-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      activeCategory === cat.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {levels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setActiveLevel(level.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      activeLevel === level.id
                        ? 'bg-secondary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse h-48" />
                ))}
              </div>
            ) : filteredAchievements.length === 0 ? (
              <div className="text-center py-20">
                <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500">No achievements found</h3>
                <p className="text-gray-400">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {filteredAchievements.map((achievement) => (
                  <Card key={achievement._id} hover className="h-full" onClick={() => { setSelectedAchievement(achievement); setModalOpen(true); }}>
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        achievement.category === 'academic' ? 'bg-primary-100 text-primary-600' :
                        achievement.category === 'sports' ? 'bg-secondary-100 text-secondary-600' :
                        achievement.category === 'cultural' ? 'bg-accent-100 text-accent-600' :
                        achievement.category === 'innovation' ? 'bg-purple-100 text-purple-600' :
                        achievement.category === 'leadership' ? 'bg-yellow-100 text-yellow-600' :
                        achievement.category === 'community' ? 'bg-green-100 text-green-600' :
                        achievement.category === 'arts' ? 'bg-pink-100 text-pink-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {achievement.category === 'academic' ? <BookOpen className="w-5 h-5" /> :
                         achievement.category === 'sports' ? <Trophy className="w-5 h-5" /> :
                         achievement.category === 'cultural' ? <Music className="w-5 h-5" /> :
                         achievement.category === 'innovation' ? <Award className="w-5 h-5" /> :
                         achievement.category === 'leadership' ? <Target className="w-5 h-5" /> :
                         achievement.category === 'community' ? <Users className="w-5 h-5" /> :
                         achievement.category === 'arts' ? <Palette className="w-5 h-5" /> :
                         <Star className="w-5 h-5" />}
                      </div>
                      <div>
                        <Badge variant="primary" className="mb-1">{achievement.category}</Badge>
                        <Badge variant="secondary" className="text-xs">{achievement.level}</Badge>
                      </div>
                    </div>
                    <h3 className="font-heading font-semibold text-lg text-gray-900 mb-2">{achievement.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{achievement.description}</p>
                    <div className="space-y-1 text-xs text-gray-500">
                      <p className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {achievement.eventName} • {achievement.eventDate}</p>
                      <p className="flex items-center gap-1"><Trophy className="w-3 h-3" /> {achievement.position}</p>
                      {achievement.student && <p className="flex items-center gap-1"><Users className="w-3 h-3" /> Student Achievement</p>}
                      {achievement.teacher && <p className="flex items-center gap-1"><GraduationCap className="w-3 h-3" /> Teacher Achievement</p>}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary-600 text-white py-16">
          <div className="container-custom text-center">
            <Badge variant="secondary" className="mb-4">Be Part of Our Success</Badge>
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
              Create Your Own Legacy
            </h2>
            <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
              Join a school that nurtures champions. Your achievement could be the next one we celebrate.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/admissions" className="px-8 py-3 bg-white text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium">
                Start Your Journey
              </Link>
              <Link to="/contact" className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-medium">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Achievement Detail Modal */}
      {modalOpen && selectedAchievement && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} size="lg" title={selectedAchievement.title}>
          <div className="space-y-6">
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="primary">{selectedAchievement.category}</Badge>
              <Badge variant="secondary">{selectedAchievement.level}</Badge>
              <Badge variant="accent">{selectedAchievement.position}</Badge>
            </div>
            <p className="text-gray-600 leading-relaxed">{selectedAchievement.description}</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Event Details</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Event:</strong> {selectedAchievement.eventName}</p>
                  <p><strong>Date:</strong> {selectedAchievement.eventDate}</p>
                  <p><strong>Position:</strong> {selectedAchievement.position}</p>
                  <p><strong>Award:</strong> {selectedAchievement.award || 'Certificate of Achievement'}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Achiever</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  {selectedAchievement.student && <p><strong>Student:</strong> {selectedAchievement.student}</p>}
                  {selectedAchievement.teacher && <p><strong>Teacher:</strong> {selectedAchievement.teacher}</p>}
                  {selectedAchievement.team && <p><strong>Team:</strong> {selectedAchievement.team}</p>}
                  {selectedAchievement.class && <p><strong>Class:</strong> {selectedAchievement.class}</p>}
                </div>
              </div>
            </div>
            {selectedAchievement.images.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Photos</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {selectedAchievement.images.map((img, idx) => (
                    <img key={idx} src={img} alt={`${selectedAchievement.title} ${idx + 1}`} className="w-full rounded-lg" />
                  ))}
                </div>
              </div>
            )}
            {selectedAchievement.certificateUrl && (
              <a href={selectedAchievement.certificateUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                <Download className="w-4 h-4" />
                View Certificate
              </a>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}