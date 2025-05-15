'use client';

import dynamic from "next/dynamic";
const SubscriptionManagement = dynamic(() => import("../../components/dashboard/SubscriptionManagement"), { ssr: false });

export default function SubscriptionPage() {
  return <SubscriptionManagement />;
} 