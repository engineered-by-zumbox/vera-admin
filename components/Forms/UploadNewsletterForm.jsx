"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import useFormSubmission from "@/hooks/useFormSubmission";
import Link from "next/link";
import { useOneNewsletter } from "@/services/queries";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import Image from "next/image";

const UploadNewsletterForm = ({ id, action }) => {
  const fileInputRef = useRef();
  const dropZoneRef = useRef();
  const {
    data,
    isLoading: loading,
    error: NewsletterError,
  } = useOneNewsletter(id || null);
  const [isDragging, setIsDragging] = useState(false);
  let dragCounter = 0;

  const {
    formData,
    setFormData,
    handleChange,
    handleImageChange,
    handleDeleteImage,
    handleSubmit,
    isLoading,
    error,
    success,
    resetForm,
  } = useFormSubmission({
    id: id,
    endpoint: id
      ? `/api/newsletter-campaigns/${id}`
      : "/api/newsletter-campaigns",
    defaultValues: {
      title: "",
      imageUrl: "",
      message: "",
    },
    validate: (formData) => {
      if (!formData.message) {
        return "Newsletter title and message text are required.";
      }
      return null;
    },
  });

  useEffect(() => {
    if (success) {
      toast.success(id ? "Project updated" : "Project created");
    }
    if (success && !id) {
      resetForm();
    }
  }, [success]);

  useEffect(() => {
    if (data) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        title: data.title || "",
        message: data.message || "",
        imageUrl: data.imageUrl || "",
      }));
    }
  }, [data, setFormData]);

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

      setFormData((prev) => ({
        ...prev,
        imageUrl: file,
      }));
      console.log("done");
    }
  };

  if (id && loading)
    return (
      <div className="h-[40dvh] myFlex justify-center">
        <Loader2
          strokeWidth={1.2}
          className="animate-spin text-primary size-16"
        />
      </div>
    );
  if (id && NewsletterError)
    return (
      <div className="h-[40dvh] text-red-500 myFlex justify-center">
        Failed to load newsletter. Please try again later.
      </div>
    );

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#E3E3E34D] rounded-[32px] px-6 py-10 grid gap-12"
    >
      <div>
        <h3 className="text-[28px] font-bold mb-3">Upload Image</h3>
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
          {formData.imageUrl ? (
            <div className="relative">
              <Image
                width={1500}
                height={230}
                src={
                  typeof formData.imageUrl === "string"
                    ? formData.imageUrl
                    : URL.createObjectURL(formData.imageUrl)
                }
                alt="Preview"
                className="rounded-lg w-fit h-[230px] object-contain"
              />
              <button
                onClick={() => handleDeleteImage(null, "single")}
                type="button"
                className="absolute -right-2 -top-2 border text-red-500 bg-white rounded-full p-1"
              >
                <X strokeWidth={1.2} size={14} />
              </button>
            </div>
          ) : (
            <div className="myFlex flex-col cursor-pointer gap-2">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => handleImageChange(e, "single")}
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
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="input"
            placeholder="Type here"
            rows={12}
          />
        </div>
      </div>
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
            "Upload Newsletter"
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
              <Link href="/newsletter">Cancel</Link>
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default UploadNewsletterForm;
