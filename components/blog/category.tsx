"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import BlogPostCard from "@/components/blog/blog-post-card2";
import { removeSpecialChars } from "@/lib/utils";
import { getBlogPosts } from "@/app/actions/blogpost";
import { CustomBadge } from "./custom-badge";
import Masonry from "react-masonry-css";

type Props = {
  categories: string[];
};

export default function BlogCategoryClient({
  categories: availableCats,
}: Props) {
  const categories = ["all", ...availableCats];
  const [selected, setSelected] = useState<string>("all");

  const {
    data: posts,
    isLoading,
    isError,
    status,
  } = useQuery({
    queryKey: ["posts-by-category", selected],
    queryFn: async () => {
      const res = await getBlogPosts({
        category: [selected],
        status: "approved",
      });
      return res;
    },
    enabled: !!selected,
    // placeholderData: keepPreviousData,
  });

  const loadingCat = isLoading ? selected : null;

  const breakpointColumnsObj = {
    default: 3,
    1024: 2,
    640: 1,
  };

  return (
    <div>
      <div className="flex gap-2 flex-wrap mb-6">
        {categories.map((cat) => (
          <CustomBadge
            key={cat}
            label={removeSpecialChars(cat)}
            active={selected === cat}
            loading={loadingCat === cat}
            onClick={() => {
              setSelected(cat);
            }}
          />
        ))}
      </div>

      {isLoading && <p>Loading posts...</p>}
      {status === "pending" && <p>Pending posts...</p>}
      {isError && <p>Failed to load posts.</p>}
      {!isLoading && posts?.length === 0 && (
        <p>No posts found for this category.</p>
      )}

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex -ml-4 w-auto"
        columnClassName="pl-4 space-y-4"
      >
        {posts?.map((post, index) => (
          <div key={index}>
            <BlogPostCard post={post} index={index} />
          </div>
        ))}
      </Masonry>
    </div>
  );
}
