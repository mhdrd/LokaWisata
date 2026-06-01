import { Test, TestingModule } from '@nestjs/testing';
import { WisataController } from './wisata.controller';
import { WisataService } from './wisata.service';

describe('WisataController', () => {
  let controller: WisataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WisataController],
      providers: [WisataService],
    }).compile();

    controller = module.get<WisataController>(WisataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
