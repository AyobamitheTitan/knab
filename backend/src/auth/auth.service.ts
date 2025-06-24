import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginUserDTO, SignupUserDTO } from './dto/user.dto';
import { verify } from 'argon2';
import { TokenService } from 'src/token/token.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private readonly tokenService: TokenService) { }

    async signup(createUserDto: SignupUserDTO) {
        return { data: await this.userService.create(createUserDto) }
    }

    async login(loginDTO: LoginUserDTO) {
        const user = await this.userService.findUserByPhoneNumber(loginDTO.username)
        const isPasswordCorrect = await verify(user.password as string, loginDTO.password)
        if (!isPasswordCorrect) {
            throw new HttpException("Invalid credentials", HttpStatus.BAD_REQUEST)
        }
        return { data: await this.tokenService.generate({ sub: user.id, username: user.phone_number }) }
    }
}
