"use client";

import Link from "next/link";
import ContentCard from "@/components/Cards/ContentCard";
import AdminSectionCard from "@/components/Cards/AdminSectionCard";
import Header from "@/components/Sections/Header";
import { useProject } from "@/services/queries";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

const ContentCardSkeleton = () => {
  return (
    <div className="min-w-[432px] p-4 flex gap-7 max-w-[432px] h-[285px] bg-white rounded-3xl border">
      <div className="basis-1/2 h-full">
        <Skeleton className="w-full h-full rounded-3xl !bg-gray-200" />
      </div>
      <div className="basis-1/2 h-full flex flex-col justify-between">
        <div className="grid gap-2">
          <Skeleton className="h-7 w-3/4 !bg-gray-200" />
          <Skeleton className="h-4 w-1/3 !bg-gray-200" />
        </div>
        <div className="space-y-2">
          {" "}
          {/* Description */}
          <Skeleton className="h-4 w-full !bg-gray-200" />
          <Skeleton className="h-4 w-full !bg-gray-200" />
          <Skeleton className="h-4 w-3/4 !bg-gray-200" />
        </div>
        <div className="flex gap-5 justify-end">
          <Skeleton className="h-6 w-12 !bg-gray-200" />
          <Skeleton className="h-6 w-16 !bg-gray-200" />
        </div>
      </div>
    </div>
  );
};

const PrtojectsPage = () => {
  const { data, error, isLoading } = useProject();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProjects = data?.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className="text-red-500 h-dvh myFlex justify-center text-center py-10">
        Failed to load projects. Please try again later.
      </div>
    );
  }
  return (
    <main className="adminContainer">
      <Header title="Content Management" />
      <AdminSectionCard
        title="Recent Projects "
        desc="Manage your latest newsletters here—edit, enhance, and expand your content to deliver an engaging reading experience, or delete entries as needed."
      >
        <div className="mt-10 myFlex gap-5 overflow-x-scroll no-scrollbar">
          {isLoading ? (
            Array(4)
              .fill(0)
              .map((_, i) => <ContentCardSkeleton key={i} />)
          ) : data?.length > 0 ? (
            data
              .slice(0, 5)
              .map((project) => (
                <ContentCard key={project._id} project={project} />
              ))
          ) : (
            <p className="text-center text-gray-500">No projects available.</p>
          )}
        </div>
      </AdminSectionCard>
      <div className="py-9 grid place-items-end max-w-[1016px]">
        <Link href="/projects/create">
          <button className="bg-[#E5C871B2] hover:scale-105 transition-all duration-300 rounded-2xl myFlex shadow-sm p-3 px-5 gap-2 font-semibold">
            Add new <img src="/images/add.svg" alt="add icon" />
          </button>
        </Link>
      </div>
      <AdminSectionCard
        title="All Projects"
        style2={true}
        value={searchTerm}
        setSearchTerm={setSearchTerm}
      >
        <div className="mt-10 grid grid-cols-2 gap-4 gap-y-10">
          {isLoading ? (
            Array(4)
              .fill(0)
              .map((_, i) => <ContentCardSkeleton key={i} />)
          ) : filteredProjects?.length > 0 ? (
            filteredProjects.map((project) => (
              <ContentCard key={project._id} project={project} />
            ))
          ) : (
            <p className="col-span-2 text-center text-gray-500">
              No projects available.
            </p>
          )}
        </div>
      </AdminSectionCard>
    </main>
  );
};

export default PrtojectsPage;
