import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginResponseDTO, LoginUserDTO, RefreshTokenDTO, SignupUserDTO } from './dto/auth.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResponseDTO)
  async signUp(@Args('signupUserDTO') signupUserDTO: SignupUserDTO) {
    return await this.authService.signup(signupUserDTO);
  }

  @Mutation(() => String)
  async login(@Args('loginUserDTO') loginUserDTO: LoginUserDTO) {
    return await this.authService.login(loginUserDTO);
  }

  @Mutation(()=> String)
  async refreshToken(@Args('refreshTokenDTO') refreshTokenDTO: RefreshTokenDTO) {
    return await this.authService.refreshToken(refreshTokenDTO.token)
  }
}
