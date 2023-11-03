import express, { Request, Response, NextFunction } from "express";
import { CreateVendor, GetVendorById, GetVendors } from "../controllers";


const router = express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.json({
        message: "Hallo, route admin"
    });
})

export {router as AdminRoute};



//function
router.post('/vendor', CreateVendor);
router.get('/vendors', GetVendors);
router.get('/vendor/:id', GetVendorById);


