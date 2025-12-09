// app/lib/auth.ts (ou auth.ts)

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import postgres from 'postgres';
 
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
 
// 1. Definição do Esquema de Credenciais
const CredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

async function getUser(email: string): Promise<User | undefined> {
  try {
    // Nota: Certifique-se de que a coluna de senha no seu DB é 'password'
    const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    return user[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    // Não lance o erro original do DB para o cliente
    throw new Error('Failed to fetch user.'); 
  }
}
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        // 2. Análise e Validação das Credenciais (Correção Principal)
        const parsedCredentials = CredentialsSchema.safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          
          // 3. Busca do Usuário
          const user = await getUser(email);
          if (!user) {
             console.log('User not found');
             return null;
          }
          
          // 4. Comparação da Senha
          // 'user.password' deve ser o hash da senha armazenado no DB
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
             console.log('Login successful');
             return user; // Sucesso: Retorna o objeto User
          }
        }
        
        // Falha na Validação Zod ou na Correspondência da Senha
        console.log('Invalid credentials');
        return null; 
      },
    }),
  ],
});