import Link from "next/link"
import { Github, Twitter, Linkedin } from "lucide-react"

export function SocialLinks() {
  return (
    <div className="flex gap-4">
      <Link
        href="https://github.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-white transition-colors"
      >
        <Github size={20} />
        <span className="sr-only">GitHub</span>
      </Link>
      <Link
        href="https://twitter.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-white transition-colors"
      >
        <Twitter size={20} />
        <span className="sr-only">Twitter</span>
      </Link>
      <Link
        href="https://linkedin.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-white transition-colors"
      >
        <Linkedin size={20} />
        <span className="sr-only">LinkedIn</span>
      </Link>
    </div>
  )
}
