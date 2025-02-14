"use client";

import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import useFormSubmission from "@/hooks/useFormSubmission";
import Link from "next/link";

const UploadNewsletterForm = ({ id, action }) => {
  const fileInputRef = useRef();
  const [isDragging, setIsDragging] = useState(false);

  const {
    formData,
    setFormData,
    handleChange,
    handleImageChange,
    handleDeleteImage,
    handleSubmit,
    isLoading,
    error,
  } = useFormSubmission({
    id: id,
    endpoint: id ? `/api/blog/updateBlog/${id}` : "/api/blog/createBlog",
    defaultValues: {
      title: "",
      thumbNail: null,
      body: "",
    },
    validate: (formData) => {
      if (!formData.title || !formData.body) {
        return "Newsletter title and body text are required.";
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
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Check file type
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }
      // Check file size (20MB = 20 * 1024 * 1024 bytes)
      if (file.size > 20 * 1024 * 1024) {
        alert("File size must be less than 20MB");
        return;
      }

      // Create a fake event object to reuse existing handleImageChange
      const fakeEvent = {
        target: {
          files: [file],
        },
      };
      handleImageChange(fakeEvent);
    }
  };

  return (
    <section className="bg-[#E3E3E34D] rounded-[32px] px-6 py-10 grid gap-12">
      <div>
        <h3 className="text-[28px] font-bold mb-3">Upload Image</h3>
        <p className="text-sm text-[#7B7670]">
          Enhance your newsletter with visual content—upload your supporting
          images here to complement and enrich your message.
        </p>

        <div
          className={`h-[253px] rounded-2xl myFlex mt-10 justify-center bg-white transition-colors
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
          {formData.thumbNail ? (
            <div className="relative">
              <img
                src={
                  typeof formData.thumbNail === "string"
                    ? formData.thumbNail
                    : URL.createObjectURL(formData.thumbNail)
                }
                alt="Preview"
                className="rounded-lg w-fit h-[230px] object-contain"
              />
              <button
                onClick={handleDeleteImage}
                type="button"
                className="absolute -right-2 -top-2 border text-red-500 bg-white rounded-full p-1"
              >
                <X strokeWidth={1.2} size={14} />
              </button>
            </div>
          ) : (
            <div
              onClick={handleButtonClick}
              className="myFlex flex-col cursor-pointer gap-2"
            >
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
              <div className="myFlex gap-3 px-4 py-3 rounded-lg myShadow">
                <Upload />
                Upload an image
              </div>
              <p>Choose images or drag & drop it here</p>
              <p className="text-[#8A8A8A]">JPG, JPEG, PNG. Max 20MB</p>
            </div>
          )}
        </div>
      </div>
      <div>
        <h3 className="text-[28px] font-bold mb-3">Choose a title</h3>
        <p className="text-sm text-[#7B7670]">
          Your newsletter title is the first impression readers get of your
          content. Please choose a clear, engaging title that captures the
          essence of your newsletter and entices your audience to read further.
        </p>
        <div className="mt-5">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input"
            placeholder="Type here"
          />
        </div>
      </div>
      <div>
        <h3 className="text-[28px] font-bold mb-3">What is the message?</h3>
        <div className="mt-3">
          <textarea
            name="body"
            value={formData.body}
            onChange={handleChange}
            className="input"
            placeholder="Type here"
            rows={12}
          />
        </div>
      </div>
      {action === "create" ? (
        <button type="submit" className="btn">
          Upload Newsletter
        </button>
      ) : (
        <div className="myFlex justify-end">
          <div className="space-x-5">
            <button type="submit" className="btn !w-[300px]">
              Save changes
            </button>
            <button type="submit" className="btn !w-[300px] !bg-[#CD3D3D]">
              <Link href="/newsletter">Cancel</Link>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default UploadNewsletterForm;
