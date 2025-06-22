import { UseMutationResult } from "@tanstack/react-query";
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


export function generateFileName(file: File) {
  const now = new Date();
  const parts = [
    now.getFullYear().toString().slice(2),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0'),
    String(now.getSeconds()).padStart(2, '0'),
    now.getMilliseconds().toString().padStart(4, '0'),
  ];
  const [name, ext] = file.name.split('.');
  return `${name}${parts.join('-')}.${ext}`;
}

export function handleMutation<TArgs>(
  mutation: UseMutationResult<unknown, unknown, TArgs, unknown>,
  args?: TArgs
) {
  mutation.mutate(args as TArgs);
}