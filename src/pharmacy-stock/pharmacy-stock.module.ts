import { Module } from '@nestjs/common';
import { PharmacyStockController } from './pharmacy-stock.controller';
import { PharmacyStockService } from './pharmacy-stock.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [PharmacyStockController],
  providers: [PharmacyStockService],
})
export class PharmacyStockModule {}