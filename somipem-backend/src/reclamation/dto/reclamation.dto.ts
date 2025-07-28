import { IsString, IsEnum, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ReclamationStatus } from '../reclamation.service';

export class CreateReclamationDto {
  @IsString({ message: 'Le titre est obligatoire' })
  @MinLength(5, { message: 'Le titre doit contenir au moins 5 caractères' })
  @MaxLength(100, { message: 'Le titre ne peut pas dépasser 100 caractères' })
  title: string;

  @IsString({ message: 'La description est obligatoire' })
  @MinLength(20, { message: 'La description doit contenir au moins 20 caractères' })
  @MaxLength(1000, { message: 'La description ne peut pas dépasser 1000 caractères' })
  description: string;
}

export class UpdateReclamationStatusDto {
  @IsEnum(ReclamationStatus)
  status: ReclamationStatus;
}
