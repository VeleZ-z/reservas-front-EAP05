import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Reserva.io ",
    template: "%s · Sistema de Reservas",
  },
  description:
    "Gestión de citas, agendas y disponibilidad para servicios, espacios e insumos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="bg-canvas text-ink antialiased">{children}</body>
    </html>
  );
}
