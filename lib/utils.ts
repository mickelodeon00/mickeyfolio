import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Removes special characters from a string, converts hyphens to spaces,
 * and keeps only alphanumeric characters and spaces
 * @param str - The input string to clean (or value that can be converted to string)
 * @param options - Configuration options
 * @param options.keepSpaces - Whether to keep spaces (default: true)
 * @param options.lowerCase - Whether to convert to lowercase (default: false)
 * @returns The cleaned string
 */
export function removeSpecialChars(
  str: unknown,
  options: {
    keepSpaces?: boolean;
    lowerCase?: boolean;
    capitalize: boolean;
  } = {
    keepSpaces: true,
    lowerCase: false,
    capitalize: false,
  }
): string {
  // Handle null/undefined
  if (str === null || str === undefined) {
    return "";
  }

  // Convert to string if it isn't already
  const stringValue = typeof str === "string" ? str : String(str);

  // Handle empty string after conversion
  if (stringValue.trim() === "") {
    return "";
  }

  // First convert hyphens to spaces
  let processed = stringValue.replace(/-/g, " ");

  let pattern: RegExp;
  if (options.keepSpaces) {
    // Keep alphanumeric and spaces
    pattern = /[^a-zA-Z0-9 ]/g;
  } else {
    // Keep only alphanumeric
    pattern = /[^a-zA-Z0-9]/g;
  }

  let cleaned = processed.replace(pattern, "");

  // Collapse multiple spaces into one
  cleaned = cleaned.replace(/\s+/g, " ").trim();

  if (options.lowerCase) {
    cleaned = cleaned.toLowerCase();
  }
  // if (options.capitalize) {
  //   cleaned = cleaned.tit();
  // }

  return cleaned;
}
