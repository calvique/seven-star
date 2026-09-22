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
  const [downloads, setDownloads] = useState<DownloadType[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await api.get<DownloadType>('/downloads/public', { limit: 100, category: category === 'all' ? undefined : category });
        if (!cancelled) setDownloads(response.data?.downloads ?? []);
      } catch (error) {
        console.error('Failed to fetch downloads', error);
        if (!cancelled) setDownloads([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [category]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return downloads;
    return downloads.filter((item) =>
      [item.title, item.description, ...(item.tags ?? [])].filter(Boolean).some((value) => String(value).toLowerCase().includes(q)),
    );
  }, [downloads, search]);

  const handleDownload = async (item: DownloadType) => {
    try { await api.incrementDownload(item._id); } catch { /* count is best effort */ }
    window.open(item.file?.url, '_blank', 'noopener,noreferrer');
  };

  const categories = ['all', 'admission', 'academic', 'exam', 'result', 'calendar', 'form', 'policy', 'circular', 'syllabus', 'other'];

  return (
    <>
      <Helmet>
        <title>Downloads | {schoolName}</title>
        <meta name="description" content={`Official downloadable resources published by ${schoolName}.`} />
      </Helmet>
      <div className="min-h-screen bg-white">
        <section className="bg-primary-700 text-white py-16">
          <div className="container-custom">
            <Link to="/" className="inline-flex items-center gap-2 text-primary-100 hover:text-white mb-6"><ArrowLeft className="w-4 h-4" /> Back to Home</Link>
            <Badge variant="secondary" className="mb-4">Resources</Badge>
            <h1 className="font-heading font-bold text-4xl md:text-5xl">Downloads</h1>
            <p className="mt-4 max-w-2xl text-primary-100">Forms, notices, academic files and other resources published by the school.</p>
          </div>
        </section>

        <section className="section bg-gray-50">
          <div className="container-custom">
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
              <div className="max-w-xl flex-1"><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search resources" leftIcon={<Search className="w-5 h-5" />} /></div>
              <div className="flex flex-wrap gap-2 items-center">
                {categories.map((item) => (
                  <button key={item} onClick={() => setCategory(item)} className={`px-3 py-2 rounded-full text-sm capitalize ${category === item ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 border border-gray-200'}`}>{item.replace('-', ' ')}</button>
                ))}
              </div>
            </div>

            {loading ? <div className="flex justify-center py-16"><Spinner size="lg" /></div> : filtered.length === 0 ? (
              <Card className="text-center py-16"><FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" /><h2 className="text-xl font-semibold text-gray-800">No resources found</h2><p className="text-gray-500 mt-2">Published downloads will appear here.</p></Card>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((item) => (
                  <Card key={item._id} hover className="h-full flex flex-col">
                    <div className="flex-1"><div className="text-xs uppercase tracking-wide text-primary-600 font-semibold">{item.category}</div><h2 className="font-heading font-semibold text-lg text-gray-900 mt-2">{item.title}</h2><p className="text-gray-600 text-sm mt-2 line-clamp-3">{item.description || 'School resource.'}</p></div>
                    <Button className="mt-5 w-full" onClick={() => handleDownload(item)}><DownloadIcon className="w-4 h-4 mr-2" /> Download</Button>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
