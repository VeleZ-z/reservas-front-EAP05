import { AppShell } from "@/components/app-shell";

/**
 * Layout del área autenticada (dashboard).
 * El route group `(app)` no afecta a las URLs: /, /agenda, /servicios…
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
