import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: any, next: () => void) {
    if(!req.headers["authorization"]){
      throw new UnauthorizedException()
    }
    next();
  }
}
