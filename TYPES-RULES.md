## TYPES RULES (Post-conversion)

La conversión JS -> TS está al 100% en el scope definido. Esta fase es de **endurecimiento de tipos**.

### 1) Fuente de verdad

- La fuente de verdad para tipos es **TypeScript** (`interface`, `type`, firmas, propiedades).
- JSDoc se mantiene para documentación, pero debe estar alineado con TS.
- Si hay conflicto entre JSDoc y TS, se corrige para que coincidan.

### 2) Regla clave nueva: `Phaser.Types.*`

- Cualquier firma TS que use `Phaser.Types.*` debe tratarse como **tipo legacy de JSDoc**.
- Procede migrarlo a tipo real con `import type`.
- Patrón:
  - Crear tipo TS real (cerca del módulo que lo usa).
  - Exportarlo explícitamente.
  - Reemplazar `Phaser.Types.*` por el tipo importado.

Ejemplo objetivo:

- Antes: `constructor(config?: Phaser.Types.Core.GameConfig)`
- Después: `import type { GameConfig } from './types/GameConfig'`

### 3) Typedefs (`typedefs/`)

- No migrar todo en bloque.
- Migración incremental por dominio (core, gameobjects, input, etc.).
- Si un tipo solo se usa localmente, dejarlo junto al módulo.
- Si es compartido por varios namespaces, moverlo a ubicación común.

### 4) `any` y opcionales

- Evitar `any` cuando exista tipo razonable.
- Prioridad para reemplazar `any`:
  1. propiedades base (`scene`, `frame`, `texture`, etc.)
  2. constructores y APIs públicas
  3. estructuras internas estables (ej. `_crop`)
- Si runtime acepta `undefined`, usar `param?: T` y reflejarlo en JSDoc (`[param]` o `[param=default]`).

### 5) Mixins

- Mantener patrón actual:
  - `export interface X extends ComponentA, ComponentB {}`
  - `export class X extends Base { static { Mixin(this, [...]) } }`
- Los `@extends Phaser.GameObjects.Components.*` en JSDoc son documentales, no tipado real.

### 6) Imports y exports

- Preferir `import type` para símbolos de solo tipado.
- Evitar ciclos de runtime por tipos.
- En archivos TS actualizados, preferir exports modernos (`export const`, `export class`, `export default` cuando aplique).

### 7) Validación por cambio

- Ejecutar typecheck en scope Phaser:
  - `bun run typecheck:phaser`
  - `bun run typecheck:phaser:watch`
- Revisar lints en los archivos tocados.
- Si se ajustan firmas públicas, revisar consumidores inmediatos.