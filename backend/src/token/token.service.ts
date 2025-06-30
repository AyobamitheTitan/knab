import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import Payload from './interfaces/payload.interface';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) { }

  async generate(payload: Payload) {
    return await this.jwtService.signAsync(payload);
  }

  async decode(authHeader: string): Promise<Payload> {
    try {
      const token = authHeader.split(' ')[1];      
      return this.jwtService.decode(token);
    } catch (err) {
      throw new UnauthorizedException("Invalid token")
    }
  }
}
