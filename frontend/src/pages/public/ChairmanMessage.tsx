import React from 'react';
import { UserCircle } from 'lucide-react';
import { Card } from '../../components/ui';
import { SiteSeo } from '../../components/seo/SiteSeo';
import { useSettings } from '../../context/SettingsContext';

export function ChairmanMessage() {
  const { getSettingValue } = useSettings();
  const schoolName = getSettingValue('general', 'school.name', 'Seven Star English Boarding School');
  const name = getSettingValue('contact', 'chairman.name', 'School Chairman');
  const message = getSettingValue('about', 'chairman.message', 'The official chairman message will be published here by the administration.');
  return <><SiteSeo title="Chairman Message" description={`Chairman message of ${schoolName}.`} /><section className="bg-primary-900 text-white py-20"><div className="container-custom"><h1 className="font-heading text-4xl md:text-5xl font-bold">Chairman Message</h1></div></section><section className="section"><div className="container-custom max-w-4xl"><Card><div className="flex items-center gap-4 mb-6"><div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center"><UserCircle className="w-9 h-9 text-primary-600"/></div><div><h2 className="font-heading text-2xl font-bold">{name}</h2><p className="text-gray-500">Chairman</p></div></div><p className="text-gray-700 text-lg leading-8 whitespace-pre-line">{message}</p></Card></div></section></>;
}
