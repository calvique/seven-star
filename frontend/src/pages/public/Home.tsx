import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bell, Camera, GraduationCap, MapPin, MessageSquare, Search, Trophy } from 'lucide-react';
import { Badge, Button, Card } from '../../components/ui';
import { SiteSeo } from '../../components/seo/SiteSeo';
import { useSettings } from '../../context/SettingsContext';
import { api } from '../../services/api';

export function Home() {
  const { getSettingValue } = useSettings();
  const [notices, setNotices] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);

  const schoolName = getSettingValue('general', 'school.name', 'Seven Star English Boarding School');
  const tagline = getSettingValue('general', 'school.tagline', 'Official school information and updates');
  const address = getSettingValue('general', 'school.address', 'Devdaha-2, Rupandehi, Nepal');
  const heroImage = getSettingValue('general', 'school.heroImage', '');
  const intro = getSettingValue('about', 'school.intro', 'School information, announcements, programmes and resources are maintained by the administration through the CMS.');

  useEffect(() => {
    Promise.allSettled([
      api.get('/notices/latest', { limit: 4 }),
      api.get('/activities/published', { limit: 4 }),
      api.get('/galleries/published', { limit: 6 }),
    ]).then(([n, a, g]) => {
      if (n.status === 'fulfilled') setNotices(n.value.data?.notices || []);
      if (a.status === 'fulfilled') setActivities(a.value.data?.activities || []);
      if (g.status === 'fulfilled') setGallery(g.value.data?.galleries || []);
    });
  }, []);

  return (
    <>
      <SiteSeo title="Home" description={`Official website of ${schoolName}. School information, notices, admissions, activities, gallery and results.`} />
      <section className="relative overflow-hidden bg-primary-900 text-white">
        {heroImage && <img src={heroImage} alt="School campus" className="absolute inset-0 w-full h-full object-cover opacity-30" loading="eager" />}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-900/90 to-primary-700/70" />
        <div className="relative container-custom py-24 lg:py-36">
          <div className="max-w-4xl">
            <Badge variant="secondary" className="mb-5">Seven Star Boarding School</Badge>
            <h1 className="font-heading font-bold text-4xl md:text-6xl lg:text-7xl leading-tight">{schoolName}</h1>
            <p className="mt-5 text-xl text-primary-100 max-w-2xl">{tagline}</p>
            <p className="mt-4 text-primary-100 max-w-2xl">{intro}</p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link to="/admissions"><Button size="lg">Admissions <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
              <Link to="/results"><Button size="lg" variant="outline" className="bg-white/10 text-white border-white/30">Class 11 & 12 Results <Search className="w-4 h-4 ml-2" /></Button></Link>
            </div>
            <div className="flex items-center gap-2 mt-7 text-sm text-primary-100"><MapPin className="w-4 h-4" />{address}</div>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-custom grid md:grid-cols-3 gap-5">
          {[['Notices', Bell, '/notices', 'Read official announcements published by the school.'], ['Activities', Trophy, '/activities', 'Explore activities and student programmes published by the school.'], ['Gallery', Camera, '/gallery', 'View school photographs and albums published through the CMS.']].map(([label, Icon, path, text]) => {
            const I = Icon as React.ElementType;
            return <Link to={path as string} key={label as string}><Card className="h-full hover:-translate-y-1 transition-transform"><I className="w-8 h-8 text-primary-600" /><h2 className="mt-4 font-heading text-xl font-bold text-gray-900">{label as string}</h2><p className="mt-2 text-gray-600">{text as string}</p><span className="inline-flex mt-5 items-center text-primary-600 font-medium">Open <ArrowRight className="w-4 h-4 ml-1" /></span></Card></Link>;
          })}
        </div>
      </section>

      <section className="section bg-gray-50">
        <div className="container-custom grid lg:grid-cols-2 gap-8">
          <Card>
            <div className="flex items-center justify-between gap-4 mb-6"><h2 className="font-heading text-2xl font-bold">Latest Notices</h2><Link to="/notices" className="text-primary-600 text-sm font-medium">View all</Link></div>
            {notices.length ? notices.map((notice) => <div key={notice._id} className="py-4 border-t border-gray-100"><Link to="/notices" className="font-semibold text-gray-900 hover:text-primary-600">{notice.title}</Link><p className="text-sm text-gray-500 mt-1">{notice.shortDescription || notice.description || ''}</p></div>) : <p className="text-gray-500">No published notices yet.</p>}
          </Card>
          <Card>
            <div className="flex items-center justify-between gap-4 mb-6"><h2 className="font-heading text-2xl font-bold">Latest Activities</h2><Link to="/activities" className="text-primary-600 text-sm font-medium">View all</Link></div>
            {activities.length ? activities.map((item) => <div key={item._id} className="py-4 border-t border-gray-100"><div className="font-semibold text-gray-900">{item.title}</div><p className="text-sm text-gray-500 mt-1">{item.shortDescription || item.description || ''}</p></div>) : <p className="text-gray-500">No published activities yet.</p>}
          </Card>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-7"><div><p className="text-sm font-semibold text-primary-600 uppercase tracking-wide">Photo updates</p><h2 className="font-heading text-3xl font-bold">Gallery</h2></div><Link to="/gallery" className="inline-flex items-center gap-1 text-primary-600 font-medium">View gallery <ArrowRight className="w-4 h-4" /></Link></div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {gallery.length ? gallery.map((item) => <Link to="/gallery" key={item._id} className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100"><img src={item.coverImage || item.images?.[0]?.url || item.images?.[0] || '/favicon.svg'} alt={item.title || 'School gallery'} className="w-full h-full object-cover" loading="lazy" decoding="async" /></Link>) : <Card className="col-span-full text-center text-gray-500">No published gallery items yet.</Card>}
          </div>
        </div>
      </section>

      <section className="section bg-primary-50">
        <div className="container-custom grid md:grid-cols-2 gap-6">
          <Link to="/suggestions"><Card className="h-full"><MessageSquare className="w-8 h-8 text-primary-600" /><h2 className="mt-4 font-heading text-xl font-bold">Suggestions</h2><p className="mt-2 text-gray-600">Share feedback or a suggestion with the administration.</p></Card></Link>
          <Link to="/contact"><Card className="h-full"><GraduationCap className="w-8 h-8 text-primary-600" /><h2 className="mt-4 font-heading text-xl font-bold">Contact</h2><p className="mt-2 text-gray-600">Find official contact information and send an enquiry.</p></Card></Link>
        </div>
      </section>
    </>
  );
}
