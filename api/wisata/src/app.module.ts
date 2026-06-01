import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WisataModule } from './wisata/wisata.module';

@Module({
  imports: [WisataModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
