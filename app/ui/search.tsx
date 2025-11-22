'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce'; // Importação correta

export default function Search({ placeholder }: { placeholder: string }) {

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Definição e uso correto do useDebouncedCallback
  const handleSearch = useDebouncedCallback((term) => {
    console.log(`Searching... ${term}`);

    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    // Garante que o termo é removido se estiver vazio
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }

    // Atualiza a URL com o novo parâmetro de busca
    replace(`${pathname}?${params.toString()}`);
  }, 300); // 👈 **CORREÇÃO PRINCIPAL:** Fechamento do useDebouncedCallback e adição do tempo (300ms é um valor comum)

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => {
          // Chama a função debounced a cada alteração
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}