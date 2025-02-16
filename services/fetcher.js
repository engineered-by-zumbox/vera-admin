import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
});

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

export default fetcher;
