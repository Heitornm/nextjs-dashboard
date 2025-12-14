import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts'; 

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