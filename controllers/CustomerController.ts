import { Request, Response, NextFunction } from "express"
import { CreateCustomerInput, LoginCustomerInput, CustomerPayload } from "../dto/Customer.dto"
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { GenerateSalt, GeneratePassword, GenerateOTP, onRequestOTP, GenerateSign,ValidatePassword } from "../utility";
import { Customer, CustomerDoc } from "../models";

export const CustomerSignUp = async (req: Request, res: Response, next: NextFunction) => {
    const customerInput = plainToClass(CreateCustomerInput, req.body);
    const inputError = await validate(customerInput, {validationError: {target:true}});

    if(inputError.length > 0){
        return res.status(400).json(inputError);
    }

    const {email, phone, password} = customerInput;
    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt);

    const custExist = await FindCust("", email);

    if(custExist){
        return res.json({ message: "Email Sudah Terdaftar!" });
    }else{
        const {otp, expiry} = GenerateOTP();
    
        console.log(otp);
    
        const result = await Customer.create({
            email: email,
            password: userPassword,
            salt: salt,
            firstName: '',
            lastName: '',
            address: '',
            phone: phone,
            verified: false,
            otp: otp,
            otp_expiry: expiry,
            lat: 0,
            lng: 0,
        });
    
        if(result){
            await onRequestOTP(otp, phone);
    
            const result_pros: CustomerDoc = result as CustomerDoc;
    
            const signature = GenerateSign({
                _id: result_pros._id,
                email: result_pros.email,
                verified: result_pros.verified
            });
    
            return res.status(201).json({signature: signature, verified:result_pros.verified,email:result_pros.email})
            
        }else{
            return res.status(400).json({message: 'Sign Up Gagal'});
        }
    }
}

export const VerifOTP = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    const { otp } = req.body;
    const customer = req.user;

    if(customer){
        const data = await Customer.findById(customer._id);
        if(data){
            if(data.otp === otp && data.otp_expiry >= new Date()){
                data.verified = true;
                const updateData = await data.save();
                const signature = GenerateSign({
                    _id: updateData._id,
                    email: updateData.email,
                    verified: updateData.verified
                });

                return res.status(201).json({signature: signature, verified: updateData.verified, email: updateData.email});
            }
        }
    }
    return res.status(400).json({message:'Verifikasi OTP gagal'});
}

export const FindCust = async(id : string | undefined, email?: string) =>{
    if(email){
        return await Customer.findOne({email : email});
    }
    else{
        return await Customer.findById(id);
    }
} 

export const LoginCustomer = async (req: Request, res:Response, next:NextFunction) =>{
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
          const payload: CustomerPayload = { _id, email, verified };
          const jwt = GenerateSign(payload);
        //   return res.json(GenerateSign(payload));
            const responseObj = {
                signature : jwt,
                email: payload.email,
                verified: payload.verified,
                message: 'Login successful'
            };
            return res.json(responseObj);
        }
    }
    return res.json({ message: "login gagal" });
}