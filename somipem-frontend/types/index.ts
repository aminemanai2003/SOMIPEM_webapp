export enum Role {
  ADMIN = 'ADMIN',
  WORKER = 'WORKER',
}

export enum ReclamationStatus {
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface Reclamation {
  id: string;
  title: string;
  description: string;
  fileUrl?: string;
  status: ReclamationStatus;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user?: User;
}

export interface ReclamationFormData {
  title: string;
  description: string;
  file?: File;
}
