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

  // Handle file changes (for images)
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setFormData((prev) => ({
        ...prev,
        thumbNail: file,
      }));
    } else {
      setError("Please upload a valid image file (PNG, JPEG, etc.).");
    }
  };

  // Handle file deletion
  const handleDeleteImage = () => {
    setFormData((prev) => ({
      ...prev,
      thumbNail: null,
    }));
  };

  // Upload image to Firebase Storage
  // const uploadImageToFirebase = async (file) => {
  //   if (!file) return { url: null, error: "No file provided" };

  //   try {
  //     const timestamp = Date.now();
  //     const storageRef = ref(storage, `images/${file.name}_${timestamp}`);
  //     await uploadBytes(storageRef, file);
  //     const downloadURL = await getDownloadURL(storageRef);
  //     return { url: downloadURL, error: null };
  //   } catch (err) {
  //     console.error("Image upload error:", err);
  //     return { url: null, error: err.message };
  //   }
  // };

  // Handle file changes
  // const handleFileChange = (e) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     setFormData((prev) => ({
  //       ...prev,
  //       cv: file,
  //     }));
  //   }
  // };

  // Handle file deletion
  // const handleDeleteFile = () => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     cv: null,
  //   }));
  // };

  // Upload file to Firebase Storage
  // const uploadFileToFirebase = async (file) => {
  //   if (!file) return { url: null, error: "No file provided" };

  //   try {
  //     const timestamp = Date.now();
  //     const storageRef = ref(storage, `cv/${file.name}_${timestamp}`);
  //     await uploadBytes(storageRef, file);
  //     const downloadURL = await getDownloadURL(storageRef);
  //     return { url: downloadURL, error: null };
  //   } catch (err) {
  //     console.error("File upload error:", err);
  //     return { url: null, error: err.message };
  //   }
  // };

  // const handleSkillChange = (index, value) => {
  //   const updatedSkills = [...formData.requiredSkills];
  //   updatedSkills[index] = value;
  //   setFormData((prev) => ({ ...prev, requiredSkills: updatedSkills }));
  // };

  // const addSkill = () => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     requiredSkills: [...prev.requiredSkills, ""],
  //   }));
  // };

  // const removeSkill = (index) => {
  //   const updatedSkills = formData.requiredSkills.filter((_, i) => i !== index);
  //   setFormData((prev) => ({ ...prev, requiredSkills: updatedSkills }));
  // };

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

    // try {
    //   let submissionData = formData;
    //   let thumbNailUrl = null;

    //   if (formData.thumbNail instanceof File) {
    //     const uploadResult = await uploadImageToFirebase(formData.thumbNail);
    //     if (uploadResult.error) {
    //       throw new Error(`Image upload failed: ${uploadResult.error}`);
    //     }
    //     thumbNailUrl = uploadResult.url;
    //     submissionData = {
    //       ...formData,
    //       thumbNail: thumbNailUrl,
    //     };
    //   } else if (typeof formData.thumbNail === "string") {
    //     thumbNailUrl = formData.thumbNail;
    //   }

    //   let cvUrl = null;
    //   if (formData.cv instanceof File) {
    //     const uploadResult = await uploadFileToFirebase(formData.cv);
    //     if (uploadResult.error) {
    //       throw new Error(`File upload failed: ${uploadResult.error}`);
    //     }
    //     cvUrl = uploadResult.url;
    //     submissionData = {
    //       ...formData,
    //       cv: cvUrl,
    //     };
    //   } else if (typeof formData.cv === "string") {
    //     cvUrl = formData.cv;
    //   }

    //   if (endpoint) {
    //     const response = await fetch(endpoint, {
    //       method: id ? "PUT" : "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify(submissionData),
    //     });

    //     if (!response.ok) {
    //       throw new Error("Failed to submit form");
    //     }
    //   }

    //   setSuccess(true);
    //   toast.success("Form submitted successfully");
    //   if (!id) {
    //     resetForm();
    //   }
    // } catch (err) {
    //   setError(err.message);
    //   console.error("Form submission error:", err);
    // } finally {
    //   setLoading(false);
    // }
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleSelectChange,
    // handleFileChange,
    // handleDeleteFile,
    handleSubmit,
    isLoading,
    handleImageChange,
    handleDeleteImage,
    error,
    success,
    resetForm,
    // handleSkillChange,
    // addSkill,
    // removeSkill,
  };
};

export default useFormSubmission;
