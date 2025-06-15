// src/utils/index.ts

/**
 * Formats a Date object into a readable string (e.g., "Jun 15, 2025").
 * @param date The date object to format.
 * @param includeTime Whether to include the time in the output.
 * @returns A formatted date string.
 */
export const formatDate = (date: Date, includeTime = false): string => {
  const options: Intl.DateTimeFormatOptions = includeTime
    ? { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
    : { year: "numeric", month: "short", day: "numeric" };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};

/**
 * Checks if a string is a valid and parsable date string.
 * @param str The string to check.
 * @returns True if the string can be parsed into a valid Date.
 */
export const isDateString = (str: string): boolean => {
  if (typeof str !== "string" || str.length < 10) return false;
  const date = new Date(str);
  return date instanceof Date && !isNaN(date.getTime());
};