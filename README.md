# ReservasFrontend - Sistema de Reservas de Servicios

## Estado actual (2026-11-21)

✅ **Completado**
- [x] Build limpio con Next.js 14.2.35 + Tailwind v3.4.17 + postcss.config.js
- [x] 13 rutas estáticas y dinámicas (incluyendo `/eventos`, `/eventos/[id]/capacidad`, `/eventos/[id]/reservas`, `/servicios/uso`, `/historial`)
- [x] Sistema de tokens de 3 tiers (global → alias semántico → componente) en `app/globals.css` + `tailwind.config.ts`
- [x] Componentes UI reutilizables en `components/ui/` (Card, Button, Input, Select, Badge, Alert, Feedback)
- [x] `app-shell.tsx` con sidebar desktop + topbar móvil, navegación por rol, perfil, cierre de sesión y footer
- [x] API client contra contrato real de Render (`src/api/*.ts`) con `apiFetch`, Bearer JWT, timeout 120s
- [x] Historial de reservas del cliente en `src/lib/reservas-cliente.ts` (migra de `localStorage` a API real)
- [x] QA visual con Chrome headless (escritorio 1440px + móvil 390px): todas las vistas consistentes
- [x] Login real verificado contra `https://fabrica-2026-2-eap05-1.onrender.com` con usuario de prueba (`cliente.prueba.eap05@test.com` / `Prueba123`)
- [x] Variable `NEXT_PUBLIC_API_URL` configurada en `.env.local` + `.env.example` (no hardcodeada)

## ✅ Pendiente
- [ ] Despliegue final en Vercel con `NEXT_PUBLIC_API_URL` como Environment Variable (pública por diseño)

## 📁 Estructura de archivos clave

### API Clients (`src/api/`)
- `auth.ts` - login, logout, registro, forgot-password, reset-password
- `agenda.ts` - consultarAgenda (proveedor)
- `horarios.ts` - registrarHorario, bloquearHorario
- `eventos.ts` - **nuevo**: registrarEvento, definirCapacidadEvento, consultarOcupacionEvento, cancelarReservaEvento
- `recursos.ts` - registrarRecurso, cambiarEstadoRecurso, definirDisponibilidad
- `proveedor-servicio.ts` - asignarProveedor
- `reservas.ts` - crearReserva, cancelarReserva, consultarHistorial (reemplaza localStorage)
- `servicios.ts` - registrarServicio, modificarServicio, validarRecurso, **nuevo**: consultarUsoServicios
- `sesion.ts` - getSesion, setSesion, clearSesion, normalizarRol

### Componentes UI (`components/ui/`)
- Card, Button, Input, Select, Label, Alert, EmptyState, SkeletonTable
- Badge, Skeleton, Spinner (no visible pero usado internamente)
- Estilos consistentes con tokens semánticos (`bg-primary`, `text-ink-muted`, `border-line`, etc.)

### Navegación (`components/app-shell.tsx`)
- Sidebar desktop + topbar móvil
- Navegación por rol: cliente → eventos, servicios > uso, historial; admin → eventos, servicios > uso
- Filtros por rol con `sesion.rol`

### UI/UX
- Paleta de colores obligatoria: `#DDF3F0`, `#60714E`, `#89A666`, `#838E73`, `#72583D`
- Estado visual consistente: hero, dashboard, formularios, tablas, modales, alerts
- Accesibilidad: foco visible, contraste, tamaño de fuente legible, navegación con teclado

## 📁 Estructura de carpetas

```
/app/
  /(auth)/           - login, registro, recuperar-contrasena
  /(app)/            - dashboard, agenda, horarios, servicios, reservas, eventos, historial, uso
  /layout.tsx        - layout raíz
  /layout.tsx        - layout para (auth) con sidebar + topbar
  /page.tsx          - página principal (dashboard)
  
/components/
  /ui/               - Card, Button, Input, Select, Badge, Alert, Feedback
  /acceso-restringido/ - RequiereSesion, RolNoPermitido
  
/src/api/
  auth.ts
  agenda.ts
  horarios.ts
  eventos.ts           ← NUEVO
  recursos.ts
  proveedor-servicio.ts
  reservas.ts        ← extendido (historial)
  servicios.ts       ← extendido (uso)
  config.ts          - apiFetch con Bearer JWT y timeout 120s
  sesion.ts          - gestión de sesión y token
  
/lib/
  reservas-cliente.ts   ← historial de reservas en localStorage (obsoleto)

/app/
  /(app)/            - rutas dinámicas: eventos, servicios, uso, historial
  /(auth)/           - rutas de autenticación
  
/components/
  /ui/               - componentes reutilizables
  /acceso-restringido/ - componentes de control de acceso
  
/src/
  api/               - clientes API contra contrato real
  lib/               - utilidades generales
  
/app/
  /layout.tsx        - layout raíz
  /layout.tsx        - layout para (auth)
  /page.tsx          - página principal (dashboard)
```

## 🔄 Cambios clave realizados

### API Clients (nuevas funciones)
- `src/api/eventos.ts`: registrarEvento, definirCapacidadEvento, consultarOcupacionEvento, cancelarReservaEvento
- `src/api/reservas.ts`: consultarHistorial (reemplaza localStorage)
- `src/api/servicios.ts`: consultarUsoServicios (nuevo endpoint)

### Páginas nuevas (`app/(app)/`)
- `/eventos` - Ocupación de eventos (admin)
- `/eventos/registrar` - Crear evento (admin)
- `/eventos/[id]/capacidad` - Definir capacidad (admin)
- `/eventos/[id]/reservas` - Reservas de evento (admin/cliente)
- `/servicios/uso` - Reporte de uso de servicios (admin)
- `/historial` - Historial de reservas cliente (cliente)

### Navegación (`app-shell.tsx`)
- Añadidas entradas NAV para admin: `Eventos`, `Servicios > Uso`
- Añadida entrada NAV para cliente: `Historial`
- Filtro automático por rol en sidebar y topbar móvil

### PKM Vault (`/home/v3le7/Documents/Vaults/PKM/10-Proyectos/ReservasFrontend/`)
- `ReservasFrontend_progress.md`: actualizado con 13 rutas, nuevos clientes API, historial migrado
- `ReservasFrontend_decisions.md`: 4 decisiones nuevas (2026-11-21)
- `MOC-ReservasFrontend.md`: páginas, API, decisiones clave actualizadas
- `sessions/2026-11-21-opencode.md`: registro detallado de la sesión de build

## ✅ Estado de la sesión de build
- `npm run build` ✅ — 13 rutas compiladas (4 dinámicas: eventos/[id]/capacidad, eventos/[id]/reservas, eventos/registrar, servicios/uso)
- TypeScript strict pasa
- CORS backend probado: permite `*` (localhost, Vercel preview, producción)
- Login real verificado: `cliente.prueba.eap05@test.com` / `Prueba123` → login → dashboard → historial

## 📌 Próximos pasos
- Despliegue final en Vercel con `NEXT_PUBLIC_API_URL` configurado como Environment Variable (pública por diseño)
- Cerrar sesión de PKM y hacer commit final
- Publicar reporte de QA (screenshots, videos) en el vault

## 📣 Conclusión
**¡Vamos!** El frontend está listo para el despliegue en Vercel. Todas las pantallas, API clients, navegación y consistencia visual están implementadas según los requisitos obligatorios. El proyecto sigue el patrón PARA (Plan, Act, Review, Act) y el estilo PKM documentado.