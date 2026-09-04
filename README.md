# Atlas XR — Protopatrones de diseño

Catálogo web de protopatrones de diseño para sistemas XR multisensoriales y corporizados.

## Ejecutar

```powershell
npm install
npm run dev
```

Vite mostrará la dirección local, normalmente `http://localhost:5173/`.

Para comprobar la compilación de producción:

```powershell
npm run build
npm run preview
```

## Contenido

- **Catálogo:** búsqueda textual, filtros combinables y previsualización de resultados.
- **Búsqueda guiada:** selección de objetivo, usuarios, modalidades y dominio con coincidencias explicadas.
- **Comparación:** contraste de hasta tres protopatrones.
- **Metodología:** criterios de extracción, N.E.E., estrategias de navegación, limitaciones y glosario.
- **Fichas de protopatrón:** problema, solución, efecto esperado, contexto, limitaciones, validación, evidencia y referencias.

Los datos de los 13 protopatrones se encuentran en `src/data/patterns.js`.

## Script de despliegue

Ha sido añadido una carpeta de script para automatizar el despliegue para Linux Alpine

script/deploy.sh
