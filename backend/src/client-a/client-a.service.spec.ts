import { Test, TestingModule } from '@nestjs/testing';
import { ClientAService } from './client-a.service';

describe('ClientAService', () => {
  let service: ClientAService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientAService],
    }).compile();

    service = module.get<ClientAService>(ClientAService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
