import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreatePharmacyDto } from './dto/create-pharmacy.dto';
import { OpeningHourDto } from './dto/opening-hour.dto';
import { UpdatePharmacyDto } from './dto/update-pharmacies';
import { Prisma } from 'generated/prisma/browser';

function validateHours(hours: OpeningHourDto[] = []) {
  for (const h of hours) {
    if (h.opensAt === h.closesAt) {
      throw new BadRequestException(
        `Jour ${h.dayOfWeek} : l'ouverture et la fermeture doivent être différentes.`,
      );
    }
  }

  // Deux plages identiques le même jour violeraient la contrainte unique
  const keys = hours.map((h) => `${h.dayOfWeek}-${h.opensAt}`);
  if (new Set(keys).size !== keys.length) {
    throw new BadRequestException('Plages horaires en double.');
  }
}

@Injectable()
export class PharmacyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePharmacyDto) {
    const { openingHours, ...data } = dto;
    validateHours(openingHours);

    return this.prisma.pharmacy.create({
      data: {
        ...data,
        openingHours: openingHours?.length
          ? { create: openingHours }
          : undefined,
      },
      include: { openingHours: true },
    });
  }

  findAll() {
    return this.prisma.pharmacy.findMany({
      include: {
        openingHours: { orderBy: [{ dayOfWeek: 'asc' }, { opensAt: 'asc' }] },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const pharmacy = await this.prisma.pharmacy.findUnique({
      where: { id },
      include: {
        openingHours: { orderBy: [{ dayOfWeek: 'asc' }, { opensAt: 'asc' }] },
      },
    });

    if (!pharmacy) throw new NotFoundException('Pharmacie introuvable.');
    return pharmacy;
  }

  async update(id: string, dto: UpdatePharmacyDto) {
    await this.findOne(id);

    const { openingHours, ...data } = dto;
    validateHours(openingHours);

    try {
      return await this.prisma.pharmacy.update({
        where: { id },
        data: {
          ...data,
          // Si openingHours est envoyé, il remplace entièrement les anciens horaires
          ...(openingHours && {
            openingHours: {
              deleteMany: {},
              create: openingHours,
            },
          }),
        },
        include: { openingHours: true },
      });
    } catch (e) {
      // if (
      //   e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002'
      // ) {
      //   throw new ConflictException('Valeur déjà utilisée.');
      // }
      throw e;
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.pharmacy.delete({ where: { id } });
    return { deleted: true };
  }
}