import { ConflictException } from '@nestjs/common';

export function throwIfConflict(entity: any, field: string) {
  if (entity) {
    throw new ConflictException(`Data dengan ${field} tersebut sudah ada`);
  }
}
