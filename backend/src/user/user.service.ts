import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { CreateUserDTO } from './dto/user.dto';
import { hash } from 'argon2';
import { TokenService } from 'src/token/token.service';
import { AccountsService } from 'src/accounts/accounts.service';
import { AccountTypeEnum } from 'src/accounts/enums/accounts.enum';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>, private tokenService: TokenService, private accountService: AccountsService) { }

  private async phoneAndEmailInUse(email: string, phone_number: number) {
    const user = await this.userModel
      .findOne({ $or: [{ phone_number }, { email }] })
      .exec();
    if (user) {
      throw new HttpException('Phone or email already in use', HttpStatus.BAD_REQUEST);
    }
  }

  async findById(id: string) {
    return await this.userModel.findOne({ _id: id }).exec();
  }

  async findUserByPhoneNumber(phone_number: number) {
    const user = await this.userModel.findOne({ phone_number }).exec();
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async create(payload: CreateUserDTO) {
    const { email, phone_number, dob, password, first_name, last_name } = payload;
    
    await this.phoneAndEmailInUse(email, phone_number);

    const userDOB = new Date(dob);
    const age = new Date().getFullYear() - userDOB.getFullYear();
    if (age < 18) {
      throw new HttpException(
        'User must be at least 18 years old',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await hash(password);
    const newUser = await this.userModel.create({
      ...payload,
      password: hashedPassword,
    });
    const account = await this.accountService.store({ account_type: AccountTypeEnum.CURRENT }, newUser.id,`${first_name} ${last_name}`)
    
    return { email: newUser.email, phone_number: newUser.phone_number, token: await this.tokenService.generate({ username: newUser.phone_number, sub: newUser.id }) };
  }
}
