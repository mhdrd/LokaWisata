import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class WisataImageService {
  constructor(private prisma: PrismaService) {}

  async create(wisataId: number, url: string, caption?: string) {
    return this.prisma.wisataImage.create({
      data: { wisataId, url, caption },
    });
  }

  findByWisata(wisataId: number) {
    return this.prisma.wisataImage.findMany({
      where: { wisataId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(id: number) {
    const image = await this.prisma.wisataImage.findUnique({ where: { id } });
    if (!image) {
      throw new NotFoundException(`Gambar dengan id ${id} tidak ditemukan`);
    }
    return this.prisma.wisataImage.delete({ where: { id } });
  }
}
