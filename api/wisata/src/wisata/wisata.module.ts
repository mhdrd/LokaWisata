import { Module } from '@nestjs/common';
import { WisataService } from './wisata.service';
import { WisataController } from './wisata.controller';

@Module({
  controllers: [WisataController],
  providers: [WisataService],
})
export class WisataModule {}
