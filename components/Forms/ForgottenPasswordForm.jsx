"use client";

import { Mail } from "lucide-react";
import { useState } from "react";

const ForgottenPasswordForm = () => {
  const [email, setEmail] = useState("");
  return (
    <form className="grid gap-4">
      <div className="input !border-[#898989] focus:border-primary flex gap-3">
        <Mail className="fill-myGray text-white" size={28} />
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="focus:outline-none w-full placeholder:text-[#898989]"
          placeholder="Email address"
        />
      </div>
      <button
        type="submit"
        className="bg-primary text-white rounded-2xl h-[48px] mt-3"
      >
        Reset Password
      </button>
    </form>
  );
};

export default ForgottenPasswordForm;
