import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InternalGuard } from '../internal.guard';

@Controller('review')
@UseGuards(InternalGuard)
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.create(createReviewDto);
  }

  @Get()
  findAll() {
    return this.reviewService.findAll();
  }

  @Get('wisata/:wisataId')
  findByWisata(@Param('wisataId') wisataId: string) {
    return this.reviewService.findByWisata(+wisataId);
  }

  @Get('wisata/:wisataId/average')
  getAverageRating(@Param('wisataId') wisataId: string) {
    return this.reviewService.getAverageRating(+wisataId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewService.update(+id, updateReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewService.remove(+id);
  }
}
