import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { LoginUserDTO, SignupUserDTO } from './dto/user.dto';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel: Model<User>, private readonly jwtService: JwtService) { }

    private async phoneAndEmailInUse(email: string, phone_number: number) {
        const user = await this.userModel.findOne({ $or: [{ phone_number }, { email }] }).exec()
        if (user) {
            throw new HttpException("Invalid credentials", HttpStatus.BAD_REQUEST)
        }
    }

    async signup(createUserDto: SignupUserDTO) {
        const { email, phone_number, dob, password } = createUserDto;

        await this.phoneAndEmailInUse(email, phone_number);

        const userDOB = new Date(dob);
        const age = new Date().getFullYear() - userDOB.getFullYear();
        if (age < 18) {
            throw new HttpException("User must be at least 18 years old", HttpStatus.BAD_REQUEST);
        }

        const hashedPassword = await hash(password);
        const newUser = await this.userModel.create({
            ...createUserDto,
            password: hashedPassword,
        });

        return {data :{ email: newUser.email, phone_number: newUser.phone_number }}
    }

    private async findUserByPhoneNumber(phone_number: number) {
        const user = await this.userModel.findOne({ phone_number }).exec()
        if (!user) {
            throw new HttpException("Invalid credentials", HttpStatus.BAD_REQUEST)
        }
        return user
    }

    async login(loginDTO: LoginUserDTO) {
        const user = await this.findUserByPhoneNumber(loginDTO.username)
        const isPasswordCorrect = await verify(user.password as string, loginDTO.password)
        if (!isPasswordCorrect) {
            throw new HttpException("Invalid credentials", HttpStatus.BAD_REQUEST)
        }
        return {data: await this.jwtService.signAsync({sub: user._id, username: user.phone_number })}
    }
}
