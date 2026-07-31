import { CompleteRegistration } from '@green-world/views/CompleteRegistration';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dovršite registraciju | Zeleni Svet',
  robots: { index: false, follow: false }
};

export default function CompleteRegistrationPage() {
  return <CompleteRegistration />;
}
