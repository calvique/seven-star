import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';

const SITE_URL = (import.meta.env.VITE_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://example.invalid')).replace(/\/$/, '');

export function SiteSeo({ title, description, image }: { title?: string; description?: string; image?: string }) {
  const location = useLocation();
  const { getSettingValue } = useSettings();
  const schoolName = getSettingValue('general', 'school.name', 'Seven Star English Boarding School');
  const defaultDescription = getSettingValue('seo', 'seo.description', `Official website of ${schoolName}.`);
  const canonical = `${SITE_URL}${location.pathname}`;
  const pageTitle = title ? `${title} | ${schoolName}` : schoolName;
  const imageUrl = image || getSettingValue('seo', 'seo.ogImage', `${SITE_URL}/favicon.svg`);
  const address = getSettingValue('general', 'school.address', 'Devdaha-2, Rupandehi, Nepal');
  const facebook = getSettingValue('social', 'social.facebook', 'https://www.facebook.com/sevenstar.boarding');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: schoolName,
    url: SITE_URL,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address,
      addressCountry: 'NP',
    },
    sameAs: [facebook],
  };

  return (
    <Helmet>
      <html lang="en" />
      <title>{pageTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={imageUrl} />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}
