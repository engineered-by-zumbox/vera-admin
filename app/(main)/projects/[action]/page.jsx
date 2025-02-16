import ProjectForm from "@/components/Forms/ProjectForm";
import Header from "@/components/Sections/Header";

const ProjectActionPage = async ({ params }) => {
  const { action } = await params;

  let id;

  if (action.includes("edit")) {
    id = action.split("-")[1];
  }

  return (
    <main className="adminContainer">
      <Header title={action === "create" ? "Add Project" : "Edit Project"} />
      <ProjectForm action={action} id={id} />
    </main>
  );
};

export default ProjectActionPage;
