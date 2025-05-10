import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return "U"
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function getStatusText(status: string): string {
  switch (status) {
    case "active":
      return "Actif"
    case "completed":
      return "Terminé"
    case "draft":
      return "Brouillon"
    default:
      return status
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "active":
      return "bg-green-500"
    case "completed":
      return "bg-blue-500"
    case "draft":
      return "bg-gray-500"
    default:
      return "bg-gray-500"
  }
}
