import ProjectForm from "@/components/Forms/ProjectForm";
import Header from "@/components/Sections/Header";

const ProjectActionPage = async ({ params }) => {
  const { action } = await params;
  return (
    <main className="adminContainer">
      <Header
        title={action === "create" ? "Add Project" : "Edit Project"}
      />
      <ProjectForm action={action} />
    </main>
  );
};

export default ProjectActionPage;
