import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, ExternalLink, Image as ImageIcon, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge, Button, Card, Input } from '../../components/ui';
import { useSettings } from '../../context/SettingsContext';
import { api } from '../../services/api';
import { SCHOOL_FACEBOOK_IMAGE_URL, SCHOOL_FACEBOOK_URL } from '../../config/branding';
import type { Gallery } from '../../types';

type GalleryItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  objectPosition?: string;
  sourceLabel?: string;
  sourceUrl?: string;
};

const facebookItems: GalleryItem[] = [
  {
    id: 'facebook-admission-poster',
    title: 'School & Admission Campaign',
    description: 'Photo published on the school Facebook presence, including the school identity and campus photographs.',
    category: 'events',
    image: SCHOOL_FACEBOOK_IMAGE_URL,
    objectPosition: 'center center',
    sourceLabel: 'Seven Star Facebook',
    sourceUrl: SCHOOL_FACEBOOK_URL,
  },
  {
    id: 'facebook-campus-main',
    title: 'Main Campus View',
    description: 'A focused crop of the upper campus photograph from the supplied Facebook image.',
    category: 'facilities',
    image: SCHOOL_FACEBOOK_IMAGE_URL,
    objectPosition: '78% 24%',
    sourceLabel: 'Seven Star Facebook',
    sourceUrl: SCHOOL_FACEBOOK_URL,
  },
  {
    id: 'facebook-campus-lower',
    title: 'Campus Building View',
    description: 'A focused crop of the second campus photograph from the supplied Facebook image.',
    category: 'facilities',
    image: SCHOOL_FACEBOOK_IMAGE_URL,
    objectPosition: '77% 62%',
    sourceLabel: 'Seven Star Facebook',
    sourceUrl: SCHOOL_FACEBOOK_URL,
  },
];

const categories = [
  { id: 'all', label: 'All' },
  { id: 'facilities', label: 'Facilities' },
  { id: 'events', label: 'Events' },
  { id: 'academic', label: 'Academic' },
  { id: 'sports', label: 'Sports' },
  { id: 'cultural', label: 'Cultural' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'trips', label: 'Trips' },
  { id: 'alumni', label: 'Alumni' },
];

export function GalleryPage() {
  const { getSettingValue } = useSettings();
  const schoolName = getSettingValue('general', 'school.name', 'Seven Star English Boarding School');
  const [items, setItems] = useState<GalleryItem[]>(facebookItems);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const [apiLoading, setApiLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    let active = true;
    api.get<Gallery>('/galleries/published', { isPublished: true, limit: 100 }).then((response) => {
      if (!active) return;
      const records = response.data?.galleries ?? [];
      const mapped: GalleryItem[] = records.map((gallery) => ({
        id: gallery._id,
        title: gallery.title,
        description: gallery.description || 'School gallery item.',
        category: gallery.category,
        image: gallery.coverImage || gallery.images?.[0]?.url || '',
        objectPosition: 'center',
      })).filter((item) => item.image);
      // Keep the supplied Facebook material at the top, then show CMS-managed albums.
      setItems([...facebookItems, ...mapped]);
    }).catch(() => {
      if (active) setItems(facebookItems);
    }).finally(() => active && setApiLoading(false));
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      const categoryMatch = activeCategory === 'all' || item.category === activeCategory;
      const searchMatch = !q || `${item.title} ${item.description} ${item.category}`.toLowerCase().includes(q);
      return categoryMatch && searchMatch;
    });
  }, [items, activeCategory, search]);

  const open = (item: GalleryItem) => {
    setSelected(item);
    setSelectedIndex(Math.max(0, filtered.findIndex((entry) => entry.id === item.id)));
  };

  const move = (direction: number) => {
    if (!filtered.length) return;
    const next = (selectedIndex + direction + filtered.length) % filtered.length;
    setSelectedIndex(next);
    setSelected(filtered[next]);
  };

  return (
    <>
      <Helmet>
        <title>Gallery | {schoolName}</title>
        <meta name="description" content={`Photo gallery of ${schoolName}, including school campus, events and community moments.`} />
        <link rel="canonical" href={`${window.location.origin}/gallery`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <section className="relative overflow-hidden bg-primary-900 text-white py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-950 to-primary-700" />
          <div className="relative container-custom">
            <Link to="/" className="inline-flex items-center gap-2 text-primary-100 hover:text-white mb-6"><ArrowLeft className="w-4 h-4" /> Back to Home</Link>
            <Badge variant="secondary" className="mb-4">School Gallery</Badge>
            <h1 className="font-heading font-bold text-4xl md:text-6xl">Moments from Seven Star</h1>
            <p className="mt-5 max-w-3xl text-primary-100 text-lg">Explore published school photographs and real visual material from the school's public presence.</p>
          </div>
        </section>

        <section className="section">
          <div className="container-custom">
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
              <div className="flex-1 max-w-xl"><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search gallery" leftIcon={<Search className="w-5 h-5" />} /></div>
              <div className="flex flex-wrap gap-2">{categories.map((category) => <button key={category.id} onClick={() => setActiveCategory(category.id)} className={`px-4 py-2 rounded-full text-sm font-medium transition ${activeCategory === category.id ? 'bg-primary-600 text-white shadow' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{category.label}</button>)}</div>
            </div>

            {filtered.length === 0 ? (
              <Card className="py-16 text-center"><ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" /><h2 className="font-heading text-xl font-bold text-gray-900">No gallery items found</h2><p className="text-gray-500 mt-2">Try another search or category.</p></Card>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((item) => (
                  <button key={item.id} type="button" onClick={() => open(item)} className="text-left group">
                    <Card hover className="p-0 overflow-hidden h-full">
                      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" style={{ objectPosition: item.objectPosition || 'center' }} loading="lazy" decoding="async" />
                        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/75 to-transparent pt-16"><div className="text-white text-sm font-semibold">View photo</div></div>
                      </div>
                      <div className="p-5"><div className="flex items-center justify-between gap-3"><Badge variant="primary">{item.category}</Badge>{item.sourceLabel && <span className="text-xs text-gray-500">{item.sourceLabel}</span>}</div><h2 className="font-heading font-bold text-xl text-gray-900 mt-3">{item.title}</h2><p className="text-gray-600 text-sm mt-2 line-clamp-2">{item.description}</p></div>
                    </Card>
                  </button>
                ))}
              </div>
            )}

            <div className="mt-10 rounded-2xl border border-primary-100 bg-primary-50 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div><p className="font-semibold text-gray-900">More photos are managed by the school.</p><p className="text-sm text-gray-600 mt-1">Administrators can publish additional albums through the CMS.</p></div>
              <a href={SCHOOL_FACEBOOK_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-primary-700 font-medium"><ExternalLink className="w-4 h-4" /> Visit Facebook</a>
            </div>

            {apiLoading && <p className="mt-4 text-xs text-gray-400">Loading additional CMS gallery items…</p>}
          </div>
        </section>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/90 p-4 sm:p-6 flex items-center justify-center" role="dialog" aria-modal="true" aria-label={selected.title} onClick={() => setSelected(null)}>
          <button className="absolute top-5 right-5 text-white/90 hover:text-white" onClick={() => setSelected(null)} aria-label="Close gallery"><X className="w-7 h-7" /></button>
          <button className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20" onClick={(e) => { e.stopPropagation(); move(-1); }} aria-label="Previous photo"><ChevronLeft className="w-7 h-7" /></button>
          <div className="max-w-6xl w-full h-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img src={selected.image} alt={selected.title} className="max-h-[78vh] max-w-full object-contain rounded-xl shadow-2xl" style={{ objectPosition: selected.objectPosition || 'center' }} />
            <div className="mt-4 text-center text-white"><h2 className="font-heading text-xl font-bold">{selected.title}</h2><p className="text-sm text-white/70 mt-1">{selected.sourceLabel || 'Seven Star School Gallery'}</p>{selected.sourceUrl && <a href={selected.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-3 text-sm text-white/90 underline"><ExternalLink className="w-4 h-4" /> View source</a>}</div>
          </div>
          <button className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20" onClick={(e) => { e.stopPropagation(); move(1); }} aria-label="Next photo"><ChevronRight className="w-7 h-7" /></button>
        </div>
      )}
    </>
  );
}
