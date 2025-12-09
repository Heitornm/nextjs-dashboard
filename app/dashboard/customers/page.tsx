// app/dashboard/customers/page.tsx

// Importações necessárias
import { Metadata } from 'next';
import { fetchFilteredCustomers } from '@/app/lib/data'; 
import CustomersTable from '@/app/ui/customers/table'; 
// CORREÇÃO 1: Importação do Search como default (sem chaves), que é o padrão do Next.js Tutorial.
import Search from '@/app/ui/search'; 
import { lusitana } from '@/app/ui/fonts';

// Configuração de metadados (Opcional)
export const metadata: Metadata = {
  title: 'Customers',
};

// Transforme o componente em assíncrono para buscar dados do servidor
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  // CORREÇÃO 2: Resolva explicitamente a Promise de searchParams, conforme o erro do console.
  const resolvedSearchParams = await searchParams; 
  const query = resolvedSearchParams?.query || '';
  
  // 2. Buscar os dados dos clientes
  // Esta função é chamada do servidor
  const customers = await fetchFilteredCustomers(query);

  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} text-2xl`}>Clientes</h1>
      
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        {/* Componente de busca para filtragem */}
        <Search placeholder="Search customers..." /> 
      </div>
      
      {/* 3. Renderizar o componente de tabela */}
      {/* Passamos os clientes buscados como propriedade (prop) */}
      <CustomersTable customers={customers} />
      
    </div>
  );
}