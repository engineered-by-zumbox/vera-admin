"use client";

import { sideNavLinks } from "@/constants";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LogoutDialog = ({ setIsLogout, logout }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      setError("");
      await logout();
    } catch (error) {
      setError("Failed to logout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div
      onClick={() => setIsLogout(false)}
      className="fixed z-[50000] top-0 bottom-0 myFlex justify-center right-0 left-0 bg-black/40"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg p-6 w-[90%] max-w-md"
      >
        <h2 className="text-xl font-semibold mb-4">Confirm Logout</h2>
        <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setIsLogout(false)}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            disabled={isLoading}
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 myFlex justify-center text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
          >
            {isLoading ? (
              <div className="myFlex gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Logging out...
              </div>
            ) : (
              "Logout"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const SideNav = () => {
  const router = useRouter();
  const pathName = usePathname();
  const [isLogout, setIsLogout] = useState(false);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/signIn");
  };

  useEffect(() => {
    if (isLogout) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isLogout]);

  const isActiveLink = (navUrl) => {
    if (navUrl === "/" && pathName === "/") {
      return true;
    }
    if (navUrl !== "/") {
      return pathName.startsWith(navUrl);
    }

    return false;
  };

  return (
    <aside className="w-[320px] py-12 myFlex flex-col justify-between border-r z-[5000] border-r-[#E3E3E3] fixed left-0 top-0 bottom-0">
      <Link href="/">
        <img
          src="/images/vera-logo.png"
          width={200}
          height={40}
          className="h-[40px] object-cover"
          alt="Vera Logo"
        />
      </Link>
      <ul className="grid gap-5">
        {sideNavLinks.map((nav, i) => (
          <li key={i}>
            <Link
              href={nav.url}
              className={cn(
                "myFlex justify-center w-full hover:bg-[#F5EAC8] transition-all duration-300 gap-2 px-4 py-3 rounded-2xl",
                isActiveLink(nav.url) && "bg-[#F5EAC8]"
              )}
            >
              <img src={nav.icon} alt={`${nav.title} icon`} />
              {nav.title}
            </Link>
          </li>
        ))}
      </ul>
      <button onClick={() => setIsLogout(true)} className="myFlex gap-3">
        <LogOut className="rotate-180" />
        Logout
      </button>
      {isLogout && <LogoutDialog setIsLogout={setIsLogout} logout={logout} />}
    </aside>
  );
};

export default SideNav;
