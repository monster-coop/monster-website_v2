import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  
  // Base URL - you should update this to your actual domain
  const baseUrl = 'https://monstercoop.co.kr'
  
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/programs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/history`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/refund`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  try {
    // Fetch all active programs for dynamic routes
    const { data: programs, error } = await supabase
      .from('programs')
      .select('slug, updated_at, created_at')
      .eq('is_active', true)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching programs for sitemap:', error)
      return staticRoutes
    }

    // Dynamic program routes
    const programRoutes: MetadataRoute.Sitemap = programs.map((program) => ({
      url: `${baseUrl}/programs/${program.slug}`,
      lastModified: new Date(program.updated_at || program.created_at || new Date().toISOString()),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    return [...staticRoutes, ...programRoutes]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticRoutes
  }
}