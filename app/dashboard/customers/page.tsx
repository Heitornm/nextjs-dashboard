// app/dashboard/customers/page.tsx

// Importações necessárias
import { Metadata } from 'next';
import { fetchFilteredCustomers } from '@/app/lib/data'; 
import CustomersTable from '@/app/ui/customers/table'; 
import Search from '@/app/ui/search'; 
import { lusitana } from '@/app/ui/fonts';

// Configuração de metadados (Opcional)
export const metadata: Metadata = {
  title: 'Customers',
};

// 1. Definição da interface de Props para a página (CORRETA)
interface PageProps {
  searchParams?: {
    query?: string;
  };
}

// 2. Transforme o componente em assíncrono e aplique a interface
export default async function Page({
  searchParams,
}: PageProps) { // Aplicando a interface PageProps

  // CORREÇÃO: Removido 'await searchParams'. searchParams JÁ É um objeto.
  const query = searchParams?.query || '';
  
  // 3. Buscar os dados dos clientes
  const customers = await fetchFilteredCustomers(query);

  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} text-2xl`}>Clientes</h1>
      
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        {/* Componente de busca para filtragem */}
        <Search placeholder="Search customers..." /> 
      </div>
      
      {/* 4. Renderizar o componente de tabela */}
      <CustomersTable customers={customers} />
      
    </div>
  );
}