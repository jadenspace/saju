import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const baseUrl = "https://sajupalja.vercel.app";

  const staticPages = [
    { route: "", priority: 1.0 },
    { route: "/guide", priority: 0.9 },
    // 학습 흐름 순서: 기본 개념 → 관계/시간 → 핵심 → 심화
    // 1. 기본 개념 (글자와 속성)
    { route: "/guide/saju", priority: 0.8 },
    { route: "/guide/chungan", priority: 0.8 },
    { route: "/guide/jiji", priority: 0.8 },
    { route: "/guide/ohaeng", priority: 0.8 },
    { route: "/guide/ilgan", priority: 0.8 },
    // 2. 관계와 시간
    { route: "/guide/sipsin", priority: 0.8 },
    { route: "/guide/daeun", priority: 0.8 },
    { route: "/guide/seun", priority: 0.8 },
    // 3. 핵심
    { route: "/guide/yongsin", priority: 0.8 },
    // 4. 심화 개념
    { route: "/guide/12unsung", priority: 0.7 },
    { route: "/guide/12sinsal", priority: 0.7 },
    { route: "/guide/gongmang", priority: 0.7 },
    // 필수 페이지
    { route: "/privacy", priority: 0.3 },
    { route: "/contact", priority: 0.5 },
  ].map(({ route, priority }) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority,
  }));

  return staticPages;
}
