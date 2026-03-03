'use client';

import dynamic from 'next/dynamic';

const TermsContent = dynamic(() => import('@/features/public/terminoscondiciones/TermsContent'), { ssr: false });

export default function TermsPage() {
    return <TermsContent />;
}
