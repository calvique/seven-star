import { useEffect, useMemo, useState } from 'react';
import { Activity as ActivityIcon, CalendarDays, Users } from 'lucide-react';
import { Badge, Card, Spinner } from '../../components/ui';
import { SiteSeo } from '../../components/seo/SiteSeo';
import { useSettings } from '../../context/SettingsContext';
import { api } from '../../services/api';

export function Activities() {
  const { getSettingValue } = useSettings();
  const schoolName = getSettingValue('general', 'school.name', 'Seven Star English Boarding School');
  const [items,setItems]=useState<any[]>([]); const [category,setCategory]=useState('all'); const [loading,setLoading]=useState(true);
  useEffect(()=>{api.getPublishedActivities({limit:100}).then(r=>setItems(r.data?.data?.activities??r.data?.activities??[])).catch(()=>setItems([])).finally(()=>setLoading(false))},[]);
  const cats=['all',...Array.from(new Set(items.map((x)=>x.category).filter(Boolean)))]; const filtered=useMemo(()=>category==='all'?items:items.filter((x)=>x.category===category),[items,category]);
  return <><SiteSeo title="Activities" description={`Student activities and co-curricular programmes published by ${schoolName}.`} /><section className="bg-primary-900 text-white py-20"><div className="container-custom"><Badge variant="secondary" className="mb-4">Activities</Badge><h1 className="font-heading text-4xl md:text-5xl font-bold">Student Activities</h1><p className="mt-4 max-w-2xl text-primary-100">Sports, clubs, cultural events and programmes published by the school.</p></div></section><section className="section bg-gray-50"><div className="container-custom">{cats.length>1&&<div className="flex flex-wrap gap-2 mb-8">{cats.map((c)=><button key={c} onClick={()=>setCategory(c)} className={`px-4 py-2 rounded-full capitalize ${category===c?'bg-primary-600 text-white':'bg-white border text-gray-700'}`}>{c}</button>)}</div>}{loading?<div className="flex justify-center py-16"><Spinner size="lg"/></div>:filtered.length===0?<Card className="py-16 text-center"><ActivityIcon className="w-12 h-12 text-gray-300 mx-auto"/><h2 className="font-heading text-xl font-bold mt-4">No published activities yet</h2></Card>:<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{filtered.map((a)=><Card key={a._id||a.title} className="h-full"><Badge variant="primary">{a.category||'Activity'}</Badge><h2 className="font-heading text-xl font-semibold mt-3">{a.title}</h2><p className="text-gray-600 mt-2">{a.shortDescription||a.description||''}</p><div className="mt-5 space-y-2 text-sm text-gray-500"><div className="flex gap-2 items-center"><CalendarDays className="w-4 h-4"/>{a.frequency||'Schedule published by school'}</div><div className="flex gap-2 items-center"><Users className="w-4 h-4"/>{a.maxParticipants?`Up to ${a.maxParticipants} participants`:'See activity details'}</div></div></Card>)}</div>}</div></section></>;
}
