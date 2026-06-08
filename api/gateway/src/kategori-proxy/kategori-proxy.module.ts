import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { KategoriProxyController } from './kategori-proxy.controller';
import { WisataProxyService } from '../wisata-proxy/wisata-proxy.service';

@Module({
  imports: [HttpModule],
  controllers: [KategoriProxyController],
  providers: [WisataProxyService],
})
export class KategoriProxyModule {}
