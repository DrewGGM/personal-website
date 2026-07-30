/**
 * Extracción de términos para cruzar una oferta con el CV.
 *
 * Sin dependencias y sin modelo: no hace falta. El problema no es "entender" la
 * oferta, es decidir qué cadenas de la oferta son términos técnicos que un ATS
 * va a buscar literalmente en el CV. Para eso bastan tres señales, y el
 * resultado es advisory — lo lee una persona antes de tocar nada.
 */

/** Palabras vacías ES + EN. Frecuentes en ofertas y sin valor como keyword. */
const STOPWORDS = new Set([
  // ES
  'a','al','algo','ante','antes','aqui','asi','aunque','cada','como','con','contra','cual','cuando','de','del','desde','donde','dos','el','ella','ellos','en','entre','era','es','esa','ese','eso','esta','este','esto','estos','ha','hace','hacia','han','hasta','hay','la','las','le','les','lo','los','mas','me','mi','mucho','muy','nos','o','otra','otro','para','pero','poco','por','porque','que','quien','se','segun','ser','si','sin','sobre','solo','son','su','sus','tambien','tan','te','tiene','todo','todos','tu','un','una','uno','unos','y','ya','sera','seran','debe','deben','tener','anos','experiencia','conocimientos','requisitos','funciones','ofrecemos','buscamos','empresa','equipo','trabajo','puesto','candidato','perfil','nivel','area','sector','jornada','contrato','salario','ubicacion','remoto','presencial','hibrido',
  // EN
  'a','about','above','after','all','also','an','and','any','are','as','at','be','been','being','but','by','can','could','do','does','for','from','had','has','have','how','if','in','into','is','it','its','may','more','most','must','no','not','of','on','only','or','other','our','out','over','own','same','should','so','some','such','than','that','the','their','them','then','there','these','they','this','those','through','to','too','under','up','use','using','very','was','we','were','what','when','where','which','while','who','will','with','would','you','your','years','experience','skills','requirements','responsibilities','role','team','company','position','candidate','ability','strong','good','excellent','plus','nice','work','working','including','etc',
]);

/** Quita acentos y baja a minúsculas, conservando los signos que forman parte
 *  de un nombre técnico (`c++`, `c#`, `node.js`, `.net`, `ci/cd`). */
export const normalize = (s: string): string =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9+#./\s-]/g, ' ')
    // El guion separa palabras ("domain-driven" → "domain driven"); la barra y
    // el punto NO, porque forman parte del nombre ("ci/cd", "node.js"). Va aquí
    // y no en el tokenizador para que los dos lados de la comparación —oferta y
    // CV— queden escritos igual.
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const tokenize = (s: string): string[] =>
  normalize(s)
    .split(' ')
    .map((t) => t.replace(/^[./]+|[./,;:]+$/g, ''))
    .filter(Boolean);

/**
 * Trozos dentro de los cuales tiene sentido formar un n-grama.
 *
 * Sin esto se generan engendros como "a plus english", que sale de pegar el
 * final de una línea con el principio de la siguiente. Un término técnico nunca
 * cruza un punto ni un salto de línea.
 */
const segments = (text: string): string[] => text.split(/[\n\r]+|(?<=[.!?;:])\s+/);

const technicalShape = (term: string) => /[0-9+#]/.test(term) || /\w\.\w/.test(term) || term.includes('/');

/**
 * Términos que un ATS buscará literalmente en el CV.
 *
 * Tres señales por token, cualquiera basta:
 *  1. Forma técnica: lleva dígito o `+ # . /` — "java 17", "c#", "node.js".
 *  2. Va en mayúscula dentro de la frase en el texto original — así se escriben
 *     los nombres de tecnología en prosa (Docker, Spring Boot, Kubernetes).
 *  3. Ya aparece en el CV — si el CV lo nombra y la oferta también, es
 *     terminología del oficio por definición.
 *
 * Para un unigrama basta con que la cumpla él. Para un multipalabra se exige que
 * la cumplan TODOS sus tokens y que ninguno sea palabra vacía — o, como atajo,
 * que la frase entera aparezca literal en el CV ("core banking system").
 *
 * La señal 3 se consulta con DOS predicados distintos a propósito. Para un token
 * suelto va contra el vocabulario estructurado (tecnologías, skills, cargos): si
 * se consultara contra la prosa del CV, palabras como "with" o "build" saldrían
 * "conocidas" y se colaría media oferta en frases como "apis with java".
 *
 * @param text La oferta tal cual, SIN normalizar (la señal 2 necesita las mayúsculas).
 */
export function extractJobTerms(
  text: string,
  vocab: {
    /** ¿La frase completa aparece literal en el CV? Se consulta contra todo cvData. */
    phrase: (term: string) => boolean;
    /** ¿El token está en el vocabulario estructurado del CV? */
    token: (term: string) => boolean;
    /**
     * ¿El término es una entrada COMPLETA del vocabulario del CV — "postgresql",
     * "spring boot"— y no un trozo de una? Decide qué sobrevive al filtro de
     * redundancia. Sin esto no hay forma de saber que "postgresql" vale por sí
     * solo dentro de "sql postgresql" pero "spring" no vale dentro de "spring boot".
     */
    atomic: (term: string) => boolean;
  },
): string[] {
  // Términos capitalizados a mitad de frase. Se descarta la primera palabra de
  // cada frase: ahí la mayúscula no dice nada.
  const capitalized = new Set<string>();
  for (const segment of segments(text)) {
    // Fuera el marcador de lista, o "Familiarity" en "- Familiarity with Git"
    // pasaría por palabra interior cuando en realidad abre la línea.
    const words = segment.trim().replace(/^[-*•·•\d.)\s]+/, '').split(/\s+/);
    for (const [i, word] of words.entries()) {
      if (!/^[A-ZÁÉÍÓÚÑ][\w+#./-]*$/.test(word)) continue;
      // La primera palabra del segmento va en mayúscula por posición, así que no
      // dice nada... salvo que lleve DOS mayúsculas (PostgreSQL, AWS, CI/CD),
      // que ya no es una convención ortográfica sino el nombre en sí.
      if (i === 0 && !/[A-Z].*[A-Z]/.test(word)) continue;
      for (const term of tokenize(word)) {
        if (term && !STOPWORDS.has(term)) capitalized.add(term);
      }
    }
  }

  const strong = (t: string) => technicalShape(t) || capitalized.has(t) || vocab.token(t);

  const counts = new Map<string, number>();
  const bump = (gram: string) => counts.set(gram, (counts.get(gram) ?? 0) + 1);

  for (const segment of segments(text)) {
    const tokens = tokenize(segment);
    for (let i = 0; i < tokens.length; i++) {
      const head = tokens[i];
      // `/[a-z]/` descarta unigramas que son sólo cifras ("2+", "17"): dentro de
      // "java 17" aportan, sueltos no son una keyword.
      if (head.length >= 2 && /[a-z]/.test(head) && !STOPWORDS.has(head) && strong(head)) bump(head);

      for (const n of [2, 3]) {
        const slice = tokens.slice(i, i + n);
        if (slice.length < n) continue;
        // Empezar o acabar en palabra vacía descarta el n-grama SIEMPRE, incluso
        // si la secuencia existe literal en el CV: "for a" o "reviews and"
        // aparecen en cualquier prosa y no son términos de nada.
        if (STOPWORDS.has(slice[0]) || STOPWORDS.has(slice[n - 1])) continue;
        const gram = slice.join(' ');
        if (vocab.phrase(gram)) {
          bump(gram);
          continue;
        }
        // Una palabra vacía en posición interior delata un trozo de prosa, no un
        // término: "apis with java". Se tolera sólo por la vía de arriba, para
        // compuestos reales del tipo "internet of things".
        if (slice.some((t) => STOPWORDS.has(t))) continue;
        if (slice.every(strong)) bump(gram);
      }
    }
  }

  // Un n-grama absorbido por otro más largo e igual de frecuente es ruido:
  // "spring", "boot" y "domain driven" bajo "spring boot" y "domain driven
  // design". Se salvan los que el CV nombra como término completo, que es cómo
  // "postgresql" sobrevive dentro del bigrama accidental "sql postgresql".
  const terms = [...counts.keys()];
  const redundant = new Set(
    terms.filter(
      (short) =>
        !vocab.atomic(short) &&
        terms.some(
          (long) => long !== short && long.includes(short) && counts.get(long)! >= counts.get(short)!,
        ),
    ),
  );

  return terms
    .filter((t) => !redundant.has(t))
    .sort((a, b) => counts.get(b)! - counts.get(a)! || a.localeCompare(b));
}

/** ¿Aparece el término en el texto, como palabra completa? */
export const mentions = (haystack: string, term: string): boolean =>
  new RegExp(`(?:^|[^a-z0-9])${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:[^a-z0-9]|$)`).test(haystack);

/**
 * Idioma de la oferta, contando marcadores exclusivos de cada lengua.
 * Decide contra qué CV se cruza (el ES o el EN).
 */
export function detectLanguage(text: string): 'es' | 'en' {
  const flat = normalize(text);
  const score = (words: string[]) => words.filter((w) => mentions(flat, w)).length;
  const es = score(['experiencia', 'conocimientos', 'requisitos', 'empresa', 'desarrollador', 'buscamos', 'ofrecemos', 'anos']);
  const en = score(['experience', 'requirements', 'responsibilities', 'developer', 'looking', 'offer', 'years']);
  return es > en ? 'es' : 'en';
}
