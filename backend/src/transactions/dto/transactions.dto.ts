import { IsNotEmpty, MaxLength, MinLength } from "class-validator"

export class SetTransactionPinDTO {
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(4)
    pin: string

    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(4)
    confirmPin: string

}