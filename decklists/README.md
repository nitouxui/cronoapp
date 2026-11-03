# Constructor de Decklists — fuentes y criterios

## Objetivo
Un único campo de búsqueda, sin filtros obligatorios, para jugadores de Pokémon TCG que conocen los nombres en español o en inglés. Se permite preparar listas de adelanto con impresiones japonesas de **Storm Emeralda (M6)**, diferenciadas de la legalidad Standard internacional.

## Arquitectura
- `index.html`: interfaz y búsqueda (primero resultados locales, luego TCGdex). Límite global de 60 cartas y 4 copias entre impresiones del mismo nombre; energías básicas exceptuadas.
- `catalog-m6.js`: índice local de **113 impresiones** japonesas M6 y alias de búsqueda en inglés/español. Se carga sin API; las 113 impresiones no equivalen a 113 cartas distintas.
- `https://api.tcgdex.net/v2/en` y `/es`: catálogo Standard, detalles e imágenes de cartas.
- `https://api.tcgdex.net/v2/ja/sets/M6`: imágenes de impresiones japonesas cuando el proveedor las entrega.
- `https://api.tcgdex.net/v2/en/sets/sve`: imágenes de energías básicas; representación SVG de respaldo si faltan.
- `sharing.js`: Firebase para publicar una copia fija de una lista completa de 60 cartas. Los enlaces llevan a `consultar/`, donde un oponente puede ver la lista sin iniciar sesión.
- No se consulta una API interna/no documentada del Deck Builder de Limitless. Los enlaces de referencia a fichas públicas de Limitless incluyen `?translate=en`. Los nombres de traducción NO son textos oficiales de cartas.

## Fuente, propiedad y vigencia
TCGdex publica una base abierta bajo MIT: https://github.com/tcgdex/cards-database . La lista de M6 y los nombres provisionales se contrastaron con https://limitlesstcg.com/cards/jp/M6 y https://exploretcgsets.com/pokemon/en-ja/sets/M6/ . Las ilustraciones y marcas pertenecen a sus titulares. No se almacenaron ni copiaron imágenes de Limitless al repositorio.

Las traducciones al español de Entrenadores y Energías en el índice son alias de búsqueda; **no son textos oficiales**. Antes de torneos oficiales, comprobar legalidad de cada carta según el formato y las reglas vigentes; el mazo de adelanto no equivale a un mazo Standard legal.

## Pruebas funcionales recomendadas
1. Buscar `rayquaza`: deben aparecer impresiones M6 #058, #095, #110 y #113, además de la gorra M6 #066.
2. Buscar `energía`, `energia` o `energy`: deben aparecer las ocho energías básicas; buscar `Energía Fuego` debe encontrar también `Nitro Fire Energy`.
3. Buscar `Delta Reign`, `Storm Emeralda` o `M6`: mostrar las 113 impresiones japonesas del índice, incluso cuando TCGdex no responda.
4. Intentar añadir 5 copias de Mega Rayquaza ex entre dos ilustraciones: solo se permiten 4 en total; las energías básicas permiten más.
5. Verificar imágenes reales cuando las devuelve TCGdex y representación alternativa cuando no hay fotografía disponible.
6. Guardar borrador, actualizar página y revisar recuperación; completar 60 cartas, iniciar sesión Google, compartir código, copiar enlace y consultar desde otro navegador.
7. Comprobar uso móvil, navegación por teclado y lectura de mensajes de estado.

## Limitaciones actuales
- La disponibilidad de imágenes externas depende de TCGdex. El sistema ofrece un respaldo visual, no una reproducción oficial garantizada.
- No hay sincronización en la nube para borradores; se guardan localmente.
- Los nombres de todas las impresiones M6 están indexados en inglés, pero las equivalencias españolas de nombres de Entrenadores requieren mantenimiento continuo.
- No se validan automáticamente todas las reglas de torneo, reimpresiones ni combinaciones de cartas especiales.
