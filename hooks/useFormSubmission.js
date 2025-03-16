import imageCompression from "browser-image-compression";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";

const useFormSubmission = (config) => {
  const { endpoint, defaultValues, validate, id } = config;

  // State for form data, loading, error, and success
  const [formData, setFormData] = useState(defaultValues || {});
  const [isLoading, setLoading] = useState(false);
  const [compressingImages, setCompressingImages] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0); // Tracks per-image progress
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const compressImage = async (file, onProgress) => {
    // 🔹 Skip compression if file is already small (< 500KB)
    if (file.size < 500 * 1024) {
      return { compressedFile: file, previewUrl: URL.createObjectURL(file) };
    }

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 2000,
      useWebWorker: true,
      initialQuality: 0.9,
      onProgress: (percent) => {
        if (onProgress) onProgress(percent);
      },
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return {
        compressedFile,
        previewUrl: URL.createObjectURL(compressedFile),
      };
    } catch (error) {
      console.error("Image compression error:", error);
      return { compressedFile: file, previewUrl: URL.createObjectURL(file) };
    }
  };

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
        imageUrl: file,
      }));
    }
  };

  // Handle single image deletion (without caption)
  const handleSingleImageDelete = () => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: null,
    }));
  };

  // Handle multiple image uploads (with captions)
  const handleMultiImageChange = async (e) => {
    const files = e.target.files;
    if (!files) return;

    setCompressingImages(true); // Start compression indicator

    let totalFiles = files.length;
    let totalProgress = 0;

    const compressedImages = await Promise.all(
      Array.from(files).map(async (file, index) => {
        if (!file.type.startsWith("image/")) {
          toast.error("Invalid file format. Please upload an image.");
          return null;
        }
        if (file.size > 20 * 1024 * 1024) {
          toast.error("File must be less than 20MB");
          return null;
        }

        // 🔹 Track progress for all files
        const onProgress = (percent) => {
          totalProgress = ((index + percent / 100) / totalFiles) * 100;
          setCompressionProgress(Math.round(totalProgress));
        };

        const { compressedFile, previewUrl } = await compressImage(
          file,
          onProgress
        );

        return {
          url: compressedFile,
          previewUrl,
          caption: "",
          id: `new-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        };
      })
    );

    setCompressingImages(false); // End compression indicator
    setCompressionProgress(0); // Reset progress

    const filteredImages = compressedImages.filter((img) => img !== null);
    if (filteredImages.length > 0) {
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...filteredImages],
      }));
    }
  };

  // Handle image caption changes
  const handleCaptionChange = useCallback((id, caption) => {
    setFormData((prev) => {
      const updatedImages = (prev.images || []).map((img) =>
        img.id === id ? { ...img, caption } : img
      );
      return {
        ...prev,
        images: updatedImages,
      };
    });
  }, []);

  // Handle individual image deletion (with caption)
  const handleMultiImageDelete = (id) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((img) => img.id !== id),
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
    setUploadProgress(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate) {
      const validationError = validate(formData);
      if (validationError) {
        setError(validationError);
        toast.error(validationError);
        return;
      }
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setUploadProgress(0); // Reset progress

    try {
      let requestBody;
      let headers = { "Content-Type": "application/json" }; // Default headers

      const hasSingleImage = formData.imageUrl;
      const hasMultipleImages = formData.images && formData.images.length > 0;

      if (hasSingleImage || hasMultipleImages) {
        // 🔹 Use FormData for requests with images
        requestBody = new FormData();

        // Add non-image fields
        Object.keys(formData).forEach((key) => {
          if (key !== "imageUrl" && key !== "images" && formData[key]) {
            requestBody.append(key, formData[key]);
          }
        });

        if (hasSingleImage) {
          // Handle single image upload
          if (formData.imageUrl instanceof File) {
            requestBody.append("image", formData.imageUrl);
          } else if (typeof formData.imageUrl === "string" && id) {
            requestBody.append("existingImageUrl", formData.imageUrl);
          }
        } else if (hasMultipleImages) {
          // Handle multiple images
          if (id) {
            const existingImages = formData.images.filter(
              (img) => !(img.url instanceof File)
            );
            requestBody.append(
              "existingImages",
              JSON.stringify(existingImages)
            );

            const newImages = formData.images.filter(
              (img) => img.url instanceof File
            );
            newImages.forEach((img) => {
              requestBody.append("newImages", img.url);
              requestBody.append("newCaptions", img.caption || "");
            });
          } else {
            formData.images.forEach((img) => {
              requestBody.append("images", img.url);
              requestBody.append("captions", img.caption || "");
            });
          }
        }

        // 🔹 Track Upload Progress with XMLHttpRequest
        const xhr = new XMLHttpRequest();
        xhr.open(id ? "PUT" : "POST", endpoint);
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(percent);
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            toast.success("Upload complete!");
            setSuccess(true);
            setUploadProgress(100); // Mark completion
          } else {
            toast.error("Upload failed!");
          }
          setLoading(false);
        };

        xhr.onerror = () => {
          toast.error("An error occurred during upload.");
          setLoading(false);
        };

        xhr.send(requestBody);
        return;
      }

      // 🔹 For Non-Image Submissions (Text Only)
      requestBody = JSON.stringify(formData);
      headers = { "Content-Type": "application/json" };

      const response = await fetch(endpoint, {
        method: id ? "PUT" : "POST",
        credentials: "include",
        body: requestBody,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to submit form");
      }

      setSuccess(true);
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
    compressingImages,
    compressionProgress,
    uploadProgress,
    setCompressingImages,
    setCompressionProgress,
    error,
    success,
    resetForm,
  };
};

export default useFormSubmission;
