"use server";

import { generateFileName } from "@/lib/utils";
import { createClient } from "@/supabase/server";
import { data } from "autoprefixer";

type BlogPostFormData = {
  title: string;
  content: string;
  excerpt: string;
  categories: string[];
  author_name: string;
  author_email: string;
  featuredImage?: string | undefined;
  slug?: string;
};

type BlogPostStatus = {
  status: "pending" | "published" | "approved" | "rejected" | "draft";
};

type contactMe = {
  name: string;
  email: string;
  message: string;
};


export type SafeResult<T> = [T | null, Error | null];

/**
 * Wrap any async function call and return a tuple: [result, error]
 * @param fn A function that returns a Promise<T>
 */
export async function safe<T>(fn: () => Promise<T>): Promise<SafeResult<T>> {
  try {
    const result = await fn();
    return [result, null];
  } catch (err) {
    return [null, err as Error];
  }
}



// server action
export async function createBlogPost(data: BlogPostFormData) {
  const {
    title,
    content,
    excerpt,
    featuredImage,
    categories,
    slug,
    author_email,
    author_name,
  } = data;
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
          author_email,
          author: author_name,
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
    // console.error("Database error:", error);
    return {
      data: null,
      error: "Failed to create post", // Return plain string
    };
  }
}

export async function getBlogPosts({
  status,
  category,
}: {
  status?: string;
  category?: string[];
}) {
  const supabase = await createClient();

  const query = supabase
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false });

  if (status && status !== "all") query.eq("status", status);
  if (category && category.length > 0 && !category.includes("all"))
    query.contains("categories", category);

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch posts: ${error.message}`);
    // return error
  }

  return data;
}

// This function is not used in the current code, but it can be used to filter posts by status
export async function getBolgPostsByStatus({ status }: BlogPostStatus) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: false });

    if (error) {
      return { data: [], error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    return { data: [], error: "Failed to fetch posts" };
  }
}

export async function getPostBySlug(slug: string) {
  const supabase = await createClient();

  try {
    const { data: post, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("slug", slug)
      .eq("status", "approved") // Assuming you want only approved posts
      .single();

    if (error) {
      return null; // Return null if not found or error
    }

    return post;
  } catch (error) {
    // console.error("Database error:", error);
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
      .eq("status", "approved") // Assuming you want only approved posts
      .contains("categories", categories); // Using contains to match any of the categories

    if (error) {
      // console.error("Supabase error:", error);
      return null;
    }

    return posts;
  } catch (error) {
    // console.error("Database error:", error);
    return null;
  }
}

export async function approvePost(id: string) {
  const supabase = await createClient();
  const { error: postError } = await supabase
    .from("blogs")
    .update({ status: "approved" }) // Update the status to 'approved'
    .eq("id", id);
  if (postError) {
    return { error: postError.message };
  }
  return { error: null }; // Return null if no error
}
export async function deletePost(id: string) {
  const supabase = await createClient();
  const { error: postError } = await supabase
    .from("blogs")
    .delete()
    .eq("id", id);
  if (postError) {
    return { error: postError.message };
  }
  return { error: null }; // Return null if no error
}

export async function getAllCategories() {
  const supabase = await createClient();

  try {
    const { data: categories, error } = await supabase
      .from("categories")
      .select("*");
    if (error) {
      // console.error("Supabase error:", error);
      return [];
    }

    const catSlugs = categories.map((cat) => cat.slug);

    return catSlugs;
  } catch (error) {
    // console.error("Database error:", error);
    return [];
  }
}

export async function contactMe(message: contactMe) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("messages")
    .insert([message])
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message }; // Return plain string, not Error object
  }

  return {
    data,
    error: null,
  };
}


export async function getProjects() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('projects')
    .select('*')

  if (error) {
    throw new Error(`Error fetching Projects`)
  }

  return data
}
async function getPublicImageUrl(imagePath: string) {
  if (!imagePath) return null

  const supabase = await createClient()

  const { data } = supabase.storage
    .from('cloud-bucket') // Replace with your actual bucket name
    .getPublicUrl(imagePath)

  return data.publicUrl
}
export type PojectFormData = {
  id: string; // Assuming formData has an id field
  title: string;
  description: string;
  imageFile?: File; // optional for image upload
  stack: string[]; // comma-separated string
  website?: string;
  github_repository?: string;

};
export type CreateProjectFormData = {
  title: string;
  description: string;
  imageFile?: File; // optional for image upload
  stack: string[]; // comma-separated string
  github_repository?: string;
  website?: string;
};

export async function updateProject(formData: PojectFormData) {
  const supabase = await createClient()

  const { imageFile, description, stack, title, github_repository, website } = formData;

  let imageUrl
  if (imageFile) {
    const { data: fileName } = await uploadImage({ file: imageFile, path: 'project-images' });
    imageUrl = fileName
  }

  const { data, error } = await supabase
    .from('projects')
    .update({
      title,
      description,
      stack,
      ...(imageUrl && { image_url: imageUrl }),
      ...(github_repository && { github_repository }),
      ...(website && { website }),
    })
    .eq('id', formData.id) // Assuming formData has an id field

  if (error) {
    throw new Error(`Error fetching Projects`)
  }

  return data
}
export async function createProject(formData: CreateProjectFormData) {
  const supabase = await createClient()

  const { imageFile, description, stack, title, website, github_repository } = formData;

  let imageUrl
  if (imageFile) {
    const { data: fileName } = await uploadImage({ file: imageFile, path: 'project-images' });
    imageUrl = fileName
  }

  const { data, error } = await supabase
    .from('projects')
    .insert({
      title,
      description,
      stack,
      image_url: imageUrl,
      ...(website && { website }),
      ...(github_repository && { github_repository })
    })

  if (error) {
    throw new Error(`Error fetching Projects`)
  }

  return data
}




export async function uploadImage({ file, path }: {
  file: File;
  path: string;
}) {
  const supabase = await createClient();
  const fileName = generateFileName(file);

  const [bucket, ...pathArray] = path.split('/')
  const pathName = pathArray.length ? pathArray.join('/') : ''


  const { error } = await supabase.storage
    .from(bucket)
    .upload(`${pathName}/${fileName}`, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    return { error, data: null };
  }

  return { data: fileName, error: null }
}


export async function deleteProject(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from('projects')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)

  return { message: 'deleted succesfully' }
}