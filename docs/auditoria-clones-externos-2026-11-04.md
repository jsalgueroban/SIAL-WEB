# Auditoría de clones y worktrees externos — 2026-11-04

Ventana solicitada: 3 y 4 de noviembre de 2026 (America/Bogota). SELF: inventario e integración dependen del estado local, sin beneficio independiente de delegación.

## Cobertura
Se localizaron 278 ubicaciones con metadatos Git (incluye repositorios de otros proyectos, directorios vacíos y antiguos worktrees con referencias rotas). Se inspeccionaron las raíces de propuestas, SIAL, Banasan, Archivo, Plataforma, Personal y Cache en D:, además de worktrees/tmp/visualizations de Codex, temporales del sistema, Desktop, Documents, Downloads, OneDrive y ubicaciones de agentes del perfil. No es una afirmación de revisión de todos los discos o perfiles del equipo.

La identificación usó remoto Git, no solamente nombre de carpeta. Los repositorios sin origin se contrastaron por otros remotos e historial para evitar omitir un clon renombrado.

## Copias de la propuesta Web encontradas
| Copia | Estado | Resultado |
| --- | --- | --- |
| SIAL Web - Propuesta (checkout principal) | main 24b9443, limpio, sin stash | Consolidación previa publicada |
| HU546 Publicacion (worktree registrado) | limpio, rama 2565542 | Contenido ya incluido en main |
| Entorno productivo, .sial-fe/proposal/SIAL-WEB (clon adicional) | main local 8acfee2, limpio, sin stash ni cambios ignorados | Commit antecesor de main; no delta local pendiente |
| Documents/ChatGPT/SIAL Propuestas UI UX | solamente metadatos Git, sin historial ni archivos de propuesta | Nada que integrar |

El remoto histórico JohnScDev/SIAL-WEB del clon adicional se actualizó mediante fetch: recibió las mismas ramas y main 24b9443. Se verificaron ramas locales/remotas, worktrees registrados, status completo, stash y reflog. Los movimientos recientes del clon corresponden a este fetch; no hay trabajo local del 3 o 4 de noviembre pendiente.

## Resultado
No se encontraron cambios adicionales de la propuesta Web para integrar. No se copiaron versiones antiguas sobre las vistas aprobadas, no se borraron ramas/clones/worktrees ni se modificaron archivos de producto o librerías. Se publica este registro como evidencia complementaria; no requiere repetir compilaciones al no cambiar código.
