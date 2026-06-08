import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { WisataProxyService } from '../wisata-proxy/wisata-proxy.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('kategori')
export class KategoriProxyController {
  constructor(private readonly proxyService: WisataProxyService) {}

  @Get()
  findAll() {
    return this.proxyService.get('/kategori');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.proxyService.get(`/kategori/${id}`);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() body: any) {
    return this.proxyService.post('/kategori', body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.proxyService.patch(`/kategori/${id}`, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.proxyService.delete(`/kategori/${id}`);
  }
}
