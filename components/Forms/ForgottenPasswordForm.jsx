"use client";

import useFormSubmission from "@/hooks/useFormSubmission";
import { Loader2 } from "lucide-react";
import { Mail } from "lucide-react";
import { useEffect } from "react";

const ForgottenPasswordForm = ({ setEmail }) => {
  const { formData, handleChange, handleSubmit, isLoading, error, success } =
    useFormSubmission({
      endpoint: "/api/auth/forgot-password",
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

  useEffect(() => {
    if (success) {
      setEmail(formData.email);
    }
  }, [success]);

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
        {isLoading && !success ? (
          <div className="w-fit myFlex gap-2">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Resetting password...
          </div>
        ) : isLoading && success ? (
          <div className="w-fit myFlex gap-2">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Resetting password...
          </div>
        ) : (
          <div></div>
        )}
      </button>
    </form>
  );
};

export default ForgottenPasswordForm;
