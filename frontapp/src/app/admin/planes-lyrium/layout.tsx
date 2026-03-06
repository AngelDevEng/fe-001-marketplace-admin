import type { Metadata } from 'next';
import '@/features/admin/planes-lyrium/styles/admin.css';

export const metadata: Metadata = {
  title: 'Panel Admin - LYRIUM Biomarketplace',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
