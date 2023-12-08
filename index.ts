import express from 'express';
import { AdminRoute, VendorRoute, ShoppingRoute, CustomerRoutes} from './routes';

import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { MONGO_URI } from './config';
import path from 'path';
import { Customer } from './models';

const app = express();

app.use(bodyParser.json()); //fungsi body parser buat ngambil variable dari post
app.use(bodyParser.urlencoded({extended: true}));
// Baris tersebut berfungsi agar gambar yang ada di directory images dapat diakses dengan path /images
app.use('/images', express.static(path.join(__dirname, 'images')));

//untuk membedakan user
app.use('/admin', AdminRoute);
app.use('/vendor', VendorRoute);
app.use('/customer', CustomerRoutes);

mongoose.connect(MONGO_URI).then(result => {
    console.log('DB terkoneksi');
}).catch(err => console.log('error '+err))

//port number 8000
app.listen(8000, () => {
    console.log('aplikasi aktif pada port 8000');
})

app.use('./admin', AdminRoute);
app.use('./vendor', VendorRoute);
app.use(ShoppingRoute);