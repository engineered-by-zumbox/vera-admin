// hooks/useFormatDate.js

import { useMemo } from "react";

// Helper function for basic date formatting
export const formatDate = (date, options = {}) => {
  // Handle different input types
  const dateObj = typeof date === "string" ? new Date(date) : date;

  // Return empty string if invalid date
  if (!(dateObj instanceof Date) || isNaN(dateObj)) {
    return "";
  }

  const defaultOptions = {
    type: "short", // 'short', 'full', 'monthDay', 'monthYear'
    locale: "en-US",
  };

  const settings = { ...defaultOptions, ...options };

  const formats = {
    short: { month: "short", day: "numeric", year: "numeric" }, // Feb 16, 2025
    full: { month: "long", day: "numeric", year: "numeric" }, // February 16, 2025
    monthDay: { month: "long", day: "numeric" }, // February 16
    monthYear: { month: "long", year: "numeric" }, // February 2025
  };

  try {
    return dateObj.toLocaleDateString(settings.locale, formats[settings.type]);
  } catch (error) {
    console.error("Date formatting error:", error);
    return "";
  }
};

// React hook for date formatting
export const useFormatDate = (date, options = {}) => {
  return useMemo(
    () => formatDate(date, options),
    [date, JSON.stringify(options)]
  );
};

// Usage examples:
// 1. Using the hook:
// const formattedDate = useFormatDate('2025-02-16T20:26:27.285Z', { type: 'monthDay' });
// Output: "February 16"

// 2. Using the function directly:
// const formattedDate = formatDate('2025-02-16T20:26:27.285Z', { type: 'monthDay' });
// Output: "February 16"

// Other examples:
// formatDate('2025-02-16T20:26:27.285Z', { type: 'short' })     // Feb 16, 2025
// formatDate('2025-02-16T20:26:27.285Z', { type: 'full' })      // February 16, 2025
// formatDate('2025-02-16T20:26:27.285Z', { type: 'monthYear' }) // February 2025
