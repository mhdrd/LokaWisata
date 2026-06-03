import { Controller, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { WisataProxyService } from '../wisata-proxy/wisata-proxy.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('wisata-image')
export class ImageProxyController {
  constructor(private readonly proxyService: WisataProxyService) {}

  @Get('wisata/:wisataId')
  findByWisata(@Param('wisataId') wisataId: string) {
    return this.proxyService.get(`/wisata-image/wisata/${wisataId}`);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.proxyService.delete(`/wisata-image/${id}`);
  }
}
