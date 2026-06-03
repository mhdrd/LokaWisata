import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { WisataProxyModule } from './wisata-proxy/wisata-proxy.module';
import { KategoriProxyModule } from './kategori-proxy/kategori-proxy.module';
import { ReviewProxyModule } from './review-proxy/review-proxy.module';
import { FavoriteProxyModule } from './favorite-proxy/favorite-proxy.module';
import { ImageProxyModule } from './image-proxy/image-proxy.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    WisataProxyModule,
    KategoriProxyModule,
    ReviewProxyModule,
    FavoriteProxyModule,
    ImageProxyModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
