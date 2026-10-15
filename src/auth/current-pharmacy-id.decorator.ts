import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/** Renvoie l'id de la pharmacie, calculé par PharmacyGuard */
export const CurrentPharmacyId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    return ctx.switchToHttp().getRequest().pharmacyId;
  },
);