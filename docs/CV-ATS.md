# CV que pasa cualquier ATS — investigación y decisiones

Notas de la investigación (julio 2026) detrás de `scripts/generate-cv.ts` y
`scripts/cv-lint.ts`. El objetivo no es un CV bonito: es un CV que un parser
trocee bien y que rellene solo los formularios de Workday, Greenhouse, Lever,
iCIMS o Taleo.

## 1. Qué lee realmente un ATS

Un parser no "mira" el PDF. Corre el equivalente a `pdftotext`, obtiene una
cadena de texto plano y le aplica regex y NER para sacar ~30 campos: nombre,
email, teléfono, ubicación, LinkedIn, y para cada puesto el cargo, la empresa,
las fechas y las viñetas; para cada estudio el título, el centro y el año; y una
lista de skills.

De ahí salen dos consecuencias que mandan sobre todo lo demás:

- **Si algo no está en la capa de texto, no existe.** Iconos, imágenes,
  contenido en el header/footer del papel: invisibles o basura.
- **El orden de lectura es el orden geométrico.** Dos columnas a la misma altura
  se entrelazan en una sola línea sin sentido. Por eso una columna, siempre.

Lo comprobado empíricamente en este repo: extraer la capa de texto del PDF que
generaba el script y leerla. Ahí aparecieron los defectos reales — no en teoría.

## 2. ¿LaTeX? No, y no por esnobismo

La pregunta era si pasar el CV a LaTeX. **La recomendación es no**, y el motivo
es concreto:

| | HTML → Chrome headless (actual) | LaTeX |
|---|---|---|
| Capa de texto | Type0 + `/ToUnicode` correcto, extracción limpia | `pdflatex` bien; **XeLaTeX/LuaLaTeX dan PDF de los que algunos parsers no extraen texto** |
| Ligaduras | ninguna | `fi`, `fl`, `ffi` pueden extraerse mal según el pipeline |
| Dependencias | Chrome/Edge, que ya está | distribución TeX completa (~1 GB) |
| Ajuste automático a 1 página | trivial (reescalar CSS y recontar páginas) | requiere pasadas y ajuste manual |
| Fuente de verdad | `src/data/cvData.ts`, compartida con la web | un `.tex` que se desincroniza |

LaTeX puede dar un CV perfectamente parseable —a una columna y compilado con
`pdflatex`— pero no aporta nada que el pipeline actual no tenga ya, y sí añade
una dependencia pesada y modos de fallo nuevos. La ventaja de LaTeX es la
tipografía fina, que a un parser le da exactamente igual.

**Lo que sí faltaba y ahora está**: verificar la extracción en vez de suponerla.

## 3. Metadatos estructurados dentro del PDF: no funcionan

Se evaluó incrustar XMP, JSON-LD schema.org o adjuntos JSON Resume en el propio
PDF. **No sirve para el ATS.** Los parsers no leen streams XMP ni extraen
adjuntos; y aunque los leyeran, XMP es un mapa plano de claves que no dice qué
trozo del documento es un cargo o a qué puesto pertenece un rango de fechas.

Publicar `resume.json` **al lado** del PDF sí tiene sentido, pero para otra cosa
(§5): extensiones de autorrelleno, agentes y scripts.

## 4. Reglas aplicadas al generador

Cada una responde a un defecto observado en la extracción real, no a una regla
de estilo:

| Antes | Ahora | Por qué |
|---|---|---|
| `Starting Aug 2026` | `Aug 2026 - Present (incoming)` | "Starting X" no es un rango: el puesto se caía del historial |
| `Cargo — Empresa   fechas` en una línea | cargo solo; `Empresa \| Ciudad \| fechas` debajo | el parser leía "Empresa Ciudad Ago 2026" como nombre de empresa |
| `Ene 2026 – Jul 2026` (raya) | `Jan 2026 - Jul 2026` (guion) | los parsers antiguos sólo reconocen el hyphen-minus |
| `·` como separador | `\|` | símbolo raro → campos partidos o líneas descartadas |
| `Segoe UI` | `Arial / Helvetica` | de la lista corta que toda guía da por segura |
| `— … ' "` en el texto | ASCII equivalente | normalizado en un único punto (`ats()`), sin tocar `cvData` |

Se mantienen las decisiones que ya eran correctas: una columna estricta, sin
tablas ni iconos, encabezados estándar (`Summary / Experience / Projects /
Skills / Education / Certifications`), contacto en el cuerpo y no en el header, y
una sola página.

Las **letras acentuadas se conservan** (á, ñ, í). Sólo se normaliza puntuación:
quitarlas destrozaría nombres propios en español y los parsers manejan Unicode
sin problema.

## 5. Qué produce ahora `npm run cv`

Para cada idioma, cuatro salidas del **mismo** origen (`src/data/cvData*.ts`):

- **`.pdf`** — lo que se sube por defecto. Para humanos y para el ATS.
- **`.docx`** — para los formularios que piden Word y para Workday y Taleo, donde
  hay mediciones que dan mejor extracción a DOCX que a PDF. Se genera con un
  escritor OOXML y un escritor ZIP propios (`scripts/lib/docx.ts`, `zip.ts`):
  ninguna dependencia nueva.
- **`.txt`** — extraído *del PDF ya escrito*, no del HTML. Es a la vez la
  versión para pegar en cajas de "pega aquí tu CV" y la prueba de qué se extrae.
- **`resume.json`** — esquema abierto [JSON Resume](https://jsonresume.org) v1.
  Para extensiones de autorrelleno, agentes y para tener el dato exacto sin
  recortarlo del PDF.

Los títulos de sección y el formato de fecha viven en `scripts/lib/cv-labels.ts`
y los comparten PDF y DOCX, para que las dos salidas no puedan divergir.

En la web los expone `src/components/CvDownload.tsx`: el PDF sigue siendo la
acción principal —es lo que sirve casi siempre— y los otros tres van en un
desplegable. El de texto plano no descarga: copia al portapapeles, que es lo que
resuelve las cajas de "pega aquí tu CV". Si el navegador niega el permiso de
portapapeles, abre el `.txt` para poder copiarlo a mano.

## 6. Cómo se verifica

```bash
npm run cv        # regenera pdf + docx + txt + json (EN y ES)
npm run cv:lint   # audita los 4 ficheros subibles leyendo su texto
```

`cv:lint` abre cada PDF y cada DOCX ya escritos, les saca el texto igual que un
`pdftotext` y comprueba sobre ESE texto: que haya capa de texto, que estén nombre, email,
teléfono, web y perfiles sociales, que el contacto esté en la primera página,
que existan los encabezados estándar, que aparezca cada puesto y cada empresa,
que haya al menos un rango de fechas parseable por puesto, que no se hayan
colado separadores inválidos ni puntuación tipográfica, y el peso y el número de
páginas. Sale con código 1 si algo está en rojo, así que puede colgarse de CI.

Prueba manual complementaria, la que recomiendan todas las guías: abrir el PDF,
`Ctrl+A`, `Ctrl+C` y pegar en un editor de texto. Si eso sale bien, el ATS lo
lee. Aquí ese resultado ya está versionado en el `.txt`.

## 7. Adaptar el CV a una oferta concreta

```bash
npm run cv:match -- ruta/a/la-oferta.txt
```

Con el formato ya resuelto, lo que más mueve la aguja es el solape de
vocabulario con la oferta concreta: la referencia habitual es **70–80 %**, no
100 %, que se lee como relleno.

`cv:match` detecta el idioma de la oferta, la cruza contra el `.txt` del CV que
corresponde y reparte los términos en tres cajones:

1. **Cubiertos** — ya están en el CV que se envía.
2. **Ya lo tienes, pero no está en el CV** — vive en `cvData` (proyectos que no
   caben en una página, highlights, certificaciones) y no llega al PDF. Material
   real y recuperable.
3. **No aparece en ningún sitio** — hueco de verdad.

Además ordena los 15 proyectos por encaje con la oferta y propone qué tres
deberían llevar `inCv: true`. Es la palanca más barata que hay: cambiar la
selección no inventa nada, sólo reordena lo que ya está escrito.

**Lo que NO hace: reescribir el CV.** Inyectar automáticamente las palabras de la
oferta es la forma más rápida de acabar afirmando algo que no es cierto. Separa
lo recuperable de lo que falta y la decisión la toma una persona.

Cómo decide qué cadenas son términos técnicos, sin modelo ni dependencias
(`scripts/lib/keywords.ts`): por forma técnica (`java 17`, `c#`, `node.js`), por
mayúscula a mitad de frase —así se escriben los nombres de tecnología en prosa—
y por aparecer ya en el vocabulario del CV. Los n-gramas no cruzan frases ni
saltos de línea, no empiezan ni acaban en palabra vacía, y el propio vocabulario
del CV decide qué es un término atómico (`postgresql` sobrevive dentro de `sql
postgresql`; `spring` no sobrevive dentro de `spring boot`).

**Limitación conocida**: una tecnología que aparezca UNA sola vez y justo al
principio de una viñeta puede escapársele — ahí la mayúscula es posicional y no
se puede distinguir de un verbo. Las de dos mayúsculas (PostgreSQL, AWS, CI/CD)
sí se detectan siempre.

## 8. Pendiente / decisiones abiertas

- **`FINANCIERA COFINCAFE - Cooperativa de Ahorro y Credito`** (avisa el lint):
  el `" - "` interno parece un separador de campo o de rango, y las mayúsculas
  sostenidas degradan el reconocimiento de entidades. Recomendado en `cvData`:
  `Financiera Cofincafé`. Es un cambio sobre el historial laboral real, así que
  no se ha hecho sin confirmarlo.
- **Cuerpo a ~9 pt.** El ajuste automático comprime hasta 9 pt para forzar una
  página. Las guías piden 10–12 pt y los ATS modernos procesan dos páginas igual
  que una. Alternativa: recortar contenido en vez de encoger la letra.
- **Cruzar con más ofertas reales.** El extractor de términos de `cv:match` (§8)
  está calibrado contra dos ofertas de prueba. Cada oferta nueva que deje pasar
  ruido es una oportunidad de afinar las reglas de `scripts/lib/keywords.ts`.

## Fuentes

- [Anatomy of an ATS Friendly Resume Format (Jobscan)](https://www.jobscan.co/blog/20-ats-friendly-resume-templates/)
- [How Resume Parsers Actually Work: Workday, Greenhouse, Lever, iCIMS, Taleo](https://resumeoptimizerpro.com/blog/how-resume-parsers-actually-work)
- [Understanding Resume Parsing (Lever)](https://help.lever.co/s/article/Understanding-Resume-Parsing)
- [Is a LaTeX Resume ATS Friendly? (con pruebas reales)](https://www.jobshinobi.com/blog/is-a-latex-resume-ats-friendly-2026)
- [LaTeX vs Word Resume for ATS Parsing](https://www.jobshinobi.com/blog/latex-vs-word-resume-for-ats-parsing)
- [Making My Resume Machine-Readable (XMP / JSON-LD / adjuntos)](https://anishshobithps.com/blog/making-my-resume-machine-readable)
- [Resume Date Formats for ATS — What Parsers Accept](https://atsverification.com/blog/how-to-format-dates-resume-ats/)
- [PDF Resume ATS Errors: How to Avoid Them](https://www.resumly.ai/blog/best-practices-for-pdf-resumes-to-avoid-ats-errors)
- [I Tested 8 ATS Systems to See How They Actually Parse Resumes](https://quickcv.io/blog/i-tested-8-ats-systems-to-see-how-they-actually-parse-resumes)
- [One-Page vs Two-Page Resume: What ATS Prefers](https://scale.jobs/blog/one-page-vs-two-page-resume-ats-preferences)
