import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { WisataModule } from './wisata/wisata.module';
import { KategoriModule } from './kategori/kategori.module';
import { ReviewModule } from './review/review.module';
import { WisataImageModule } from './wisata-image/wisata-image.module';
import { FavoriteModule } from './favorite/favorite.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    WisataModule,
    KategoriModule,
    ReviewModule,
    WisataImageModule,
    FavoriteModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
