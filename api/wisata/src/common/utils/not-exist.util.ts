import { NotFoundException } from '@nestjs/common';

export function throwIfNotExist(entity: any, name: string, id: number) {
  if (!entity) {
    throw new NotFoundException(`${name} dengan id ${id} tidak ditemukan`);
  }
}
