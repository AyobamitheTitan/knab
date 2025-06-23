import { IsDateString, IsEmail, IsNotEmpty, IsNumber, IsPhoneNumber, MinLength } from "class-validator"

export class SignupUserDTO {
    @IsNumber()
    phone_number: number

    @IsEmail()
    email: string

    @IsNotEmpty()
    first_name: string

    @IsNotEmpty()
    last_name: string

    @MinLength(6)
    password: string

    @IsDateString()
    dob: Date
}

export class LoginUserDTO{
    @IsNumber()
    username: number

    password: string
}