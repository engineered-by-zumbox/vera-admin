"use client";

import Link from "next/link";
import AdminSectionCard from "@/components/Cards/AdminSectionCard";
import NewsletterCard from "@/components/Cards/NewsletterCard";
import Header from "@/components/Sections/Header";
import { useNewsletter } from "@/services/queries";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const NewsletterCardSkeleton = () => {
  return (
    <div className="max-w-[300px] min-w-[300px] bg-white min-h-[381px] rounded-3xl p-4">
      <Skeleton className="w-full h-[123px] rounded-3xl" />
      <div className="mt-7 mb-5 grid gap-2">
        <Skeleton className="w-3/4 h-6" />
        <Skeleton className="w-1/3 h-4" />
      </div>
      <Skeleton className="h-12 w-full" />
      <div className="mt-4 flex gap-5 justify-end">
        <Skeleton className="w-12 h-6" />
        <Skeleton className="w-12 h-6" />
      </div>
    </div>
  );
};

const AdminNewsLetter = () => {
  const { data, error, isLoading } = useNewsletter();
  console.log(data);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredNewsletter = data?.filter((newsletter) =>
    newsletter.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className="text-red-500 h-dvh myFlex justify-center text-center py-10">
        Failed to load newsletters. Please try again later.
      </div>
    );
  }
  return (
    <main className="adminContainer">
      <Header title="Newsletter Management" />
      <AdminSectionCard
        title="Recent Newsletters"
        desc="Manage your latest newsletters here—edit, enhance, and expand your content to deliver an engaging reading experience, or delete entries as needed."
      >
        <div className="mt-10 myFlex gap-5 overflow-x-scroll no-scrollbar">
          {isLoading ? (
            Array(4)
              .fill(0)
              .map((_, i) => <NewsletterCardSkeleton key={i} />)
          ) : data?.length > 0 ? (
            data
              .slice(0, 5)
              .map((newsletter) => (
                <NewsletterCard key={newsletter._id} newsletter={newsletter} />
              ))
          ) : (
            <p className="text-center text-gray-500">
              No newsletter available.
            </p>
          )}
        </div>
      </AdminSectionCard>
      <div className="py-9 grid place-items-end max-w-[1016px]">
        <Link
          href="/newsletter/create"
          className="fixed bottom-7 right-7 z-[4000]"
        >
          <button className="bg-[#E5C871B2] hover:scale-105 transition-all duration-300 rounded-2xl myFlex shadow-sm p-3 px-5 gap-2 font-semibold">
            Add new <img src="/images/add.svg" alt="add icon" />
          </button>
        </Link>
      </div>
      <AdminSectionCard
        title="All Newsletters"
        style2={true}
        value={searchTerm}
        setSearchTerm={setSearchTerm}
      >
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-3 gap-4 gap-y-10">
          {isLoading ? (
            Array(4)
              .fill(0)
              .map((_, i) => <NewsletterCardSkeleton key={i} />)
          ) : filteredNewsletter?.length > 0 ? (
            filteredNewsletter.map((newsletter) => (
              <NewsletterCard key={newsletter._id} newsletter={newsletter} />
            ))
          ) : (
            <p className="col-span-2 text-center text-gray-500">
              No newsletter available.
            </p>
          )}
        </div>
      </AdminSectionCard>
    </main>
  );
};

export default AdminNewsLetter;
