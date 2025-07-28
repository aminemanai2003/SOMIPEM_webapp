import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReclamationDto, UpdateReclamationStatusDto } from './dto/reclamation.dto';
import { ReclamationStatus } from '@prisma/client';

export { ReclamationStatus };

export interface Reclamation {
  id: string;
  title: string;
  description: string;
  fileUrl?: string | null;
  status: ReclamationStatus;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

@Injectable()
export class ReclamationService {
  constructor(private prisma: PrismaService) {}

  async getUserReclamations(userId: string): Promise<Reclamation[]> {
    return this.prisma.reclamation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createReclamation(
    userId: string,
    dto: CreateReclamationDto,
    fileUrl?: string,
  ): Promise<Reclamation> {
    return this.prisma.reclamation.create({
      data: {
        ...dto,
        fileUrl,
        userId,
      },
    });
  }

  async getAllReclamations(): Promise<Reclamation[]> {
    return this.prisma.reclamation.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateReclamationStatus(
    id: string,
    dto: UpdateReclamationStatusDto,
  ): Promise<Reclamation> {
    return this.prisma.reclamation.update({
      where: { id },
      data: { status: dto.status },
    });
  }

  async getReclamationStats() {
    const statuses = Object.values(ReclamationStatus);
    const stats = await Promise.all(
      statuses.map(async (status) => {
        const count = await this.prisma.reclamation.count({
          where: { status },
        });
        return { status, count };
      }),
    );

    return stats;
  }
}
