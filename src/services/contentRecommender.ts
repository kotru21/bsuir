import type {
  UserProfile,
  RecommendationResult,
  SportSection,
  GoalTag,
} from "../types.js";
import { sportSections } from "../data/sections.js";
import { goalTagLabels, formatLabelsRu } from "../bot/constants.js";
let stemmer: {
  setCurrent: (s: string) => void;
  stem: () => void;
  getCurrent: () => string;
} | null = null;
try {
  // Avoid attempting to import optional dependency during Vitest (bundler/resolve issues)
  if (!process.env.VITEST) {
    /* top-level await: try to import optional dependency */
    // package may be absent in CI; load dynamically
    const pkgName = "snowball-stemmer.jsx";
    const SnowballModule: unknown = await import(pkgName);
    // SnowballModule default is a constructor
    type SnowballCtorType = new (lang: string) => {
      setCurrent: (s: string) => void;
      stem: () => void;
      getCurrent: () => string;
    };
    const SnowballCtor =
      ((SnowballModule as unknown as { default?: SnowballCtorType }).default as
        | SnowballCtorType
        | undefined) ?? (SnowballModule as unknown as SnowballCtorType);
    stemmer = new SnowballCtor("russian");
  }
} catch {
  // no-op: optional dependency not available; continue without stemming
  stemmer = null;
}
const RU_STOPWORDS = new Set([
  "и",
  "в",
  "во",
  "не",
  "на",
  "с",
  "по",
  "что",
  "как",
  "а",
  "или",
  "к",
  "для",
  "это",
  "с",
]);

const goalSynonyms: Record<string, string[]> = {
  strength: ["силовые", "сила", "тренировка со штангой", "гантели"],
  endurance: ["выносливость", "кардио", "бег", "кардиотренировка"],
  flexibility: ["гибкость", "растяжка", "стретчинг"],
  teamwork: ["команда", "командная игра"],
  martialArts: ["единоборства", "борьба", "бокс", "ударная тренировка"],
  ballSports: ["мяч", "футбол", "баскетбол", "мини-футбол"],
  aquatic: ["плавание", "бассейн"],
  dance: ["танцы", "хореография"],
  coordination: ["координация", "ловкость", "реакция"],
  rehabilitation: ["реабилитация", "восстановление", "медицинский"],
  weightManagement: ["похудение", "контроль веса", "дельта веса"],
  aesthetics: ["пластика", "эстетика", "построение тела"],
  competition: ["соревнования", "соревновательная", "турниры"],
};

// Lightweight TF-IDF implementation in pure TypeScript: no extra deps.
// - builds TF-IDF vectors for sections on first call
// - query: constructs a query vector from profile.desiredGoals and returns cosine similarities

type Vector = Map<string, number>;

function tokenize(text: string): string[] {
  return (
    text
      // Normalize
      .toLowerCase()
      .replace(/[\p{P}\p{S}]+/gu, " ")
      .split(/\s+/)
      .filter(Boolean)
      // very small stoplist
      .filter((t) => !["the", "and", "or"].includes(t))
      .map((t) => {
        const norm = t.trim();
        if (!norm || RU_STOPWORDS.has(norm)) return "";
        // apply stemming for russian tokens
        try {
          if (stemmer) {
            stemmer.setCurrent(norm);
            stemmer.stem();
            return stemmer.getCurrent();
          }
          return norm;
        } catch {
          return norm;
        }
      })
      .filter(Boolean)
  );
}

function buildCorpus(): { docs: string[]; vocab: string[] } {
  const docs: string[] = sportSections.map((s) => {
    const parts = [s.title, s.summary, ...(s.extraBenefits ?? []), ...s.focus];
    return parts.join(" ");
  });

  const vocabSet = new Set<string>();
  docs.forEach((d) => tokenize(d).forEach((t) => vocabSet.add(t)));
  return { docs, vocab: Array.from(vocabSet) };
}

function computeTf(doc: string): Vector {
  const tokens = tokenize(doc);
  const tf: Vector = new Map();
  for (const t of tokens) {
    tf.set(t, (tf.get(t) ?? 0) + 1);
  }
  // Use raw frequency; we'll apply IDF later
  return tf;
}

function computeIdf(docs: string[], vocab: string[]): Map<string, number> {
  const idf = new Map<string, number>();
  for (const t of vocab) {
    let df = 0;
    for (const doc of docs) {
      if (tokenize(doc).includes(t)) df++;
    }
    idf.set(t, Math.log((docs.length + 1) / (df + 1)) + 1);
  }
  return idf;
}

function tfidfVector(tf: Vector, idf: Map<string, number>): Vector {
  const v: Vector = new Map();
  let sumSquares = 0;
  for (const [term, freq] of tf) {
    const weight = (freq || 0) * (idf.get(term) ?? 0);
    v.set(term, weight);
    sumSquares += weight * weight;
  }
  // normalize L2
  const norm = Math.sqrt(sumSquares) || 1;
  for (const k of v.keys()) v.set(k, (v.get(k) ?? 0) / norm);
  return v;
}

function cosine(a: Vector, b: Vector): number {
  let res = 0;
  // iterate over smaller vector
  const [sm, bg] = a.size < b.size ? [a, b] : [b, a];
  for (const [k, v] of sm) {
    if (bg.has(k)) res += v * (bg.get(k) ?? 0);
  }
  return res;
}

let tfidfIndex: {
  sectionVectors: Map<string, Vector>;
  idf: Map<string, number>;
} | null = null;

export function buildIndex() {
  const { docs, vocab } = buildCorpus();
  const idf = computeIdf(docs, vocab);
  const tfVecs = docs.map((d) => computeTf(d));
  const sectionVectors: Map<string, Vector> = new Map();
  for (let i = 0; i < sportSections.length; i++) {
    const v = tfidfVector(tfVecs[i], idf);
    sectionVectors.set(sportSections[i].id, v);
  }
  tfidfIndex = { sectionVectors, idf };
}

function profileToQuery(profile: UserProfile): string {
  // primary features: tags goals
  // map GoalTag to human labels in Russian for better matching with summaries
  const goals = profile.desiredGoals
    .map((g) => goalTagLabels[g] ?? g)
    .join(" ");
  // add synonyms for better matching with Russian descriptions
  const synonyms = profile.desiredGoals
    .flatMap((g) => goalSynonyms[g] ?? [])
    .join(" ");
  // include preferred formats as tokens
  const formatTokens = profile.preferredFormats
    .map((f) => formatLabelsRu[f] ?? f)
    .join(" ");
  // simple: user age and fitness level as tokens
  const profileTokens = [profile.fitnessLevel, profile.gender];
  // add preferred times to the query (if present)
  const timeTokens = (profile.preferredTimes ?? [])
    .map((t) => {
      if (t === "morning") return "утро";
      if (t === "afternoon") return "день";
      if (t === "evening") return "вечер";
      if (t === "weekend") return "выходные";
      return t;
    })
    .join(" ");
  return [goals, synonyms, formatTokens, ...profileTokens, timeTokens].join(
    " "
  );
}

export function queryProfile(profile: UserProfile, limit = 3) {
  if (!tfidfIndex) buildIndex();
  const q = profileToQuery(profile);
  const tf = computeTf(q);
  const qVec = tfidfVector(tf, tfidfIndex!.idf);
  const results = Array.from(tfidfIndex!.sectionVectors.entries()).map(
    ([sectionId, vec]) => {
      return { sectionId, score: cosine(qVec, vec) };
    }
  );
  results.sort((a, b) => b.score - a.score);
  const top = results.slice(0, limit);

  // Map to RecommendationResult shape: for content-only we'll use small normalized score and reason
  const maxScore = top[0]?.score ?? 1;
  const recs: RecommendationResult[] = top.map((r) => {
    const section = sportSections.find((s) => s.id === r.sectionId)!;
    const score = Math.round((r.score / (maxScore || 1)) * 10 * 10) / 10; // 0..10
    return {
      section,
      score,
      matchedFocus: profile.desiredGoals.filter((g: GoalTag) =>
        section.focus.includes(g)
      ),
      formatMatch: formatMatchesLocal(section, profile.preferredFormats),
      reasons: [{ kind: "catalog-reference", note: "content-match" }],
    };
  });

  return recs;
}

// local reimplementation of formatMatches because reusing recommendation.ts directly would create circular import
function formatMatchesLocal(section: SportSection, preferred: string[]) {
  if (!preferred || preferred.length === 0) return true;
  if (preferred.includes("mixed")) return true;
  return preferred.includes(section.format);
}

// small utility: return top N section ids
export function queryTopSectionIds(profile: UserProfile, limit = 3) {
  const recs = queryProfile(profile, limit);
  return recs.map((r) => ({ id: r.section.id, score: r.score }));
}
