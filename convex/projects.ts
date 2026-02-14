import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// List all projects (public)
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("projects").order("desc").collect();
  },
});

// Get project by ID
export const getById = query({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create project (admin only)
export const create = mutation({
  args: {
    title: v.string(),
    imageUrl: v.optional(v.union(v.string(), v.null())),
    description: v.string(),
    content: v.optional(v.union(v.string(), v.null())),
    stack: v.array(v.string()),
    website: v.optional(v.union(v.string(), v.null())),
    githubRepository: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    return await ctx.db.insert("projects", args);
  },
});

// Update project (admin only)
export const update = mutation({
  args: {
    id: v.id("projects"),
    title: v.optional(v.string()),
    imageUrl: v.optional(v.union(v.string(), v.null())),
    description: v.optional(v.string()),
    content: v.optional(v.union(v.string(), v.null())),
    stack: v.optional(v.array(v.string())),
    website: v.optional(v.union(v.string(), v.null())),
    githubRepository: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

// Delete project (admin only)
export const remove = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    await ctx.db.delete(args.id);
  },
});