# Assessment B — evidencia técnica aislada

Detector ejecutado contra `src/web/security-product/vehicle-facts-exploration.jsx`: salida `[]`, sin hallazgos del detector estático. Archivo original: `detector.json`.

Navegador en pestaña propia cerrada al terminar, sin navegar la pestaña del padre:

| Variante | Campos de contexto | Campos del hito | Listas descriptivas | Overflow 1440 | Overflow 390 |
| --- | --- | --- | --- | --- | --- |
| A | 12 | 5 | 6 | No | No |
| B | 12 | 5 | 6 | No | No |

Campos presentes en ambas: placa, tipo, contenedor, capacidad, conductor, transportadora, carrier, ubicación actual, destino, registro, responsable de operación y sincronización. Hito: etapa, contenedor asignado, carga, observación y responsable. La composición usa `dl/dt/dd`; los contenedores `div` agrupan pares semánticos.

Límites: el detector estático no certifica accesibilidad, contraste ni aceptación visual. No se inyectó overlay del detector ni se afirma que exista. Esta pasada verifica estructura, integridad de campos y overflow; la comparación estética corresponde a Assessment A y al padre.
