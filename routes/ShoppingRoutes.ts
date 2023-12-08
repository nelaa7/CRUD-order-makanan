import express, { Request, Response, NextFunction} from "express";
import { GetFoodTersedia, GetBestWarteg, GetFoodIn30Min } from "../controllers/ShoppingController";
import { VendorLogin } from "../controllers";
import { authenticate } from "../middleware";

const router = express.Router();

router.post('/login', VendorLogin);
router.use(authenticate);
router.get('/warteg-food/:id', GetFoodTersedia);
router.get('/top-warteg', GetBestWarteg);
router.get('/food-in-30-min/:id', GetFoodIn30Min);

export {router as ShoppingRoute};

