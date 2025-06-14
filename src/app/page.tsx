'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/ui-brochure');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-main flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-text-primary mb-4">
          Brochure Design App
        </h1>
        <p className="text-text-secondary">
          Redirecting to brochure generator...
        </p>
      </div>
    </div>
  );
}