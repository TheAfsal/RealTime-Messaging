import { Test, TestingModule } from '@nestjs/testing';
import { ClientBService } from './client-b.service';

describe('ClientBService', () => {
  let service: ClientBService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientBService],
    }).compile();

    service = module.get<ClientBService>(ClientBService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
