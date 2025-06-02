import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import PageWrapper from "@/components/layout/page-wrapper";
import FadeInWhenVisible from "@/components/general/fadeIn-when-visible";
import { fadeInUp } from "@/utils/animations";

// Sample project data - in a real app, this would come from Supabase
const projects = [
  {
    id: "1",
    title: "E-commerce Platform",
    description:
      "A full-featured e-commerce platform built with Next.js and Supabase.",
    image: "/placeholder.svg?height=300&width=600",
    tags: ["Next.js", "Supabase", "Tailwind CSS", "TypeScript"],
    github: "https://github.com",
    demo: "https://example.com",
  },
  {
    id: "2",
    title: "Task Management App",
    description:
      "A productivity app for managing tasks and projects with team collaboration features.",
    image: "/placeholder.svg?height=300&width=600",
    tags: ["React", "Firebase", "Redux", "Material UI"],
    github: "https://github.com",
    demo: "https://example.com",
  },
  {
    id: "3",
    title: "Weather Dashboard",
    description:
      "Real-time weather information with interactive maps and forecasts.",
    image: "/placeholder.svg?height=300&width=600",
    tags: ["JavaScript", "OpenWeather API", "Chart.js", "Mapbox"],
    github: "https://github.com",
    demo: "https://example.com",
  },
];

export const metadata = {
  title: "Projects | Micheal",
  description: "Explore my portfolio of web development projects",
};

export default function ProjectsPage() {
  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-24 md:py-32 ">
        <FadeInWhenVisible variants={fadeInUp}>
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Projects</h1>
            <p className="text-xl text-muted-foreground mb-12">
              Here are some of the projects I've worked on. Each one represents
              a unique challenge and learning experience.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <div className="relative h-48 w-full">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <h3 className="text-2xl font-bold">{project.title}</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-4">
                    <Button asChild variant="outline" size="sm">
                      <Link
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="h-4 w-4 mr-2" />
                        Code
                      </Link>
                    </Button>
                    <Button asChild size="sm">
                      <Link
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Live Demo
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </FadeInWhenVisible>
      </div>
    </PageWrapper>
  );
}
