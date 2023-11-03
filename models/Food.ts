import mongoose, {Schema, Document, Model} from "mongoose";

interface FoodDoc extends Document{
    vendorId: string;
    name: string;
    description: string;
    category: string;
    foodtype: string;
    readyTime: string;
    price: number;
    rating: number;
    images: [string];
}

const FoodSchema = new Schema({
    vendorId: {type: String},
    name: {type: String, required: true},
    description:{type: String, required: true},
    category: {type: String},
    foodtype: {type: String, required: true},
    readyTime: {type: Number},
    price: {type:Number, required:true},
    rating: {type: String},
    images: {type: [String]}
},{
    toJSON: {
        transform(doc, ret){
            delete ret.__v,
            delete ret.createAt,
            delete ret.updateAt
        },
        timestamp: true
        // menunjukan bahwa setiap kali sebuah document 
        // dibuat akan ditambahkan dua property createdAt dan updatedAt
    }
})

const Food = mongoose.model<FoodDoc>('food', FoodSchema);

export {Food};