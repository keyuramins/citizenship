import type { Metadata } from "next";
import LoginForm from "../../components/LoginForm";

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

export default function LoginPage() {
  return <LoginForm />;
} 