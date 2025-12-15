// app/dashboard/customers/page.tsx

import { Metadata } from 'next';
import { fetchFilteredCustomers } from '@/app/lib/data'; 
import CustomersTable from '@/app/ui/customers/table'; 
import Search from '@/app/ui/search'; 
import { lusitana } from '@/app/ui/fonts';

export const metadata: Metadata = {
  title: 'Customers',
};

// Use a tipagem inline e remova QUALQUER importação de tipagem PageProps, se houver.
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {

  const params = await searchParams;
  const query = params?.query || '';
  
  const customers = await fetchFilteredCustomers(query);

  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} text-2xl`}>Clientes</h1>
      
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search customers..." /> 
      </div>
      
      <CustomersTable customers={customers} />
      
    </div>
  );
}