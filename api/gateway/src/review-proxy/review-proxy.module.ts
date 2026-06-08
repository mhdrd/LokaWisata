import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ReviewProxyController } from './review-proxy.controller';
import { WisataProxyService } from '../wisata-proxy/wisata-proxy.service';

@Module({
  imports: [HttpModule],
  controllers: [ReviewProxyController],
  providers: [WisataProxyService],
})
export class ReviewProxyModule {}
