// components/blog/ShareButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  Link,
  MessageCircle,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ShareButtonProps {
  title: string;
  url: string;
}

export function ShareButton({ title, url }: ShareButtonProps) {
  const shareOptions = [
    {
      name: "Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        title
      )}&url=${encodeURIComponent(url)}`,
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`,
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url
      )}`,
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      url: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    },
    {
      name: "Reddit",
      icon: Share2,
      url: `https://reddit.com/submit?url=${encodeURIComponent(
        url
      )}&title=${encodeURIComponent(title)}`,
    },
    {
      name: "Telegram",
      icon: Share2,
      url: `https://t.me/share/url?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(title)}`,
    },
  ];

  const handleShare = (platform: string) => {
    const option = shareOptions.find((opt) => opt.name === platform);
    if (option) {
      window.open(option.url, "_blank", "noopener,noreferrer");
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied to clipboard!",
        description: "You can now share this post with others.",
      });
    } catch (error) {
      toast({
        title: "Error copying link",
        description: "Could not copy the link. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {shareOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <DropdownMenuItem
              key={option.name}
              className="cursor-pointer"
              onClick={() => handleShare(option.name)}
            >
              <IconComponent className="h-4 w-4 mr-2" />
              {option.name}
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={handleCopyLink}>
          <Link className="h-4 w-4 mr-2" />
          Copy Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
