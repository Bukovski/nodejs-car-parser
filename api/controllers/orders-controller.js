const mongoose = require("mongoose");

const Order = require("../models/order-model");
const Product = require("../models/product-model");


exports.orders_get_all = async (req, res) => {
  try {
    const _order = await Order.find()
      .select("product quantity _id")
      .populate("product", [ "name", "price" ])
    
    const orderMapFn = order => {
      return {
        _id: order._id,
        product: order.product,
        quantity: order.quantity,
        request: {
          type: "GET",
          url: "http://localhost:3000/orders/" + order._id
        }
      };
    }
    
    res.status(200).json({
      count: _order.length,
      orders: _order.map(orderMapFn)
    })
  } catch (err) {
    res.status(500).json({ error: err })
  }
};

exports.orders_create_order = async (req, res, next) => {
  try {
    const product = await Product.findById(req.body.productId)
    
    if (!product) return res.status(404).json({ message: "Product not found" });
    
    const order = new Order({
      _id: mongoose.Types.ObjectId(),
      quantity: req.body.quantity,
      product: req.body.productId
    });
    
    const result = await order.save();
    
    const response = {
      message: "Order stored",
      createdOrder: {
        _id: result._id,
        product: result.product,
        quantity: result.quantity
      },
      request: {
        type: "GET",
        url: "http://localhost:3000/orders/" + result._id
      }
    }
    
    res.status(201).json(response);
  } catch (err) {
    res.status(500).json({ error: err })
  }
};

exports.orders_get_order = async (req, res, next) => {
  const _id = req.params.orderId;
  
  try {
    const _order = await Order.findById(_id)
      .populate("product")
    
    if (!_order) return res.status(404).json({ message: "Order not found" });
    
    const response = {
      order: _order,
      request: {
        type: "GET",
        url: "http://localhost:3000/orders"
      }
    };
    
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: err })
  }
};

exports.orders_delete_order = async (req, res, next) => {
  const _id = req.params.orderId;
  
  try {
    const order = await Order.findByIdAndDelete(_id)
    
    if (!order) return res.status(404).json({ message: "Order not found" });
    
    res.status(200).json({
      message: "Order deleted",
      request: {
        type: "POST",
        url: "http://localhost:3000/orders",
        body: {
          productId: "ID",
          quantity: "Number"
        }
      }
    });
  } catch (err) {
    res.status(500).json({ error: err })
  }
};
