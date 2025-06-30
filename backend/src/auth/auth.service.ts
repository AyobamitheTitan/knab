import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginUserDTO, SignupUserDTO } from './dto/auth.dto';
import { verify } from 'argon2';
import { TokenService } from 'src/token/token.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async signup(createUserDto: SignupUserDTO) {
    return await this.userService.create(createUserDto);
  }

  async login(loginDTO: LoginUserDTO) {
    const user = await this.userService.findUserByPhoneNumber(
      loginDTO.username,
    );
    const isPasswordCorrect = await verify(user.password, loginDTO.password);
    if (!isPasswordCorrect) {
      throw new HttpException('Incorrect password', HttpStatus.BAD_REQUEST);
    }
    return await this.tokenService.generate({
      sub: user.id,
      username: user.phone_number,
    });
  }

  async refreshToken(authorization: string) {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new BadRequestException('Invalid authorization header');
    }
    const payload = await this.tokenService.decode(authorization)
    
    return this.tokenService.generate({sub:payload.sub, username:payload.username})
  }
}
