# Laboratorio Alkosto — Reproducción de estudio (PDP)

Reproducción **no comercial** de la página de producto de Alkosto, creada con fines
educativos y de diseño. No es el sitio oficial.

**Página de referencia:**
`https://www.alkosto.com/tv-kalley-65-pulgadas-164-cm-65g315-4k-uhd-max-led-smart/p/7705946477086`

---

## Qué se analizó (HTML / CSS / JS observables)

### Estructura HTML
- `header` en 3 niveles: franja de evento → barra de soporte → fila principal
  (logo + buscador + acciones) → menú de categorías.
- `breadcrumb` (miga de pan) `Inicio > TV > Smart TV > Televisores Kalley > TV KALLEY 65"`.
- Zona principal de producto en 2 columnas: **galería** (imagen + miniaturas) e
  **info** (marca, título `h1`, código/SKU, precio, medios de pago, beneficios,
  cantidad + CTA, acciones secundarias).
- Barra "sticky" que aparece al hacer scroll (precio + "Agregar al carrito").
- Secciones: *Características destacadas*, *Descripción del producto*,
  *Especificaciones* (tabla por grupos).
- `footer` en 4 columnas (Contacto, Nosotros, Compras y servicios, Políticas).

### Datos extraídos (JSON-LD / schema.org)
- **Producto:** TV KALLEY 65" 65G315, marca Kalley, SKU `7705946477086`.
- **Precio:** `$1.899.900` (hoy) · base `$4.099.900` · **-53%**.
- **Addi:** `$1.779.900`.
- **Envío gratis**, **recoge en tienda**, **garantía 2 años**, **devolución 30 días**.
- Máx. 3 unidades por compra en línea.

### Paleta (tokens CSS)
- Naranja principal `#eb5b25` (CTAs, descuentos, acentos) · `#e95e27` (favicon/mask).
- Azul navy `#1a4f8a` / `#12355b` (enlaces, menú de categorías).
- Negro `#111113` (franja de evento y barra sticky) · gris fondo `#f5f5f5`.
- Tipografía: sans-serif (Inter como sustituto).

### Funcionalidades JavaScript reproducidas
- Galería con cambio de imagen por miniaturas.
- Selector de cantidad (límite 3) con botones − / +.
- "Agregar al carrito" → toast + badge de contador animado.
- Favoritos (toggle) y Compartir (Web Share API / portapapeles).
- Barra sticky que aparece al hacer scroll.
- Menú móvil + acordeón de especificaciones en pantallas pequeñas.
- Formato de moneda COP (`es-CO`).

---

## Imágenes
- `img/logo.svg` — logotipo vectorial (SVG propio).
- **Fotos de producto (5)** — proporcionadas por el Capataz vía ImgBB
  (`i.ibb.co`), reutilizadas como enlace directo en la galería (imagen principal
  + 4 miniaturas). No se usaron las fotos del CDN de Alkosto.

---

## Cómo ejecutar

```bash
node server.js
```

Luego abre `http://localhost:8097`.

También puedes abrir `index.html` directamente en el navegador (sin backend).

---

## Estructura de archivos

```
laboratorio-alkosto/
├── index.html          # Página de producto
├── css/styles.css      # Estilos (tokens, layout, responsive, animaciones)
├── js/app.js           # Interacciones
├── img/                # Recursos propios (SVG)
├── server.js           # Servidor local (Node, sin dependencias)
└── README.md
```

### Responsive
- **Desktop** (>1024px): 2 columnas, galería grande.
- **Tablet** (≤1024px): 1 columna, galería centrada.
- **Móvil** (≤768px): header compacto, menú hamburguesa, CTA a ancho completo,
  especificaciones apiladas.

> Nota: la página original usa un sistema de comercio headless (SAP Hybris),
> un visor de imágenes "Sirv" y búsqueda Algolia. Aquí se recrearon las
> interacciones visuales equivalentes con JS vanilla, sin copiar su código.
