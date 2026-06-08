import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ImageProxyController } from './image-proxy.controller';
import { WisataProxyService } from '../wisata-proxy/wisata-proxy.service';

@Module({
  imports: [HttpModule],
  controllers: [ImageProxyController],
  providers: [WisataProxyService],
})
export class ImageProxyModule {}
