import { Injectable } from '@nestjs/common';
import { throwIfNotExist } from '../common/utils/not-exist.util';
import { PrismaService } from '../prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  create(createReviewDto: CreateReviewDto) {
    return this.prisma.review.create({ data: createReviewDto });
  }

  findAll() {
    return this.prisma.review.findMany({
      include: { wisata: true },
    });
  }

  findByWisata(wisataId: number) {
    return this.prisma.review.findMany({
      where: { wisataId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    throwIfNotExist(review, 'Review', id);
    return review;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    await this.findOne(id);
    return this.prisma.review.update({
      where: { id },
      data: updateReviewDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.review.delete({ where: { id } });
  }

  async getAverageRating(wisataId: number) {
    const result = await this.prisma.review.aggregate({
      where: { wisataId },
      _avg: { rating: true },
      _count: { rating: true },
    });
    return {
      wisataId,
      averageRating: result._avg.rating ?? 0,
      totalReviews: result._count.rating,
    };
  }
}
