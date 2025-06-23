import { Body, Controller, Post } from '@nestjs/common';
import { LoginUserDTO, SignupUserDTO } from './dto/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post("/signup")
    async signup(@Body() signupUserDTO: SignupUserDTO){
        return this.authService.signup(signupUserDTO)
    }

    @Post("/login")
    async login(@Body() loginUserDTO: LoginUserDTO) {
        return this.authService.login(loginUserDTO)
    }
}
