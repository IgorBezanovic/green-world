'use client';

import { Events } from '@green-world/views/Events';
import { Suspense } from 'react';

export default function EventsPage() {
  return (
    <Suspense>
      <Events />
    </Suspense>
  );
}
