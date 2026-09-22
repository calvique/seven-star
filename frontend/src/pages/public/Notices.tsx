import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Bell, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge, Card, Input, Spinner } from '../../components/ui';
import { useSettings } from '../../context/SettingsContext';
import { api } from '../../services/api';
import type { Notice } from '../../types';

export function Notices() {
  const { getSettingValue } = useSettings();
  const schoolName = getSettingValue('general', 'school.name', 'Seven Star English Boarding School');
  const [items, setItems] = useState<Notice[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Notice | null>(null);

  useEffect(() => {
    api.getPublishedNotices({ limit: 100 }).then((response) => {
      const data: any = response.data?.data ?? response.data ?? {};
      setItems(data.notices ?? []);
    }).catch(() => setItems([])).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return !q ? items : items.filter((item) => `${item.title} ${item.excerpt ?? ''} ${item.content}`.toLowerCase().includes(q));
  }, [items, query]);

  return <>
    <Helmet><title>Notices & News | {schoolName}</title><meta name="description" content={`Official notices from ${schoolName}.`} /></Helmet>
    <section className="bg-primary-700 text-white py-16"><div className="container-custom"><Link to="/" className="inline-flex items-center gap-2 text-primary-100 mb-6"><ArrowLeft className="w-4 h-4" /> Back to Home</Link><h1 className="font-heading text-4xl md:text-5xl font-bold">Notices & News</h1><p className="mt-4 text-primary-100">Official announcements and school updates.</p></div></section>
    <section className="section bg-gray-50"><div className="container-custom"><div className="max-w-xl mb-8"><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search notices" leftIcon={<Search className="w-5 h-5" />} /></div>{loading ? <div className="flex justify-center py-16"><Spinner size="lg" /></div> : filtered.length === 0 ? <Card className="py-16 text-center"><Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" /><h2 className="font-semibold text-xl">No published notices</h2></Card> : <div className="space-y-4">{filtered.map((notice) => <Card key={notice._id} hover className="cursor-pointer" onClick={() => setSelected(notice)}><div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4"><div><div className="flex flex-wrap gap-2 mb-2"><Badge variant="primary">{notice.category}</Badge>{notice.isPinned && <Badge variant="warning">Pinned</Badge>}</div><h2 className="font-heading text-xl font-semibold">{notice.title}</h2><p className="text-gray-600 mt-2 line-clamp-2">{notice.excerpt || notice.content.replace(/<[^>]+>/g, '').slice(0, 240)}</p></div><span className="text-sm text-gray-500">{notice.publishedAt ? new Date(notice.publishedAt).toLocaleDateString() : ''}</span></div></Card>)}</div>}</div></section>
    {selected && <div className="fixed inset-0 z-50 bg-black/60 p-4 flex items-center justify-center" onClick={() => setSelected(null)}><Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}><div className="flex justify-between gap-4"><div><Badge variant="primary">{selected.category}</Badge><h2 className="font-heading text-2xl font-bold mt-3">{selected.title}</h2></div><button onClick={() => setSelected(null)} aria-label="Close"><X className="w-6 h-6" /></button></div><div className="mt-6 prose max-w-none whitespace-pre-line">{selected.content.replace(/<[^>]+>/g, '')}</div></Card></div>}
  </>;
}
