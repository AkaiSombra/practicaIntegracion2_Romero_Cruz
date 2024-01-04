
import { Router, query } from "express"
import productsModel from "../models/products.models.js"

const router = Router()

router.get('/', async (req, res) => {
  try{
    const limit = parseInt(req.query.limit) || 10
    const page = parseInt(req.query.page) || 1

    const sort = req.query.sort 

    const categoryContent = req.query.category
    console.log(categoryContent)
    const statusContent = req.query.status

    let statusContentBoolean
    
    if (statusContent === 'true'){
      statusContentBoolean = true
    } else {
      statusContentBoolean = false
    }

    let products
    let queryConditions = {}

    if(categoryContent){
      queryConditions.category = categoryContent
    }

    if(statusContent != undefined){
      queryConditions.status = statusContentBoolean 
    }

    if (sort){
        products = await productsModel.paginate(
        queryConditions,
        { offset: (page - 1) * limit, limit: limit, sort: {price: sort}, lean: true}
      )
    }  else {
        products = await productsModel.paginate(
        queryConditions,
        { offset: (page - 1) * limit, limit: limit, lean: true}
        )
    }

    res.status(200).send({ status: 'OK', data: products })
  } catch(error){
    res.status(500).send({ status: 'ERR', data: error.message })
  }
})

router.get('/all', async (req, res) => {
    try {
        const products = await productsModel.find().lean()
        res.status(200).send(products)
      } catch(error){
        res.status(400).send(error.message)
      }
})  

router.get('/:pid', async (req, res) => {
    try {
        const pId = req.params.pid
        const product = await productsModel.findOne({ _id: pId}).lean()
        res.status(200).send(product)
      } catch (error) {
        res.status(404).send(error.message)
      }
})

router.post('/', async (req, res) => {
    try {

        const newProduct = req.body

        const productAdded = await productsModel.create(newProduct)
        res.status(200).send(`Producto agregado con ID: ${productAdded._id}`)

        } catch (err){
            res.status(400).send(err.message)
        } 
})

router.put('/:pid', async (req, res) => {  
    try {
        const pId = req.params.pid
        const productUpdate = req.body

        const updatedProduct = await productsModel.updateOne({ _id: pId}, productUpdate)
        res.status(200).send(`El producto con ID:${pId} ha sido actualizado correctamente`)
      } catch (error) {
        res.status(400).send(error.message)
      }
})

router.delete('/:pid', async (req, res) => {
    try{
        const pId = req.params.pid

        const deletedProduct = await productsModel.deleteOne( {_id: pId})

        res.status(200).send(`El producto con id ${pId} ha sido borrado exitosamente, ${deletedProduct}`)
    } catch(err){
        res.status(400).send(err.message)
    }
})

export default router