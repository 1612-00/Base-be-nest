import { Test, TestingModule } from '@nestjs/testing';
import { TechStacksController } from '../tech-stacks.controller';

describe('TechStacksController', () => {
  let controller: TechStacksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TechStacksController],
    }).compile();

    controller = module.get<TechStacksController>(TechStacksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
