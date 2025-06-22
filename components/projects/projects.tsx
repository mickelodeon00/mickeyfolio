"use client"

import React from "react";

import ProjectCard from "./projectCard";
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/app/actions/blogpost";


export default function Projects() {

  const { data: projects = [], isLoading: projectsLoading, error: projectsError } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
    staleTime: 5 * 60 * 1000
  })


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {
        projects.map((project) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            description={project.description}
            github_repository={project.github_repository}
            website={project.website}
            imageUrl={project.image_url ? `/api/images/o/${project.image_url}` : "/placeholder.svg?height=300&width=600"}
            stack={project.stack} />))
      }
    </div>
  );
}

