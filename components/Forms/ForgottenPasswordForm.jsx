"use client";

import useFormSubmission from "@/hooks/useFormSubmission";
import { Loader2 } from "lucide-react";
import { Mail } from "lucide-react";
import { useEffect } from "react";

const ForgottenPasswordForm = ({ setEmail, email }) => {
  const { formData, handleChange, handleSubmit, isLoading, error, success } =
    useFormSubmission({
      endpoint: email
        ? "/api/auth/resend-reset-email"
        : "/api/auth/forgot-password",
      defaultValues: {
        email: "",
      },
      validate: (formData) => {
        // Email validation
        if (!formData.email) {
          return "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          return "Please enter a valid email address";
        }
        return null;
      },
    });

  const buttonText =
    success || email
      ? isLoading
        ? "Resending..."
        : "Resend Email"
      : isLoading
      ? "Resetting..."
      : "Reset Password";

  useEffect(() => {
    if (success) {
      setEmail(formData.email);
    }
  }, [success, formData.email, setEmail]);

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      {error && <p className="text-red-500 mb-1 text-center">{error}</p>}
      {!success && (
        <div className="input !border-[#898989] focus:border-primary flex gap-3">
          <Mail className="fill-myGray text-white" size={28} />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="focus:outline-none w-full placeholder:text-[#898989]"
            placeholder="Email address"
            disabled={isLoading}
          />
        </div>
      )}
      <button
        type="submit"
        className="!rounded-2xl btn mt-3 myFlex justify-center"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="w-fit myFlex gap-2">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            {buttonText}
          </div>
        ) : (
          buttonText
        )}
      </button>
    </form>
  );
};

export default ForgottenPasswordForm;
