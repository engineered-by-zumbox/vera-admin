"use client";

import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import useFormSubmission from "@/hooks/useFormSubmission";
import Link from "next/link";

const ProjectForm = ({ id, action }) => {
  const fileInputRef = useRef();
  const dropZoneRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  let dragCounter = 0; // Add counter to track drag events

  const {
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    handleImageChange,
    handleDeleteImage,
    handleCaptionChange,
    isLoading,
    error,
  } = useFormSubmission({
    id: id,
    endpoint: id ? `/api/blog/updateBlog/${id}` : "/api/blog/createBlog",
    defaultValues: {
      projectName: "",
      description: "",
      category: "",
      images: [],
    },
    validate: (formData) => {
      if (!formData.projectName || !formData.title || !formData.body) {
        return "Project name, newsletter title and body text are required.";
      }
      return null;
    },
  });

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter++;
    if (e.target === dropZoneRef.current) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter--;
    if (dragCounter === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target === dropZoneRef.current) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter = 0;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        if (!file.type.startsWith("image/")) {
          alert("Please upload an image file");
          return;
        }
        if (file.size > 20 * 1024 * 1024) {
          alert("File size must be less than 20MB");
          return;
        }

        setFormData((prev) => ({
          ...prev,
          images: [
            ...prev.images,
            {
              file,
              caption: "",
              id: Date.now() + Math.random(),
            },
          ],
        }));
      });
    }
  };

  return (
    <section className="bg-[#E3E3E34D] rounded-[32px] px-6 py-10 grid gap-12">
      <div>
        <h3 className="text-[28px] font-bold mb-3">Project Details</h3>
        <div className="space-y-6">
          <div>
            <input
              type="text"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              className="input"
              placeholder="Project Name *"
            />
          </div>
          <div>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input"
              placeholder="Project Description (Optional)"
              rows={4}
            />
          </div>
          <div>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input"
              placeholder="Category (Optional)"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-[28px] font-bold mb-3">Upload Images</h3>
        <p className="text-sm text-[#7B7670]">
          Enhance your newsletter with visual content—upload your supporting
          images here to complement and enrich your message.
        </p>

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

        <div className="mt-6 space-y-4">
          {formData.images.map((image) => (
            <div
              key={image.id}
              className="bg-white rounded-lg p-4 flex items-start gap-4"
            >
              <div className="w-24 h-24 relative flex-shrink-0">
                <img
                  src={URL.createObjectURL(image.file)}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex-grow">
                <input
                  type="text"
                  value={image.caption}
                  onChange={(e) =>
                    handleCaptionChange(image.id, e.target.value)
                  }
                  className="input"
                  placeholder="Add a caption for this image"
                />
              </div>
              <button
                onClick={() => handleDeleteImage(image.id, "multi")}
                type="button"
                className="text-red-500 hover:bg-red-50 rounded-full p-2"
              >
                <X strokeWidth={1.2} size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
      {action === "create" ? (
        <button onClick={handleSubmit} type="submit" className="btn">
          Upload Newsletter
        </button>
      ) : (
        <div className="myFlex justify-end">
          <div className="space-x-5">
            <button
              onClick={handleSubmit}
              type="submit"
              className="btn !w-[300px]"
            >
              Save changes
            </button>
            <button type="button" className="btn !w-[300px] !bg-[#CD3D3D]">
              <Link href="/newsletter">Cancel</Link>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProjectForm;
