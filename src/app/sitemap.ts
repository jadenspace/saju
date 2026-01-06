import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://sajupalja.vercel.app'

  // 정적 페이지들
  const staticPages = [
    '',
    '/guide',
    '/guide/saju',
    '/guide/sipsin',
    '/guide/ohaeng',
    '/guide/12unsung',
    '/guide/12sinsal',
    '/guide/gongmang',
    '/privacy',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return [...staticPages]
}