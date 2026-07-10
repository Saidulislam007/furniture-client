// src/lib/auth/roles.ts
export enum UserRole {
  USER = 'USER',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN'
}

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

// API থেকে আসা সেশন ভ্যালিডেশনের জন্য Zod স্কিমা (No any standard)
import { z } from 'zod';
export const sessionResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.nativeEnum(UserRole),
});