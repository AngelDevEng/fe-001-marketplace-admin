import { Suspense } from 'react';
import { FinancePageClient } from './FinancePageClient';
import BaseLoading from '@/components/ui/BaseLoading';

export default async function FinancePage() {
    return (<Suspense fallback={<BaseLoading message="Cargando finanzas..." />}><FinancePageClient /></Suspense>);
}
