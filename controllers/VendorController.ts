import { Request, Response, NextFunction, request } from "express";
import { EditVendorInputs, VendorLoginInput, VendorPayLoad, EditVendorService, CreateFoodInputs, UpdateFood } from "../dto";
import { GenerateSign } from "../utility";
import { FindVendor } from './AdminController';
import { Food, Vendor, VendorDoc } from "../models";
import multer from "multer";

export const VendorLogin =async (req:Request, res:Response, next:NextFunction) => {
    const { email, password } = <VendorLoginInput> req.body;

    const vendorExist = await FindVendor('', email);

    if(vendorExist !== null){
        let vendor;
        if(Array.isArray(vendorExist)) {
            vendor = vendorExist[0];
        } else {
            vendor = vendorExist;
        }

        const payload: VendorPayLoad = {
            _id: vendor._id,
            name: vendor.name,
            foodtypes: vendor.foodType,
            email: email
        };
        const token = GenerateSign(payload);
        return res.json(token)
    }else{
        return res.json({"message": "Login Gagal!!"})
    }
}

export const GetVendorProfile = async (req:Request, res:Response, next:NextFunction) =>{
    const user =req.user;
    
    if (user){
        const vendor = FindVendor(user._id);

        return res.json(vendor);

    }
    else{
        return res.json({"message" : "vendor not found"})
    }
}

export const UpdateVendorProfile = async (req:Request, res:Response, next:NextFunction) =>{

    const {foodtypes, name, address, phone} = <EditVendorInputs> req.body;

    const user = req.user;

    if(user){
        const vendor = await FindVendor(user._id);

        if (vendor !== null && typeof vendor === 'object'){
            const m_vendor: VendorDoc = vendor as VendorDoc;
            m_vendor.name = name;
            m_vendor.address = address;
            m_vendor.phone = phone;
            m_vendor.foodType = foodtypes;

            const retval = await vendor.save();
        }
        return res.json(vendor);
    }
    else{
        return res.json({"message":"vendor not found"});
    }
}

export const UpdateVendorService= async (req:Request, res:Response, next:NextFunction) =>{

    const {serviceAvailable} = <EditVendorService> req.body;

    const user = req.user;

    if(user){
        const vendor = await FindVendor(user._id);

        if (vendor !== null && typeof vendor === 'object'){
            const m_vendor: VendorDoc = vendor as VendorDoc;
            m_vendor.serviceAvailable = serviceAvailable;
           

            const retval = await vendor.save();
        }
        return res.json(vendor);
    }
    else{
        return res.json({"message":"vendor not found"});
    }
}

export const AddFood = async (req:Request, res:Response, next:NextFunction) => {
    const user = req.user;

    if(user){
        const {name, description, category, foodtype, readyTime, price} = <CreateFoodInputs> req.body;
        const vendor = await FindVendor(user._id);

        if(vendor !== null){
            const m_vendor: VendorDoc = vendor as VendorDoc;

            //nanti hasilnya di terminal console.log
            const files = req.files as [Express.Multer.File];

            const images = files.map((file: Express.Multer.File) => file.filename);

            console.log(files);
            console.log(images);

            const menu = await Food.create({
                vendorId: m_vendor._id,
                name: name,
                description: description,
                category: category,
                foodtype: foodtype,
                readyTime: readyTime,
                price: price,
                rating: 0,
                images: images
            });
            m_vendor.foods.push(menu);
            const result = await m_vendor.save();

            return res.json(result);
        }
        else{
            return res.json(vendor);
        }
    }
    else{
        return res.json({"message":"vendor not found"});
    }
}

export const GetFood = async (req: Request, res: Response) => {
    const user = req.user;

    if (user) {
        const vendor = await FindVendor(user._id);

        if (vendor !== null && typeof vendor === 'object') {
            const m_vendor: VendorDoc = vendor as VendorDoc;
            
            // Mengambil data makanan dari vendor yang aktif
            const activeVendorFoods = await Food.find({ vendorId: m_vendor._id });
            
            return res.json(activeVendorFoods);
        } else {
            return res.json(vendor);
        }
    } else {
        return res.json({ "message": "Vendor not found" });
    }
}

export const UpdateFoodImages = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (user){
    const {foodid,hapus,myimages}=<UpdateFood>req.body
        if (hapus==='true'){
            const food= await Food.updateOne({_id:foodid},{ $unset:{images:1}})
            return res.json(food)
        } else {
            const files = req.files as [Express.Multer.File];
            const images = files.map((file: Express.Multer.File) => file.filename);
            const food= await Food.updateOne({_id:foodid}, {$push: {images}})
        }
    } else {
        return res.json({ message: "Vendor not found"})
    }
};