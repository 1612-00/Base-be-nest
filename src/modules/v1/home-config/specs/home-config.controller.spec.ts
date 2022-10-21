import { Test, TestingModule } from '@nestjs/testing';
import { HomeConfigController } from '../home-config.controller';

describe('HomeConfigController', () => {
  let controller: HomeConfigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomeConfigController],
    }).compile();

    controller = module.get<HomeConfigController>(HomeConfigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
