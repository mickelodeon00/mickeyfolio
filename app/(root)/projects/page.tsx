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
import Projects from "@/components/projects/projects";
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/app/actions/blogpost";

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


            <Projects />
          </div>
        </FadeInWhenVisible>
      </div>
    </PageWrapper>
  );
}
