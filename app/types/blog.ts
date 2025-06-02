export interface BlogCategory {
  id: string
  name: string
  slug: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featured_image?: string
  author_id: string
  published: boolean
  created_at: string
  updated_at: string
  post_categories: {
    categories: BlogCategory
  }[]
}

export interface BlogFormData {
  title: string
  content: string
  excerpt: string
  featured_image?: string
  categories: string[]
}
