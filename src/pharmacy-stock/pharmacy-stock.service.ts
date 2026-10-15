import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from 'generated/prisma/browser';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStockItemDto, UpdateStockItemDto } from './dto/pharmacy-stock.dto';

const include = { medicine: true } satisfies Prisma.PharmacyMedicineInclude;

type Row = Prisma.PharmacyMedicineGetPayload<{ include: typeof include }>;

/** Vue fusionnée Medicine + PharmacyMedicine, au format attendu par le front */
function toStockItem(row: Row) {
  return {
    id: row.medicineId,
    name: row.medicine.name,
    description: row.medicine.description ?? '',
    dosage: row.medicine.dosage ?? '',
    price: row.price,
    quantity: row.quantity,
  };
}

const same = (a?: string | null, b?: string | null) =>
  (a ?? '').trim().toLowerCase() === (b ?? '').trim().toLowerCase();

@Injectable()
export class PharmacyStockService {
  constructor(private readonly prisma: PrismaService) {}

  /** Retrouve le médicament du catalogue (nom + dosage) ou le crée */
  private async findOrCreateMedicine(
    tx: Prisma.TransactionClient,
    data: { name: string; dosage: string; description?: string },
  ) {
    const name = data.name.trim();
    const dosage = data.dosage.trim();

    const existing = await tx.medicine.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
        dosage: { equals: dosage, mode: 'insensitive' },
      },
    });

    if (existing) return existing;

    return tx.medicine.create({
      data: { name, dosage, description: data.description?.trim() ?? '' },
    });
  }

  private async getRow(pharmacyId: string, medicineId: string) {
    const row = await this.prisma.pharmacyMedicine.findUnique({
      where: { pharmacyId_medicineId: { pharmacyId, medicineId } },
      include,
    });

    if (!row) throw new NotFoundException('Médicament introuvable dans votre stock.');
    return row;
  }

  async findAll(pharmacyId: string) {
    const rows = await this.prisma.pharmacyMedicine.findMany({
      where: { pharmacyId },
      include,
      orderBy: { medicine: { name: 'asc' } },
    });

    return rows.map(toStockItem);
  }

  async create(pharmacyId: string, dto: CreateStockItemDto) {
    return this.prisma.$transaction(async (tx) => {
      const medicine = await this.findOrCreateMedicine(tx, dto);

      const already = await tx.pharmacyMedicine.findUnique({
        where: {
          pharmacyId_medicineId: { pharmacyId, medicineId: medicine.id },
        },
      });

      if (already) {
        throw new ConflictException(
          'Ce médicament est déjà dans votre stock. Modifiez-le plutôt.',
        );
      }

      const row = await tx.pharmacyMedicine.create({
        data: {
          pharmacyId,
          medicineId: medicine.id,
          price: dto.price,
          quantity: dto.quantity,
        },
        include,
      });

      return toStockItem(row);
    });
  }

  async update(pharmacyId: string, medicineId: string, dto: UpdateStockItemDto) {
    const current = await this.getRow(pharmacyId, medicineId);

    const name = dto.name ?? current.medicine.name;
    const dosage = dto.dosage ?? current.medicine.dosage ?? '';

    const identityChanged =
      !same(name, current.medicine.name) ||
      !same(dosage, current.medicine.dosage);

    return this.prisma.$transaction(async (tx) => {
      // Nom ou dosage modifié : on déplace le stock vers le bon médicament du catalogue
      if (identityChanged) {
        const target = await this.findOrCreateMedicine(tx, {
          name,
          dosage,
          description: dto.description ?? current.medicine.description ?? '',
        });

        if (target.id !== medicineId) {
          const duplicate = await tx.pharmacyMedicine.findUnique({
            where: {
              pharmacyId_medicineId: { pharmacyId, medicineId: target.id },
            },
          });

          if (duplicate) {
            throw new ConflictException(
              'Un médicament identique existe déjà dans votre stock.',
            );
          }

          await tx.pharmacyMedicine.delete({
            where: { pharmacyId_medicineId: { pharmacyId, medicineId } },
          });

          const moved = await tx.pharmacyMedicine.create({
            data: {
              pharmacyId,
              medicineId: target.id,
              price: dto.price ?? current.price,
              quantity: dto.quantity ?? current.quantity,
            },
            include,
          });

          return toStockItem(moved);
        }
      }

      // Description : modifiable seulement si aucune autre pharmacie n'utilise ce médicament
      if (dto.description !== undefined) {
        const owners = await tx.pharmacyMedicine.count({ where: { medicineId } });

        if (owners === 1) {
          await tx.medicine.update({
            where: { id: medicineId },
            data: { description: dto.description.trim() },
          });
        }
      }

      const row = await tx.pharmacyMedicine.update({
        where: { pharmacyId_medicineId: { pharmacyId, medicineId } },
        data: { price: dto.price, quantity: dto.quantity },
        include,
      });

      return toStockItem(row);
    });
  }

  async remove(pharmacyId: string, medicineId: string) {
    await this.getRow(pharmacyId, medicineId);

    // On supprime seulement le stock de cette pharmacie, pas le catalogue
    await this.prisma.pharmacyMedicine.delete({
      where: { pharmacyId_medicineId: { pharmacyId, medicineId } },
    });

    return { deleted: true };
  }
}