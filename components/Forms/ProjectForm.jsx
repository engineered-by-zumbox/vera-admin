"use client";

import { memo, useEffect, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import useFormSubmission from "@/hooks/useFormSubmission";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

const ImagePreviewItem = memo(({ image, onCaptionChange, onDelete }) => {
  // Ensure preview URL is used
  const imageSrc =
    image.previewUrl ||
    (image.url instanceof File ? URL.createObjectURL(image.url) : image.url);

  return (
    <div className="bg-white rounded-lg p-4 flex items-start gap-4">
      <div className="w-24 h-24 relative flex-shrink-0">
        {imageSrc && (
          <Image
            width={100}
            height={100}
            src={imageSrc}
            alt="Preview"
            className="w-full h-full object-cover rounded-lg"
          />
        )}
      </div>
      <div className="flex-grow">
        <input
          type="text"
          value={image.caption || ""}
          onChange={(e) => onCaptionChange(image.id, e.target.value)}
          className="input"
          placeholder="Add a caption for this image"
        />
      </div>
      <button
        onClick={() => onDelete(image.id)}
        type="button"
        className="text-red-500 hover:bg-red-50 rounded-full p-2"
      >
        <X strokeWidth={1.2} size={20} />
      </button>
    </div>
  );
});

ImagePreviewItem.displayName = "ImagePreviewItem";

function ProjectForm({ id, action }) {
  const fileInputRef = useRef();
  const dragCounter = useRef(0);
  const dropZoneRef = useRef();

  // Only fetch project data if we have an ID (edit mode)
  const [projectData, setProjectData] = useState(null);
  const [projectLoading, setProjectLoading] = useState(false);
  const [projectError, setProjectError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const {
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    handleImageChange,
    handleDeleteImage,
    handleCaptionChange,
    compressingImages,
    compressionProgress,
    resetForm,
    isLoading,
    error,
    success,
  } = useFormSubmission({
    id: id,
    endpoint: id ? `/api/projects/${id}` : "/api/projects",
    defaultValues: {
      name: "",
      description: "",
      category: "",
      images: [],
    },
    validate: (formData) => {
      if (!formData.name) {
        return "Project name is required.";
      }
      if (!formData.images || formData.images.length === 0) {
        return "At least one image is required.";
      }
      return null;
    },
  });

  // Handle success message and form reset
  useEffect(() => {
    if (success) {
      toast.success(
        id ? "Project updated successfully" : "Project created successfully"
      );
      if (!id) {
        resetForm();
      }
    }
  }, [success]);

  useEffect(() => {
    let isMounted = true;

    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${id}`);
        if (!response.ok) throw new Error("Failed to fetch project data");

        const data = await response.json();
        if (isMounted) setProjectData(data); // Only set state if mounted
      } catch (error) {
        if (isMounted) setProjectError(error.message);
      }
    };

    if (id) fetchProject();

    return () => {
      isMounted = false; // Cleanup to prevent setting state after unmount
    };
  }, [id]);

  useEffect(() => {
    return () => {
      formData.images.forEach((img) => {
        if (img.previewUrl) URL.revokeObjectURL(img.previewUrl);
      });
    };
  }, [formData.images]);

  // Set form data when project data is loaded (edit mode)
  useEffect(() => {
    if (projectData) {
      setFormData({
        name: projectData.name || "",
        description: projectData.description || "",
        category: projectData.category || "",
        images: Array.isArray(projectData.images)
          ? projectData.images.map((img) => ({
              ...img,
              id:
                img.id ||
                `existing-${Math.random().toString(36).substring(2, 9)}`,
            }))
          : [],
      });
    }
  }, [projectData]);

  // File input handler
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();

    dragCounter.current++; // First, increment the counter

    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleImageChange({ target: { files } }, "multi"); // Use existing function
    }
  };

  // Show loading state while fetching project in edit mode
  if (projectLoading) {
    return (
      <div className="h-[40dvh] myFlex justify-center">
        <Loader2
          strokeWidth={1.2}
          className="animate-spin text-primary size-16"
        />
      </div>
    );
  }

  // Show error state if project fetch fails
  if (projectError) {
    return (
      <div className="h-[40dvh] text-red-500 myFlex justify-center">
        Failed to load project. Please try again later.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#E3E3E34D] rounded-[32px] px-6 py-10 grid gap-12"
    >
      {error && <p className="text-red-500 mb-1 text-center">{error}</p>}

      {/* Project Details Section */}
      <div>
        <h3 className="text-[28px] font-bold mb-3">Project Details</h3>
        <div className="space-y-6">
          <div>
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="input"
              placeholder="Project Name *"
            />
          </div>
          <div>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              className="input"
              placeholder="Project Description (Optional)"
              rows={8}
            />
          </div>
          <div>
            <input
              type="text"
              name="category"
              value={formData.category || ""}
              onChange={handleChange}
              className="input"
              placeholder="Category (Optional)"
            />
          </div>
        </div>
      </div>

      {/* Image Upload Section */}
      <div>
        <h3 className="text-[28px] font-bold mb-3">Upload Images</h3>
        <p className="text-sm text-[#7B7670]">
          Enhance your project with visual content—upload your supporting images
          here to complement and enrich your message.
        </p>

        {/* Drop Zone */}
        <div
          ref={dropZoneRef}
          onClick={handleButtonClick}
          className={`h-[253px] rounded-2xl cursor-pointer myFlex mt-10 justify-center bg-white transition-colors
            ${
              isDragging
                ? "border-2 border-dashed border-primary bg-primary/5"
                : ""
            }`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="myFlex flex-col gap-2">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={(e) => handleImageChange(e, "multi")}
              className="hidden"
              multiple
            />
            <div className="myFlex gap-3 px-4 py-3 rounded-lg myShadow">
              <Upload />
              Upload images
            </div>
            <p>Choose images or drag & drop them here</p>
            <p className="text-[#8A8A8A]">JPG, JPEG, PNG. Max 20MB</p>
          </div>
        </div>

        {/**Compressing Image ux */}
        {compressingImages && (
          <div className="flex items-center justify-center min-h-[150px] font-medium opacity-90">
            Compressing Images {compressionProgress}%
          </div>
        )}

        {/* Image Preview Section */}
        <div className="mt-6 space-y-4">
          {formData?.images && formData?.images?.length > 0 ? (
            formData?.images.map((image, index) => (
              <ImagePreviewItem
                key={image.id || index}
                image={image}
                onCaptionChange={handleCaptionChange}
                onDelete={(id) => handleDeleteImage(id, "multi")}
              />
            ))
          ) : (
            <p className="text-gray-500">No images uploaded.</p> // Show fallback text
          )}
        </div>
      </div>

      {/* Form Actions */}
      {action === "create" ? (
        <button
          disabled={isLoading}
          type="submit"
          className="btn myFlex justify-center"
        >
          {isLoading ? (
            <div className="myFlex gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Uploading...
            </div>
          ) : (
            "Upload Project"
          )}
        </button>
      ) : (
        <div className="myFlex justify-end">
          <div className="space-x-5 myFlex">
            <button
              type="submit"
              disabled={isLoading}
              className="btn !w-[300px] myFlex justify-center"
            >
              {isLoading ? (
                <div className="myFlex gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </div>
              ) : (
                "Save changes"
              )}
            </button>
            <button
              type="button"
              disabled={isLoading}
              className="btn !w-[300px] !bg-[#CD3D3D]"
            >
              <Link href="/projects">Cancel</Link>
            </button>
          </div>
        </div>
      )}
    </form>
  );
}

export default ProjectForm;
