import React, { useEffect, useState } from 'react';
import { ArrowRight, Camera, GraduationCap, MapPin, MessageSquare, Bell, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
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
  const intro = getSettingValue('about', 'school.intro', 'Official school information, notices, activities and resources published by the administration.');

  useEffect(() => {
    Promise.allSettled([
      api.get('/notices/latest', { limit: 4 }),
      api.get('/activities/published', { limit: 4 }),
      api.get('/galleries/published', { limit: 6 }),
    ]).then(([n, a, g]) => {
      if (n.status === 'fulfilled') setNotices(n.value.data?.notices || n.value.data?.data?.notices || []);
      if (a.status === 'fulfilled') setActivities(a.value.data?.activities || a.value.data?.data?.activities || []);
      if (g.status === 'fulfilled') setGallery(g.value.data?.galleries || g.value.data?.data?.galleries || []);
    });
  }, []);

  return <>
    <SiteSeo title="Home" description={`Official website of ${schoolName}. School information, notices, admissions, activities, gallery and results.`} />
    <section className="relative overflow-hidden bg-primary-950 text-white">
      {heroImage && <img src={heroImage} alt="School campus" className="absolute inset-0 h-full w-full object-cover opacity-35" loading="eager" />}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-900/90 to-primary-700/70" />
      <div className="relative container-custom py-24 lg:py-32">
        <div className="max-w-4xl">
          <Badge variant="secondary" className="mb-5">Seven Star Boarding School</Badge>
          <h1 className="font-heading text-4xl font-bold leading-tight md:text-6xl">{schoolName}</h1>
          <p className="mt-5 max-w-2xl text-xl text-primary-100">{tagline}</p>
          <p className="mt-4 max-w-2xl text-primary-100">{intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/admissions"><Button size="lg">Admissions <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
            <Link to="/results"><Button size="lg" variant="outline" className="border-white/30 bg-white/10 text-white">Class 11 & 12 Results</Button></Link>
          </div>
          <div className="mt-7 flex items-center gap-2 text-sm text-primary-100"><MapPin className="h-4 w-4" />{address}</div>
        </div>
      </div>
    </section>

    <section className="section bg-white">
      <div className="container-custom grid gap-5 md:grid-cols-3">
        {[
          ['/notices', 'Notices', Bell, 'Official announcements and school updates.'],
          ['/activities', 'Activities', Trophy, 'Student activities and programmes.'],
          ['/gallery', 'Gallery', Camera, 'Published school photos and albums.'],
        ].map(([path, label, Icon, text]) => {
          const IconComponent = Icon as React.ElementType;
          return <Link key={path as string} to={path as string}><Card className="h-full transition-transform hover:-translate-y-1"><IconComponent className="h-8 w-8 text-primary-600" /><h2 className="mt-4 font-heading text-xl font-bold text-gray-900">{label as string}</h2><p className="mt-2 text-gray-600">{text as string}</p><span className="mt-5 inline-flex items-center text-primary-600">Open <ArrowRight className="ml-1 h-4 w-4" /></span></Card></Link>;
        })}
      </div>
    </section>

    <section className="section bg-gray-50">
      <div className="container-custom grid gap-8 lg:grid-cols-2">
        <Card>
          <div className="mb-6 flex items-center justify-between"><h2 className="font-heading text-2xl font-bold">Latest Notices</h2><Link to="/notices" className="text-sm font-medium text-primary-600">View all</Link></div>
          {notices.length ? notices.map((notice) => <div key={notice._id} className="border-t border-gray-100 py-4"><Link to="/notices" className="font-semibold text-gray-900 hover:text-primary-600">{notice.title}</Link><p className="mt-1 text-sm text-gray-500">{notice.excerpt || notice.shortDescription || ''}</p></div>) : <p className="text-gray-500">No published notices yet.</p>}
        </Card>
        <Card>
          <div className="mb-6 flex items-center justify-between"><h2 className="font-heading text-2xl font-bold">Latest Activities</h2><Link to="/activities" className="text-sm font-medium text-primary-600">View all</Link></div>
          {activities.length ? activities.map((item) => <div key={item._id} className="border-t border-gray-100 py-4"><div className="font-semibold text-gray-900">{item.title}</div><p className="mt-1 text-sm text-gray-500">{item.shortDescription || item.description || ''}</p></div>) : <p className="text-gray-500">No published activities yet.</p>}
        </Card>
      </div>
    </section>

    <section className="section bg-white"><div className="container-custom"><div className="mb-7 flex items-center justify-between"><div><p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Photo updates</p><h2 className="font-heading text-3xl font-bold">Gallery</h2></div><Link to="/gallery" className="inline-flex items-center gap-1 font-medium text-primary-600">View gallery <ArrowRight className="h-4 w-4" /></Link></div><div className="grid grid-cols-2 gap-4 md:grid-cols-3">{gallery.length ? gallery.map((item) => <Link to="/gallery" key={item._id} className="aspect-[4/3] overflow-hidden rounded-xl bg-gray-100"><img src={item.coverImage || item.images?.[0]?.url || item.images?.[0] || '/favicon.svg'} alt={item.title || 'School gallery'} className="h-full w-full object-cover" loading="lazy" decoding="async" /></Link>) : <Card className="col-span-full text-center text-gray-500">No published gallery items yet.</Card>}</div></div></section>

    <section className="section bg-primary-50"><div className="container-custom grid gap-6 md:grid-cols-2"><Link to="/suggestions"><Card className="h-full"><MessageSquare className="h-8 w-8 text-primary-600" /><h2 className="mt-4 font-heading text-xl font-bold">Suggestions</h2><p className="mt-2 text-gray-600">Share feedback or suggestions with the school administration.</p></Card></Link><Link to="/contact"><Card className="h-full"><GraduationCap className="h-8 w-8 text-primary-600" /><h2 className="mt-4 font-heading text-xl font-bold">Contact</h2><p className="mt-2 text-gray-600">Find official contact details and send an enquiry.</p></Card></Link></div></section>
  </>;
}
