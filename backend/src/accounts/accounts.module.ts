import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from './schemas/accounts.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from 'src/token/token.service';
import { TransactionsService } from 'src/transactions/transactions.service';
import { Transactions, TransactionsSchema } from 'src/transactions/schemas/transactions.schema';
import { UserService } from 'src/user/user.service';
import { User, UserSchema } from 'src/auth/schemas/user.schema';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>("JWT_EXPIRESIN") },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }, {name: Transactions.name, schema: TransactionsSchema}, {name: User.name, schema:UserSchema}]), 
  ],
  providers: [AccountsService, TokenService, TransactionsService, UserService],
  controllers: [AccountsController]
})
export class AccountsModule {}