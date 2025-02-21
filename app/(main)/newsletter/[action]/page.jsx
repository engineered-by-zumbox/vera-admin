import UploadNewsletterForm from "@/components/Forms/UploadNewsletterForm";
import Header from "@/components/Sections/Header";

const NewsletterActionPage = async ({ params }) => {
  const { action } = await params;

  let id;

  if (action.includes("edit")) {
    id = action.split("-")[1];
  }

  return (
    <main className="adminContainer">
      <Header
        title={action === "create" ? "Upload Newsletter" : "Edit Newsletter"}
      />
      <UploadNewsletterForm action={action} id={id} />
    </main>
  );
};

export default NewsletterActionPage;
