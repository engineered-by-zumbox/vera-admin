import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getImageSrc = (image) => {
  // If image is a File object (new upload)
  if (image instanceof File) {
    return URL.createObjectURL(image);
  }

  // If image is an object with url property (existing image)
  if (image.url) {
    return image.url;
  }

  // If image is already a URL string
  if (typeof image === "string") {
    return image;
  }

  return ""; // Fallback empty string or you could return a placeholder image
};
