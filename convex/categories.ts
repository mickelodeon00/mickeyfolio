import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// List all categories
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("categories").collect();
  },
});

// Get slugs only
export const getSlugs = query({
  handler: async (ctx) => {
    const categories = await ctx.db.query("categories").collect();
    return categories.map(c => c.slug);
  },
});

// Create category (admin only)
export const create = mutation({
  args: {
    slug: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    return await ctx.db.insert("categories", args);
  },
});

// Delete category (admin only)
export const remove = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    await ctx.db.delete(args.id);
  },
});