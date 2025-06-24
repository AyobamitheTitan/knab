import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Account } from 'src/accounts/schemas/accounts.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop({ unique: true })
    phone_number: Number

    @Prop({ unique: true })
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

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Account" }] })
    accounts: Account[]
}

export const UserSchema = SchemaFactory.createForClass(User);