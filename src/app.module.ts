import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PharmacyModule } from './pharmacy/pharmacy.module';
import { MedicineModule } from './medicine/medicine.module';

@Module({
  imports: [PrismaModule, PharmacyModule, MedicineModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
