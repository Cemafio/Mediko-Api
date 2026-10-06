import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePharmacyDto } from './dto/create-pharmacy.dto';
import { UpdatePharmacyDto } from './dto/update-pharmacies';

@Injectable()
export class PharmacyService {
  constructor(
    private readonly prisma: PrismaService 
  ) {}

  async findAll() {
    return this.prisma.pharmacy.findMany();
  }

  async create(createPharmacyDto: CreatePharmacyDto) {
    return this.prisma.pharmacy.create({
      data: createPharmacyDto,
    });
  }

  async findOne(id: string){
    return this.prisma.pharmacy.findUnique(
      {
        where: { id }
      }
    )
  }
  
  async update(id: string, updatePharmacyDto: UpdatePharmacyDto) {
    return this.prisma.pharmacy.update({
      where: { id },
      data: updatePharmacyDto,
    });
  }

  async remove(id: string) {
    return this.prisma.pharmacy.delete({
      where: { id },
    });
  }
}