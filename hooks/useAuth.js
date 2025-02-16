import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export const useAuth = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [authenticating, setAuthenticating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch("/api/auth/verify", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("Auth verification failed:", data);
          throw new Error(data.error);
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth error:", error);
        // Add a small delay before redirect to ensure console logs are visible
        setTimeout(() => {
          router.replace(`/signIn?callbackUrl=${encodeURIComponent(pathname)}`);
        }, 100);
      } finally {
        setAuthenticating(false);
      }
    };

    verifyAuth();
  }, [pathname, router]);

  return { authenticating, isAuthenticated };
};
