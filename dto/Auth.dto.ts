import { VendorPayLoad } from "./vendor.dto";
import { CustomerPayload } from "./Customer.dto";

export type AuthPayload = VendorPayLoad | CustomerPayload;