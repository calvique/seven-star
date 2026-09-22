import React, { useEffect, useState } from 'react';
import { Building2, MapPin } from 'lucide-react';
import { Badge, Card } from '../../components/ui';
import { SiteSeo } from '../../components/seo/SiteSeo';
import { useSettings } from '../../context/SettingsContext';
import { api } from '../../services/api';
import type { Facility } from '../../types';

export function Facilities() {
  const { getSettingValue } = useSettings();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const schoolName = getSettingValue('general', 'school.name', 'Seven Star English Boarding School');
  useEffect(() => { api.get('/facilities/published', { limit: 100 }).then((res) => { if (res.success) setFacilities(res.data.facilities || []); }).catch(() => {}).finally(() => setLoading(false)); }, []);
  return <><SiteSeo title="Facilities" description={`Facilities published by ${schoolName}.`} /><section className="bg-primary-900 text-white py-20"><div className="container-custom"><Badge variant="secondary" className="mb-4">Facilities</Badge><h1 className="font-heading text-4xl md:text-5xl font-bold">Campus facilities</h1><p className="mt-5 max-w-3xl text-primary-100">Only facilities published and approved by the administration appear on this page.</p></div></section><section className="section"><div className="container-custom">{loading ? <p className="text-gray-500">Loading facilities…</p> : !facilities.length ? <Card className="text-center"><Building2 className="w-10 h-10 text-primary-600 mx-auto"/><h2 className="mt-4 font-heading text-xl font-bold">No facilities published yet</h2></Card> : <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{facilities.map((item)=><Card key={item._id} className="h-full"><div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 mb-5">{item.images?.length ? <img src={item.images.find(i=>i.isCover)?.url || item.images[0].url} alt={item.images.find(i=>i.isCover)?.alt || item.name} className="w-full h-full object-cover" loading="lazy" decoding="async"/> : <div className="w-full h-full flex items-center justify-center"><Building2 className="w-12 h-12 text-gray-300"/></div>}</div><Badge variant="primary" className="mb-2">{item.category}</Badge><h2 className="font-heading text-xl font-bold">{item.name}</h2><p className="mt-2 text-gray-600">{item.shortDescription || item.description}</p>{item.location && <p className="mt-4 text-sm text-gray-500 flex items-center gap-2"><MapPin className="w-4 h-4"/>{item.location}</p>}{item.features?.length ? <div className="mt-4 flex flex-wrap gap-2">{item.features.map((feature)=><span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs" key={feature}>{feature}</span>)}</div> : null}</Card>)}</div>}</div></section></>;
}
