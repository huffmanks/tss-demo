import { type ClassValue, clsx } from "clsx";
import slugifyPkg from "slugify";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function json<T>(data: T, status: number = 200, init?: ResponseInit): Response {
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");

  return new Response(JSON.stringify(data), {
    status,
    headers,
    ...init,
  });
}

export function slugify(string: string) {
  return slugifyPkg(string, {
    lower: true,
    strict: true,
  });
}

export function createAcronym(inputString: string) {
  const sanitizedString = inputString.trim().replace(/[-_]/g, " ");

  const words = sanitizedString.split(/\s+/).filter(Boolean);

  const letters = words.map((word) => word.charAt(0).toUpperCase());

  const acronym = letters.join("").slice(0, 3);

  return acronym;
}

export function createLabel(segment: string) {
  if (!isNaN(Number(segment))) {
    return "Details";
  }
  return segment.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}
