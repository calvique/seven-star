import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Image, Camera, Calendar, MapPin, Search, ChevronLeft, ChevronRight, X, Maximize, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, Badge, Modal } from '../../components/ui';
import { useSettings } from '../../context/SettingsContext';
import { api } from '../../services/api';
import type { Gallery } from '../../types';

export function GalleryPage() {
  const { getSettingValue } = useSettings();
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const schoolName = getSettingValue('general', 'school.name', 'Seven Star English Boarding School');

  const categories = [
    { id: 'all', label: 'All', icon: Image },
    { id: 'academic', label: 'Academic', icon: BookOpen },
    { id: 'sports', label: 'Sports', icon: Dumbbell },
    { id: 'cultural', label: 'Cultural', icon: Music },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'facilities', label: 'Facilities', icon: Image },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'trips', label: 'Trips', icon: MapPin },
    { id: 'alumni', label: 'Alumni', icon: Users },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get<Gallery>('/galleries/published', { isPublished: true });
        if (res.success) setGalleries(res.data.galleries || []);
      } catch (error) {
        console.error('Failed to fetch galleries:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredGalleries = galleries.filter((g) => {
    const matchesCategory = activeCategory === 'all' || g.category === activeCategory;
    const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const openLightbox = (gallery: Gallery, index: number) => {
    setSelectedGallery(gallery);
    setSelectedImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedGallery(null);
    setSelectedImageIndex(0);
  };

  const navigateLightbox = (direction: number) => {
    if (!selectedGallery) return;
    const newIndex = (selectedImageIndex + direction + selectedGallery.images.length) % selectedGallery.images.length;
    setSelectedImageIndex(newIndex);
  };

  return (
    <>
      <Helmet>
        <title>Photo Gallery - {schoolName}</title>
        <meta name="description" content={`Photo gallery of ${schoolName} - Academic, sports, cultural events, facilities, and achievements in Devdaha, Rupandehi.`} />
        <meta property="og:title" content={`Photo Gallery - ${schoolName}`} />
        <meta property="og:description" content="Explore memorable moments, school life, activities and experiences." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-16 lg:py-24">
          <div className="container-custom">
            <div className="max-w-3xl">
              <Link to="/" className="inline-flex items-center gap-2 text-primary-100 hover:text-white mb-6 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                Back to Home
              </Link>
              <Badge variant="secondary" className="mb-6">Life in Frames</Badge>
              <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
                Photo Gallery
              </h1>
              <p className="text-lg md:text-xl text-primary-100 mb-8">
                Moments captured from school life - academics, sports, culture, and achievements.
              </p>
            </div>
          </div>
        </section>

        {/* Search & Filters */}
        <section className="section bg-gray-50 -mt-8">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search galleries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
                      activeCategory === cat.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <cat.icon className="w-4 h-4" />
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="section bg-white pb-20">
          <div className="container-custom">
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="animate-pulse overflow-hidden">
                    <div className="aspect-[4/3] bg-gray-200" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : filteredGalleries.length === 0 ? (
              <div className="text-center py-20">
                <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500 mb-2">No galleries found</h3>
                <p className="text-gray-400">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredGalleries.map((gallery) => (
                  <Card key={gallery._id} hover className="overflow-hidden h-full" onClick={() => openLightbox(gallery, 0)}>
                    <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                      {gallery.coverImage ? (
                        <img 
                          src={gallery.coverImage} 
                          alt={gallery.title} 
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          loading="lazy"
                        />
                      ) : gallery.images[0] ? (
                        <img 
                          src={gallery.images[0].url} 
                          alt={gallery.title} 
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100">
                          <Image className="w-12 h-12 text-primary-200" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <Badge variant="primary">{gallery.category}</Badge>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <Camera className="w-5 h-5 text-white/80" />
                        <span className="text-white/90 text-sm font-medium">{gallery.images.length} photos</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <Badge variant="primary" className="mb-2">{gallery.category}</Badge>
                      <h3 className="font-heading font-semibold text-lg text-gray-900 mb-1 line-clamp-1">{gallery.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{gallery.description || 'School life moments'}</p>
                      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100 text-sm text-gray-500">
                        {gallery.eventDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(gallery.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        )}
                        {gallery.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {gallery.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Image className="w-4 h-4" />
                          {gallery.views} views
                        </span>
                      </div>
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
            <Badge variant="secondary" className="mb-4">Stay Connected</Badge>
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
              Follow Our Journey
            </h2>
            <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
              Stay updated with our latest activities, events, and achievements on social media.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="https://www.facebook.com/sevenstar.boarding" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-medium flex items-center gap-2">
                <Facebook className="w-5 h-5" />
                Facebook
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-medium flex items-center gap-2">
                <Youtube className="w-5 h-5" />
                YouTube
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-medium flex items-center gap-2">
                <Instagram className="w-5 h-5" />
                Instagram
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && selectedGallery && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <button
            onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <div className="relative max-w-5xl max-h-[90vh] w-full mx-4">
            <img
              src={selectedGallery.images[selectedImageIndex].url}
              alt={selectedGallery.images[selectedImageIndex].alt || selectedGallery.title}
              className="max-w-full max-h-[80vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="font-heading font-bold text-white mb-1">{selectedGallery.title}</h3>
              <p className="text-white/80 text-sm">{selectedGallery.images[selectedImageIndex].caption || `Image ${selectedImageIndex + 1} of ${selectedGallery.images.length}`}</p>
            </div>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Thumbnail Strip */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 max-w-4xl overflow-x-auto pb-4 px-4">
            {selectedGallery.images.map((img, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(idx); }}
                className={`relative w-20 h-14 rounded overflow-hidden flex-shrink-0 transition-all ${
                  idx === selectedImageIndex ? 'ring-2 ring-white scale-105' : 'opacity-60 hover:opacity-100'
                }`}
                aria-label={`View image ${idx + 1}`}
                aria-current={idx === selectedImageIndex ? 'true' : 'false'}
              >
                <img src={img.url} alt="" className="w-full h-full object-cover" />
                {idx === selectedImageIndex && <div className="absolute inset-0 bg-white/20" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}