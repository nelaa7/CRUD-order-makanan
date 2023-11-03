import { Request, Response, NextFunction } from "express";
import { CreateVendorInput } from "../dto";
import { Vendor } from "../models";
import { GeneratePassword, GenerateSalt } from "../utility";

export const CreateVendor = async (req: Request, res: Response, next: NextFunction) => {
    const {name, address, pincode, foodType, email, password, ownerName, phone } = <CreateVendorInput> req.body;
                                                                                //<> implementasi dari interface  digunakan untuk menentukan type data datan struktur data
    const existVendor = await FindVendor('', email);

    if(existVendor !== null){
        return res.json({"message" : "Vendor sudah ada!"});
    }

    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt);

    const createVendor = await Vendor.create({
        name: name,
        ownerName: ownerName,
        foodType: foodType,
        pincode: pincode,
        address: address,
        phone: phone,
        email: email,
        password: userPassword,
        salt: salt,
        serviceAvailable: false,
        coverImage:[],
        rating:0
    });
    return res.json(createVendor);
  
}

export const GetVendors = async (req: Request, res: Response, next: NextFunction) => {
    const vendor = await FindVendor('');

    if(vendor != null){
        return res.json(vendor);
    }

    return res.json({"message" : " data tidak ditemukan!"});
}

export const GetVendorById = async (req: Request, res: Response, next: NextFunction) => {
   const id = req.params.id;
   
   const vendor = await FindVendor(id);

   if (vendor != null){
    return res.json(vendor);
   }

   return res.json({"message" : "data tidak ditemukan"});
}

export const FindVendor = async(id: string | undefined, email?: string) => {
    if(email){
        return await Vendor.findOne({email: email});
    }
    else{
        return await Vendor.findById(id);
    }
}


