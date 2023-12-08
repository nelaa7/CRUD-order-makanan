import express from 'express';
import {  CustomerSignUp, LoginCustomer, VerifOTP } from '../controllers/CustomerController';
import { authenticate } from '../middleware';

const router = express.Router()
router.post('/login', LoginCustomer)
router.post('/signup', CustomerSignUp)
router.use(authenticate)
router.patch('/verifotp',VerifOTP)
export { router as CustomerRoutes }