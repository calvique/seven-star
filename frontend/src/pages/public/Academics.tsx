import React, { useEffect, useState } from 'react';
import { BookOpen, ChevronRight, GraduationCap } from 'lucide-react';
import { Card, Badge } from '../../components/ui';
import { SiteSeo } from '../../components/seo/SiteSeo';
import { api } from '../../services/api';
import { useSettings } from '../../context/SettingsContext';
import type { Class } from '../../types';

export function Academics() {
  const { getSettingValue } = useSettings();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const schoolName = getSettingValue('general', 'school.name', 'Seven Star English Boarding School');

  useEffect(() => { api.get('/classes/by-level').then((res) => { if (res.success) setClasses(res.data.classes || []); }).catch(() => {}).finally(() => setLoading(false)); }, []);
  const grouped = classes.reduce<Record<string, Class[]>>((acc, item) => { const key = item.level || 'other'; (acc[key] ||= []).push(item); return acc; }, {});

  return <>
    <SiteSeo title="Academics" description={`Academic classes and subjects published by ${schoolName}.`} />
    <section className="bg-primary-900 text-white py-20"><div className="container-custom"><Badge variant="secondary" className="mb-4">Academics</Badge><h1 className="font-heading text-4xl md:text-5xl font-bold">Classes & subjects</h1><p className="mt-5 max-w-3xl text-primary-100">The academic structure shown here comes directly from the school CMS. Administrators can add or update classes, sections and subjects without changing code.</p></div></section>
    <section className="section"><div className="container-custom">{loading ? <p className="text-gray-500">Loading academic structure…</p> : !classes.length ? <Card className="text-center"><GraduationCap className="w-10 h-10 text-primary-600 mx-auto"/><h2 className="mt-4 font-heading text-xl font-bold">Academic data is not published yet</h2><p className="mt-2 text-gray-600">The administrator can publish classes and subjects from the CMS.</p></Card> : <div className="space-y-10">{Object.entries(grouped).map(([level, items])=><div key={level}><div className="flex items-center gap-2 mb-4"><BookOpen className="w-5 h-5 text-primary-600"/><h2 className="font-heading text-2xl font-bold capitalize">{level.replaceAll('-', ' ')}</h2></div><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">{items.map((item)=><Card key={item._id} className="h-full"><div className="flex items-start justify-between gap-3"><div><h3 className="font-heading font-bold text-xl">{item.name}</h3><p className="text-sm text-gray-500 mt-1">{item.code} · Grade {item.grade}{item.section ? ` · Section ${item.section}` : ''}</p></div><ChevronRight className="w-5 h-5 text-gray-400"/></div><p className="mt-4 text-sm text-gray-600">{item.description || 'Academic class published by the school.'}</p>{Array.isArray(item.subjects) && item.subjects.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{item.subjects.map((subject: any) => <span key={subject._id || subject} className="px-2.5 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-medium">{subject.name || String(subject)}</span>)}</div>}</Card>)}</div></div>)}</div>}</div></section>
  </>;
}
