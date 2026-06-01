import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateKategoriDto } from './dto/create-kategori.dto';

@Injectable()
export class KategoriService {
  constructor(private prisma: PrismaService) {}

  create(createKategoriDto: CreateKategoriDto) {
    return this.prisma.kategori.create({ data: createKategoriDto });
  }
}
