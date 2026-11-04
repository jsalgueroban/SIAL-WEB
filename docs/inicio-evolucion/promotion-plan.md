# Integración y revisión

Hero conserva bloque aprobado. Gradientes radiales continuos, isotipo con escala máxima1.035, tres ondas desfase1.6s, ciclo4.8s; pausa con Button ghost y reduced motion. Se retiran resumen de permisos/sesión, chip Centro de trabajo y contexto redundante. CTA real lleva foco a Accesos rápidos. Sin cambios a autenticación.

Calendario feature-local consume colección WeekDto normalizada a fechas civilesYYYY-MM-DD mediante loadWeeks; RibbonCode, Card y Button proceden del paquete. Snapshot de las52semanas visibles de Planeación guardado en shared/cases/home-weeks-2026.json. No hay conexión en vivo en la propuesta.

Integración de producto propuesta: obtener semanas con PlanningWeeksService.getAll (server-only, /weeks) dentro de contexto autorizado; normalizar fechas civiles y pasar colección al calendario. No llamar API productiva desde HTML ni copiar tokens. Faltante bloqueante de integración: determinar discrepancia de zona horaria; UI dice lunes-domingo, datos renderizados28dic2025–3ene2026 y1–7nov2026 son domingo-sábado. Mapper usa new Date + getDate local, posible causa aún no demostrada. Propuesta conserva fechas observadas y adapta orden de días; no genera cintas por índice.

Mes civil actual con semanas que lo intersectan, día Bogotá destacado. Noviembre incluye45–49;45Rojo,46Café,47Negro,48Naranja,49Verde según captura. No usa colores del calendario adjunto sin año. Fuera de snapshot muestra vacío, nunca inventa semanas. Se implementan carga, error/reintentar, vacío; probados visualmente caso cargado y responsive. Error/vacío no ejercitados en navegador.

Pruebas: build; consola sin errores; pausa devuelve animationPlayState paused; CTA enfoca home-quick-title; hoy3nov; tabla306px; móvil390sin overflow(351px calendario). Reduced motion implementado por CSS, no emulado en esta sesión. Pendiente revisión visual y conexión productiva explícita. No promover calendario como componente de librería aún.

## Revisión 3D y calendario — 2026-11-03
- Three.js 0.180 ya instalado, sin cambio de dependencias. ExtrudeGeometry desde silueta del SialIsotype publicado, cara con SVG oficial y materiales iluminados. No se atribuye un nuevo asset oficial ni promoción de librería.
- La escena inicia al montar Inicio y libera geometrías, materiales, textura, observadores y renderer. El build IIFE incluye Three en el bundle compartido: import() difiere inicialización, no descarga separada. Antes de promover a producto separar chunk; no declarar optimización de red.
- Calendario con retícula, color semanal, domingos diferenciados y hoy destacado. Datos capturados sin mutar ni recalcular las semanas. Integración en vivo sigue pendiente.
- Mis accesos conserva los seis enlaces iniciales agrupados y cinco áreas complementarias, sin duplicar la parrilla ni contar opciones.
- Build pasó. Navegador: modelo WebGL cargado, sin errores de consola observados; controles pausa/reactivar y foco en Mis accesos verificados. Móvil390: ancho contenido375=scroll375, sin overflow. Reduced-motion implementado, no emulado. Error/vacío del calendario heredados, no recorridos en esta revisión.
- Sigue En Revisión, pendiente aprobación visual; no publicación ni cambio productivo.

## Directorio escalable de accesos
Petición: organizar interior para admin y corregir acciones/iconos. Evolución local con SIAL design proposals + library consumption; SELF, slice acotado. Card, TextInput, Button ghost y ChevronRightIcon publicados. Enlaces nativos para navegación (Button no expone href), botones para cambiar área; ChevronDown para salto interno a accesos.
Fuente: snapshot de shared/sial-navigation-contract.js filtrado por existencia física de rutas: 9 áreas, 64 accesos. Datos de demostración amplios para validar escala, no concesión ni simulación de permisos reales. Producto deberá suministrar menú autorizado mediante groups.
Sustituye grupos desiguales y Otras áreas por directorio maestro-detalle con búsqueda global insensible a tildes, estado vacío y Limpiar. Conserva hero y calendario. Build correcto; probado grupo19, búsqueda vehiculos con4 coincidencias, vacío y restablecimiento. Pendiente aprobación visual.

Corrección del usuario: directorio maestro-detalle rechazado porque duplica el menú lateral. Retirado del montaje y CSS, baseline anterior restaurado y compilado. No implementar otra estructura antes de elección. Propuestas: accesos elegidos, recientes/fijados o tareas por contexto; ninguna se presenta como dato funcional existente.

## Composición aprobada por rol — vigente
Se reemplaza la propuesta de directorio por grupos en dos columnas CSS independientes, orden de lectura vertical y una columna móvil. Sin búsqueda, personalización, favoritos, Otras áreas ni scroll interno.
Fuente real leída: dashboard-overview.tsx y utils.ts: getDashboardModules(session.menu, session.permissions), filtra view y /dashboard; backend y permisos intactos. Snapshot UI del 3nov2026: ocho módulos y29 rutas, contrastadas expandiendo la navegación real. home-role-accesses.json mapea esas29 a HTML existente; ninguna ruta del catálogo general adicional. El componente recibe groups para adaptar la salida autorizada existente del producto; propuesta usa snapshot, no sesión en vivo.
Card e iconos publicados. ChevronRightIcon en enlaces nativos completos, ChevronDownIcon para salto interno. No usar Button para href porque API publicada no lo admite. Conserva identidad, hero3D y calendario. Fuente real mantiene primeros6 como quick; propuesta agrupa los29 disponibles eliminando duplicación quick/áreas, sin cambiar permisos.
Build pasa;29archivos de destino existen; DOM ocho módulos29enlaces, dos columnas desktop y una móvil390; width375=scroll375; foco por teclado verificado. Pendiente revisión visual del usuario; sin publicación.

## Opción A aprobada: mosaico de módulos
Aplicada como evolución local con SIAL design proposals y consumo sial-web-library: Card publicada por módulo, SialIcon y ChevronRightIcon. Se retira Card exterior para evitar cards dentro de cards. Grid de dos bloques por fila, enlaces transparentes con hover y foco, una columna móvil. Misma colección snapshot del rol: 8 módulos y29accesos sin cambios. Calendario conserva retirada de Ver gestión de semanas. Build, DOM29enlaces, foco al primer acceso y móvil390sin overflow verificados. Pendiente revisión visual, sin publicación ni backend.

## Retorno al bloque único — criterio vigente
Usuario retira mosaico por extensión y desalineación. Una Card publicada contiene encabezado y8 módulos con29accesos intactos. Secciones internas sin cards, bordes ni fondos propios; dos columnas independientes con enlaces compactos. Calendario y Card comparten coordenada superior185.09px en revisión. Build pasó; móvil390 columnaúnica y ancho375=scroll375. Conservados iconos, hover, foco y reduced-motion. Pendiente aprobación visual.

## Cierre aprobado — 2026-11-04
Inicio aprobado visualmente por el usuario y cerrado como propuesta. Composición vigente: bloque único de accesos, no mosaico ni directorio. Ver ../cierre-inicio-2026-11-04.md. Pendientes de integración se mantienen explícitos; no hay despliegue acreditado. Siguiente pendiente de Seguridad: POMA.
