#!/usr/bin/env bun
/**
 * Dependency Graph Builder
 *
 * Escanea src/phaser/src (o la carpeta indicada), extrae require/import
 * y genera un HTML interactivo con el grafo de dependencias.
 *
 * Uso:
 *   bun conversor-viewer/build-graph.ts
 *     → Full graph
 *   bun conversor-viewer/build-graph.ts [namespace]
 *     → Only that namespace, e.g. gameobjects, gameobjects/image
 *   bun conversor-viewer/build-graph.ts [baseDir] [output] [namespace]
 */

import * as fs from 'fs';
import * as path from 'path';

const BASE_DIR_DEFAULT = 'src/phaser/src';
const OUTPUT_DEFAULT = 'conversor-viewer/output/dependency-graph.html';

const EXTENSIONS = ['.js', '.ts', '.mjs', '.cjs', '.jsx', '.tsx'];
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', 'out', '__pycache__']);

// Regex para extraer imports/requires
const IMPORT_PATTERNS = [
    /(?:from|import)\s+['"]([^'"]+)['"]/g,
    /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
    /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
];

function collectFiles(dir: string, baseDir: string, files: string[]): void {
    if (!fs.existsSync(dir)) return;

    const entries = fs.readdirSync(dir);

    for (const entry of entries) {
        if (SKIP_DIRS.has(entry)) continue;

        const fullPath = path.join(dir, entry);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            collectFiles(fullPath, baseDir, files);
            continue;
        }

        const ext = path.extname(entry);
        if (!EXTENSIONS.includes(ext)) continue;
        if (entry.endsWith('.d.ts')) continue;

        const rel = path.relative(baseDir, fullPath).replace(/\\/g, '/');
        files.push(rel);
    }
}

function extractSpecifiers(content: string): string[] {
    const stripped = content
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\/\/.*$/gm, '');

    const seen = new Set<string>();
    const specs: string[] = [];

    for (const pattern of IMPORT_PATTERNS) {
        let match: RegExpExecArray | null;
        const re = new RegExp(pattern.source, 'g');
        while ((match = re.exec(stripped)) !== null) {
            const spec = match[1];
            if (spec && !seen.has(spec)) {
                seen.add(spec);
                specs.push(spec);
            }
        }
    }

    return specs;
}

function resolveToFile(
    baseDir: string,
    fromFile: string,
    specifier: string,
    fileSet: Set<string>
): string | null {
    // Solo resolvemos rutas relativas (./ o ../)
    if (!specifier.startsWith('.')) return null;

    const fromDir = path.dirname(path.join(baseDir, fromFile));
    const resolved = path.normalize(path.join(fromDir, specifier));
    const relResolved = path.relative(baseDir, resolved).replace(/\\/g, '/');

    const candidates = [
        relResolved,
        relResolved + '.ts',
        relResolved + '.js',
        (relResolved + '/index.ts').replace(/\\/g, '/'),
        (relResolved + '/index.js').replace(/\\/g, '/'),
    ].map((c) => c.replace(/\\/g, '/'));

    for (const c of candidates) {
        if (fileSet.has(c)) return c;
        const withoutIndex = c.replace(/\/index\.(ts|js)$/, '');
        if (fileSet.has(withoutIndex)) return withoutIndex;
    }

    return null;
}

function getFolderFromPath(relPath: string): string {
    const parts = relPath.split('/').filter(Boolean);
    return parts[0] ?? 'root';
}

function buildGraph(baseDir: string, namespaceFilter: string | null): { nodes: any[]; edges: any[]; stats: any } {
    const cwd = process.cwd();
    const fullBase = path.join(cwd, baseDir);

    const allFiles: string[] = [];
    collectFiles(fullBase, fullBase, allFiles);

    // Filter by namespace if specified
    const files = namespaceFilter
        ? allFiles.filter((f) => f === namespaceFilter || f.startsWith(namespaceFilter + '/'))
        : allFiles;

    const fileSet = new Set(files);

    const nodes: any[] = [];
    const edges: any[] = [];
    const folderCount: Record<string, number> = {};
    const colorMap: Record<string, string> = {};
    const colors = [
        '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4',
        '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff',
        '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1',
        '#000075', '#808080',
    ];
    let colorIdx = 0;

    files.forEach((f) => {
        const folder = getFolderFromPath(f);
        if (!colorMap[folder]) {
            colorMap[folder] = colors[colorIdx % colors.length];
            colorIdx++;
        }
        folderCount[folder] = (folderCount[folder] || 0) + 1;
    });

    files.forEach((file) => {
        const folder = getFolderFromPath(file);
        const label = file.split('/').pop() || file;
        nodes.push({
            id: file,
            label: label,
            title: file,
            namespace: folder,
            color: colorMap[folder],
            font: { size: 10 },
        });
    });

    let resolvedCount = 0;
    let unresolvedCount = 0;

    files.forEach((fromFile) => {
        const fullPath = path.join(fullBase, fromFile);
        if (!fs.existsSync(fullPath)) return;

        const content = fs.readFileSync(fullPath, 'utf-8');
        const specifiers = extractSpecifiers(content);

        specifiers.forEach((spec) => {
            const toFile = resolveToFile(fullBase, fromFile, spec, new Set(allFiles));
            if (toFile && toFile !== fromFile) {
                // Only include edge if both endpoints are in our filtered set
                if (fileSet.has(toFile)) {
                    edges.push({ from: fromFile, to: toFile });
                    resolvedCount++;
                }
            } else if (spec.startsWith('.')) {
                unresolvedCount++;
            }
        });
    });

    const namespaces = Object.entries(folderCount)
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => ({ name, count }));

    return {
        nodes,
        edges,
        stats: {
            totalFiles: files.length,
            totalEdges: edges.length,
            folders: Object.keys(folderCount).length,
            resolvedCount,
            unresolvedCount,
            namespaces,
            namespaceFilter: namespaceFilter || null,
        },
    };
}

function generateHTML(nodes: any[], edges: any[], stats: any): string {
    const nodesJson = JSON.stringify(nodes);
    const edgesJson = JSON.stringify(edges);
    const namespacesJson = JSON.stringify(stats.namespaces || []);

    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Phaser Dependency Graph</title>
  <script type="text/javascript" src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; background: #1a1a2e; color: #eee; }
    #header {
      padding: 12px 20px;
      background: #16213e;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }
    h1 { font-size: 1.2rem; font-weight: 600; }
    #stats { font-size: 0.85rem; opacity: 0.9; }
    #controls {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    #controls button {
      padding: 6px 12px;
      border: none;
      border-radius: 6px;
      background: #0f3460;
      color: #eee;
      cursor: pointer;
      font-size: 0.9rem;
    }
    #controls button:hover { background: #e94560; }
    #search {
      padding: 6px 12px;
      border: 1px solid #0f3460;
      border-radius: 6px;
      background: #1a1a2e;
      color: #eee;
      font-size: 0.9rem;
      width: 180px;
    }
    #search::placeholder { color: #666; }
    #layout {
      display: flex;
      flex: 1;
      min-height: 0;
    }
    #sidebar {
      width: 220px;
      min-width: 180px;
      background: #16213e;
      padding: 12px;
      overflow-y: auto;
      border-right: 1px solid #0f3460;
    }
    #sidebar h3 {
      font-size: 0.9rem;
      margin-bottom: 8px;
      color: #aaccff;
    }
    #sidebar .ns-controls {
      display: flex;
      gap: 6px;
      margin-bottom: 12px;
    }
    #sidebar .ns-controls button {
      flex: 1;
      padding: 4px 8px;
      font-size: 0.75rem;
      background: #0f3460;
      color: #eee;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    #sidebar .ns-controls button:hover { background: #e94560; }
    #sidebar .ns-list {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    #sidebar label {
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      font-size: 0.8rem;
      padding: 2px 0;
    }
    #sidebar label:hover { opacity: 0.9; }
    #sidebar input[type="checkbox"] { cursor: pointer; }
    #sidebar .ns-count { color: #888; font-size: 0.75rem; }
    #mynetwork {
      flex: 1;
      height: calc(100vh - 56px);
      background: #0f0f1a;
    }
    #info {
      position: fixed;
      bottom: 16px;
      left: 16px;
      right: 16px;
      max-width: 480px;
      padding: 12px;
      background: rgba(0,0,0,0.8);
      border-radius: 8px;
      font-size: 0.8rem;
      display: none;
    }
  </style>
</head>
<body>
  <div id="header">
    <div>
      <h1>🔗 Phaser Dependency Graph</h1>
      <div id="stats">
        ${stats.totalFiles} files · ${stats.totalEdges} connections · ${stats.folders} namespaces
        ${stats.unresolvedCount > 0 ? ' · ' + stats.unresolvedCount + ' unresolved imports' : ''}
      </div>
    </div>
    <div id="controls">
      <input type="text" id="search" placeholder="Search module...">
      <button id="btnReset">Reset view</button>
      <button id="btnFit">Fit</button>
    </div>
  </div>

  <div id="layout">
    <div id="sidebar">
      <h3>Namespaces</h3>
      <div class="ns-controls">
        <button id="btnShowAll">Show all</button>
        <button id="btnHideAll">Hide all</button>
      </div>
      <div class="ns-list" id="nsList"></div>
    </div>
    <div id="mynetwork"></div>
  </div>
  <div id="info"></div>

  <script>
    const nodes = new vis.DataSet(${nodesJson});
    const edges = new vis.DataSet(${edgesJson});

    const container = document.getElementById('mynetwork');
    const data = { nodes, edges };

    const options = {
      nodes: {
        shape: 'box',
        margin: 8,
        borderWidth: 1,
        borderWidthSelected: 2,
        shadow: true,
      },
      edges: {
        arrows: 'to',
        width: 0.5,
        color: { opacity: 0.5 },
      },
      physics: {
        enabled: true,
        forceAtlas2Based: {
          gravitationalConstant: -50,
          centralGravity: 0.01,
          springLength: 150,
          springConstant: 0.08,
        },
        solver: 'forceAtlas2Based',
        stabilization: { iterations: 150 },
      },
      interaction: {
        dragNodes: true,
        dragView: true,
        zoomView: true,
      },
    };

    const network = new vis.Network(container, data, options);

    network.on('click', function(params) {
      const info = document.getElementById('info');
      if (params.nodes.length > 0) {
        const id = params.nodes[0];
        const node = nodes.get(id);
        const conns = edges.get().filter(e => e.from === id || e.to === id);
        info.innerHTML = '<strong>' + node.title + '</strong><br>' +
          'Exports to: ' + conns.filter(e => e.from === id).length + ' · Imports from: ' + conns.filter(e => e.to === id).length;
        info.style.display = 'block';
      } else {
        info.style.display = 'none';
      }
    });

    document.getElementById('btnReset').onclick = () => network.fit();
    document.getElementById('btnFit').onclick = () => network.fit();

    // Namespace visibility
    const namespaces = ${namespacesJson};
    const nsCheckboxes = {};

    function getNodeNamespace(id) {
      const n = nodes.get(id);
      return n && n.namespace ? n.namespace : (id.split('/')[0] || 'root');
    }

    function applyNamespaceVisibility() {
      const hiddenNs = new Set();
      Object.keys(nsCheckboxes).forEach(ns => {
        if (!nsCheckboxes[ns].checked) hiddenNs.add(ns);
      });
      nodes.forEach(n => {
        const ns = n.namespace || n.id.split('/')[0] || 'root';
        nodes.update({ id: n.id, hidden: hiddenNs.has(ns) });
      });
    }

    const nsList = document.getElementById('nsList');
    namespaces.forEach(({ name, count }) => {
      const label = document.createElement('label');
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = true;
      cb.dataset.ns = name;
      nsCheckboxes[name] = cb;
      cb.onchange = applyNamespaceVisibility;
      label.appendChild(cb);
      label.appendChild(document.createTextNode(name));
      const span = document.createElement('span');
      span.className = 'ns-count';
      span.textContent = ' (' + count + ')';
      label.appendChild(span);
      nsList.appendChild(label);
    });

    document.getElementById('btnShowAll').onclick = function() {
      Object.keys(nsCheckboxes).forEach(ns => { nsCheckboxes[ns].checked = true; });
      applyNamespaceVisibility();
    };

    document.getElementById('btnHideAll').onclick = function() {
      Object.keys(nsCheckboxes).forEach(ns => { nsCheckboxes[ns].checked = false; });
      applyNamespaceVisibility();
    };

    document.getElementById('search').oninput = function() {
      const q = this.value.trim().toLowerCase();
      if (!q) {
        nodes.forEach(n => nodes.update({ ...n, hidden: false }));
        return;
      }
      nodes.forEach(n => {
        const match = n.title.toLowerCase().includes(q);
        nodes.update({ ...n, hidden: !match });
      });
    };
  </script>
</body>
</html>`;
}

function main(): void {
    const args = process.argv.slice(2);
    let baseDir = BASE_DIR_DEFAULT;
    let outputArg = OUTPUT_DEFAULT;
    let namespaceFilter: string | null = null;

    if (args.length === 0) {
        // No args: full graph
    } else if (args.length === 1) {
        const arg = args[0];
        const looksLikeBaseDir = arg.startsWith('src') || arg.includes('phaser') || arg.includes('converted');
        if (looksLikeBaseDir) {
            baseDir = arg;
        } else {
            namespaceFilter = arg;
        }
    } else if (args.length === 2) {
        baseDir = args[0];
        outputArg = args[1];
    } else {
        baseDir = args[0];
        outputArg = args[1];
        namespaceFilter = args[2];
    }

    const cwd = process.cwd();
    const outputPath = path.join(cwd, outputArg);
    const outputDir = path.dirname(outputPath);

    console.log('Scanning:', baseDir);
    if (namespaceFilter) {
        console.log('Namespace filter:', namespaceFilter);
    }
    const { nodes, edges, stats } = buildGraph(baseDir, namespaceFilter);

    console.log('Nodes:', stats.totalFiles);
    console.log('Edges:', stats.totalEdges);
    console.log('Folders:', stats.folders);
    if (stats.unresolvedCount > 0) {
        console.log('Unresolved imports:', stats.unresolvedCount);
    }

    const html = generateHTML(nodes, edges, stats);

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, html, 'utf-8');
    console.log('Generated:', outputPath);
    console.log('Open the file in your browser to visualize.');
}

main();
