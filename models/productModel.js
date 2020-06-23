const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stripeId:{type:String, required:true},
  image: { type: String, required: true },
  artist: { type: String, required: true },
  price: { type: Number, default: 0, required: true },
  category: { type: String, required: true },
  countInStock: { type: Number, default: 0, required: true },
  description: { type: String, required: true },
});

const productModel = mongoose.model("Product", productSchema);

module.exports = productModel;