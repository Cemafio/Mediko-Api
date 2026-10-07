import { Injectable } from '@nestjs/common';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MedicineService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMedicineDto: CreateMedicineDto) {
    return this.prisma.medicine.create({
      data: createMedicineDto,
    });
  }

  async findAll() {
    return this.prisma.medicine.findMany({
      include: {
        pharmacy: {
          include: {
            pharmacy: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.medicine.findUnique({
      where: {
        id,
      },
      include: {
        pharmacy: {
          include: {
            pharmacy: true,
          },
        },
      },
    });
  }

  async update(id: string, updateMedicineDto: UpdateMedicineDto) {
    return this.prisma.medicine.update({
      where: { id },
      data: updateMedicineDto,
    });
  }

  async remove(id: string) {
    return this.prisma.medicine.delete({
      where: { id },
    });
  }
}