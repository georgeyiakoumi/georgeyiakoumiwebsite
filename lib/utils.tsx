import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getEntryPath(type: string | undefined, slug: string) {
  return type === "article" ? `/article/${slug}` : `/project/${slug}`;
}
