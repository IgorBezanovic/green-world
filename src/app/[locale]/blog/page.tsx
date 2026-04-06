'use client';

import { BlogPost } from '@green-world/views/BlogPost';
import { Suspense } from 'react';

export default function BlogPage() {
  return (
    <Suspense>
      <BlogPost />
    </Suspense>
  );
}
