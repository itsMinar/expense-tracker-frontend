'use client';

import { Toaster } from 'sonner';
import { QueryProvider } from './query-provider';
import { ThemeProvider } from './theme-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>
        {children}
        <Toaster richColors position="top-center" />
      </QueryProvider>
    </ThemeProvider>
  );
}
