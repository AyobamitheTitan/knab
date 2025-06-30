import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Transactions,
  TransactionsSchema,
} from './schemas/transactions.schema';
import { TransactionsResolver } from './transactions.resolver';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRESIN') },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: Transactions.name, schema: TransactionsSchema },
    ]),
  ],
  providers: [TransactionsService, TransactionsResolver],
})
export class TransactionsModule {}
