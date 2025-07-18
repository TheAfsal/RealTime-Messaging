import { Test, TestingModule } from '@nestjs/testing';
import { ClientAController } from './client-a.controller';

describe('ClientAController', () => {
  let controller: ClientAController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientAController],
    }).compile();

    controller = module.get<ClientAController>(ClientAController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
