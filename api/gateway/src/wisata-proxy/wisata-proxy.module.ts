import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WisataProxyService } from './wisata-proxy.service';
import { WisataProxyController } from './wisata-proxy.controller';

@Module({
  imports: [HttpModule],
  controllers: [WisataProxyController],
  providers: [WisataProxyService],
})
export class WisataProxyModule {}
