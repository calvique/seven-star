import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, History as HistoryIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui';
import { useSettings } from '../../context/SettingsContext';

export function History() {
  const { getSettingValue } = useSettings();
  const schoolName = getSettingValue('general', 'school.name', 'Seven Star English Boarding School');
  const historyText = getSettingValue('about', 'school.history', 'The school administration can publish the official history of the school from the CMS.');

  return (
    <>
      <Helmet><title>School History | {schoolName}</title><meta name="description" content={`Official history and background of ${schoolName}.`} /></Helmet>
      <div className="min-h-screen bg-white">
        <section className="bg-primary-700 text-white py-16"><div className="container-custom"><Link to="/about" className="inline-flex items-center gap-2 text-primary-100 hover:text-white mb-6"><ArrowLeft className="w-4 h-4" /> Back to About</Link><h1 className="font-heading font-bold text-4xl md:text-5xl">School History</h1></div></section>
        <section className="section"><div className="container-custom max-w-4xl"><Card><div className="flex gap-4 items-start"><HistoryIcon className="w-10 h-10 text-primary-600 flex-shrink-0" /><div><h2 className="font-heading text-2xl font-bold text-gray-900">Official history</h2><p className="mt-4 text-gray-700 leading-8 whitespace-pre-line">{String(historyText)}</p></div></div></Card></div></section>
      </div>
    </>
  );
}
