/**
 * Formats a Date object into a readable string (e.g., "Jun 15, 2025").
 * @param date The date object to format.
 * @param includeTime Whether to include the time in the output.
 * @returns A formatted date string.
 */
export const formatDate = (date: Date, includeTime = false): string => {
  const options: Intl.DateTimeFormatOptions = includeTime
    ? {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
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

/**
 * Checks if a given item is a non-null object.
 * @param item The item to check.
 * @returns True if the item is an object.
 */
const isObject = (item: any): item is Record<string, any> => {
  return item && typeof item === "object" && !Array.isArray(item);
};

/**
 * Deeply merges two objects. It's used to combine the default classNames
 * with user-provided custom classNames.
 * @param target The target object to merge into.
 * @param source The source object to merge from.
 * @returns The merged object.
 */
export const mergeDeep = (target: any, source: any): any => {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) Object.assign(output, { [key]: source[key] });
        else output[key] = mergeDeep(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
};
