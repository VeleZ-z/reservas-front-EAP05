import "./globals.css";

export const metadata = {
  title: "Sistema de Reservas - Calidad de Software",
  description: "Interfaz frontend para el sistema de reservas de servicios, espacios e insumos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-[var(--color-light-turquoise)] text-[var(--color-olive-dark)]">
        <nav className="bg-[var(--color-olive-dark)] py-3 fixed top-0 left-0 right-0 z-50">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-[var(--color-light-turquoise)]">SISTEMA RESERVAS</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="/login" className="text-[var(--color-light-turquoise)] hover:text-[var(--color-bronze)] font-medium">
                Iniciar Sesión
              </a>
              <a href="/register" className="text-[var(--color-light-turquoise)] hover:text-[var(--color-bronze)] font-medium">
                Registrarse
              </a>
            </div>
          </div>
        </nav>

        <main className="pt-20 max-w-7xl mx-auto px-6">
          {children}
        </main>
      </body>
    </html>
  );
}