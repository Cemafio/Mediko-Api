import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PharmacyGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const email: string | undefined = req.user?.email?.trim().toLowerCase();

    if (!email) {
      throw new ForbiddenException('Non authentifié.');
    }

    const user = await this.prisma.user.findUnique({ where: { email } });

    // if (!user || user.role !== 'PHARMACY') {
    //   throw new ForbiddenException('Ce compte n’est pas un compte pharmacie.');
    // }    

    // if (user.status !== 'ACTIVE') {
    //   throw new ForbiddenException('Votre compte est en attente de validation.');
    // }

    // Lien compte ↔ pharmacie : même email
    const pharmacy = await this.prisma.pharmacy.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!pharmacy) {
      throw new ForbiddenException('Compte non associé à une pharmacie.');
    }

    req.pharmacyId = pharmacy.id;
    return true;
  }
}