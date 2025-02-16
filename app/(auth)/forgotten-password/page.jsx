"use client";

import Link from "next/link";
import Header from "@/components/Sections/Auth/Header";
import ForgottenPasswordForm from "@/components/Forms/ForgottenPasswordForm";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

const ForgottenPasswordPage = () => {
  const [email, setEmail] = useState("");
  return (
    <div className="max-w-[436px] mx-auto space-y-7">
      <Header
        title="FORGOT PASSWORD?"
        desc={
          email
            ? `We have sent an email to ${email} If this email exists, you'll receive a reset link shortly`
            : "Enter your email address to receive a link to reset your password."
        }
      />
      <ForgottenPasswordForm setEmail={setEmail} />
      <Link
        href="/signIn"
        className="myFlex gap-2 hover:underline text-black/70 w-fit mx-auto"
      >
        <ArrowLeft size={16} />
        Back to log in
      </Link>
    </div>
  );
};

export default ForgottenPasswordPage;
