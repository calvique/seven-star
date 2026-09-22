import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, History as HistoryIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui';
import { useSettings } from '../../context/SettingsContext';

export function History() {
  const { getSettingValue } = useSettings();
  const schoolName = getSettingValue('general', 'school.name', 'Seven Star English Boarding School');
  const history = getSettingValue('about', 'school.history', 'The official history of the school will be published by the administration through the CMS.');
  return <>
    <Helmet><title>School History | {schoolName}</title></Helmet>
    <section className="bg-primary-700 text-white py-16"><div className="container-custom"><Link to="/about" className="inline-flex items-center gap-2 text-primary-100 mb-6"><ArrowLeft className="w-4 h-4" /> Back to About</Link><h1 className="font-heading text-4xl md:text-5xl font-bold">School History</h1></div></section>
    <section className="section"><div className="container-custom max-w-4xl"><Card><div className="flex items-start gap-4"><HistoryIcon className="w-9 h-9 text-primary-600 flex-shrink-0" /><div><h2 className="font-heading text-2xl font-bold">Official history</h2><p className="mt-4 text-gray-700 leading-8 whitespace-pre-line">{history}</p></div></div></Card></div></section>
  </>;
}
