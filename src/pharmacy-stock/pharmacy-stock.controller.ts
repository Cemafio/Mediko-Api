import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentPharmacyId } from 'src/auth/current-pharmacy-id.decorator';
import { PharmacyStockService } from './pharmacy-stock.service';
import { CreateStockItemDto, UpdateStockItemDto } from './dto/pharmacy-stock.dto';
import { PharmacyGuard } from 'src/auth/pharmacy.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard/jwt-auth.guard';
import { Role } from 'generated/prisma/enums';

@UseGuards(JwtAuthGuard,PharmacyGuard)
@Controller('pharmacy/stock')
export class PharmacyStockController {
  constructor(private readonly stockService: PharmacyStockService) {}

  @Get()
  findAll(@CurrentPharmacyId() pharmacyId: string) {
    return this.stockService.findAll(pharmacyId);
  }

  @Post()
  create(
    @CurrentPharmacyId() pharmacyId: string,
    @Body() dto: CreateStockItemDto,
  ) {
    return this.stockService.create(pharmacyId, dto);
  }

  @Patch(':medicineId')
  update(
    @CurrentPharmacyId() pharmacyId: string,
    @Param('medicineId') medicineId: string,
    @Body() dto: UpdateStockItemDto,
  ) {
    return this.stockService.update(pharmacyId, medicineId, dto);
  }

  @Delete(':medicineId')
  remove(
    @CurrentPharmacyId() pharmacyId: string,
    @Param('medicineId') medicineId: string,
  ) {
    return this.stockService.remove(pharmacyId, medicineId);
  }
}