import UploadNewsletterForm from "@/components/Forms/UploadNewsletterForm";
import Header from "@/components/Sections/Header";

const NewsletterActionPage = async ({ params }) => {
  const { action } = await params;
  return (
    <main className="adminContainer">
      <Header
        title={action === "create" ? "Upload Newsletter" : "Edit Newsletter"}
      />
      <UploadNewsletterForm action={action} />
    </main>
  );
};

export default NewsletterActionPage;
