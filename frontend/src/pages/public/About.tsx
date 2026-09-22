import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Eye, History as HistoryIcon, Target, Users } from 'lucide-react';
import { Card } from '../../components/ui';
import { SiteSeo } from '../../components/seo/SiteSeo';
import { useSettings } from '../../context/SettingsContext';

export function About() {
  const { getSettingValue } = useSettings();
  const schoolName = getSettingValue('general', 'school.name', 'Seven Star English Boarding School');
  const address = getSettingValue('general', 'school.address', 'Devdaha-2, Rupandehi, Nepal');
  const intro = getSettingValue('about', 'school.intro', 'Official school background and institutional information is maintained by the administration.');
  const mission = getSettingValue('about', 'school.mission', 'The school administration can publish its official mission statement here.');
  const vision = getSettingValue('about', 'school.vision', 'The school administration can publish its official vision statement here.');

  const links = [
    ['/about/chairman', 'Chairman Message', 'Published leadership message'],
    ['/about/principal', 'Principal Message', 'Published leadership message'],
    ['/about/mission-vision', 'Mission & Vision', 'Official mission and vision'],
    ['/about/history', 'History', 'Official school history'],
  ];

  return <>
    <SiteSeo title="About" description={`About ${schoolName}, ${address}.`}/>
    <section className="bg-primary-900 text-white py-20"><div className="container-custom"><p className="text-primary-200 mb-3">About the school</p><h1 className="font-heading text-4xl md:text-5xl font-bold">{schoolName}</h1><p className="mt-5 max-w-3xl text-primary-100 text-lg">{intro}</p></div></section>
    <section className="section"><div className="container-custom grid lg:grid-cols-2 gap-8"><Card><BookOpen className="w-9 h-9 text-primary-600"/><h2 className="mt-4 font-heading text-2xl font-bold">School information</h2><p className="mt-3 text-gray-600 leading-7">The school website uses a CMS so that official history, programmes, leadership information and public updates can be maintained by authorised administrators without editing code.</p><p className="mt-4 text-sm text-gray-500">Location: {address}</p></Card><div className="grid sm:grid-cols-2 gap-5"><Card><Target className="w-7 h-7 text-primary-600"/><h3 className="mt-3 font-heading font-bold text-xl">Mission</h3><p className="mt-2 text-gray-600 whitespace-pre-line">{mission}</p></Card><Card><Eye className="w-7 h-7 text-primary-600"/><h3 className="mt-3 font-heading font-bold text-xl">Vision</h3><p className="mt-2 text-gray-600 whitespace-pre-line">{vision}</p></Card><Card><Users className="w-7 h-7 text-primary-600"/><h3 className="mt-3 font-heading font-bold text-xl">Leadership</h3><p className="mt-2 text-gray-600">Chairman and principal messages are published through the CMS.</p></Card><Card><HistoryIcon className="w-7 h-7 text-primary-600"/><h3 className="mt-3 font-heading font-bold text-xl">History</h3><p className="mt-2 text-gray-600">View the official history published by the school.</p></Card></div></div></section>
    <section className="section bg-gray-50"><div className="container-custom"><h2 className="font-heading text-3xl font-bold mb-7">Explore About</h2><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">{links.map(([path,title,text])=><Link key={path} to={path}><Card className="h-full hover:-translate-y-1 transition-transform"><h3 className="font-heading font-bold text-lg">{title}</h3><p className="mt-2 text-gray-600 text-sm">{text}</p><span className="inline-flex items-center gap-1 mt-4 text-primary-600 text-sm font-medium">Open <ArrowRight className="w-4 h-4"/></span></Card></Link>)}</div></div></section>
  </>;
}
