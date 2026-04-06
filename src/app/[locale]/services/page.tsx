'use client';

import { ServiceListingPage } from '@green-world/views/ServiceListing';
import { Suspense } from 'react';

export default function ServicesPage() {
  return (
    <Suspense>
      <ServiceListingPage />
    </Suspense>
  );
}
