import { NextRequest } from 'next/server';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';

const staticRoutes = [
  '', // Only the homepage is included for now
];

export async function GET(req: NextRequest) {
  const urls = staticRoutes.map(
    (route) => `  <url>\n    <loc>${siteUrl}/${route}</loc>\n    <priority>${route === '' ? '1.0' : '0.8'}</priority>\n  </url>`
  ).join('\n');
  const xml = `<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n${urls}\n</urlset>`;
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
} 