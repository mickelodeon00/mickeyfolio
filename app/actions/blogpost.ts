"use server";

import { createClient } from "@/supabase/server";

type BlogPostFormData = {
  title: string;
  content: string;
  excerpt: string;
  categories: string[];
  featuredImage?: string | undefined;
  slug?: string;
};

// server action
export async function createBlogPost(data: BlogPostFormData) {
  const { title, content, excerpt, featuredImage, categories, slug } = data;
  const supabase = await createClient();

  try {
    const { data: result, error } = await supabase
      .from("blogs")
      .insert([
        {
          title,
          content,
          excerpt,
          featured_image: featuredImage,
          categories,
          slug,
        },
      ])
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message }; // Return plain string, not Error object
    }

    return {
      data: {
        id: result.id,
        title: result.title,
        slug: result.slug,
      },
      error: null,
    };
  } catch (error) {
    console.error("Database error:", error);
    return {
      data: null,
      error: "Failed to create post", // Return plain string
    };
  }
}

export async function getBlogPosts() {
  const supabase = await createClient();

  try {
    const { data: posts, error } = await supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return { data: [], error: error.message }; // Return plain string, not Error object
    }

    return { data: posts, error: null };
  } catch (error) {
    console.error("Database error:", error);
    return { data: [], error: "Failed to fetch posts" }; // Return plain string
  }
}

export async function getPostBySlug(slug: string) {
  const supabase = await createClient();

  try {
    const { data: post, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      return null; // Return null if not found or error
    }

    return post;
  } catch (error) {
    console.error("Database error:", error);
    return null; // Return null on error
  }
}

export async function getPostsByCategory(categories: string[]) {
  const supabase = await createClient();

  try {
    // This query will find posts where the categories array contains ANY of the provided categories
    const { data: posts, error } = await supabase
      .from("blogs")
      .select("*")
      .contains("categories", categories); // Using contains to match any of the categories

    if (error) {
      console.error("Supabase error:", error);
      return null;
    }

    return posts;
  } catch (error) {
    console.error("Database error:", error);
    return null;
  }
}

export async function getAllCategories() {
  const supabase = await createClient();

  try {
    const { data: categories, error } = await supabase
      .from("categories")
      .select("*");
    if (error) {
      console.error("Supabase error:", error);
      return [];
    }

    const catSlugs = categories.map((cat) => cat.slug);

    // console.log("slugdd:", { catSlugs, error });
    return categories;
  } catch (error) {
    console.error("Database error:", error);
    return [];
  }
}
