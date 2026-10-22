// 09-seo-geo: canonical·OG 경로(SEO-R01), JSON-LD 생성(SEO-R03)
const CONTEXT = 'https://schema.org';
const day = (d: Date) => d.toISOString().slice(0, 10);

export function canonicalUrl(site: string, pathname: string): string {
  const path = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
  return new URL(path, site).href;
}

export function ogImagePath(pathname: string): string {
  const path = pathname.replace(/\/+$/, '');
  return `/og${path === '' ? '/index' : path}.png`;
}

export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function personLd(p: { name: string; email: string; linkedinUrl: string; url: string }) {
  return { '@context': CONTEXT, '@type': 'Person', name: p.name, url: p.url, email: `mailto:${p.email}`, sameAs: [p.linkedinUrl] };
}

export function webSiteLd(w: { name: string; url: string }) {
  return { '@context': CONTEXT, '@type': 'WebSite', name: w.name, url: w.url, inLanguage: 'ko' };
}

export function articleLd(a: {
  headline: string;
  description: string;
  url: string;
  image: string;
  datePublished: Date;
  dateModified?: Date | null | undefined;
  author: string;
}) {
  return {
    '@context': CONTEXT,
    '@type': 'Article',
    headline: a.headline,
    description: a.description,
    url: a.url,
    image: a.image,
    datePublished: day(a.datePublished),
    dateModified: day(a.dateModified ?? a.datePublished),
    author: { '@type': 'Person', name: a.author },
    inLanguage: 'ko',
  };
}

export function breadcrumbLd(items: readonly { name: string; url: string }[]) {
  return {
    '@context': CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, item: item.url })),
  };
}

export function definedTermLd(t: { name: string; alternateName: readonly string[]; description: string; url: string }) {
  return { '@context': CONTEXT, '@type': 'DefinedTerm', name: t.name, alternateName: [...t.alternateName], description: t.description, url: t.url };
}

export function faqPageLd(faq: readonly { question: string; answer: string }[]) {
  return {
    '@context': CONTEXT,
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
  };
}

export function creativeWorkLd(c: { name: string; description: string; url: string; keywords: readonly string[] }) {
  return { '@context': CONTEXT, '@type': 'CreativeWork', name: c.name, description: c.description, url: c.url, keywords: c.keywords.join(', ') };
}
