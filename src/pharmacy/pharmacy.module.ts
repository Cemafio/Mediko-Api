import { Module } from '@nestjs/common';
import { PharmacyService } from './pharmacy.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PharmacyController } from './pharmacy.controller';

@Module({
  imports: [PrismaModule],
  providers: [PharmacyService],
  controllers: [PharmacyController],
})
export class PharmacyModule {}