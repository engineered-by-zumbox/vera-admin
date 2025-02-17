"use client";

import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const ResetPasswordForm = ({ token }) => {
  const router = useRouter();
  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false,
  });

  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user types
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { newPassword: "", confirmPassword: "" };

    if (form.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters long";
      isValid = false;
    }

    if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/set-new-password`,
        {
          method: "POST",
          body: JSON.stringify({
            resetToken: token,
            newPassword: form.newPassword,
            confirmPassword: form.confirmPassword,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        alert(errorData?.error || "Failed to submit form");
      }

      toast.success("Password Reset");
      router.push("/signIn");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="relative">
        <div className="input !border-[#898989] flex gap-3 justify-between">
          <img src="/images/pword.svg" alt="password icon" />
          <input
            type={showPassword.new ? "text" : "password"}
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            placeholder="Enter a new password"
            className="focus:outline-none w-full placeholder:text-[#898989]"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility("new")}
            className="focus:outline-none"
          >
            {showPassword.new ? (
              <EyeOff className="text-myGray" size={22} />
            ) : (
              <Eye className="text-myGray" size={22} />
            )}
          </button>
        </div>
        {errors.newPassword && (
          <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
        )}
      </div>

      <div className="relative">
        <div className="input !border-[#898989] flex gap-3 justify-between">
          <img src="/images/pword.svg" alt="password icon" />
          <input
            type={showPassword.confirm ? "text" : "password"}
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm password"
            className="focus:outline-none w-full placeholder:text-[#898989]"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility("confirm")}
            className="focus:outline-none"
          >
            {showPassword.confirm ? (
              <EyeOff className="text-myGray" size={22} />
            ) : (
              <Eye className="text-myGray" size={22} />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="bg-primary text-white rounded-2xl h-[48px] mt-3"
      >
        {isLoading ? "Resetting" : "Reset password"}
      </button>
    </form>
  );
};

export default ResetPasswordForm;
