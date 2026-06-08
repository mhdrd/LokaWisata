import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FavoriteProxyController } from './favorite-proxy.controller';
import { WisataProxyService } from '../wisata-proxy/wisata-proxy.service';

@Module({
  imports: [HttpModule],
  controllers: [FavoriteProxyController],
  providers: [WisataProxyService],
})
export class FavoriteProxyModule {}
