import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PharmacyModule } from './pharmacy/pharmacy.module';
import { MedicineModule } from './medicine/medicine.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, PharmacyModule, MedicineModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
