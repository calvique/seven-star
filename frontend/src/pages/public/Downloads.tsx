import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Download as DownloadIcon, FileText, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge, Button, Card, Input, Spinner } from '../../components/ui';
import { useSettings } from '../../context/SettingsContext';
import { api } from '../../services/api';
import type { Download as DownloadType } from '../../types';

export function Downloads() {
  const { getSettingValue } = useSettings();
  const schoolName = getSettingValue('general', 'school.name', 'Seven Star English Boarding School');
  const [items, setItems] = useState<DownloadType[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    let active = true;
    api.getPublishedDownloads({ limit: 100, category: category === 'all' ? undefined : category })
      .then((response) => {
        if (!active) return;
        const data: any = response.data?.data ?? response.data ?? {};
        setItems(data.downloads ?? []);
      })
      .catch(() => active && setItems([]))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [category]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return !q ? items : items.filter((item) => `${item.title} ${item.description ?? ''} ${(item.tags ?? []).join(' ')}`.toLowerCase().includes(q));
  }, [items, query]);

  const download = async (item: DownloadType) => {
    try { await api.incrementDownload(item._id); } catch { /* best effort */ }
    window.open(item.file.url, '_blank', 'noopener,noreferrer');
  };

  const categories = ['all', 'admission', 'academic', 'exam', 'result', 'calendar', 'form', 'policy', 'circular', 'syllabus', 'other'];

  return <>
    <Helmet><title>Downloads | {schoolName}</title><meta name="description" content={`Official school downloads from ${schoolName}.`} /></Helmet>
    <section className="bg-primary-700 text-white py-16"><div className="container-custom"><Link to="/" className="inline-flex items-center gap-2 text-primary-100 mb-6"><ArrowLeft className="w-4 h-4" /> Back to Home</Link><Badge variant="secondary" className="mb-4">Resources</Badge><h1 className="font-heading text-4xl md:text-5xl font-bold">Downloads</h1><p className="mt-4 text-primary-100 max-w-2xl">Forms, notices, academic files and other resources published by the school.</p></div></section>
    <section className="section bg-gray-50"><div className="container-custom"><div className="flex flex-col lg:flex-row gap-4 mb-8"><div className="max-w-xl flex-1"><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search resources" leftIcon={<Search className="w-5 h-5" />} /></div><div className="flex flex-wrap gap-2">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`px-3 py-2 rounded-full text-sm capitalize ${category === item ? 'bg-primary-600 text-white' : 'bg-white border text-gray-700'}`}>{item}</button>)}</div></div>{loading ? <div className="flex justify-center py-16"><Spinner size="lg" /></div> : filtered.length === 0 ? <Card className="py-16 text-center"><FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" /><h2 className="font-semibold text-xl">No downloads found</h2><p className="text-gray-500 mt-2">Published resources will appear here.</p></Card> : <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{filtered.map((item) => <Card key={item._id} hover className="h-full flex flex-col"><div className="flex-1"><Badge variant="primary">{item.category}</Badge><h2 className="font-heading text-xl font-semibold mt-3">{item.title}</h2><p className="text-gray-600 text-sm mt-2 line-clamp-3">{item.description || 'School resource.'}</p></div><Button className="mt-5 w-full" onClick={() => download(item)}><DownloadIcon className="w-4 h-4 mr-2" /> Download</Button></Card>)}</div>}</div></section>
  </>;
}
