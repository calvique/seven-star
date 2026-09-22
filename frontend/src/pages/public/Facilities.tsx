import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Building, Wifi, BookOpen, FlaskConical, Dumbbell, Utensils, Bed, Bus, Heart, Music, TreePine, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, Badge } from '../../components/ui';
import { useSettings } from '../../context/SettingsContext';
import { api } from '../../services/api';
import type { Facility } from '../../types';

export function Facilities() {
  const { getSettingValue } = useSettings();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const schoolName = getSettingValue('general', 'school.name', 'Seven Star English Boarding School');

  const categories = [
    { id: 'all', label: 'All Facilities', icon: Building },
    { id: 'academic', label: 'Academic', icon: BookOpen },
    { id: 'laboratory', label: 'Laboratories', icon: FlaskConical },
    { id: 'library', label: 'Library', icon: BookOpen },
    { id: 'sports', label: 'Sports', icon: Dumbbell },
    { id: 'auditorium', label: 'Auditorium', icon: Music },
    { id: 'hostel', label: 'Hostel', icon: Bed },
    { id: 'cafeteria', label: 'Cafeteria', icon: Utensils },
    { id: 'transport', label: 'Transport', icon: Bus },
    { id: 'medical', label: 'Medical', icon: Heart },
    { id: 'playground', label: 'Playground', icon: TreePine },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get<Facility>('/facilities/published', { isActive: true, isPublished: true });
        if (res.success) setFacilities(res.data.facilities || []);
      } catch (error) {
        console.error('Failed to fetch facilities:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredFacilities = activeCategory === 'all' 
    ? facilities 
    : facilities.filter(f => f.category === activeCategory);

  const featuredFacilities = [
    {
      id: 'computer-lab',
      name: 'Computer Laboratory',
      category: 'academic',
      shortDescription: '60 workstations with high-speed internet and latest software',
      description: 'Our state-of-the-art computer lab features 60 modern workstations with gigabit fiber connectivity. Students learn programming, digital literacy, and computer applications from Grade 1 onwards. The lab is equipped with the latest software for coding, design, and research.',
      features: ['60 modern workstations', 'Gigabit fiber internet', 'Programming & coding software', 'Digital literacy curriculum', 'Robotics & AI basics', 'Available for all grades'],
      image: '/facilities/computer-lab.jpg',
    },
    {
      id: 'science-labs',
      name: 'Science Laboratories',
      category: 'laboratory',
      shortDescription: 'Fully equipped Physics, Chemistry, and Biology labs',
      description: 'Three separate modern laboratories for Physics, Chemistry, and Biology rebuilt in 2023. Each lab features modern equipment, safety systems, and ample space for hands-on experiments. Students conduct practical experiments aligned with NEB curriculum.',
      features: ['Physics, Chemistry, Biology labs', 'Modern equipment & apparatus', 'Safety systems & fume hoods', 'NEB practical curriculum', 'Lab assistants for guidance', 'Regular equipment updates'],
      image: '/facilities/science-labs.jpg',
    },
    {
      id: 'library',
      name: 'Library & Resource Center',
      category: 'library',
      shortDescription: '10,000+ books, digital resources, and quiet study spaces',
      description: 'Our spacious library houses over 10,000 books including textbooks, reference materials, fiction, and periodicals. Digital resources include e-books, educational databases, and online journals. Quiet reading areas and group study rooms available.',
      features: ['10,000+ books', 'E-books & digital databases', 'Quiet reading areas', 'Group study rooms', 'Reference section', 'Newspapers & magazines'],
      image: '/facilities/library.jpg',
    },
    {
      id: 'sports-complex',
      name: 'Sports Complex',
      category: 'sports',
      shortDescription: 'Indoor courts, table tennis, and 400m running track',
      description: 'Our sports complex includes four table tennis courts, a covered multi-purpose court for basketball/volleyball/badminton, and a 400m running track. Regular inter-house and inter-school competitions are held here.',
      features: ['4 table tennis courts', 'Covered multi-purpose court', '400m running track', 'Basketball/Volleyball/Badminton', 'Inter-house competitions', 'Sports equipment provided'],
      image: '/facilities/sports.jpg',
    },
    {
      id: 'auditorium',
      name: 'Auditorium',
      category: 'auditorium',
      shortDescription: '600-seat hall for assemblies, festivals, and events',
      description: 'A modern 600-seat auditorium with professional sound and lighting systems. Used for daily assemblies, cultural programs, annual functions, guest lectures, and examinations. Fully air-conditioned with comfortable seating.',
      features: ['600-seat capacity', 'Professional sound & lighting', 'Air-conditioned', 'Stage with backstage', 'Projection system', 'Used for assemblies & events'],
      image: '/facilities/auditorium.jpg',
    },
    {
      id: 'hostel',
      name: 'Boarding Facilities',
      category: 'hostel',
      shortDescription: 'Separate boys & girls hostels with 24/7 supervision',
      description: 'Comfortable and secure boarding facilities with separate wings for boys and girls. Each room accommodates 4-6 students with study tables, wardrobes, and attached bathrooms. 24/7 wardens, CCTV, and medical support available.',
      features: ['Separate boys/girls wings', '4-6 students per room', 'Study tables & wardrobes', '24/7 warden supervision', 'CCTV security', 'Medical room on-site'],
      image: '/facilities/hostel.jpg',
    },
    {
      id: 'cafeteria',
      name: 'Cafeteria & Dining Hall',
      category: 'cafeteria',
      shortDescription: 'Hygienic meals with varied nutritious menu',
      description: 'Spacious dining hall serving hygienic, nutritious meals prepared in our modern kitchen. Varied menu including Nepali, Indian, and continental dishes. Special dietary requirements accommodated. RO water purification system.',
      features: ['Hygienic kitchen', 'Varied nutritious menu', 'RO water purification', 'Dietary accommodations', 'Spacious dining hall', 'Regular quality checks'],
      image: '/facilities/cafeteria.jpg',
    },
    {
      id: 'transport',
      name: 'Transportation',
      category: 'transport',
      shortDescription: 'School buses covering major routes in Rupandehi',
      description: 'Fleet of well-maintained school buses with experienced drivers and conductors. Routes cover Devdaha, Butwal, Bhairahawa, and surrounding areas. GPS tracking, first-aid kits, and female attendants on all routes.',
      features: ['Multiple bus routes', 'GPS tracking', 'Experienced drivers', 'Female attendants', 'First-aid kits', 'Regular maintenance'],
      image: '/facilities/transport.jpg',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Facilities - {schoolName}</title>
        <meta name="description" content={`Facilities at ${schoolName} - Modern computer labs, science laboratories, library, sports complex, auditorium, boarding, cafeteria, and transportation in Devdaha, Rupandehi.`} />
        <meta property="og:title" content={`Facilities - ${schoolName}`} />
        <meta property="og:description" content="Modern facilities including labs, library, sports complex, auditorium, and boarding." />
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
              <Badge variant="secondary" className="mb-6">Campus Infrastructure</Badge>
              <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
                World-Class Facilities
              </h1>
              <p className="text-lg md:text-xl text-primary-100 mb-8">
                Modern infrastructure designed for holistic learning and student well-being.
              </p>
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  <span>Safe & Secure Campus</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wifi className="w-5 h-5" />
                  <span>High-Speed Internet</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  <span>Modern Buildings</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Facilities */}
        <section className="section bg-white">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <Badge variant="primary" className="mb-4">Key Facilities</Badge>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 mb-4">
                Campus Highlights
              </h2>
              <p className="text-lg text-gray-600">
                Explore our state-of-the-art facilities designed for 21st-century learning.
              </p>
            </div>

            <div className="space-y-8">
              {featuredFacilities.map((facility, index) => (
                <div key={facility.id} className={`grid lg:grid-cols-2 gap-8 ${index % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-primary-100 to-secondary-100">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {(() => {
                        switch (facility.category) {
                          case 'academic': return <BookOpen className="w-16 h-16 text-primary-200" />;
                          case 'laboratory': return <FlaskConical className="w-16 h-16 text-primary-200" />;
                          case 'library': return <BookOpen className="w-16 h-16 text-primary-200" />;
                          case 'sports': return <Dumbbell className="w-16 h-16 text-primary-200" />;
                          case 'auditorium': return <Music className="w-16 h-16 text-primary-200" />;
                          case 'hostel': return <Bed className="w-16 h-16 text-primary-200" />;
                          case 'cafeteria': return <Utensils className="w-16 h-16 text-primary-200" />;
                          case 'transport': return <Bus className="w-16 h-16 text-primary-200" />;
                          case 'medical': return <Heart className="w-16 h-16 text-primary-200" />;
                          default: return <TreePine className="w-16 h-16 text-primary-200" />;
                        }
                      })()}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent text-white">
                      <Badge variant="secondary" className="mb-2">{facility.category}</Badge>
                      <h3 className="font-heading font-bold text-xl">{facility.name}</h3>
                    </div>
                  </div>
                  <div className="p-6 lg:p-8">
                    <Badge variant="primary" className="mb-3">{facility.category}</Badge>
                    <h3 className="font-heading font-bold text-2xl text-gray-900 mb-3">{facility.name}</h3>
                    <p className="text-gray-600 text-lg mb-6">{facility.shortDescription}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {facility.features.map((feature) => (
                        <Badge key={feature} variant="gray" className="text-sm">{feature}</Badge>
                      ))}
                    </div>
                    <Link to="/contact" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium">
                      Schedule a Campus Tour <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* All Facilities Grid */}
        <section className="section bg-gray-50">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-8">
              <Badge variant="primary" className="mb-4">All Facilities</Badge>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 mb-4">
                Complete Campus Infrastructure
              </h2>
            </div>

            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === cat.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <cat.icon className="w-4 h-4 inline mr-1" />
                  {cat.label}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse h-64" />
                ))}
              </div>
            ) : filteredFacilities.length === 0 ? (
              <div className="text-center py-12">
                <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500">No facilities in this category</h3>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFacilities.map((facility) => (
                  <Card key={facility._id} hover className="h-full">
                    <div className="aspect-[4/3] bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl mb-4 flex items-center justify-center">
                      {facility.images[0] ? (
                        <img src={facility.images[0].url} alt={facility.name} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <Building className="w-12 h-12 text-primary-200" />
                      )}
                    </div>
                    <Badge variant="primary" className="mb-2">{facility.category}</Badge>
                    <h3 className="font-heading font-semibold text-lg text-gray-900 mb-2">{facility.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{facility.shortDescription || facility.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {facility.features.slice(0, 4).map((feature) => (
                        <Badge key={feature} variant="gray" className="text-xs">{feature}</Badge>
                      ))}
                      {facility.features.length > 4 && (
                        <Badge variant="gray" className="text-xs">+{facility.features.length - 4} more</Badge>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Virtual Tour CTA */}
        <section className="bg-primary-600 text-white py-20">
          <div className="container-custom text-center">
            <Badge variant="secondary" className="mb-6">Visit Us</Badge>
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-6">
              Experience Our Campus
            </h2>
            <p className="text-primary-100 text-lg mb-10 max-w-2xl mx-auto">
              Schedule a guided campus tour to see our facilities firsthand and meet our community.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="px-8 py-3 bg-white text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium">
                Schedule Campus Tour
              </Link>
              <Link to="/admissions" className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-medium">
                Apply for Admission
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}