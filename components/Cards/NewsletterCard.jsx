import { useFormatDate } from "@/hooks/useFormatDate";
import { useDeleteNewsletter } from "@/services/mutation";
import { Loader2, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useToggleNewsletterActive = () => {
  const toggleActive = async ({ id }) => {
    try {
      const response = await fetch("/api/newsletter-campaigns/activate", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",

        },
        body: JSON.stringify({ campaignId: id }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  };

  return {
    trigger: toggleActive,
  };
};

const DeleteDialog = ({ setIsDelete, newsletterId }) => {
  const { trigger, isMutating, error } = useDeleteNewsletter();

  const handleRequestDelete = async () => {
    try {
      await trigger({
        id: newsletterId,
      });
      setIsDelete(false);
      toast.success("Newsletter deleted");
    } catch (error) {
      alert("Failed to update request. Please try again.");
      console.error("Error during optimistic update:", error);
    }
  };

  return (
    <div
      onClick={() => setIsDelete(false)}
      className="fixed z-[50000] top-0 bottom-0 myFlex justify-center right-0 left-0 bg-black/40"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg p-6 w-[90%] max-w-md"
      >
        <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this project?
        </p>
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setIsDelete(false)}
            disabled={isMutating}
            className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            disabled={isMutating}
            onClick={handleRequestDelete}
            className="px-4 py-2 bg-red-500 myFlex justify-center text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
          >
            {isMutating ? (
              <div className="myFlex gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </div>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const NewsletterCard = ({ newsletter }) => {
  const [isDelete, setIsDelete] = useState(false);
  const [isActive, setIsActive] = useState(newsletter.isActive);
  const [isToggling, setIsToggling] = useState(false);
  const { trigger: toggleActive } = useToggleNewsletterActive();

  const handleToggleActive = async () => {
    try {
      setIsToggling(true);
      const newState = !isActive;
      await toggleActive({
        id: newsletter._id,
      });
      setIsActive(newState);
      toast.success(
        newState ? "Newsletter activated" : "Newsletter deactivated"
      );
    } catch (error) {
      toast.error("Failed to update newsletter status");
      console.error("Error toggling active status:", error);
    } finally {
      setIsToggling(false);
    }
  };

  useEffect(() => {
    if (isDelete) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isDelete]);

  return (
    <div className="relative flex-shrink-0 max-w-[303px] bg-white min-h-[381px] rounded-3xl p-4">
      <Image
        width={300}
        height={123}
        src={newsletter.imageUrl}
        alt="project"
        className="w-full h-[123px] rounded-3xl object-cover"
      />
      <div className="mt-7 mb-5 grid gap-2">
        <h3 className="text-xl font-semibold line-clamp-2">
          {newsletter.title}
        </h3>
        <p className="text-myGray">
          {useFormatDate(newsletter?.createdAt, { type: "monthDay" })}
        </p>
      </div>
      <p className="line-clamp-2">{newsletter.message}</p>

      {/* Status indicator */}
      <div className="absolute top-4 right-4 bg-white rounded-full shadow px-2 py-1 text-xs font-medium">
        {isActive ? (
          <span className="text-green-600 flex items-center">
            <Check className="w-3 h-3 mr-1" />
            Active
          </span>
        ) : (
          <span className="text-gray-500">Inactive</span>
        )}
      </div>

      {/* Action buttons */}
      <div className="mt-4 myFlex gap-3 right-4 absolute bottom-4">
        <button
          className={`text-sm font-semibold ${
            isActive ? "text-amber-600" : "text-emerald-600"
          }`}
          onClick={handleToggleActive}
          disabled={isToggling}
        >
          {isToggling ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isActive ? (
            "Deactivate"
          ) : (
            "Activate"
          )}
        </button>
        <Link
          href={`/newsletter/edit-${newsletter._id}`}
          className="text-[#9E8437] font-semibold"
        >
          Edit
        </Link>
        <button
          className="text-[#CD3D3D] font-semibold"
          onClick={() => setIsDelete(true)}
        >
          Delete
        </button>
      </div>

      {isDelete && (
        <DeleteDialog setIsDelete={setIsDelete} newsletterId={newsletter._id} />
      )}
    </div>
  );
};

export default NewsletterCard;
