import { Request, Response, NextFunction } from "express"
import { CreateCustomerInput, LoginCustomerInput, CustomerPayload } from "../dto/Customer.dto"
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { GenerateSalt, GeneratePassword, GenerateOTP, onRequestOTP, GenerateSign,ValidatePassword } from "../utility";
import { Customer, CustomerDoc } from "../models";
import { Message } from "twilio/lib/twiml/MessagingResponse";
import { verify } from "jsonwebtoken";

export const CustomerSignUp = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const Customerinput = plainToClass(CreateCustomerInput, req.body)
        const inputError = await validate(Customerinput, { validationError: { target: true } })
        if (inputError.length > 0) return res.status(400).json(inputError);

        const { email, phone, password } = Customerinput
        const salt = await GenerateSalt()
        const userPassword = await GeneratePassword(password, salt)
        const { otp, expiry } = GenerateOTP()
        await onRequestOTP(otp,phone);
        const result = await Customer.create(
            {
                email, password: userPassword,
                salt, phone, verified: false,
                otp, otp_expiry: expiry, lat: 0, lng: 0
            })
        if (result) {
            // await onRequestOtp(otp, phone);
            const result_pros: CustomerDoc = result as CustomerDoc
            const signature = GenerateSign({
                
                _id: result_pros._id,
                email: result_pros.email,
                verified: result_pros.verified
            })
            return res.status(201).json({ signature, verified: result_pros.verified, email: result_pros.email })
        } else {
            return res.status(400).json({ message: "sign up gagal" })
        }
    } catch (e) {
        if ((e as any).code === 11000) {
            return res.json({ "message": "Customer Exist" })
        }
        else if (typeof e === "string") {
            return res.json(e.toUpperCase())
        } else if (e instanceof Error) {
            return res.json(e.message)
        }
    }
}
export const VerifOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { otp } = req.body;
        const customer = req.user;

        if (customer) {
            const data = await Customer.findById(customer._id);

            if (data && parseInt(data.otp) === parseInt(otp) && new Date(data.otp_expiry) >= new Date()) {
                data.verified = true;
                const { _id, email, verified } = await data.save();
                const signature = GenerateSign({ _id, email, verified });
                return res.status(201).json({ signature, verified, email });
            }
        }

        return res.status(400).json({ "message": "Verifikasi otp gagal" });
    } catch (error) {
        console.error("Error in VerifOTP:", error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const FindCust = async(id : string | undefined, email?: string) =>{
    if(email){
        return await Customer.findOne({email : email});
    }
    else{
        return await Customer.findById(id);
    }
} 

export const LoginCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = <LoginCustomerInput>req.body;

        const custExist = await FindCust("", email);

        if (custExist && !Array.isArray(custExist)) {
            const isPasswordTrue = await ValidatePassword(
                password,
                custExist.password,
                custExist.salt
            );

            if (isPasswordTrue) {
                const { _id, email, verified } = custExist;

                if (verified) {
                    const payload: CustomerPayload = { _id, email, verified };
                    const jwt = GenerateSign(payload);

                    const responseObj = {
                        signature: jwt,
                        email: payload.email,
                        verified: payload.verified,
                        message: 'Login successful'
                    };

                    return res.json(responseObj);
                } else {
                    return res.status(403).json({ message: "User not verified. Please verify your account." });
                }
            }
        }

        return res.status(401).json({ message: "Authentication failed" });
    } catch (error) {
        console.error("Error during authentication:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
