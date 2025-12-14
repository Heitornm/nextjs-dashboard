// app/layout.tsx - SOLUÇÃO COM SUPPRESSHYDRATIONWARNING

import { inter } from '@/app/ui/fonts'; // Certifique-se de importar suas fontes

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      {/* Adicione suppressHydrationWarning. 
        Note que isso deve ser usado com moderação, apenas em casos como este 
        em que um atributo injetado externamente está causando o conflito.
      */}
      <body 
        className={`${inter.className} antialiased`} 
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}