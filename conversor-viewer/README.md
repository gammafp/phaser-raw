# conversor-viewer

Visualizador interactivo del grafo de dependencias de Phaser (require/import).

## Uso

```bash
# Full graph (default)
bun conversor-viewer/build-graph.ts

# Only a namespace
bun conversor-viewer/build-graph.ts gameobjects
bun conversor-viewer/build-graph.ts gameobjects/image
bun conversor-viewer/build-graph.ts renderer/webgl

# Custom baseDir
bun conversor-viewer/build-graph.ts src_converted/phaser/src

# Full args: baseDir, output, namespace
bun conversor-viewer/build-graph.ts src/phaser/src output/graph.html gameobjects
```

## Salida

Genera `conversor-viewer/output/dependency-graph.html` con:

- **Nodos** = archivos (.js/.ts)
- **Aristas** = conexiones import/require (A → B si A importa B)
- **Colores** = por carpeta (gameobjects, renderer, etc.)

## Interactividad

- **Arrastrar** nodos para reorganizar
- **Zoom** con rueda del ratón
- **Pan** arrastrando el fondo
- **Clic** en nodo → info de conexiones
- **Buscar** módulo por nombre
- **Reset/Ajustar** vista

## Requisitos

- Bun (o Node.js)
- Navegador web (para abrir el HTML generado)
- vis-network se carga desde CDN (sin npm install)
