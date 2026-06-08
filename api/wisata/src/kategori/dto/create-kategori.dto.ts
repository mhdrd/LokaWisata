import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateKategoriDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
