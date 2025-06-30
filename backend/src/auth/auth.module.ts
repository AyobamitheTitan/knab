import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenService } from 'src/token/token.service';
import { UserService } from 'src/user/user.service';
import { AuthResolver } from './auth.resolver';
import { AccountsService } from 'src/accounts/accounts.service';
import { Account, AccountSchema } from 'src/accounts/schemas/accounts.schema';
import { TransactionsService } from 'src/transactions/transactions.service';
import { Transactions, TransactionsSchema } from 'src/transactions/schemas/transactions.schema';

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
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, {name: Account.name, schema: AccountSchema}, {name: Transactions.name, schema: TransactionsSchema}])
  ],
  providers: [AuthService, TokenService, UserService, AuthResolver, AccountsService, TransactionsService],
})
export class AuthModule {}
