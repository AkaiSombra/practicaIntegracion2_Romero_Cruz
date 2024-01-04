
import mongoose, { mongo } from 'mongoose'

mongoose.pluralize(null)

const collection = 'messages'

const schema = new mongoose.Schema({
    userName: { type: String, required: true},
    firstName: { type: String, required: true},
    email: {type: String, required: true},
    content: {type: String, required: true}
    },
    {
    versionKey: false
    
})

const model = mongoose.model(collection, schema)

export default model