
// yang wajib didefinisikan pada dto adalah struktur data transfer (kirim atau menerima) pada API

export interface CreateFoodInputs{
    name: string;
    description: string;
    category: string;
    foodtype: string;
    readyTime: number;
    price: number;
}