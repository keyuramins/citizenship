import type { Metadata } from "next";
import LoginForm from "../../components/LoginForm";
import { createSupabaseServerClient } from '../../lib/supabaseClient';
import { redirect } from 'next/navigation';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000";
const siteName = process.env.NEXT_PUBLIC_SITENAME;

export const metadata: Metadata = {
  title: `Login | ${siteName}`,
  description: "Login to your account to access citizenship practice tests, track your progress, and unlock premium features.",
  robots: "noindex, follow",
  alternates: {
    canonical: `${siteUrl}/login`,
  },
  openGraph: {
    title: `Login | ${siteName}`,
    description: "Login to your account to access citizenship practice tests, track your progress, and unlock premium features.",
    url: `${siteUrl}/login`,
    siteName,
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Login | ${siteName}`,
    description: "Login to your account to access citizenship practice tests, track your progress, and unlock premium features.",
    images: [`${siteUrl}/og-image.png`],
    site: siteName,
  },
};

export default async function LoginPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect('/dashboard');
  return <LoginForm />;
} 