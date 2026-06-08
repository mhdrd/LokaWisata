import { PartialType } from '@nestjs/mapped-types';
import { CreateWisataDto } from './create-wisata.dto';

export class UpdateWisataDto extends PartialType(CreateWisataDto) {}
