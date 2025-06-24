import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { CreateUserDTO } from './dto/user.dto';
import { hash } from 'argon2';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    private async phoneAndEmailInUse(email: string, phone_number: number) {
        const user = await this.userModel.findOne({ $or: [{ phone_number }, { email }] }).exec()
        if (user) {
            throw new HttpException("Invalid credentials", HttpStatus.BAD_REQUEST)
        }
    }

    async findById(id) {
        return await this.userModel.findOne({ _id:id }).exec()
    }

    async findUserByPhoneNumber(phone_number: number) {
        const user = await this.userModel.findOne({ phone_number }).exec()
        if (!user) {
            throw new HttpException("Invalid credentials", HttpStatus.BAD_REQUEST)
        }
        return user
    }

    async create(payload: CreateUserDTO) {
        const { email, phone_number, dob, password } = payload;

        await this.phoneAndEmailInUse(email, phone_number);

        const userDOB = new Date(dob);
        const age = new Date().getFullYear() - userDOB.getFullYear();
        if (age < 18) {
            throw new HttpException("User must be at least 18 years old", HttpStatus.BAD_REQUEST);
        }

        const hashedPassword = await hash(password);
        const newUser = await this.userModel.create({
            ...payload,
            password: hashedPassword,
        });

        return { email: newUser.email, phone_number: newUser.phone_number }
    }

    async setTransactionPin(user_id: String, pin: string) {
        const user = await this.findById(user_id)

        if (!user) {
            throw new HttpException("Invalid credentials", HttpStatus.BAD_REQUEST)
        }
        if(user.transaction_pin){
            throw new BadRequestException("Pin has already been set")
        }

        user.transaction_pin = await hash(pin)
        user.save()
    }
}
