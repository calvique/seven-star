import React from 'react';
import { Eye, Target } from 'lucide-react';
import { Card } from '../../components/ui';
import { SiteSeo } from '../../components/seo/SiteSeo';
import { useSettings } from '../../context/SettingsContext';

export function MissionVision() {
  const { getSettingValue } = useSettings();
  const schoolName = getSettingValue('general', 'school.name', 'Seven Star English Boarding School');
  const mission = getSettingValue('about', 'school.mission', 'The official mission statement will be published here by the school administration.');
  const vision = getSettingValue('about', 'school.vision', 'The official vision statement will be published here by the school administration.');
  return <><SiteSeo title="Mission & Vision" description={`Mission and vision of ${schoolName}.`} /><section className="bg-primary-900 text-white py-20"><div className="container-custom"><h1 className="font-heading text-4xl md:text-5xl font-bold">Mission & Vision</h1><p className="mt-4 text-primary-100">Official statements published through the school CMS.</p></div></section><section className="section"><div className="container-custom grid md:grid-cols-2 gap-7"><Card><Target className="w-10 h-10 text-primary-600"/><h2 className="mt-5 font-heading text-2xl font-bold">Mission</h2><p className="mt-4 text-gray-700 leading-8 whitespace-pre-line">{mission}</p></Card><Card><Eye className="w-10 h-10 text-primary-600"/><h2 className="mt-5 font-heading text-2xl font-bold">Vision</h2><p className="mt-4 text-gray-700 leading-8 whitespace-pre-line">{vision}</p></Card></div></section></>;
}
