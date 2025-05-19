import type { Metadata } from "next";
import ForgotPasswordForm from "../../components/ForgotPasswordForm";
import { createSupabaseServerClient } from "../../lib/supabaseClient";
import { redirect } from "next/navigation";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000";
const siteName = process.env.NEXT_PUBLIC_SITENAME;

export const metadata: Metadata = {
  title: `Forgot Password | ${siteName}`,
  description: "Reset your password to regain access to your account.",
  robots: "noindex, nofollow",
  alternates: {
    canonical: `${siteUrl}/forgot-password`,
  },
  openGraph: {
    title: `Forgot Password | ${siteName}`,
    description: "Reset your password to regain access to your account.",
    url: `${siteUrl}/forgot-password`,
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
    title: `Forgot Password | ${siteName}`,
    description: "Reset your password to regain access to your account.",
    images: [`${siteUrl}/og-image.png`],
    site: siteName,
  },
};

export default async function ForgotPasswordPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect('/dashboard');
  return <ForgotPasswordForm />;
}