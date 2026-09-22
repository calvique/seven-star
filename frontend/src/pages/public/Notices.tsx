import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Bell, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge, Button, Card, Input, Spinner } from '../../components/ui';
import { useSettings } from '../../context/SettingsContext';
import { api } from '../../services/api';
import type { Notice } from '../../types';

export function Notices() {
  const { getSettingValue } = useSettings();
  const schoolName = getSettingValue('general', 'school.name', 'Seven Star English Boarding School');
  const [items, setItems] = useState<Notice[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await api.getPublishedNotices({ limit: 100 });
        const data = response.data?.data?.notices ?? response.data?.data?.items ?? response.data?.notices ?? [];
        setItems(data);
      } catch (error) { console.error('Failed to fetch notices', error); }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return !q ? items : items.filter((item) => `${item.title} ${item.excerpt ?? ''} ${item.content}`.toLowerCase().includes(q));
  }, [items, search]);

  return (
    <>
      <Helmet><title>Notices & News | {schoolName}</title><meta name="description" content={`Official notices and news published by ${schoolName}.`} /></Helmet>
      <div className="min-h-screen bg-gray-50">
        <section className="bg-primary-700 text-white py-16"><div className="container-custom"><Link to="/" className="inline-flex items-center gap-2 text-primary-100 hover:text-white mb-6"><ArrowLeft className="w-4 h-4" /> Back to Home</Link><h1 className="font-heading font-bold text-4xl md:text-5xl">Notices & News</h1><p className="mt-4 text-primary-100 max-w-2xl">Official announcements, academic updates and school notices.</p></div></section>
        <section className="section"><div className="container-custom"><div className="max-w-xl mb-8"><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search notices" leftIcon={<Search className="w-5 h-5" />} /></div>
          {loading ? <div className="flex justify-center py-16"><Spinner size="lg" /></div> : filtered.length === 0 ? <Card className="text-center py-16"><Bell className="w-12 h-12 mx-auto text-gray-300 mb-4" /><h2 className="text-xl font-semibold text-gray-800">No published notices</h2></Card> : <div className="space-y-4">
            {filtered.map((notice) => <Card key={notice._id} hover className="cursor-pointer" onClick={() => setSelected(notice)}><div className="flex items-start justify-between gap-6"><div><div className="flex flex-wrap gap-2 mb-2"><Badge variant="primary">{notice.category}</Badge>{notice.isPinned && <Badge variant="warning">Pinned</Badge>}</div><h2 className="font-heading text-xl font-semibold text-gray-900">{notice.title}</h2><p className="text-gray-600 mt-2">{notice.excerpt || notice.content?.replace(/<[^>]+>/g, '').slice(0, 220)}</p></div><time className="text-sm text-gray-500 whitespace-nowrap">{notice.publishedAt ? new Date(notice.publishedAt).toLocaleDateString() : ''}</time></div></Card>)}
          </div>}
        </div></section>
      </div>
      {selected && <div className="fixed inset-0 z-50 bg-black/60 p-4 flex items-center justify-center" onClick={() => setSelected(null)}><Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}><div className="flex justify-between gap-4"><div><Badge variant="primary">{selected.category}</Badge><h2 className="font-heading text-2xl font-bold text-gray-900 mt-3">{selected.title}</h2></div><button onClick={() => setSelected(null)} aria-label="Close"><X className="w-6 h-6" /></button></div><div className="prose max-w-none mt-6" dangerouslySetInnerHTML={{ __html: selected.content }} /></Card></div>}
    </>
  );
}
