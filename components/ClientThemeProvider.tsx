"use client";
import { ThemeProvider, ThemeProviderProps } from "next-themes";
import { ReactNode } from "react";

interface ClientThemeProviderProps extends ThemeProviderProps {
  children: ReactNode;
}

export default function ClientThemeProvider({ children, ...props }: ClientThemeProviderProps) {
  return <ThemeProvider {...props}>{children}</ThemeProvider>;
} 