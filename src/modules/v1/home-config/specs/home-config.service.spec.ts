import { Test, TestingModule } from '@nestjs/testing';
import { HomeConfigService } from '../home-config.service';

describe('HomeConfigService', () => {
  let service: HomeConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HomeConfigService],
    }).compile();

    service = module.get<HomeConfigService>(HomeConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
