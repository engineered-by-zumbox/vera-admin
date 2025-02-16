import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";

export const useAuth = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [authenticating, setAuthenticating] = useState(true);

  useEffect(() => {
    const authToken = Cookies.get("auth_token");
    console.log(authToken)

    if (!authToken) {
      router.replace(`/signIn?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: authToken }),
        });

        if (!response.ok) throw new Error("Invalid token");

        setAuthenticating(false);
      } catch (error) {
        console.error("Error verifying token:", error);
        router.replace(`/signIn?callbackUrl=${encodeURIComponent(pathname)}`);
      }
    };

    verifyToken();
  }, []);

  return { authenticating };
};
