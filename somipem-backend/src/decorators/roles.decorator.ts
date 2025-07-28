import { SetMetadata } from '@nestjs/common';

// Define custom Role enum to avoid prisma client import issues
export enum Role {
  ADMIN = 'ADMIN',
  WORKER = 'WORKER'
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
