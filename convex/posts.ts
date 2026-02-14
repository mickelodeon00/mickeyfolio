import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// List posts (with filters)
export const list = query({
  args: {
    status: v.optional(v.string()),
    category: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    let posts = await ctx.db.query("posts").order("desc").collect();

    if (args.status && args.status !== "all") {
      posts = posts.filter(p => p.status === args.status);
    }

    if (args.category && args.category.length > 0 && !args.category.includes("all")) {
      posts = posts.filter(p => p.categories.some(c => args.category!.includes(c)));
    }

    return posts;
  },
});

// Get post by slug (approved only - public)
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .filter((q) => q.eq(q.field("status"), "approved"))
      .unique();
  },
});

// Get post by ID (admin only)
export const getById = query({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    return await ctx.db.get(args.id);
  },
});

// Create post (guest submission)
export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    excerpt: v.optional(v.string()),
    featuredImage: v.optional(v.string()),
    categories: v.array(v.string()),
    slug: v.string(),
    author: v.string(),
    authorEmail: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("posts", {
      ...args,
      status: "pending",
    });
  },
});

// Update post (admin only)
export const update = mutation({
  args: {
    id: v.id("posts"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    featuredImage: v.optional(v.string()),
    categories: v.optional(v.array(v.string())),
    status: v.optional(v.union(
      v.literal("published"),
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("draft")
    )),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

// Approve post (admin only)
export const approve = mutation({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    await ctx.db.patch(args.id, { status: "approved" });
  },
});

// Delete post (admin only)
export const remove = mutation({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    await ctx.db.delete(args.id);
  },
});