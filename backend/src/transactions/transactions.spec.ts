import { Test, TestingModule } from '@nestjs/testing';
import { Transactions } from './transactions';

describe('Transactions', () => {
  let provider: Transactions;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Transactions],
    }).compile();

    provider = module.get<Transactions>(Transactions);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
