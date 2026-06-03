import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { WisataProxyService } from './wisata-proxy.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('wisata')
export class WisataProxyController {
  constructor(private readonly wisataProxyService: WisataProxyService) {}

  @Get()
  findAll(@Query() query: any) {
    const queryString = new URLSearchParams(query).toString();
    return this.wisataProxyService.get(`/wisata?${queryString}`);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wisataProxyService.get(`/wisata/${id}`);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() body: any) {
    return this.wisataProxyService.post('/wisata', body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.wisataProxyService.patch(`/wisata/${id}`, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wisataProxyService.delete(`/wisata/${id}`);
  }
}
