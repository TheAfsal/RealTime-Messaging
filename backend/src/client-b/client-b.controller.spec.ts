import { Test, TestingModule } from '@nestjs/testing';
import { ClientBController } from './client-b.controller';

describe('ClientBController', () => {
  let controller: ClientBController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientBController],
    }).compile();

    controller = module.get<ClientBController>(ClientBController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
