"use client";

import { sideNavLinks } from "@/constants";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SideNav = () => {
  const pathName = usePathname();

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
      <button className="myFlex gap-3">
        <LogOut className="rotate-180" />
        Logout
      </button>
    </aside>
  );
};

export default SideNav;
