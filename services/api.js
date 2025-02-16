import { axiosInstance } from "./fetcher";

export const updateHireRequest = async (url, { arg }) => {
  const { id, status } = arg;
  const updatedUrl = `${url}${id}`;
  await axiosInstance.patch(updatedUrl, { status });
};

export const deleteRequest = async (url, { arg }) => {
  const { id } = arg;
  const updatedUrl = `${url}${id}`;
  await axiosInstance.delete(updatedUrl);
};
