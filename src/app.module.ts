import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PharmacyModule } from './pharmacy/pharmacy.module';
import { MedicineModule } from './medicine/medicine.module';
import { AuthModule } from './auth/auth.module';
import { PharmacyMedicineService } from './pharmacy-medicine/pharmacy-medicine.service';
import { PharmacyMedicineModule } from './pharmacy-medicine/pharmacy-medicine.module';

@Module({
  imports: [PrismaModule, PharmacyModule, MedicineModule, AuthModule, PharmacyMedicineModule],
  controllers: [AppController],
  providers: [AppService, PharmacyMedicineService],
})
export class AppModule {}
