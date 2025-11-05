// ./app/query/route.ts

import postgres from 'postgres';
import { NextResponse } from 'next/server'; // Importação útil para Next.js Routes

// Inicialização da conexão com o banco de dados
// A variável de ambiente POSTGRES_URL! é usada, com '!' indicando que é garantida a existência (non-null assertion).
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

/**
 * Função assíncrona para buscar a lista de faturas do banco de dados.
 * Usa a sintaxe de Template Tagged Literal para consultas seguras.
 */
async function listInvoices() {
  // A consulta SQL está correta, envolvida por crases (` `) e prefixada pela tag 'sql'.
  const data = await sql`
      SELECT invoices.amount, customers.name
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE invoices.amount = 666;
    `;

  // Em 'postgres.js', o resultado da consulta é um array de objetos, o que é ideal.
  return data;
}

/**
 * Função de handler para a rota GET (funciona como uma API Endpoint).
 * Acessível via um request GET para /api/query (se o seu caminho for /app/query/route.ts).
 */
export async function GET() {
  try {
    // 1. Executa a função que busca os dados
    const invoices = await listInvoices();

    // 2. Retorna os dados em formato JSON com status 200 (OK)
    return NextResponse.json(invoices); 
    
  } catch (error) {
    // Loga o erro no console do servidor para fins de depuração
    console.error("Database error during GET request:", error);
    
    // Retorna uma resposta de erro JSON com status 500 (Internal Server Error)
    // Usamos um objeto de erro mais genérico para evitar expor detalhes internos do banco de dados ao cliente.
    return NextResponse.json(
      { error: 'Falha ao buscar as faturas.' }, 
      { status: 500 }
    );
  }
  
  // O código de placeholder foi removido para que o bloco try/catch seja executado!
}