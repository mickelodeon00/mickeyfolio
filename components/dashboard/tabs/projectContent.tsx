import { deleteProject } from "@/app/actions/blogpost";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { handleMutation } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import CreateProjectForm from "../createProjectForm";
import DialogForm from "../dialogForm";
import ProjectCard from "../projectCard";
import EditProjectForm from "../projectForm";



interface Props {
  projects: any
}

export default function ProjectContent(props: Props) {

  const { projects } = props


  const queryClient = useQueryClient()

  const deleteProjectMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast("Project deleted", {
        description: "The Project has been deleted successfully",
      });
    },
    onError: () => {
      toast("Error", {
        description: "Failed to delete Project",
      });
    },
  })
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
        {
          projects.length === 0 ? (
            <Card className="text-center py-12">
              <CardHeader>
                <CardTitle>No projects yet</CardTitle>
                <CardDescription>
                  You haven't created any projects yet. Start by adding a new project.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button size="lg" >
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Project
                </Button>
              </CardContent>
            </Card>
          ) : (
            projects.map((project: any) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                title={project.title}
                imageUrl={project.image_url}
                description={project.description}
                stack={project.stack}
                onDelete={deleteProjectMutation}
                EditFormComponent={EditProjectForm}
                formInitialValues={{
                  id: project.id,
                  title: project.title,
                  description: project.description,
                  imageUrl: project.image_url,
                  stack: project.stack,
                  website: project?.website,
                  github_repository: project?.github_repository
                }}
              />
            )
            ))
        }

      </div>
    </TabsContent>
  )
}
