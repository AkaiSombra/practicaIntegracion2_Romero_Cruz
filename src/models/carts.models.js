
import mongoose, { mongo } from 'mongoose'

mongoose.pluralize(null)

const collection = 'carts'

const schema = new mongoose.Schema({
    // products: [ productId:{ type: mongoose.Schema.Types.ObjectId, ref:'products'}, quantity:{ type: Number, default: 1}, _id: {require: false}],
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'products'}, { quantity: { type: Number, default: 1 } }],
    // products: { type: [mongoose.Schema.Types.ObjectId], ref:'products'},
    // products: [ {productId: {type: String, require: true}, quantity: {type: Number, default: 1}}],
    //total: {type: Number, require: true}
    },
    {
    versionKey: false
    
})

const model = mongoose.model(collection, schema)

export default model