import { Module } from '@nestjs/common';
import { PharmacyMedicineController } from './pharmacy-medicine.controller';
import { PharmacyMedicineService } from './pharmacy-medicine.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PharmacyMedicineController],
  providers: [PharmacyMedicineService],
})
export class PharmacyMedicineModule {}