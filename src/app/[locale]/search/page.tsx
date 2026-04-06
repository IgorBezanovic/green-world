'use client';

import { Products } from '@green-world/views/Products';
import { Suspense } from 'react';

export default function SearchPage() {
  return (
    <Suspense>
      <Products />
    </Suspense>
  );
}
