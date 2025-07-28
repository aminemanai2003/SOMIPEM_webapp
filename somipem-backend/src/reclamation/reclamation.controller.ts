import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ReclamationService, Reclamation, ReclamationStatus } from './reclamation.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles, Role } from '../decorators/roles.decorator';
import { CreateReclamationDto, UpdateReclamationStatusDto } from './dto/reclamation.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller()
export class ReclamationController {
  constructor(private readonly reclamationService: ReclamationService) {}

  @UseGuards(JwtAuthGuard)
  @Get('reclamations/me')
  getUserReclamations(@Req() req) {
    return this.reclamationService.getUserReclamations(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('reclamations')  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB en octets
      },
      fileFilter: (req, file, cb) => {
        // Vérifier le type du fichier
        const allowedMimeTypes = [
          'image/jpeg',
          'image/png',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];

        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true); // Accepter le fichier
        } else {
          cb(
            new Error(
              'Format de fichier non supporté. Formats acceptés: JPEG, PNG, PDF, DOC, DOCX',
            ),
            false, // Rejeter le fichier
          );
        }
      },
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          // Créer un nom de fichier unique
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )  async createReclamation(
    @Req() req,
    @Body() dto: CreateReclamationDto,
    @UploadedFile() file?,
  ) {
    try {
      return await this.reclamationService.createReclamation(
        req.user.id,
        dto,
        file ? `/uploads/${file.filename}` : undefined,
      );    } catch (error) {
      if (error?.message?.includes('Format de fichier non supporté')) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      } else if (error?.message?.includes('taille maximale')) {
        throw new HttpException(error.message, HttpStatus.PAYLOAD_TOO_LARGE);
      }
      // Log the error for debugging
      console.error('Erreur lors de la création de réclamation:', error);
      throw new HttpException(
        "Une erreur s'est produite lors de la création de la réclamation",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin/reclamations')
  getAllReclamations() {
    return this.reclamationService.getAllReclamations();
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('admin/reclamations/:id/status')
  updateReclamationStatus(
    @Param('id') id: string,
    @Body() dto: UpdateReclamationStatusDto,
  ) {
    return this.reclamationService.updateReclamationStatus(id, dto);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin/reclamations/stats')
  getReclamationStats() {
    return this.reclamationService.getReclamationStats();
  }
}
