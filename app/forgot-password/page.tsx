import type { Metadata } from "next";
import ForgotPasswordForm from "../../components/ForgotPasswordForm";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000";
const siteName = process.env.NEXT_PUBLIC_SITENAME;

export const metadata: Metadata = {
  title: `Forgot Password | ${siteName}`,
  description: "Reset your password to regain access to your citizenship practice test account.",
  robots: "noindex, nofollow",
  alternates: {
    canonical: `${siteUrl}/forgot-password`,
  },
  openGraph: {
    title: `Forgot Password | ${siteName}`,
    description: "Reset your password to regain access to your citizenship practice test account.",
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
    description: "Reset your password to regain access to your citizenship practice test account.",
    images: [`${siteUrl}/og-image.png`],
    site: siteName,
  },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}