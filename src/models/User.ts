import { Role } from "./Role";

export type User = {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  roles: Role[];
};

export type UserRole = {
  userId: number;
  data: [];
  roles: Role[];
};
