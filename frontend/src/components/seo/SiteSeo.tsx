import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';

export function SiteSeo({ title, description }: { title?: string; description?: string }) {
  const { getSettingValue } = useSettings();
  const location = useLocation();
  const schoolName = getSettingValue('general', 'school.name', 'Seven Star English Boarding School');
  const baseUrl = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, '');
  const pageTitle = title ? `${title} | ${schoolName}` : schoolName;
  const metaDescription = description || getSettingValue('seo', 'seo.description', `Official website of ${schoolName}.`);
  const canonical = `${baseUrl}${location.pathname}`;
  return <Helmet><title>{pageTitle}</title><meta name="description" content={metaDescription}/><link rel="canonical" href={canonical}/><meta property="og:type" content="website"/><meta property="og:title" content={pageTitle}/><meta property="og:description" content={metaDescription}/><meta property="og:url" content={canonical}/></Helmet>;
}
