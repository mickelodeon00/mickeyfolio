"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { useToast } from "../../hooks/use-toast";
import { Loader2, Eye, Edit, PenSquareIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import Tiptap from "../editor/tiptap";
import Preview from "../editor/preview2";
import MarkdownEditor from "../editor/markdown-editor";
import { createBlogPost } from "@/app/actions/blogpost";

// Types
interface Category {
  id: string;
  name: string;
  slug: string;
}

interface PostEditorProps {
  categories: Category[];
  userId: string;
}

// Zod Schema
const postSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters"),
  excerpt: z
    .string()
    .min(1, "Excerpt is required")
    .min(10, "Excerpt must be at least 10 characters")
    .max(500, "Excerpt must be less than 500 characters"),
  content: z
    .string()
    .min(1, "Content is required")
    .min(50, "Content must be at least 50 characters"),
  featuredImage: z
    .string()
    .optional()
    .refine(
      (url) => {
        if (!url || url.trim() === "") return true;
        try {
          new URL(url);
          return true;
        } catch {
          return false;
        }
      },
      {
        message: "Please enter a valid URL",
      }
    ),
  categories: z
    .array(z.string())
    .min(1, "Please select at least one category")
    .max(5, "You can select up to 5 categories"),
});

type PostFormData = z.infer<typeof postSchema>;

export default function PostEditor({ categories, userId }: PostEditorProps) {
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = React.useState<
    "edit" | "preview" | "markdown"
  >("edit");
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      featuredImage: "",
      categories: [],
    },
    mode: "onChange", // Validate on change for better UX
  });

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isValid },
  } = form;

  // Watch content for live preview
  const watchedContent = watch("content");
  const watchedCategories = watch("categories");

  const handleCategoryToggle = (categoryId: string) => {
    const currentCategories = watchedCategories;
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter((id) => id !== categoryId)
      : [...currentCategories, categoryId];

    setValue("categories", newCategories, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onSubmit = async (data: PostFormData) => {
    startTransition(async () => {
      try {
        // Create a slug from the title
        const slug = data.title
          .toLowerCase()
          .replace(/[^\w\s]/gi, "")
          .replace(/\s+/g, "-");

        const postData = {
          ...data,
          slug,
        };
        const { data: response, error } = await createBlogPost(postData);

        if (error) {
          toast({
            title: "Error",
            description: "Something went wrong",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Success! (Preview Mode)",
          description:
            "Your post would be submitted for approval in production",
        });

        // Reset form and redirect
        // form.reset();
        // router.push("/blog");
        // router.refresh();
      } catch (error) {
        console.error("Error submitting post:", error);
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Something went wrong",
          variant: "destructive",
        });
      }
    });
  };

  const handleContentChange = (newContent: string) => {
    setValue("content", newContent, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create New Post</h1>
        <p className="text-muted-foreground mt-2">
          Share your thoughts with the community
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Title Field */}
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter an engaging title for your post"
                    {...field}
                    className={errors.title ? "border-destructive" : ""}
                  />
                </FormControl>
                <FormDescription>
                  A compelling title helps readers find and engage with your
                  content
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Excerpt Field */}
          <FormField
            control={control}
            name="excerpt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Excerpt *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write a brief summary that will appear in post previews"
                    className={`resize-none ${
                      errors.excerpt ? "border-destructive" : ""
                    }`}
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This appears in search results and post previews (10-500
                  characters)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Featured Image Field */}
          <FormField
            control={control}
            name="featuredImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Featured Image URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com/your-image.jpg"
                    {...field}
                    className={errors.featuredImage ? "border-destructive" : ""}
                  />
                </FormControl>
                <FormDescription>
                  Optional: Add a featured image that represents your post
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Categories Field */}
          <FormField
            control={control}
            name="categories"
            render={() => (
              <FormItem>
                <FormLabel>Categories *</FormLabel>
                <FormDescription>
                  Select relevant categories for your post (1-5 categories)
                </FormDescription>
                <div className="flex flex-wrap gap-2 mt-2">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      type="button"
                      variant={
                        watchedCategories.includes(category.slug)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => handleCategoryToggle(category.slug)}
                      className="transition-all duration-200"
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Content Field with Tabs */}
          <FormField
            control={control}
            name="content"
            render={() => (
              <FormItem>
                <FormLabel>Content *</FormLabel>
                <FormDescription>
                  Write your post content using the rich editor, preview, or
                  markdown
                </FormDescription>
                <FormControl>
                  <Tabs
                    value={activeTab}
                    onValueChange={(value) =>
                      setActiveTab(value as typeof activeTab)
                    }
                    className="w-full"
                  >
                    <TabsList className="grid grid-cols-3 mb-4">
                      <TabsTrigger
                        value="edit"
                        className="flex items-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Rich Editor
                      </TabsTrigger>
                      <TabsTrigger
                        value="preview"
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Preview
                      </TabsTrigger>
                      <TabsTrigger
                        value="markdown"
                        className="flex items-center gap-2"
                      >
                        <PenSquareIcon className="h-4 w-4" />
                        Markdown
                      </TabsTrigger>
                    </TabsList>

                    <div className="border rounded-lg overflow-y-auto ">
                      <TabsContent value="edit" className="m-0 h-[600px] ">
                        <Tiptap
                          content={watchedContent}
                          setContent={handleContentChange}
                        />
                      </TabsContent>

                      <TabsContent value="preview" className="m-0 h-[500px] ">
                        <Preview markdown={watchedContent} />
                      </TabsContent>

                      <TabsContent value="markdown" className="m-0 h-[500px] ">
                        <MarkdownEditor
                          content={watchedContent}
                          setContent={handleContentChange}
                        />
                      </TabsContent>
                    </div>
                  </Tabs>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div className="text-sm text-muted-foreground">
              {!isValid && (
                <span className="text-destructive">
                  Please fix the errors above before submitting
                </span>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={isPending}
              >
                Reset Form
              </Button>

              <Button
                type="submit"
                disabled={isPending || !isValid}
                className="min-w-[140px]"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit for Approval"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

// Export the schema for reuse
export { postSchema, type PostFormData };
