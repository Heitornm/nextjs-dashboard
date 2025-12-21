'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { notFound } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import * as bcrypt from 'bcryptjs';

// Inicialização do Cliente Postgres
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require', prepare: false });

// --- Esquemas de Validação Zod (EXISTENTES) ---
const FormSchema = z.object({
    id: z.string(),
    customerId: z.string().min(1, { message: 'Please select a customer.' }),
    amount: z.coerce
        .number()
        .gt(0, { message: 'Please enter an amount greater than $0.' }),
    status: z.enum(['pending', 'paid'], {
        message: 'Please select an invoice status.',
    }),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
};
// ---------------------------------------------

// --- NOVO Esquema e Tipo para Cadastro (Register) ---

const RegisterSchema = z.object({
    name: z.string().min(1, { message: 'O nome é obrigatório.' }),
    email: z.string().email({ message: 'Email inválido.' }),
    password: z.string().min(6, { message: 'A senha deve ter no mínimo 6 caracteres.' }),
    confirmPassword: z.string().min(6, { message: 'A confirmação de senha é obrigatória.' }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"], // Define onde o erro será anexado (no campo de confirmação)
});

export type RegisterState = {
    errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
    };
    message?: string | null;
};

// ---------------------------------------------

// --- AÇÕES EXISTENTES (Invoices) ---

export async function createInvoice(prevState: State, formData: FormData) {
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        };
    }

    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    try {
        await sql`
          INSERT INTO invoices (customer_id, amount, status, date)
          VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `;
    } catch (error) {
        console.error(error);
        return {
            message: 'Database Error: Failed to Create Invoice.',
        };
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function updateInvoice(
    id: string,
    prevState: State,
    formData: FormData,
) {
    const validatedFields = UpdateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Invoice.',
        };
    }

    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;

    try {
        await sql`
          UPDATE invoices
          SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
          WHERE id = ${id}
        `;
    } catch (error) {
        return { message: 'Database Error: Failed to Update Invoice.' };
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
    try {
        await sql`
            DELETE FROM invoices WHERE id = ${id}
        `;
    } catch (error) {
        console.error('Database Error: Failed to Delete Invoice.', error);
        notFound();
    }

    revalidatePath('/dashboard/invoices');
}

// --- AÇÃO DE LOGIN EXISTENTE (Authentication) ---

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    // Extrai o campo oculto 'redirectTo' do formulário para saber onde redirecionar.
    const redirectTo = formData.get('redirectTo') as string;

    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }

    // Se a autenticação foi bem-sucedida, redirecione.
    redirect(redirectTo || '/dashboard');
}


// --- NOVA AÇÃO: Cadastro de Usuário (registerUser) ---

export async function registerUser(prevState: RegisterState, formData: FormData) {
    // 1. Validação dos campos
    const validatedFields = RegisterSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
    });

    // 1.1. Retorna erros de validação se falhar
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Campos inválidos ou senhas não coincidem.',
        };
    }

    const { name, email, password } = validatedFields.data;

    try {
        // 2. Checa se o usuário já existe
        const existingUser = await sql`SELECT email FROM users WHERE email = ${email}`;
        if (existingUser.length > 0) {
            return { message: 'Este email já está cadastrado.' };
        }

        // 3. Hash da senha antes de salvar
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Insere o novo usuário no banco de dados
        await sql`
          INSERT INTO users (name, email, password)
          VALUES (${name}, ${email}, ${hashedPassword})
        `;
    } catch (error) {
        console.error('Database Error during registration:', error);
        return {
            message: 'Erro no Banco de Dados: Falha ao cadastrar o usuário.',
        };
    }

    // 5. Redireciona para a página de login após cadastro bem-sucedido
    redirect('/login?success=true'); // Adicionado 'success=true' opcionalmente para feedback
}