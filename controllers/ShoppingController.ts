import { Request, Response, NextFunction } from "express";
import { Food, Vendor } from "../models";
import mongoose from "mongoose";



export const GetFoodTersedia = async (req:Request, res:Response, next:NextFunction) => {
    const idvendor = req.params.id;

    try{
    const result = await Vendor.find({_id : idvendor, serviceAvailable:true}).sort({'rating': 'descending'}).populate("foods");

    if(result.length > 0 ){
        return res.status(200).json(result);
    }
    else{
        return res.status(400).json({"message":"NOt Found or NOt Available"});
    
    }
}
    catch(e:any){

        if (typeof e ==="string") {
            console.log(e.toUpperCase());
        } else if (e instanceof Error) {
            console.log(e.message);
        }
    }return res.json({"message":"Not Found or Not Available"});
}

export const GetBestWarteg = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await Vendor.aggregate([{ $sort: { rating: -1 } }]).limit(4);
        if (result.length > 0) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json({ message: "Not Found or not available" });
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const GetFoodIn30Min = async (req: Request, res: Response, next: NextFunction) => {
    const idvendor = req.params.id;
    try {
        const result = await Food.find({
            vendorId: new mongoose.Types.ObjectId(idvendor),
            readyTime: { $lt: 30 }
        });

        if (result.length > 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({ message: 'No menu available in less than 30 minutes' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}