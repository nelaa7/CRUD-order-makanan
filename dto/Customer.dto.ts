import { IsEmail, IsEmpty, Length } from "class-validator";

export class CreateCustomerInput{
    @IsEmail()
    email: string;

    @Length(7, 14)
    phone: string;

    @Length(6, 12)
    password: string;
}

export interface CustomerPayload{
    _id: string,
    email: string,
    verified: boolean
}

export class LoginCustomerInput{
    @IsEmail()
    email: string;

    @Length(6, 12)
    password: string;
}
