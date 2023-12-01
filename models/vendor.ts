import mongoose, {Schema, Document, Model} from "mongoose";
//document == row dalam satu row fieldnya apa aja tentukan
// atribut 

export interface VendorDoc extends Document{//fokus pada row kalau update fokusnya di row
    name: string;
    ownerName: string;
    foodType: [string];
    pincode: string;
    address: string;
    phone: string;
    email: string;
    password: string;
    salt: string;
    serviceAvailable: boolean;
    coverImage: [string];
    rating: number;
    foods : any
}
//required == not null 
const VendorSchema = new Schema({
    name: {type: String, required:true},
    ownerName: {type: String, required:true},
    foodType: {type: [String]},
    pincode: {type: String, required:true},
    address: {type: String},
    phone: {type: String, required:true},
    email: {type: String, required:true},
    password: {type: String, required:true},
    salt: {type: String, required:true},
    serviceAvailable: {type: String, required:true}, // aslinya true tp error trs aku ganti pake false
    coverImage: {type: [String]},
    rating: {type: Number},
    foods: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'food'
    }]
},{ // function lanjutan untuk transform ketika anda kirimkan mana yg akan dihilangkan/ tidak ditampilkan
    toJSON: {
        transform(doc, ret){
            delete ret.password;
            delete ret.salt;
            delete ret.coverImage;
            delete ret.createAt;
            delete ret.upateAt;
            delete ret.__v;
        }
    },
    timestamps: true //setiap kali generate auto menabahkan createAt & updateAt
});


//kalo model fokus satu tabel kalo update dkk
//vendor ini sebuah model dengan struktur vendordoc menggunakan skema vendor skema nama collectionnya vendor
const Vendor = mongoose.model<VendorDoc>('vendor', VendorSchema);

export {Vendor};
