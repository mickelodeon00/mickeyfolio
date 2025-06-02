import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import PageWrapper from "@/components/layout/page-wrapper"

export default function NotFound() {
  return (
    <PageWrapper>
      <div className="container flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-medium mb-6">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </PageWrapper>
  )
}
