'use client';

import { lusitana } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';
import { useActionState } from 'react';
import Link from 'next/link';
// Removido o `useRouter` desnecessário e mantido o `useSearchParams`
import { useSearchParams } from 'next/navigation'; 

// IMPORTANTE: A função `registerUser` está no seu arquivo actions.ts
import { registerUser } from '@/app/lib/actions';

// Defina o tipo de estado de erro que sua Server Action retorna.
// Isso garante que o TypeScript saiba que 'message' existe.
// (Assumindo que você tem 'RegisterState' em algum lugar, mas para o erro,
// fazemos a checagem no runtime.)

export default function RegisterForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    registerUser,
    undefined,
  );

  // Hook para ler parâmetros da URL
  const searchParams = useSearchParams();
  const registrationSuccess = searchParams.get('success');
  
  // CORREÇÃO: Extrai a string 'message' do objeto de erro.
  // Se errorMessage for um objeto e tiver a propriedade 'message', usa-a.
  // Caso contrário, usa undefined ou null.
  const messageToDisplay = typeof errorMessage === 'object' && errorMessage !== null && 'message' in errorMessage 
    ? errorMessage.message 
    : errorMessage; // Se for string (caso de erro não validado, por exemplo), retorna a própria string.

  return (
    <form action={formAction} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Crie sua conta.
        </h1>

        {/* Bloco de Sucesso: Aparece se houver sucesso na URL */}
        {registrationSuccess && (
          <div className="p-3 mb-4 rounded-md bg-green-500 text-white text-sm">
            ✅ Cadastro realizado com sucesso! Faça login abaixo.
          </div>
        )}

        <div className="w-full">
          {/* Novo Campo: Nome */}
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="name"
            >
              Nome Completo
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="name"
                type="text"
                name="name"
                placeholder="Seu nome completo"
                required
              />
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          {/* Campo: Email */}
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Insira seu endereço de email"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          {/* Campo: Senha */}
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Senha
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Crie sua senha"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          {/* Novo Campo: Confirmação de Senha */}
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="confirmPassword"
            >
              Confirme a Senha
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Confirme sua senha"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

        </div>

        <Button className="mt-6 w-full" aria-disabled={isPending}>
          Cadastrar <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>

        {/* Bloco de Login */}
        <div className="mt-4 text-center">
          <Link href="/login" className="text-sm text-blue-500 hover:underline">
            Já tem conta? Faça login
          </Link>
        </div>

        {/* Bloco de Mensagem de Erro: Utiliza 'messageToDisplay' */}
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {messageToDisplay && typeof messageToDisplay === 'string' && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{messageToDisplay}</p> {/* Renderiza a STRING */}
            </>
          )}
        </div>
      </div>
    </form>
  );
}