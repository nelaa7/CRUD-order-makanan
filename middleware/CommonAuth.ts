import { AuthPayload } from "../dto";
import { ValidateSign } from "../utility";
import { Request, Response, NextFunction } from "express";

declare global {
    namespace Express{
        interface Request{
            user?: AuthPayload
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const validate = await ValidateSign(req);

    if(validate){
        next();
    }
    else{
        return res.json({"messsage" : "Not authoreized"})
    }
}