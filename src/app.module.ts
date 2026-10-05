import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PharmacyModule } from './pharmacy/pharmacy.module';

@Module({
  imports: [PrismaModule, PharmacyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
