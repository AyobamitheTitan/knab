import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { LoginUserDTO, SignupUserDTO } from './dto/user.dto';

const userModelMock = {
  signup: jest.fn(),
  login: jest.fn()
}

describe('AuthService', () => {
  let service: AuthService;
  let model: jest.Mocked<Model<User>>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{
        provide: getModelToken(User.name),
        useValue: Model
      }, AuthService, JwtService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    model = module.get(getModelToken("User"))
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("signup", () => {
    it("should signup a new user", async () => {
      const mockedUser: SignupUserDTO = {
        dob: new Date("2005-09-08"),
        password: "password",
        email: "mockuser@gmail.com",
        phone_number: 234809123451884,
        last_name: "Onabanjo",
        first_name: "Oluwademilade"
      }
      
      const result = service.signup(mockedUser)

      expect(result).toEqual({
        email: "mockuser@gmail.com",
        phone_number: 234809123451884,
      })
    })
  })

});
