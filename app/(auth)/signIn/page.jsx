import SignInForm from "@/components/Forms/SignInForm";
import Header from "@/components/Sections/Auth/Header";

const SignInPage = () => {
  return (
    <div className="max-w-[436px] mx-auto space-y-7">
      <Header
        title="SIGN IN TO YOUR ACCOUNT"
        desc="Log in now to efficiently manage your website with our powerful tools!"
      />
      <SignInForm />
    </div>
  );
};

export default SignInPage;
