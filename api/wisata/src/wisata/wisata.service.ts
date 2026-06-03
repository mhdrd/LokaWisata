import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateWisataDto } from './dto/create-wisata.dto';
import { UpdateWisataDto } from './dto/update-wisata.dto';
import { QueryWisataDto } from './dto/query-wisata.dto';

@Injectable()
export class WisataService {
  constructor(private prisma: PrismaService) {}

  create(createWisataDto: CreateWisataDto) {
    return this.prisma.wisata.create({ data: createWisataDto });
  }

  async findAll(query: QueryWisataDto) {
    const { search } = query;

    const where: any = {};

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const data = await this.prisma.wisata.findMany({
      where,
      include: { kategori: true },
    });

    return data;
  }

  async findOne(id: number) {
    const wisata = await this.prisma.wisata.findUnique({ 
      where: { id },
      include: { kategori: true }
    });
    if (!wisata) {
      throw new NotFoundException(`Wisata dengan id ${id} tidak ditemukan`);
    }
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