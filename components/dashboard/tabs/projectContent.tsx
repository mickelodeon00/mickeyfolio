'use client'

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import DialogForm from "../dialogForm"
import CreateProjectForm from "../createProjectForm"
import ProjectCard from "../projectCard"

export default function ProjectContent() {
  const projects = useQuery(api.projects.list) ?? []

  if (projects === undefined) return <div>Loading...</div>

  return (
    <TabsContent value="projects" className="space-y-4">
      <DialogForm
        trigger={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        }
        form={<CreateProjectForm />}
        title="Add new Project"
        width="max-w-xl"
      />

      <div className="flex flex-col gap-4">
        {projects.length === 0 ? (
          <Card className="text-center py-12">
            <CardHeader>
              <CardTitle>No projects yet</CardTitle>
              <CardDescription>
                You haven't created any projects yet. Start by adding a new project.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg">
                <Plus className="mr-2 h-4 w-4" />
                Create New Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))
        )}
      </div>
    </TabsContent>
  )
}