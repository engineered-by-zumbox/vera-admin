import { useState } from "react";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { storage } from "@/firebaseConfig";
// import toast from "react-hot-toast";

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

  // Upload to Firebase Storage (commented out but prepared for both types)
  // const uploadToFirebase = async (formData) => {
  //   try {
  //     let updatedData = { ...formData };

  //     // Handle single image (thumbNail)
  //     if (formData.thumbNail instanceof File) {
  //       const timestamp = Date.now();
  //       const storageRef = ref(
  //         storage,
  //         `images/${formData.thumbNail.name}_${timestamp}`
  //       );
  //       await uploadBytes(storageRef, formData.thumbNail);
  //       const downloadURL = await getDownloadURL(storageRef);
  //       updatedData.thumbNail = downloadURL;
  //     }

  //     // Handle multiple images with captions
  //     if (formData.images && formData.images.length > 0) {
  //       const uploadPromises = formData.images.map(async (imageObj) => {
  //         if (imageObj.file instanceof File) {
  //           const timestamp = Date.now();
  //           const storageRef = ref(
  //             storage,
  //             `images/${imageObj.file.name}_${timestamp}`
  //           );
  //           await uploadBytes(storageRef, imageObj.file);
  //           const downloadURL = await getDownloadURL(storageRef);
  //           return {
  //             ...imageObj,
  //             file: downloadURL,
  //           };
  //         }
  //         return imageObj;
  //       });

  //       updatedData.images = await Promise.all(uploadPromises);
  //     }

  //     return { data: updatedData, error: null };
  //   } catch (err) {
  //     console.error("Upload error:", err);
  //     return { data: null, error: err.message };
  //   }
  // };

  const resetForm = () => {
    setFormData(defaultValues || {});
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run validation if provided
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
      // Check if formData contains files/images
      const hasFiles = Object.values(formData).some(
        (value) =>
          value instanceof File ||
          (Array.isArray(value) &&
            value.some((item) => item.url instanceof File))
      );

      let requestBody;
      let headers = {};

      if (hasFiles) {
        // Handle form with files
        requestBody = new FormData();

        // Append all form fields
        Object.entries(formData).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            // Handle array of images with captions
            value.forEach((item, index) => {
              if (item.url instanceof File) {
                requestBody.append(`${key}`, item.url);
                requestBody.append(`${key}Captions`, item.caption || "");
              }
            });
          } else if (value instanceof File) {
            // Handle single file
            requestBody.append(key, value);
          } else {
            // Handle regular form fields
            requestBody.append(key, value);
          }
        });
      } else {
        // Handle regular JSON form
        requestBody = JSON.stringify(formData);
        headers = {
          "Content-Type": "application/json",
        };
      }

      if (endpoint) {
        const response = await fetch(endpoint, {
          method: id ? "PUT" : "POST",
          credentials: "include",
          headers,
          body: requestBody,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          setError(errorData?.error || "An unknown error occurred");
          throw new Error(errorData?.error || "Failed to submit form");
        }

        const data = await response.json();
        setSuccess(true);

        if (!id) {
          resetForm();
        }

        return data;
      }
    } catch (err) {
      console.error("Form submission error:", err);
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
