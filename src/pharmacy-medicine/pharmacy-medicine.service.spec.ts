import { Test, TestingModule } from '@nestjs/testing';
import { PharmacyMedicineService } from './pharmacy-medicine.service';

describe('PharmacyMedicineService', () => {
  let service: PharmacyMedicineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PharmacyMedicineService],
    }).compile();

    service = module.get<PharmacyMedicineService>(PharmacyMedicineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
