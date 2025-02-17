import { useFormatDate } from "@/hooks/useFormatDate";
import { useDeleteProject } from "@/services/mutation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const DeleteDialog = ({ setIsDelete, projectId }) => {
  const { trigger, isMutating, error } = useDeleteProject();

  const handleRequestDelete = async () => {
    try {
      await trigger({
        id: projectId,
      });
      setIsDelete(false);
      toast.success("Project deleted");
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

const ContentCard = ({ project }) => {
  const [isDelete, setIsDelete] = useState(false);

  const handleDelete = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/signIn");
  };

  useEffect(() => {
    if (isDelete) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isDelete]);
  return (
    <div className="min-w-[432px] p-4 myFlex gap-7 max-w-[432px] h-[285px] bg-white rounded-3xl">
      <div className="basis-1/2 h-full">
        <img
          src={project?.images[0]?.url}
          alt="interiot image"
          className="w-full h-full object-cover rounded-3xl"
        />
      </div>
      <div className="basis-1/2 h-full flex flex-col justify-between">
        <div className="grid gap-2">
          <h3 className="text-xl font-semibold">{project?.name}</h3>
          <p className="text-myGray">
            {useFormatDate(project?.createdAt, { type: "monthDay" })}
          </p>
        </div>
        <p className="line-clamp-5">{project?.description}</p>
        <div className="myFlex gap-5 justify-end">
          <Link
            href={`/projects/edit-${project._id}`}
            className="text-[#9E8437] font-semibold"
          >
            Edit
          </Link>
          <button
            onClick={() => setIsDelete(true)}
            className="text-[#CD3D3D] font-semibold"
          >
            Delete
          </button>
        </div>
      </div>
      {isDelete && (
        <DeleteDialog
          setIsDelete={setIsDelete}
          handleDelete={handleDelete}
          projectId={project._id}
        />
      )}
    </div>
  );
};

export default ContentCard;
