import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  MinLength,
} from 'class-validator';

@InputType()
export class SignupUserDTO {
  @Field(() => Number)
  @IsNumber()
  phone_number: number;

  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  first_name: string;

  @Field(() => String)
  @IsNotEmpty()
  last_name: string;

  @Field(() => String)
  @MinLength(6)
  password: string;

  @Field(() => String)
  @IsDateString()
  dob: Date;
}

@InputType()
export class LoginUserDTO {
  @Field(() => Number)
  @IsNumber()
  username: number;

  @Field(() => String)
  @IsNotEmpty()
  password: string;
}


@InputType()
export class RefreshTokenDTO {
  @Field(() => String)
  @IsNotEmpty()
  token: string;
}

@ObjectType()
export class LoginResponseDTO{
  @Field()
  phone_number: number

  @Field()
  email: string

  @Field()
  token: string
}