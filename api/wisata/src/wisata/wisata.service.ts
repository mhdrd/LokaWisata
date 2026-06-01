import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateWisataDto } from './dto/create-wisata.dto';
import { UpdateWisataDto } from './dto/update-wisata.dto';

@Injectable()
export class WisataService {
  constructor(private prisma: PrismaService) {}

  create(createWisataDto: CreateWisataDto) {
    return this.prisma.wisata.create({ data: createWisataDto });
  }

  findAll() {
    return this.prisma.wisata.findMany({ include: { kategori: true } });
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

  remove(id: number) {
    return this.prisma.wisata.delete({ where: { id } });
  }
}