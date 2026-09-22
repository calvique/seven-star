import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Lightbulb, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge, Button, Card, Input, Select, Textarea } from '../../components/ui';
import { SiteSeo } from '../../components/seo/SiteSeo';
import { api } from '../../services/api';
import { useSettings } from '../../context/SettingsContext';

export function Suggestions() {
  const { getSettingValue } = useSettings();
  const schoolName = getSettingValue('general', 'school.name', 'Seven Star English Boarding School');
  const [form, setForm] = useState({ name: '', email: '', category: 'general', subject: '', message: '', isAnonymous: false });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setError(''); setLoading(true);
    try { await api.submitSuggestion(form); setSubmitted(true); }
    catch (err: any) { setError(err?.response?.data?.message || 'Unable to submit the suggestion right now.'); }
    finally { setLoading(false); }
  };

  return <>
    <SiteSeo title="Suggestions" description={`Send a suggestion or feedback to ${schoolName}.`} />
    <section className="bg-primary-900 text-white py-20"><div className="container-custom"><Link to="/" className="inline-flex items-center gap-2 text-primary-100 mb-6"><ArrowLeft className="w-4 h-4"/> Back to Home</Link><Badge variant="secondary" className="mb-4">Community Feedback</Badge><h1 className="font-heading text-4xl md:text-5xl font-bold">Suggestions</h1><p className="mt-4 max-w-2xl text-primary-100">Share an idea, concern or suggestion with the school administration.</p></div></section>
    <section className="section"><div className="container-custom max-w-3xl"><Card>{submitted ? <div className="py-12 text-center"><CheckCircle2 className="w-14 h-14 text-green-600 mx-auto mb-4"/><h2 className="font-heading text-2xl font-bold">Thank you</h2><p className="text-gray-600 mt-2">Your suggestion has been submitted to the school.</p><Button className="mt-6" onClick={() => { setSubmitted(false); setForm({ name:'', email:'', category:'general', subject:'', message:'', isAnonymous:false }); }}>Send another</Button></div> : <><div className="flex gap-4 items-start"><Lightbulb className="w-9 h-9 text-primary-600"/><div><h2 className="font-heading text-2xl font-bold">Help improve the school</h2><p className="text-gray-500 mt-1">Your feedback can help the school improve its services and student experience.</p></div></div>{error && <div className="mt-5 rounded-lg bg-red-50 border border-red-200 text-red-700 p-4 text-sm">{error}</div>}<form onSubmit={submit} className="grid md:grid-cols-2 gap-5 mt-6"><Input label="Name" value={form.name} disabled={form.isAnonymous} onChange={e=>setForm({...form,name:e.target.value})}/><Input label="Email" type="email" value={form.email} disabled={form.isAnonymous} onChange={e=>setForm({...form,email:e.target.value})}/><Select label="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} options={[{value:'general',label:'General'},{value:'academic',label:'Academic'},{value:'facility',label:'Facility'},{value:'activity',label:'Activities'},{value:'safety',label:'Safety'},{value:'other',label:'Other'}]}/><Input label="Subject" value={form.subject} required onChange={e=>setForm({...form,subject:e.target.value})}/><div className="md:col-span-2"><Textarea label="Suggestion" rows={7} required value={form.message} onChange={e=>setForm({...form,message:e.target.value})}/></div><label className="md:col-span-2 flex items-center gap-2 text-sm text-gray-600"><input type="checkbox" checked={form.isAnonymous} onChange={e=>setForm({...form,isAnonymous:e.target.checked})}/> Submit anonymously</label><div className="md:col-span-2"><Button type="submit" loading={loading}><Send className="w-4 h-4 mr-2"/> Submit suggestion</Button></div></form></>}</Card></div></section>
  </>;
}
