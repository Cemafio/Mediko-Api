import { Test, TestingModule } from '@nestjs/testing';
import { PharmacyMedicineController } from './pharmacy-medicine.controller';

describe('PharmacyMedicineController', () => {
  let controller: PharmacyMedicineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PharmacyMedicineController],
    }).compile();

    controller = module.get<PharmacyMedicineController>(PharmacyMedicineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
