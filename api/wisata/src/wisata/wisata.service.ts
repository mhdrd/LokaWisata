import { Injectable } from '@nestjs/common';
import { CreateWisataDto } from './dto/create-wisata.dto';
import { UpdateWisataDto } from './dto/update-wisata.dto';

@Injectable()
export class WisataService {
  create(createWisataDto: CreateWisataDto) {
    return 'This action adds a new wisata';
  }

  findAll() {
    return `This action returns all wisata`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wisata`;
  }

  update(id: number, updateWisataDto: UpdateWisataDto) {
    return `This action updates a #${id} wisata`;
  }

  remove(id: number) {
    return `This action removes a #${id} wisata`;
  }
}
