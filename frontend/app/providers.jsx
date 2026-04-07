"use client";

import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./_context/AuthContext";
import { LanguageProvider } from "./_context/LanguageContext";

export function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AuthProvider>
        <LanguageProvider>{children}</LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
