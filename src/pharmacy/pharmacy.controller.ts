import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreatePharmacyDto } from './dto/create-pharmacy.dto';
import { PharmacyService } from './pharmacy.service';
import { UpdatePharmacyDto } from './dto/update-pharmacies';

@Controller('pharmacies')
export class PharmacyController {
  constructor(private readonly pharmacyService: PharmacyService) {}

  @Post()
  create(@Body() dto: CreatePharmacyDto) {
    return this.pharmacyService.create(dto);
  }

  @Get()
  findAll() {
    return this.pharmacyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pharmacyService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePharmacyDto) {
    return this.pharmacyService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pharmacyService.remove(id);
  }
}