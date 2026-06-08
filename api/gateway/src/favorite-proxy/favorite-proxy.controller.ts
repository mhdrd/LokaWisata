import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { WisataProxyService } from '../wisata-proxy/wisata-proxy.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('favorite')
@UseGuards(JwtAuthGuard)
export class FavoriteProxyController {
  constructor(private readonly proxyService: WisataProxyService) {}

  @Post('toggle')
  toggle(@Body() body: any, @Request() req) {
    return this.proxyService.post('/favorite/toggle', {
      ...body,
      userId: req.user.id,
    });
  }

  @Get()
  findMyFavorites(@Request() req) {
    return this.proxyService.get(`/favorite/user/${req.user.id}`);
  }
}
