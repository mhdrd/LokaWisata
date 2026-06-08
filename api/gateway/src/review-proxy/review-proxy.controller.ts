import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { WisataProxyService } from '../wisata-proxy/wisata-proxy.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('review')
export class ReviewProxyController {
  constructor(private readonly proxyService: WisataProxyService) {}

  @Get()
  findAll() {
    return this.proxyService.get('/review');
  }

  @Get('wisata/:wisataId')
  findByWisata(@Param('wisataId') wisataId: string) {
    return this.proxyService.get(`/review/wisata/${wisataId}`);
  }

  @Get('wisata/:wisataId/average')
  getAverageRating(@Param('wisataId') wisataId: string) {
    return this.proxyService.get(`/review/wisata/${wisataId}/average`);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.proxyService.get(`/review/${id}`);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: any, @Request() req) {
    return this.proxyService.post('/review', { ...body, userId: req.user.id });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.proxyService.patch(`/review/${id}`, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.proxyService.delete(`/review/${id}`);
  }
}
