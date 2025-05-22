export interface Item {
  id: string;
  name: string;
  quantity: number;
  category: string;
  expiryDate: string; // ISO date string
  imageUri?: string;
  notes?: string;
  addedDate: string; // ISO date string
  lastModified: string; // ISO date string
} 