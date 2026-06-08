import { Module } from '@nestjs/common';
import { WisataImageService } from './wisata-image.service';
import { WisataImageController } from './wisata-image.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [WisataImageController],
  providers: [WisataImageService, PrismaService],
})
export class WisataImageModule {}
