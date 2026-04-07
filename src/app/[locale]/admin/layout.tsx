import { AdminPanel } from '@green-world/views/AdminPanel';

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <AdminPanel>{children}</AdminPanel>;
}
