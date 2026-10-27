[CmdletBinding()]
param([string]$ProposalRoot)

$ErrorActionPreference = 'Stop'
if (-not $ProposalRoot) { $ProposalRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path }
$inventoryPath = Join-Path $ProposalRoot '.sial-design-map/inventory.generated.json'
if (-not (Test-Path -LiteralPath $inventoryPath)) {
  throw 'Ejecuta scan-proposal.ps1 antes de construir la matriz.'
}
$inventory = Get-Content -LiteralPath $inventoryPath -Raw | ConvertFrom-Json
if ($inventory.platform -ne 'web') { throw 'El inventario no pertenece a Web.' }

# Evidencia de consumo directo: docs/matriz-normalizacion-materiales-web-2026-10-16.md.
# Una entrada aquí no acredita estados secundarios ni aprobación visual.
$materials = @{
  'ajustar-pedido-sugerido.html' = @{ shape='ajuste por receta'; direct='NumberInput,Chip,Button,Toast'; local='filas y justificación por receta' }
  'aprobacion-pedidos-materiales.html' = @{ shape='galería de decisión'; direct='TextInput,SelectInput,NumberInput,Chip,Button,Notice,Toast'; local='galería, decisión por material y auditoría' }
  'categorias-pedido.html' = @{ shape='catálogo breve'; direct='TextInput,SelectInput,Chip,Button,Table,Pagination,Drawer,DrawerAuditList,Toast'; local='estado de catálogo y formulario compacto' }
  'configuracion-materiales-referencia.html' = @{ shape='configuración por referencia'; direct='Table,Pagination,Chip,SearchSelectInput,SelectInput,DateInput,NumberInput,TextInput,Button,Toast,Drawer'; local='secciones de captura y dependencia receta-material' }
  'gestion-materiales.html' = @{ shape='catálogo y alta breve'; direct='TextInput,SelectInput,SearchSelectInput,NumberInput,Chip,Button,IconButton,Table,TableRowActions,Pagination,Drawer,Toast'; local='selección SAP y formulario breve' }
  'gestion-pedidos-materiales.html' = @{ shape='pedido sugerido por receta'; direct='SelectInput,Chip,Button,Notice,Toast'; local='fuentes, recetas y cálculo' }
  'gestion-proveedores.html' = @{ shape='catálogo y alta breve'; direct='TextInput,SelectInput,Chip,Button,IconButton,Table,TableRowActions,Pagination,Drawer,Toast'; local='formulario de proveedor y estado local' }
  'inventario-materiales-finca.html' = @{ shape='bandeja de consulta'; direct='TextInput,SelectInput,Chip,Button,Table,Pagination,Drawer'; local='consulta por material y finca' }
  'inventario-pallets.html' = @{ shape='bandeja de consulta'; direct='TextInput,SelectInput,Chip,Button,Table,Pagination,Drawer'; local='detalle de pallet' }
  'movimientos-inventario.html' = @{ shape='bandeja de consulta'; direct='TextInput,SelectInput,DateInput,Chip,Button,Table,Pagination,Drawer'; local='rango de fechas y detalle' }
  'ordenes-transporte-insumos.html' = @{ shape='bandeja y mesa de partición'; direct='TextInput,SelectInput,DateInput,Chip,Button,IconButton,Table,Pagination,Toast,Drawer'; local='mesa HU546 y asignación de ítems completos' }
  'pedidos-adicionales.html' = @{ shape='bandeja, registro y detalle'; direct='TextInput,SelectInput,NumberInput,Chip,Button,IconButton,Toast,Table,Pagination,Card,KeyValueGrid'; local='líneas dinámicas, cadena de origen, progreso y borrador' }
  'pedidos-recurrentes.html' = @{ shape='bandeja y panel'; direct='TextInput,SelectInput,NumberInput,DateInput,Chip,Button,Toast,Table,TableRowActions,Pagination'; local='panel de registro y decisión recurrente' }
  'recetas-materiales.html' = @{ shape='bandeja y editor de receta'; direct='TextInput,SelectInput,SearchSelectInput,NumberInput,Chip,Button,IconButton,Table,TableRowActions,Pagination,Drawer,Toast'; local='composición de materiales por referencia y versión' }
  'reglas-documentales.html' = @{ shape='catálogo y alta breve'; direct='TextInput,SelectInput,Chip,Button,IconButton,Table,TableRowActions,Pagination,Drawer,Toast'; local='formulario de regla y estado local' }
  'resumen-proveedores.html' = @{ shape='bandeja de consulta'; direct='TextInput,SelectInput,Chip,Button,IconButton,Table,TableRowActions,Pagination,Drawer,Toast'; local='generación y envío local del resumen' }
  'seguimiento-entregas.html' = @{ shape='bandeja de consulta'; direct='TextInput,SelectInput,Chip,Button,IconButton,Table,TableRowActions,Pagination,Drawer'; local='evidencia de entrega' }
  'seguimiento-pedidos-finca.html' = @{ shape='consulta y detalle'; direct='TextInput,SelectInput,Chip,Table,TableRowActions,Pagination'; local='detalle por receta y material' }
  'trazabilidad-pedido.html' = @{ shape='consulta y recorrido de siete etapas; alternativa de datos y evidencia'; direct='TextInput,Button,Notice,Card,KeyValueGrid,Chip'; local='recorrido anterior principal; selector de siete hitos alternativo' }
}

$rows = [System.Collections.Generic.List[object]]::new()
foreach ($view in $inventory.views) {
  $route = [string]$view.route
  $class = if ($route -eq 'Materiales y Suministros/index.html') { 'redirect' }
    elseif ($route -eq 'shared/componentes.html') { 'component-catalog' }
    elseif ($view.kind -eq 'module-index') { 'navigation-support' }
    else { [string]$view.kind }
  $base = [ordered]@{
    route = $route; class = $class; shape = [string]$view.kind
    component = ''; component_state = ''; evidence = ''
    functional_gate = 'pending'; visual_gate = 'pending'
  }
  if ($class -eq 'redirect') {
    $base.component = '(sin interfaz funcional)'; $base.component_state = 'not-applicable'
    $base.evidence = 'redirección a gestion-pedidos-materiales.html'; $base.functional_gate = 'redirect-verified'
    $base.visual_gate = 'not-applicable'; $rows.Add([pscustomobject]$base); continue
  }
  if ($class -eq 'component-catalog') {
    $base.component = '(catálogo técnico)'; $base.component_state = 'not-applicable'
    $base.evidence = 'shared/componentes.html'; $base.functional_gate = 'not-applicable'
    $base.visual_gate = 'not-applicable'; $rows.Add([pscustomobject]$base); continue
  }
  $materialName = if ($route.StartsWith('Materiales y Suministros/')) { Split-Path $route -Leaf } else { '' }
  if ($materials.ContainsKey($materialName)) {
    $decision = $materials[$materialName]
    $base.shape = $decision.shape
    if ($materialName -in @('gestion-pedidos-materiales.html','ajustar-pedido-sugerido.html')) {
      $base.functional_gate = 'prototype-scenarios-verified-2026-10-26'
      $base.visual_gate = 'approved-by-John-2026-10-26'
    }
    if ($materialName -eq 'aprobacion-pedidos-materiales.html') {
      $base.functional_gate = 'prior-functional-evidence-plus-visual-review'
      $base.visual_gate = 'approved-by-John-2026-10-26'
    }
    if ($materialName -eq 'seguimiento-pedidos-finca.html') {
      $base.functional_gate = 'one-zero-results-and-detail-verified-2026-10-26'
      $base.visual_gate = 'approved-by-John-2026-10-26'
    }
    if ($materialName -eq 'pedidos-adicionales.html') {
      $base.functional_gate = 'dynamic-lines-draft-submit-and-detail-verified-2026-10-26'
      $base.visual_gate = 'approved-by-John-2026-10-26'
    }
    if ($materialName -eq 'ordenes-transporte-insumos.html') {
      $base.functional_gate = 'partition-export-filters-and-detail-verified-2026-10-26'
      $base.visual_gate = 'approved-by-John-2026-10-26'
    }
    if ($materialName -eq 'categorias-pedido.html') {
      $base.functional_gate = 'crud-toasts-filters-pagination-and-audit-verified-2026-10-26'
      $base.visual_gate = 'approved-by-John-2026-10-26'
    }
    if ($materialName -eq 'gestion-materiales.html') {
      $base.functional_gate = 'catalog-edit-filter-export-detail-verified; mock-sap-source-limited'
      $base.visual_gate = 'approved-by-John-2026-10-26'
    }
    if ($materialName -eq 'gestion-proveedores.html') {
      $base.functional_gate = 'create-edit-status-persistence-filters-pagination-export-detail-verified-2026-10-26'
      $base.visual_gate = 'approved-by-John-2026-10-26'
    }
    if ($materialName -eq 'reglas-documentales.html') {
      $base.functional_gate = 'create-edit-status-persistence-filters-pagination-export-detail-verified-2026-10-26'
      $base.visual_gate = 'approved-by-John-2026-10-26'
    }
    if ($materialName -eq 'recetas-materiales.html') {
      $base.functional_gate = 'create-edit-duplicate-status-persistence-filters-pagination-detail-verified-2026-10-26'
      $base.visual_gate = 'approved-by-John-2026-10-26'
    }
    if ($materialName -eq 'configuracion-materiales-referencia.html') {
      $base.functional_gate = 'create-duplicate-date-rules-persistence-filters-pagination-detail-focus-verified-2026-10-26'
      $base.visual_gate = 'approved-by-John-2026-10-26'
    }
    if ($materialName -eq 'trazabilidad-pedido.html') {
      $base.functional_gate = 'seven-stages-keyboard-evidence-errors-and-no-route-verified-2026-10-26'
      $base.visual_gate = 'approved-by-John-2026-10-26; previous-primary-alternative-secondary'
    }
    if ($materialName -eq 'inventario-materiales-finca.html') {
      $base.functional_gate = 'combined-filters-one-zero-pagination-detail-link-verified-2026-10-26'
      $base.visual_gate = 'approved-by-John-2026-10-26'
    }
    if ($materialName -eq 'inventario-pallets.html') {
      $base.functional_gate = 'combined-filters-one-zero-pagination-detail-verified-2026-10-26'
      $base.visual_gate = 'approved-by-John-2026-10-26'
    }
    if ($materialName -eq 'movimientos-inventario.html') {
      $base.functional_gate = 'combined-filters-date-zero-pagination-detail-verified-2026-10-26'
      $base.visual_gate = 'approved-by-John-2026-10-26'
    }
    if ($materialName -eq 'pedidos-recurrentes.html') {
      $base.functional_gate = 'create-invalid-status-persistence-filters-pagination-focus-verified-2026-10-26'
      $base.visual_gate = 'approved-by-John-2026-10-26'
    }
    if ($materialName -eq 'resumen-proveedores.html') {
      $base.functional_gate = 'combined-filters-one-zero-pagination-share-status-persistence-export-detail-verified-2026-10-26'
      $base.visual_gate = 'approved-by-John-2026-10-26'
    }
    if ($materialName -eq 'seguimiento-entregas.html') {
      $base.functional_gate = 'combined-filters-one-zero-pagination-export-detail-audit-link-verified-2026-10-26'
      $base.visual_gate = 'approved-by-John-2026-10-26'
    }
    foreach ($name in ($decision.direct -split ',')) {
      $entry = [ordered]@{}; foreach ($key in $base.Keys) { $entry[$key] = $base[$key] }
      $entry.component = $name; $entry.component_state = 'direct-in-proposal; secondary-states-pending'
      if ($materialName -eq 'trazabilidad-pedido.html' -and $name -in @('Card','KeyValueGrid','Chip')) {
        $entry.component_state = 'direct-in-alternative; query=composicion=alternativa'
      }
      $entry.evidence = 'docs/matriz-normalizacion-materiales-web-2026-10-16.md'
      $rows.Add([pscustomobject]$entry)
    }
    $base.component = $decision.local; $base.component_state = 'feature-local; visual-review-pending'
    $base.evidence = 'docs/matriz-normalizacion-materiales-web-2026-10-16.md; plan acordado 2026-10-26'; $rows.Add([pscustomobject]$base)
    continue
  }
  $html = [IO.File]::ReadAllText((Join-Path $ProposalRoot $route))
  $observed = @([regex]::Matches($html, '(?i)data-sial-component\s*=\s*["'']([^"'']+)["'']') |
    ForEach-Object { $_.Groups[1].Value } | Select-Object -Unique)
  if (-not $observed.Count) { $observed = @('(runtime audit pending)') }
  foreach ($name in $observed) {
    $entry = [ordered]@{}; foreach ($key in $base.Keys) { $entry[$key] = $base[$key] }
    $entry.component = $name
    $entry.component_state = if ($name -eq '(runtime audit pending)') { 'pending' } else { 'static-marker; runtime-unverified' }
    $entry.evidence = if ($name -eq '(runtime audit pending)') { 'scan-proposal.ps1; montaje por revisar' } else { $route }
    $rows.Add([pscustomobject]$entry)
  }
}
$destination = Join-Path $ProposalRoot 'docs/matriz-vista-componente-web-2026-10-26.csv'
$rows | Export-Csv -LiteralPath $destination -NoTypeInformation -Encoding utf8
"routes=$(@($rows.route | Select-Object -Unique).Count) rows=$($rows.Count) materials=$($materials.Count) output=$destination"
