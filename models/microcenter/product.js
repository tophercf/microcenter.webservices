'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productModel = new Schema({
  name: { type: String, required: true },
  imageLocation: { type: String },
  price: {type: String},
  brand: {type: String},
  link: { type: String},
  sku: {type: String},
  stock: {type: String},
  inStoreOnly: {type: Boolean},
  runGroup: {type: String},
  storeId: {type: String},
  pageNumber: {type: String},
  date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Product', productModel); 