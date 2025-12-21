import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Adicionando a configuração para o ESLint
  eslint: {
    // Esta linha diz ao Next.js para ignorar o processo de Linting durante o build de produção.
    // É a solução mais rápida para o erro de Estrutura Circular.
    ignoreDuringBuilds: false,
  },
  
  /* config options here (outras configurações que você possa ter) */
};

export default nextConfig;