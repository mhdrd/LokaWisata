import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { InternalGuard } from '../internal.guard';

@Controller('favorite')
@UseGuards(InternalGuard)
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post('toggle')
  toggle(@Body() createFavoriteDto: CreateFavoriteDto) {
    return this.favoriteService.toggle(createFavoriteDto);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.favoriteService.findByUser(+userId);
  }
}
