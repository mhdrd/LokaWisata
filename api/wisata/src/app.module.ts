import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { WisataModule } from './wisata/wisata.module';
import { KategoriModule } from './kategori/kategori.module';

@Module({
  imports: [WisataModule, KategoriModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
