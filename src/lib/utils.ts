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
