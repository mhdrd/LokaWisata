import { IsString, IsOptional, IsInt, IsNotEmpty } from 'class-validator';

export class CreateWisataImageDto {
  @IsString()
  @IsOptional()
  caption?: string;

  @IsInt()
  @IsNotEmpty()
  wisataId: number;
}
