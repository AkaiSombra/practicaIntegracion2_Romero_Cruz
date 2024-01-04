import mongoose, { mongo } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

mongoose.pluralize(null)

const collection = 'users'

const schema = new mongoose.Schema({
    firstName: { type: String, required: true},
    lastName: { type: String, required: true},
    email: { type: String, required: true, index: true},
    username: { type: String, required: true, unique: true, index: true},
    password: { type: String, required: true},
    age: { type: Number, index: true},
    gender: { type: String, required: false, index: true},
    role: { type: String, enum: ["ADMIN", "USER"], default: "USER"},
    cart: { type: mongoose.Schema.Types.ObjectId}
    },
    {
    versionKey: false
    
})

schema.plugin(mongoosePaginate)

const model = mongoose.model(collection, schema)

export default model