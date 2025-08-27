const HTML_ESCAPE_MAP = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "/": "&#x2F;",
} as const;

/**
 * Formats a Date object into a readable string (e.g., "Jun 15, 2025").
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
 */
export const isDateString = (str: string): boolean => {
  if (typeof str !== "string" || str.length < 10) return false;
  const date = new Date(str);
  return date instanceof Date && !Number.isNaN(date.getTime());
};

/**
 * Checks if a given item is a non-null object.
 */
const isObject = (item: unknown): item is Record<string, unknown> => {
  return Boolean(item && typeof item === "object" && !Array.isArray(item));
};

/**
 * Sanitizes a string to prevent XSS attacks by escaping HTML characters.
 */
export const sanitizeString = (str: string): string => {
  return str.replace(
    /[&<>"'/]/g,
    (match) => HTML_ESCAPE_MAP[match as keyof typeof HTML_ESCAPE_MAP]
  );
};

/**
 * Type guard to check if a value is a string.
 */
export const isString = (value: unknown): value is string => {
  return typeof value === "string";
};

/**
 * Type guard to check if a value is a number.
 */
export const isNumber = (value: unknown): value is number => {
  return typeof value === "number" && !Number.isNaN(value);
};

/**
 * Deeply merges two objects, used for combining default and custom classNames.
 */
export const mergeDeep = <
  T extends Record<string, unknown>,
  U extends Record<string, unknown>,
>(
  target: T,
  source: U | undefined
): T & U => {
  if (!source) return target as T & U;

  const output = { ...target } as Record<string, unknown>;

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      const sourceValue = source[key];
      const targetValue = target[key];

      if (isObject(sourceValue)) {
        if (!(key in target)) {
          Object.assign(output, { [key]: sourceValue });
        } else if (isObject(targetValue)) {
          output[key] = mergeDeep(targetValue, sourceValue);
        }
      } else {
        Object.assign(output, { [key]: sourceValue });
      }
    });
  }

  return output as T & U;
};

/**
 * Type-safe version of mergeDeep for specific types used in the library.
 */
export const mergeTableConfig = <T>(
  target: T,
  source: Partial<T> | undefined
): T => {
  return mergeDeep(
    target as Record<string, unknown>,
    source as Record<string, unknown> | undefined
  ) as T;
};
