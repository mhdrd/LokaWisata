import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Injectable()
export class FavoriteService {
  constructor(private prisma: PrismaService) {}

  async toggle(createFavoriteDto: CreateFavoriteDto) {
    const { userId, wisataId } = createFavoriteDto;
    const existing = await this.prisma.favorite.findUnique({
      where: { userId_wisataId: { userId, wisataId } },
    });

    if (existing) {
      await this.prisma.favorite.delete({ where: { id: existing.id } });
      return { message: 'Wisata dihapus dari favorit', favorited: false };
    }

    await this.prisma.favorite.create({ data: { userId, wisataId } });
    return { message: 'Wisata ditambahkan ke favorit', favorited: true };
  }

  findByUser(userId: number) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: { wisata: true },
    });
  }
}
