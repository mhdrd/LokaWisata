import { Injectable } from '@nestjs/common';
import { throwIfNotExist } from '../common/utils/not-exist.util';
import { PrismaService } from '../prisma.service';
import { CreateKategoriDto } from './dto/create-kategori.dto';
import { UpdateKategoriDto } from './dto/update-kategori.dto';

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
    throwIfNotExist(kategori, 'Kategori', id);
    return kategori;
  }

  async update(id: number, updateKategoriDto: UpdateKategoriDto) {
    await this.findOne(id);
    return this.prisma.kategori.update({
      where: { id },
      data: updateKategoriDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.kategori.delete({ where: { id } });
  }
}
