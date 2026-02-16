"use client"

import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import BlogPostCard from "@/components/blog/blog-post-card2"
import { removeSpecialChars } from "@/lib/utils"
import { CustomBadge } from "./custom-badge"
import Masonry from "react-masonry-css"

export default function BlogCategoryClient() {
  const [selected, setSelected] = useState<string>("all")
  const [isSwitching, setIsSwitching] = useState(false)

  // Fetch all categories
  const allCategories = useQuery(api.categories.getSlugs) ?? []
  const categories = ["all", ...allCategories]

  // Fetch posts based on selected category
  const posts = useQuery(
    api.posts.list,
    selected === "all"
      ? { status: "approved" }
      : { status: "approved", category: [selected] }
  ) ?? []

  const isLoading = posts === undefined || allCategories === undefined

  const handleCategoryChange = (cat: string) => {
    setIsSwitching(true)
    setSelected(cat)
    // Reset after Convex loads new data
    setTimeout(() => setIsSwitching(false), 300)
  }

  const breakpointColumnsObj = {
    default: 3,
    1024: 2,
    640: 1,
  }

  return (
    <div>
      {/* Category Filter Tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {categories.map((cat) => (
          <CustomBadge
            key={cat}
            label={removeSpecialChars(cat)}
            active={selected === cat}
            loading={isSwitching && selected === cat}
            onClick={() => handleCategoryChange(cat)}
          />
        ))}
      </div>

      {/* Loading State */}
      {isLoading && <p>Loading posts...</p>}

      {/* Empty State */}
      {!isLoading && posts.length === 0 && (
        <p>No posts found for this category.</p>
      )}

      {/* Masonry Grid */}
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex -ml-4 w-auto"
        columnClassName="pl-4 space-y-4"
      >
        {posts.map((post, index) => (
          <div key={post._id}>
            <BlogPostCard post={post} index={index} />
          </div>
        ))}
      </Masonry>
    </div>
  )
}