import type { NextApiRequest, NextApiResponse } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';

const staticRoutes = [
  '',
  'login',
  'register',
  'forgot-password',
  'reset-password',
  // Add more static or dynamic routes as needed
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'application/xml');
  const urls = staticRoutes.map(
    (route) => `  <url>\n    <loc>${siteUrl}/${route}</loc>\n    <priority>${route === '' ? '1.0' : '0.8'}</priority>\n  </url>`
  ).join('\n');
  res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`);
} 