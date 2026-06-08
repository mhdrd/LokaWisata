import { Controller, Post, Get, Delete, Param, Body, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { WisataImageService } from './wisata-image.service';
import { InternalGuard } from '../internal.guard';
import { multerConfig } from '../common/config/multer.config';

@Controller('wisata-image')
@UseGuards(InternalGuard)
export class WisataImageController {
  constructor(private readonly wisataImageService: WisataImageService) {}

  @Post(':wisataId')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  upload(
    @Param('wisataId') wisataId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('caption') caption?: string,
  ) {
    const url = `/uploads/${file.filename}`;
    return this.wisataImageService.create(+wisataId, url, caption);
  }

  @Get('wisata/:wisataId')
  findByWisata(@Param('wisataId') wisataId: string) {
    return this.wisataImageService.findByWisata(+wisataId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wisataImageService.remove(+id);
  }
}
