import CardWrapper from '@/app/ui/dashboard/cards';
import RevenueChart from '../ui/dashboard/revenue-chart'; // Corrigido para caminho relativo
import LatestInvoices from '../ui/dashboard/latest-invoices'; // Corrigido para caminho relativo
import { lusitana } from '../ui/fonts'; // Corrigido para caminho relativo
import { Suspense } from 'react';
import { RevenueChartSkeleton, LatestInvoicesSkeleton, CardsSkeleton } from '../ui/skeletons'; // Corrigido para caminho relativo

export default async function Page() {
  // O código abaixo funciona, mas veja a Sugestão 3 para melhor performance!

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
       <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          {/* Corrigido: Passando o array 'revenue' como prop */}
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </div>
    </main>
  );
}