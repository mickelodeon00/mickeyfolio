import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Github } from 'lucide-react'
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Doc } from '@/convex/_generated/dataModel'

interface ProjectCardProps {
  project: Doc<"projects">
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const hasGithub = Boolean(project.githubRepository)
  const hasWebsite = Boolean(project.website)


  return (
    <Card className="overflow-hidden flex flex-col h-full">
      {project.imageUrl && (
        <div className="relative h-48 w-full">
          <Image
            // src={project.imageUrl ? `/api/images/o/${project.imageUrl}` : "/placeholder.svg"}
            src={project.imageUrl ? `${project.imageUrl}` : "/placeholder.svg"}
            alt={project.title}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
        </div>
      )}

      <CardHeader className="flex-shrink-0">
        <h3 className="text-2xl font-bold">{project.title}</h3>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <p className="text-muted-foreground mb-4 line-clamp-3 flex-shrink-0">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-auto">
          {project.stack.map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech.trim()}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex gap-4 flex-shrink-0 mt-auto">
        {hasGithub ? (
          <Button asChild variant="outline" size="sm">
            <Link
              href={project.githubRepository!}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-4 w-4 mr-2" />
              Code
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled title="not available">
            <Github className="h-4 w-4 mr-2" />
            Code
          </Button>
        )}

        {hasWebsite ? (
          <Button asChild size="sm">
            <Link
              href={project.website!}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit Site
            </Link>
          </Button>
        ) : (
          <Button size="sm" disabled title="not available">
            <ExternalLink className="h-4 w-4 mr-2" />
            Visit Site
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export default ProjectCard