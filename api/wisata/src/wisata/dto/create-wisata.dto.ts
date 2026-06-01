import { IsString, IsOptional, IsNumber, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateWisataDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  contactWa?: string;

  @IsEmail()
  @IsOptional()
  contactEmail?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsNumber()
  @IsNotEmpty()
  kategoriId: number;
}
