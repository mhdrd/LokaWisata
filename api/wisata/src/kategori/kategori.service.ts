import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateKategoriDto } from './dto/create-kategori.dto';

@Injectable()
export class KategoriService {
  constructor(private prisma: PrismaService) {}

  create(createKategoriDto: CreateKategoriDto) {
    return this.prisma.kategori.create({ data: createKategoriDto });
  }

  findAll() {
    return this.prisma.kategori.findMany({
      include: { _count: { select: { wisatas: true } } },
    });
  }

  async findOne(id: number) {
    const kategori = await this.prisma.kategori.findUnique({
      where: { id },
      include: { wisatas: true },
    });
    if (!kategori) {
      throw new NotFoundException(`Kategori dengan id ${id} tidak ditemukan`);
    }
    return kategori;
  }
}
