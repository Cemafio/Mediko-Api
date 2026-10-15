import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PharmacyModule } from './pharmacy/pharmacy.module';
import { MedicineModule } from './medicine/medicine.module';
import { AuthModule } from './auth/auth.module';
import { PharmacyMedicineService } from './pharmacy-medicine/pharmacy-medicine.service';
import { PharmacyMedicineModule } from './pharmacy-medicine/pharmacy-medicine.module';
import { PharmacyStockService } from './pharmacy-stock/pharmacy-stock.service';
import { PharmacyStockModule } from './pharmacy-stock/pharmacy-stock.module';

@Module({
  imports: [PrismaModule, PharmacyModule, MedicineModule, AuthModule, PharmacyMedicineModule, PharmacyStockModule,PharmacyStockModule],
  controllers: [AppController],
  providers: [AppService, PharmacyMedicineService, PharmacyStockService],
})
export class AppModule {}
