const fs = require('fs');
const mongoose = require("mongoose");
const Product = require("../models/product-model");


exports.products_get_all = async (req, res) => {
  try {
    const product = await Product.find({})
      .select("name price _id productImage updatedAt createdAt")
    
    const response = {
      count: product.length,
      products: product.map(prod => {
        return {
          _id: prod._id,
          name: prod.name,
          price: prod.price,
          productImage: prod.productImage,
          updatedAt: prod.updatedAt,
          createdAt: prod.createdAt,
          request: {
            type: "GET",
            url: "http://localhost:3000/products/" + prod._id
          }
        }
      })
    };
    
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
};

exports.products_create_product = async (req, res, next) => {
  try {
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price,
      productImage: req.file.path
    });
    
    await product.save();
    
    const response = {
      message: 'Created product successfully',
      createdProduct: {
        _id: product._id,
        name: product.name,
        price: product.price,
        productImage: product.productImage,
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + product._id
        }
      }
    }
    
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
};

exports.products_get_product = async (req, res, next) => {
  const _id = req.params.productId;
  
  try {
    const product = await Product.findById(_id).select("name price _id productImage updatedAt createdAt")
    
    if (!product) return res.status(404).json({ message: 'No valid entry found for provided ID'})
    
    const response = {
      product: product,
      request: {
        type: "GET",
        url: "http://localhost:3000/products"
      }
    };
    
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
};

exports.products_update_product = async (req, res, next) => {
  const _id = req.params.productId;
  
  const updates = Object.keys(req.body)
  const allowedUpdates = [ 'name', 'price' ]
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
  
  if (!isValidOperation) return res.status(400).send({ error: 'Invalid fields for updates!' })
  
  try {
    if (req.file && req.file.path) { // check file update
      req.body.productImage = req.file.path;
    }
    
    const product = await Product.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })
    if (!product) return res.status(404).json({ error: "Product Id not found" });
    
    const response = {
      message: "Product updated",
      request: {
        type: "GET",
        url: "http://localhost:3000/products/" + _id
      }
    };
    
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
};

exports.products_delete = async (req, res, next) => {
  const _id = req.params.productId;
  
  try {
    const product = await Product.findByIdAndDelete(_id)
    
    if (!product) return res.status(404).json({ error: "Product Id not found" });
    
    // remove page file
    const filePath = product.productImage;
    fs.unlinkSync(__dirname + "/../../" + filePath);
    
    res.status(200).json({
      message: "Product deleted",
      request: {
        type: "POST",
        url: "http://localhost:3000/products",
        body: {
          name: "String",
          price: "Number"
        }
      }
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
