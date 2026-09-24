import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Domus",
  description: "Gestão completa de condomínios",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}