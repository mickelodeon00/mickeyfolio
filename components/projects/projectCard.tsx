import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Github } from 'lucide-react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProjectCardProps {
  title: string;
  description: string;
  imageUrl: string;
  stack: string[];
  github_repository?: string;
  website?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  imageUrl,
  stack,
  github_repository,
  website
}) => {
  const hasGithub = Boolean(github_repository);
  const hasWebsite = Boolean(website);

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform hover:scale-105"
        />
      </div>

      <CardHeader className="flex-shrink-0">
        <h3 className="text-2xl font-bold">{title}</h3>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <p className="text-muted-foreground mb-4 line-clamp-3 flex-shrink-0">
          {description}
        </p>
        <div className="flex flex-wrap gap-2 mt-auto">
          {stack.map((tech, index) => (
            <Badge key={index} variant="secondary">
              {tech.trim()}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex gap-4 flex-shrink-0 mt-auto">
        {hasGithub ? (
          <Button asChild variant="outline" size="sm">
            <Link
              href={github_repository!}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-4 w-4 mr-2" />
              Code
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled title='not available'>
            <Github className="h-4 w-4 mr-2" />
            Code
          </Button>
        )}

        {hasWebsite ? (
          <Button asChild size="sm">
            <Link
              href={website!}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit Site
            </Link>
          </Button>
        ) : (
          <Button size="sm" disabled title='not available'>
            <ExternalLink className="h-4 w-4 mr-2" />
            Visit Site
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;