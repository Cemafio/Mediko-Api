import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PharmacyService } from './pharmacy.service';
import { CreatePharmacyDto } from './dto/create-pharmacy.dto';
import { get } from 'node:http';
import { UpdatePharmacyDto } from './dto/update-pharmacies';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard/jwt-auth.guard';

@Controller('pharmacies')
// @UseGuards(JwtAuthGuard)
export class PharmacyController {
  constructor(private readonly pharmacyService: PharmacyService) {}

  @Get()
  findAll() {
    return this.pharmacyService.findAll();
  }

  @Post()
  create(@Body() createPharmacyDto: CreatePharmacyDto) {
    return this.pharmacyService.create(createPharmacyDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pharmacyService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePharmacyDto: UpdatePharmacyDto,
  ) {
    return this.pharmacyService.update(id, updatePharmacyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pharmacyService.remove(id);
  }
}