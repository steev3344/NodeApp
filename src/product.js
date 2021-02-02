const express=require("express");
const mongoose=require("mongoose");
const Schema = mongoose.Schema;
const response = require("./response")
const router = express.Router();

//routes
router.post('/create', (req,res) => createmodel(req,res))
router.get('/all', (req,res) => listmodel(req,res))
router.get('/:id', (req,res) => showmodel(req,res))
router.put('/update/:id', (req,res) => updatemodel(req,res))
router.delete('/:id', (req,res) => deletemodel(req,res))

//controller
const createmodel = async (req,res) => {create(Object.assign(req.body)).then(data => {response.success(res,data)}).catch(err => {response.error(res,err)})}
const showmodel = async (req,res) => {show(req.params.id).then(data => {response.success(res,data)}).catch(err => {response.error(res,err)})}
// const listmodel = async (req,res) => {list(req,res).then(data => {response.success(res,data)}).catch(err => {response.error(res,err)})}
const listmodel = async (req,res) => {response.paginate(req,res,Product).then(data => {response.filtersuccess(res,data)}).catch(err => {response.error(res,err)})}
const updatemodel = async (req,res) => {update(req.params.id,req.body).then(data => {response.success(res,data)}).catch(err => {response.error(res,data)})}
const deletemodel = async (req,res) => {remove(req.params.id).then(data => {response.success(res,data)}).catch(err => {response.error(res,err)})}

//service
const create = async (data) => {return new Product(data).save()}
//const read = async (data) => {return Subcategory.find({$and:[data]})}
const show = async (id,data) => {return Product.findById(id,data)}
 const list = async (data) => {return Product.find()}
const update = async (id,data) => {return Product.findByIdAndUpdate(id,data,{new: true})}
const remove = async (data) => {return Product.findByIdAndDelete(data)}

//model
const Product = mongoose.model("product", {
    productname: { type: String, required: true },
    price: { type: String, required: true },
    added_date: { type: String, required: true,default:Date.now},
});
module.exports = { Product };
module.exports = router;
