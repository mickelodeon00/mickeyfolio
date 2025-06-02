// components/blog/ShareButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ShareButtonProps {
  title: string;
  url: string;
}

export function ShareButton({ title, url }: ShareButtonProps) {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: title,
          url: url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link copied to clipboard!",
          description: "You can now share this post with others.",
        });
      }
    } catch (error) {
      toast({
        title: "Error sharing",
        description: "Could not share the post. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleShare}>
      <Share2 className="h-4 w-4 mr-2" />
      Share
    </Button>
  );
}
