import { useEffect, useMemo, useState } from 'react';
import { Award, Trophy } from 'lucide-react';
import { Badge, Card, Spinner } from '../../components/ui';
import { SiteSeo } from '../../components/seo/SiteSeo';
import { useSettings } from '../../context/SettingsContext';
import { api } from '../../services/api';

export function Achievements() {
  const { getSettingValue } = useSettings();
  const schoolName = getSettingValue('general', 'school.name', 'Seven Star English Boarding School');
  const [items, setItems] = useState<any[]>([]);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.getPublishedAchievements({ limit: 100 }).then((r) => setItems(r.data?.data?.achievements ?? r.data?.achievements ?? [])).catch(() => setItems([])).finally(() => setLoading(false)); }, []);
  const filtered = useMemo(() => category === 'all' ? items : items.filter((x) => x.category === category), [items, category]);
  const cats = ['all', ...Array.from(new Set(items.map((x) => x.category).filter(Boolean)))];
  return <><SiteSeo title="Achievements" description={`Published achievements of ${schoolName}.`} /><section className="bg-primary-900 text-white py-20"><div className="container-custom"><Badge variant="secondary" className="mb-4">Student Success</Badge><h1 className="font-heading text-4xl md:text-5xl font-bold">Achievements</h1><p className="mt-4 max-w-2xl text-primary-100">Verified achievements published by the school administration.</p></div></section><section className="section bg-gray-50"><div className="container-custom">{cats.length>1&&<div className="flex flex-wrap gap-2 mb-8">{cats.map((c)=><button key={c} onClick={()=>setCategory(c)} className={`px-4 py-2 rounded-full capitalize ${category===c?'bg-primary-600 text-white':'bg-white border text-gray-700'}`}>{c}</button>)}</div>}{loading?<div className="flex justify-center py-16"><Spinner size="lg"/></div>:filtered.length===0?<Card className="py-16 text-center"><Trophy className="w-12 h-12 text-gray-300 mx-auto"/><h2 className="font-heading text-xl font-bold mt-4">No published achievements yet</h2></Card>:<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{filtered.map((a)=><Card key={a._id||a.title} className="h-full"><div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center"><Award className="w-6 h-6 text-primary-600"/></div><Badge variant="primary" className="mt-4">{a.category||'Achievement'}</Badge><h2 className="font-heading text-xl font-semibold mt-2">{a.title}</h2><p className="text-gray-600 mt-2">{a.description||'Published school achievement.'}</p><p className="text-sm text-gray-500 mt-4">{a.eventDate ? new Date(a.eventDate).toLocaleDateString() : ''}{a.position ? ` · ${a.position}` : ''}{a.award ? ` · ${a.award}` : ''}</p></Card>)}</div>}</div></section></>;
}
