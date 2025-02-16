import { axiosInstance } from "./fetcher";

export const deleteRequest = async (url, { arg }) => {
  const { id } = arg;
  const updatedUrl = `${url}${id}`;

  try {
    const response = await axiosInstance.delete(updatedUrl);
    return response.data;
  } catch (error) {
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Handle unauthorized error (invalid/expired token)
      throw new Error("Authentication failed. Please login again.");
    }
    if (error.response?.status === 403) {
      // Handle forbidden error
      throw new Error("You do not have permission to delete this project.");
    }
    // Handle other errors
    throw new Error(
      error.response?.data?.message || "Failed to delete project"
    );
  }
};
