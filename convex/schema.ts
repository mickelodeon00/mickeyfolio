import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),      // Clerk's user ID
    email: v.string(),
    name: v.string(),
    bio: v.optional(v.string()),
    avatar: v.optional(v.string()),
  }).index("by_clerk_id", ["clerkId"]),  // Fast lookups


  posts: defineTable({
    title: v.string(),
    slug: v.string(),
    excerpt: v.optional(v.string()),
    content: v.string(),
    categories: v.array(v.string()),
    featuredImage: v.optional(v.string()),  // camelCase
    author: v.optional(v.union(v.string(), v.null())),                      // Guest name
    authorEmail: v.optional(v.union(v.string(), v.null())),
    status: v.union(
      v.literal("published"),
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("draft"),
    ),
    updatedAt: v.optional(v.number()),      // Optional
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"]),


  categories: defineTable({
    slug: v.string(),
    name: v.optional(v.string()),
  }).index("by_slug", ["slug"]),

  messages: defineTable({
    name: v.string(),
    email: v.string(),
    message: v.string(),
  }),

  projects: defineTable({
    title: v.string(),
    imageUrl: v.optional(v.union(v.string(), v.null())),
    description: v.string(),
    content: v.optional(v.union(v.string(), v.null())),
    stack: v.array(v.string()),
    website: v.optional(v.union(v.string(), v.null())),
    githubRepository: v.optional(v.union(v.string(), v.null())),
  }),




});