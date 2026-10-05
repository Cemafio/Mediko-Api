import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getMedicines(): string {
    return 'Liste des medicament';
  }
}
