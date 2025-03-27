
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency in UZS
export function formatUZCurrency(amount: number): string {
  return new Intl.NumberFormat('uz-UZ').format(amount);
}

// Format phone number
export function formatPhoneNumber(phone: string): string {
  if (!phone) return '';
  
  // For Uzbekistan numbers
  if (phone.startsWith('+998')) {
    return phone.replace(/(\+998)(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
  }
  
  return phone;
}

// Get initials from name
export function getInitials(name: string): string {
  if (!name) return '';
  
  const names = name.split(' ');
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  
  return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
}
