import express, { Request, Response, NextFunction } from "express";
import { GetVendorProfile, VendorLogin, UpdateVendorProfile, 
        UpdateVendorService, AddFood, GetFood, UpdateFoodImages } from "../controllers";
import { Authenticate } from "../middleware";
import multer from 'multer';
import Randomstring from "randomstring";

const router = express.Router();

const imgStorage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './images');
    },
    filename: function(req, file, cb){
        cb(null, Randomstring.generate(7)+'_'+file.originalname);
    }
});

const gambar = multer ({storage: imgStorage}).array('myimages', 10);

router.post('/login', VendorLogin);

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.json({
        message: "Hallo, route vendor"
    });
})

export {router as VendorRoute};

router.use(Authenticate);
router.get('/profile', Authenticate, GetVendorProfile);
router.get('/food', Authenticate, GetFood);
router.patch('/profile',Authenticate, UpdateVendorProfile);
router.patch('/service', Authenticate, UpdateVendorService);
router.post('/food',gambar, AddFood);
router.post('/update-food-images', gambar, UpdateFoodImages)