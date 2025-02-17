import { useState } from "react";

const useFormSubmission = (config) => {
  const { endpoint, defaultValues, validate, id } = config;

  // State for form data, loading, error, and success
  const [formData, setFormData] = useState(defaultValues || {});
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle single image change (without caption)
  const handleSingleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file (PNG, JPEG, etc.).");
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        alert("File size must be less than 20MB");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        thumbNail: file,
      }));
    }
  };

  // Handle single image deletion (without caption)
  const handleSingleImageDelete = () => {
    setFormData((prev) => ({
      ...prev,
      thumbNail: null,
    }));
  };

  // Handle multiple image uploads (with captions)
  const handleMultiImageChange = (e) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        if (!file.type.startsWith("image/")) {
          alert("Please upload a valid image file (PNG, JPEG, etc.).");
          return;
        }
        if (file.size > 20 * 1024 * 1024) {
          alert("File size must be less than 20MB");
          return;
        }

        setFormData((prev) => ({
          ...prev,
          images: [
            ...(prev.images || []),
            {
              url: file,
              caption: "",
              id: Date.now() + Math.random(),
            },
          ],
        }));
      });
    }
  };

  // Handle image caption changes
  const handleCaptionChange = (id, caption) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).map((img) =>
        img.id === id ? { ...img, caption } : img
      ),
    }));
  };

  // Handle individual image deletion (with caption)
  const handleMultiImageDelete = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index), // Remove by index
    }));
  };

  // Generic image change handler that detects the type of upload needed
  const handleImageChange = (e, type = "single") => {
    if (type === "single") {
      handleSingleImageChange(e);
    } else {
      handleMultiImageChange(e);
    }
  };

  // Generic image delete handler that detects the type of deletion needed
  const handleDeleteImage = (idOrEvent, type = "single") => {
    if (type === "single") {
      handleSingleImageDelete();
    } else {
      handleMultiImageDelete(idOrEvent);
    }
  };

  const resetForm = () => {
    setFormData(defaultValues || {});
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate) {
      const validationError = validate(formData);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      let requestBody;
      let headers = { "Content-Type": "application/json" }; // Default headers

      // Check if images exist in formData
      const hasImages = formData.images && formData.images.length > 0;

      if (hasImages) {
        // Use FormData for requests with images
        requestBody = new FormData();

        // Add basic fields
        requestBody.append("name", formData.name);
        requestBody.append("description", formData.description || "");
        requestBody.append("category", formData.category || "");

        if (id) {
          // Add existing images that weren't deleted
          const existingImages = formData.images.filter(
            (img) => !(img.url instanceof File)
          );
          requestBody.append("existingImages", JSON.stringify(existingImages));

          // Add new images
          const newImages = formData.images.filter(
            (img) => img.url instanceof File
          );
          newImages.forEach((img, index) => {
            requestBody.append("newImages", img.url);
            requestBody.append("newCaptions", img.caption || "");
          });
        } else {
          // Handle create (POST) request
          formData.images.forEach((img, index) => {
            requestBody.append("images", img.url);
            requestBody.append("captions", img.caption || "");
          });
        }
      } else {
        // Use JSON for requests without images
        requestBody = JSON.stringify(formData);
        headers = { "Content-Type": "application/json" };
      }

      const response = await fetch(endpoint, {
        method: id ? "PUT" : "POST",
        credentials: "include",
        body: requestBody,
        headers: hasImages ? {} : headers, // Only set headers for JSON requests
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to submit form");
      }

      const data = await response.json();
      setSuccess(true);

      if (!id) {
        resetForm();
      }

      return data;
    } catch (err) {
      console.error("Form submission error:", err);
      setError(err.message || "An error occurred while submitting the form");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleSelectChange,
    handleSubmit,
    isLoading,
    handleImageChange,
    handleDeleteImage,
    handleCaptionChange,
    error,
    success,
    resetForm,
  };
};

export default useFormSubmission;
