import { MetadataRoute } from 'next'
import { getBlogPosts } from "@/app/actions/blogpost"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NODE_ENV === 'development' ? process.env.NEXT_PUBLIC_SITE_URL! : 'https://mickeyfolio.vercel.app'

  // Fetch all approved blog posts directly from the database
  const posts = await getBlogPosts({ status: "approved" })

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ]

  const dynamicPages = (posts || []).map((post: { slug: string, updated_at?: string, created_at?: string }) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at || post.created_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...dynamicPages]
}