import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePharmacyMedicineDto } from './dto/CreatePharmacy-medicine.dto';
import { UpdatePharmacyMedicineDto } from './dto/updatePharmacy-medicine.dto';

@Injectable()
export class PharmacyMedicineService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createPharmacyMedicineDto: CreatePharmacyMedicineDto) {
        return this.prisma.pharmacyMedicine.create({
            data: {
                price: createPharmacyMedicineDto.price,
                quantity: createPharmacyMedicineDto.quantity,

                pharmacy: {
                    connect: {
                        id: createPharmacyMedicineDto.pharmacyId,
                    },
                },

                medicine: {
                    connect: {
                        id: createPharmacyMedicineDto.medicineId,
                    },
                },
            },
        });
    }

    async findAll() {
        return this.prisma.pharmacyMedicine.findMany({
            include: {
                pharmacy: true,
                medicine: true,
            },
        });
    }

    async findOne(pharmacyId: string, medicineId: string) {
        return this.prisma.pharmacyMedicine.findUnique({
            where: {
                pharmacyId_medicineId: {
                    pharmacyId,
                    medicineId,
                },
            },
            include: {
                pharmacy: true,
                medicine: true,
            },
        });
    }

    async update(
        pharmacyId: string,
        medicineId: string,
        updatePharmacyMedicineDto: UpdatePharmacyMedicineDto,
    ) {
        return this.prisma.pharmacyMedicine.update({
            where: {
                pharmacyId_medicineId: {
                    pharmacyId,
                    medicineId,
                },
            },
            data: updatePharmacyMedicineDto,
        });
    }

    async remove(pharmacyId: string, medicineId: string) {
        return this.prisma.pharmacyMedicine.delete({
            where: {
                pharmacyId_medicineId: {
                    pharmacyId,
                    medicineId,
                },
            },
        });
    }
}