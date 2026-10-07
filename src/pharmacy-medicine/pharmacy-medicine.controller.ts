import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { PharmacyMedicineService } from './pharmacy-medicine.service';
import { CreatePharmacyMedicineDto } from './dto/CreatePharmacy-medicine.dto';
import { UpdatePharmacyMedicineDto } from './dto/updatePharmacy-medicine.dto';

@Controller('pharmacy-medicine')
export class PharmacyMedicineController {
  constructor(
    private readonly pharmacyMedicineService: PharmacyMedicineService,
  ) {}

  @Post()
  create(
    @Body() createPharmacyMedicineDto: CreatePharmacyMedicineDto,
  ) {
    return this.pharmacyMedicineService.create(
      createPharmacyMedicineDto,
    );
  }

  @Get()
  findAll() {
    return this.pharmacyMedicineService.findAll();
  }

  @Get(':pharmacyId/:medicineId')
  findOne(
    @Param('pharmacyId') pharmacyId: string,
    @Param('medicineId') medicineId: string,
  ) {
    return this.pharmacyMedicineService.findOne(
      pharmacyId,
      medicineId,
    );
  }

  @Patch(':pharmacyId/:medicineId')
  update(
    @Param('pharmacyId') pharmacyId: string,
    @Param('medicineId') medicineId: string,
    @Body() updatePharmacyMedicineDto: UpdatePharmacyMedicineDto,
  ) {
    return this.pharmacyMedicineService.update(
      pharmacyId,
      medicineId,
      updatePharmacyMedicineDto,
    );
  }

  @Delete(':pharmacyId/:medicineId')
  remove(
    @Param('pharmacyId') pharmacyId: string,
    @Param('medicineId') medicineId: string,
  ) {
    return this.pharmacyMedicineService.remove(
      pharmacyId,
      medicineId,
    );
  }
}