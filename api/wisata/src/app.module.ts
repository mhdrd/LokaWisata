import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { WisataModule } from './wisata/wisata.module';
import { KategoriModule } from './kategori/kategori.module';
import { ReviewModule } from './review/review.module';

@Module({
  imports: [WisataModule, KategoriModule, ReviewModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
