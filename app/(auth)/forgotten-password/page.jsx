import Link from "next/link";
import Header from "@/components/Sections/Auth/Header";
import ForgottenPasswordForm from "@/components/Forms/ForgottenPasswordForm";
import { ArrowLeft } from "lucide-react";

const ForgottenPasswordPage = () => {
  return (
    <div className="max-w-[436px] mx-auto space-y-7">
      <Header
        title="FORGOT PASSWORD?"
        desc="Enter your email address to receive a link to reset your password."
      />
      <ForgottenPasswordForm />
      <Link
        href="/admin/signIn"
        className="myFlex gap-2 text-black/70 w-fit mx-auto"
      >
        <ArrowLeft size={16} />
        Back to log in
      </Link>
    </div>
  );
};

export default ForgottenPasswordPage;
