'use client';

import { Shops } from '@green-world/views/Shops';
import { Suspense } from 'react';

export default function ShopsPage() {
  return (
    <Suspense>
      <Shops />
    </Suspense>
  );
}
