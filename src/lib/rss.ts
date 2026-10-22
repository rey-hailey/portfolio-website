// WRT-R04: RSS 2.0 피드 문자열 (의존성 없이)
const XML_ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' };

export function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => XML_ESCAPES[c]!);
}

interface FeedItem {
  title: string;
  slug: string;
  publishedAt: Date;
  summary: string;
}

export function rssXml({ title, description, siteUrl, items }: { title: string; description: string; siteUrl: string; items: readonly FeedItem[] }): string {
  const base = siteUrl.replace(/\/$/, '');
  const entries = [...items]
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
    .map((item) => {
      const link = `${base}/writing/${item.slug}`;
      return `<item><title>${escapeXml(item.title)}</title><link>${link}</link><guid isPermaLink="true">${link}</guid><pubDate>${item.publishedAt.toUTCString()}</pubDate><description>${escapeXml(item.summary)}</description></item>`;
    })
    .join('');
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escapeXml(title)}</title><link>${base}/writing</link><description>${escapeXml(description)}</description><language>ko</language>${entries}</channel></rss>`;
}
