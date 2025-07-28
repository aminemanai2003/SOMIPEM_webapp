import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ReclamationService } from './reclamation.service';
import { ReclamationController } from './reclamation.controller';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [ReclamationController],
  providers: [ReclamationService],
})
export class ReclamationModule {}
