'use client'; 

import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteInvoice } from '@/app/lib/actions'; // Importe sua Server Action
import React, { useState } from 'react';
// Importe o novo Modal
import { ConfirmationModal } from './ConfirmatioModal'; // ⬅️ Ajuste o caminho se necessário

export function CreateInvoice() {
  return (
    <Link
      href="/dashboard/invoices/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Invoice</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateInvoice({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/invoices/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteInvoice({ id }: { id: string }) {
  // Estado para controlar se o modal está aberto
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Ação para fechar o modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Ação para confirmar a exclusão (chamada pelo modal)
  const handleConfirmDelete = () => {
    handleCloseModal(); // Fecha o modal
    
    // Chama a Server Action, que executa o DELETE no BD e revalida o path
    deleteInvoice(id); 
  };
  
  // Ação para abrir o modal (chamada pelo clique no botão da lixeira)
  const handleOpenModal = (event: React.FormEvent<HTMLFormElement>) => {
    // Impede o envio padrão do formulário (que chamaria a Server Action sem confirmação)
    event.preventDefault(); 
    setIsModalOpen(true);
  };

  return (
    <>
      {/* O formulário agora apenas intercepta o clique para abrir o modal */}
      <form onSubmit={handleOpenModal}>
        <button 
          type="submit" 
          className="rounded-md border p-2 hover:bg-gray-100"
        >
          <span className="sr-only">Delete</span>
          <TrashIcon className="w-5" />
        </button>
      </form>
      
      {/* O Modal é renderizado condicionalmente */}
      {isModalOpen && (
        <ConfirmationModal
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
          title="Confirmação de Exclusão"
          // ➡️ Mensagem é agora um JSX.Element, permitindo <strong> e <br />
          message={
            <React.Fragment>
              Excluir permanentemente a fatura com ID:
              <br />
              {/* Usa <strong> e classes Tailwind para negrito */}
              <strong className="font-bold text-red-700">{id}</strong>?
              <br />
              Esta ação não pode ser desfeita.
            </React.Fragment>
          }
        />
    )}
    </>
  );
}