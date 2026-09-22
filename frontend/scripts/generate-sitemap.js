#!/usr/bin/env node
/**
 * Sitemap Generator for Seven Star School Website
 * Run after build: node scripts/generate-sitemap.js
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://sevenstar.edu.np';
const BUILD_DIR = path.join(__dirname, '../dist');

const staticRoutes = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/about', changefreq: 'weekly', priority: 0.9 },
  { url: '/about/chairman', changefreq: 'monthly', priority: 0.8 },
  { url: '/about/principal', changefreq: 'monthly', priority: 0.8 },
  { url: '/about/mission-vision', changefreq: 'monthly', priority: 0.8 },
  { url: '/about/history', changefreq: 'monthly', priority: 0.7 },
  { url: '/academics', changefreq: 'weekly', priority: 0.9 },
  { url: '/facilities', changefreq: 'monthly', priority: 0.8 },
  { url: '/gallery', changefreq: 'daily', priority: 0.8 },
  { url: '/activities', changefreq: 'weekly', priority: 0.8 },
  { url: '/achievements', changefreq: 'weekly', priority: 0.8 },
  { url: '/notices', changefreq: 'daily', priority: 0.9 },
  { url: '/admissions', changefreq: 'daily', priority: 0.95 },
  { url: '/contact', changefreq: 'monthly', priority: 0.8 },
  { url: '/downloads', changefreq: 'weekly', priority: 0.7 },
  { url: '/results', changefreq: 'daily', priority: 0.85 },
  { url: '/login', changefreq: 'yearly', priority: 0.3 },
  { url: '/register', changefreq: 'yearly', priority: 0.3 },
  { url: '/forgot-password', changefreq: 'yearly', priority: 0.2 },
];

function generateSitemap() {
  const today = new Date().toISOString().split('T')[0];
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

  staticRoutes.forEach(route => {
    sitemap += `  <url>
    <loc>${BASE_URL}${route.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}${route.url}" />
    <xhtml:link rel="alternate" hreflang="np" href="${BASE_URL}${route.url}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}${route.url}" />
  </url>
`;
  });

  sitemap += '</urlset>';

  const sitemapPath = path.join(BUILD_DIR, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap);
  console.log(`Sitemap generated at ${sitemapPath}`);
  
  // Also generate robots.txt
  const robotsTxt = `# Robots.txt for Seven Star English Boarding School
User-agent: *
Allow: /

# Sitemap
Sitemap: ${BASE_URL}/sitemap.xml

# Disallow admin and private routes
Disallow: /admin/
Disallow: /teacher/
Disallow: /dashboard/
Disallow: /api/
Disallow: /login
Disallow: /register
Disallow: /forgot-password
Disallow: /reset-password
Disallow: /verify-email

# Crawl-delay
Crawl-delay: 10
`;

  const robotsPath = path.join(BUILD_DIR, 'robots.txt');
  fs.writeFileSync(robotsPath, robotsTxt);
  console.log(`Robots.txt generated at ${robotsPath}`);
  
  // Generate structured data for homepage
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Seven Star English Boarding School",
    "alternateName": "Seven Star Boarding",
    "description": "NEB Affiliated +2 Programs. Quality Education from Nursery to Grade 12 with 100% SEE Pass Rate.",
    "url": "https://sevenstar.edu.np/",
    "logo": "https://sevenstar.edu.np/logo.png",
    "foundingDate": "2006",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Devdaha-2, Pipaldanda",
      "addressLocality": "Devdaha",
      "addressRegion": "Rupandehi",
      "postalCode": "32914",
      "addressCountry": "NP"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 27.5733,
      "longitude": 83.4423
    },
    "telephone": "+977-9857078448",
    "email": "sevenstar.school2063@gmail.com",
    "sameAs": [
      "https://www.facebook.com/sevenstar.boarding",
      "https://www.youtube.com/@sevenstarschool",
      "https://www.instagram.com/sevenstarschool"
    ],
    "makesOffer": [
      {
        "@type": "Offer",
        "name": "Nursery to Grade 10",
        "description": "Complete schooling from Nursery to Grade 10 (SEE)",
        "category": "Primary and Secondary Education"
      },
      {
        "@type": "Offer",
        "name": "+2 Science",
        "description": "NEB Affiliated Higher Secondary Science Program",
        "category": "Higher Secondary Education"
      },
      {
        "@type": "Offer",
        "name": "+2 Management",
        "description": "NEB Affiliated Higher Secondary Management Program",
        "category": "Higher Secondary Education"
      },
      {
        "@type": "Offer",
        "name": "+2 Hotel Management",
        "description": "NEB Affiliated Higher Secondary Hotel Management Program",
        "category": "Higher Secondary Education"
      }
    ],
    "knowsAbout": [
      "Education",
      "Boarding School",
      "NEB Curriculum",
      "SEE Examination",
      "Higher Secondary Education",
      "Science Education",
      "Management Education",
      "Hotel Management Education"
    ],
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": "Lumbini Province, Nepal"
    }
  };

  const structuredDataPath = path.join(BUILD_DIR, 'structured-data.json');
  fs.writeFileSync(structuredDataPath, JSON.stringify(structuredData, null, 2));
  console.log(`Structured data generated at ${structuredDataPath}`);
}

generateSitemap();