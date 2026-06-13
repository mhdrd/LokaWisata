import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateWisataDto } from './dto/create-wisata.dto';
import { UpdateWisataDto } from './dto/update-wisata.dto';
import { QueryWisataDto } from './dto/query-wisata.dto';
import { throwIfNotExist } from '../common/utils/not-exist.util';

@Injectable()
export class WisataService {
  constructor(private prisma: PrismaService) {}

  create(createWisataDto: CreateWisataDto) {
    return this.prisma.wisata.create({ data: createWisataDto });
  }

  async findAll(query: QueryWisataDto) {
    const { search, kategoriId, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = query;

    const where: any = {};

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    if (kategoriId) {
      where.kategoriId = kategoriId;
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.wisata.findMany({
        where,
        include: { kategori: true, images: true },
        skip,
        take: limit,
        orderBy: { [sortBy]: order },
      }),
      this.prisma.wisata.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const wisata = await this.prisma.wisata.findUnique({ 
      where: { id },
      include: { kategori: true, images: true }
    });
    throwIfNotExist(wisata, 'Wisata', id);
    return wisata;
  }

  async update(id: number, updateWisataDto: UpdateWisataDto) {
    await this.findOne(id);
    return this.prisma.wisata.update({
      where: { id },
      data: updateWisataDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.wisata.delete({ where: { id } });
  }
}