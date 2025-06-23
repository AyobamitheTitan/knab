import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UUID } from 'crypto';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User{
    @Prop()
    id: UUID

    @Prop()
    phone_number: Number

    @Prop()
    email: String

    @Prop()
    first_name: String

    @Prop()
    last_name: String

    @Prop()
    password: String

    @Prop()
    dob: Date

    @Prop()
    transaction_pin: String
}

export const UserSchema = SchemaFactory.createForClass(User);