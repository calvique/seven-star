const fs = require('fs');
const path = require('path');

const BASE_URL = (process.env.VITE_SITE_URL || process.env.SITE_URL || '').replace(/\/$/, '');
const BUILD_DIR = path.join(process.cwd(), 'dist');

const staticRoutes = [
  '/', '/about', '/about/chairman', '/about/principal', '/about/mission-vision', '/about/history',
  '/academics', '/facilities', '/gallery', '/activities', '/achievements', '/notices', '/admissions',
  '/contact', '/downloads', '/suggestions', '/results'
];

if (!BASE_URL) {
  console.warn('VITE_SITE_URL/SITE_URL is not set; sitemap.xml and robots.txt will be generated with relative-safe defaults. Set VITE_SITE_URL in production.');
}

const origin = BASE_URL || 'https://example.invalid';
const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${staticRoutes.map((url) => `  <url>\n    <loc>${origin}${url}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(BUILD_DIR, 'sitemap.xml'), sitemap);

const robots = `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /teacher/\nDisallow: /dashboard/\nDisallow: /api/\nDisallow: /login\nDisallow: /register\nDisallow: /forgot-password\nDisallow: /reset-password\nDisallow: /verify-email\nSitemap: ${origin}/sitemap.xml\n`;
fs.writeFileSync(path.join(BUILD_DIR, 'robots.txt'), robots);
console.log('SEO files generated in dist/.');
