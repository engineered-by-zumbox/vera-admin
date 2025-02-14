"use client";

import Link from "next/link";
import ContentCard from "@/components/Cards/ContentCard";
import AdminSectionCard from "@/components/Cards/AdminSectionCard";
import Header from "@/components/Sections/Header";

const PrtojectsPage = () => {
  return (
    <main className="adminContainer">
      <Header title="Content Management" />
      <AdminSectionCard
        title="Recent Projects "
        desc="Manage your latest newsletters here—edit, enhance, and expand your content to deliver an engaging reading experience, or delete entries as needed."
      >
        <div className="mt-10 myFlex gap-5 overflow-x-scroll no-scrollbar">
          {[0, 0, 0, 0].map((_, i) => (
            <ContentCard key={i} />
          ))}
        </div>
      </AdminSectionCard>
      <div className="py-9 grid place-items-end max-w-[1016px]">
        <Link href="/projects/create">
          <button className="bg-[#E5C871B2] hover:scale-105 transition-all duration-300 rounded-2xl myFlex shadow-sm p-3 px-5 gap-2 font-semibold">
            Add new <img src="/images/add.svg" alt="add icon" />
          </button>
        </Link>
      </div>
      <AdminSectionCard title="All Projects" style2={true}>
        <div className="mt-10 grid grid-cols-2 gap-4 gap-y-10">
          {[0, 0, 0, 0].map((_, i) => (
            <ContentCard key={i} />
          ))}
        </div>
      </AdminSectionCard>
    </main>
  );
};

export default PrtojectsPage;
