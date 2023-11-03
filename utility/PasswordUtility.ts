import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthPayload, VendorPayLoad } from '../dto';
import { APP_SECRET } from '../config';
import { Request, Response, NextFunction } from 'express';

export const GenerateSalt = async () => {
    return await bcrypt.genSalt();
}

export const GeneratePassword = async (password: string, salt: string) =>{
    return await bcrypt.hash(password, salt);
}

export const ValidatePassword = async (enterpasswd: string, savedpasswd: string, salt: string) => {
    return await GeneratePassword(enterpasswd, salt) === savedpasswd;
}

export const GenerateSign = (payload: VendorPayLoad) => {
    return jwt.sign(payload, APP_SECRET, {expiresIn: '1d'});
}

export const ValidateSign = async (req: Request) => {
    // aslinya re.get cuman error jadinya ganti req.header
    const sign = req.get('Authorization');

    console.log(sign);

    if(sign){
        const payload = await jwt.verify(sign, APP_SECRET) as AuthPayload;

        req.user = payload;

        return true;
    }

    return false;
}
