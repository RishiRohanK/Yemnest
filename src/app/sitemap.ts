import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yemnest.com'

  let productUrls: MetadataRoute.Sitemap = []

  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        createdAt: true,
      },
    });

    productUrls = products.map((product: { id: string; createdAt: Date }) => ({
      url: `${baseUrl}/shop/${product.id}`,
      lastModified: product.createdAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch {
    // DB not reachable at build time — return static pages only
  }

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/collections`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/story`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/journey`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...productUrls,
  ]
}
