"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Mail, Eye, EyeOff, Loader2 } from "lucide-react";
import useFormSubmission from "@/hooks/useFormSubmission";
import { useRouter, useSearchParams } from "next/navigation";

const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [callbackUrl, setCallbackUrl] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const validateForm = (data) => {
    const errors = {
      email: "",
      password: "",
    };

    // Email validation
    if (!data.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!data.password) {
      errors.password = "Password is required";
    } else if (data.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFormErrors(errors);
    return Object.values(errors).every((error) => error === "")
      ? null
      : "Please fix the form errors";
  };

  const { formData, handleChange, handleSubmit, success, isLoading, error } =
    useFormSubmission({
      endpoint: "/api/auth/login",
      defaultValues: {
        email: "",
        password: "",
      },
      validate: validateForm,
    });

  useEffect(() => {
    const callback = searchParams.get("callbackUrl");
    if (callback) {
      setCallbackUrl(callback);
    }
  }, [searchParams]);

  useEffect(() => {
    if (success) {
      router.push(callbackUrl || "/");
    }
  }, [success]);

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 w-full max-w-md">
      {error && <p className="text-red-500 mb-1 text-center">{error}</p>}
      <div className="space-y-4">
        {/* Email Input */}
        <div className="space-y-2">
          <div className="relative">
            <div className="input !border-[#898989] focus-within:border-primary flex gap-3 transition-colors">
              <Mail className="fill-myGray text-white shrink-0" size={28} />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="focus:outline-none w-full placeholder:text-[#898989]"
                placeholder="Email address"
                aria-label="Email address"
                aria-invalid={!!formErrors.email}
                aria-describedby={formErrors.email ? "email-error" : undefined}
                disabled={isLoading}
              />
            </div>
          </div>
          {formErrors.email && (
            <p id="email-error" className="text-sm text-red-500 mt-1">
              {formErrors.email}
            </p>
          )}
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <div className="input !border-[#898989] flex gap-3 justify-between focus-within:border-primary transition-colors">
            <img src="/images/pword.svg" alt="" className="shrink-0" />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter a password"
              className="focus:outline-none w-full placeholder:text-[#898989]"
              aria-label="Password"
              aria-invalid={!!formErrors.password}
              aria-describedby={
                formErrors.password ? "password-error" : undefined
              }
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="focus:outline-none hover:text-gray-700 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="text-myGray" size={22} />
              ) : (
                <Eye className="text-myGray" size={22} />
              )}
            </button>
          </div>
          {formErrors.password && (
            <p id="password-error" className="text-sm text-red-500 mt-1">
              {formErrors.password}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Link
          href="/forgotten-password"
          className="text-sm text-red-500 hover:underline focus:outline-none"
        >
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        className="!rounded-2xl btn mt-3 myFlex justify-center"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="w-fit myFlex gap-2">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Signing in...
          </div>
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
};

export default SignInForm;
