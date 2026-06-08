import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { WisataService } from './wisata.service';
import { CreateWisataDto } from './dto/create-wisata.dto';
import { UpdateWisataDto } from './dto/update-wisata.dto';
import { QueryWisataDto } from './dto/query-wisata.dto';
import { InternalGuard } from '../internal.guard';

@Controller('wisata')
@UseGuards(InternalGuard)
export class WisataController {
  constructor(private readonly wisataService: WisataService) {}

  @Post()
  create(@Body() createWisataDto: CreateWisataDto) {
    return this.wisataService.create(createWisataDto);
  }

  @Get()
  findAll(@Query() query: QueryWisataDto) {
    return this.wisataService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wisataService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWisataDto: UpdateWisataDto) {
    return this.wisataService.update(+id, updateWisataDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wisataService.remove(+id);
  }
}
