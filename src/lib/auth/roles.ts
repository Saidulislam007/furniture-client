export interface UserSession {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;

  emailVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}