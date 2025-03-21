import ResetPasswordForm from "@/components/Forms/ResetPasswordForm";
import Header from "@/components/Sections/Auth/Header";

const ResetPasswordPage = async ({ searchParams }) => {
  const { token } = await searchParams;
  return (
    <div className="max-w-[436px] mx-auto space-y-7">
      <Header
        title="RESET PASSWORD?"
        desc="Choose a password that's easy for you to remember so you can easily log back into your account."
      />
      <ResetPasswordForm token={token} />
    </div>
  );
};

export default ResetPasswordPage;
