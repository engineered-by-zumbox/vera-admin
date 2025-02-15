"use client";

import { Mail, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const SignInForm = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form className="grid gap-4">
      <div className="input !border-[#898989] focus:border-primary flex gap-3">
        <Mail className="fill-myGray text-white" size={28} />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="focus:outline-none w-full placeholder:text-[#898989]"
          placeholder="Email address"
        />
      </div>
      <div className="input !border-[#898989] flex gap-3 justify-between">
        <img src="/images/pword.svg" alt="password icon" />
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter a password"
          className="focus:outline-none w-full placeholder:text-[#898989]"
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="focus:outline-none"
        >
          {showPassword ? (
            <EyeOff className="text-myGray" size={22} />
          ) : (
            <Eye className="text-myGray" size={22} />
          )}
        </button>
      </div>
      <div className="myFlex justify-end">
        <Link
          href="/forgotten-password"
          className="text-sm text-red-500 w-fit text-right hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        className="!rounded-2xl btn mt-3"
      >
        Login
      </button>
    </form>
  );
};

export default SignInForm;
