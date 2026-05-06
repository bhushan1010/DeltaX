import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isAdmin = (role?: string): boolean => role === 'admin';
export const isMember = (role?: string): boolean => role === 'member';
export const canManageProjects = (role?: string): boolean => role === 'admin';
export const canManageUsers = (role?: string): boolean => role === 'admin';
export const canDeleteTask = (role?: string): boolean => role === 'admin';
