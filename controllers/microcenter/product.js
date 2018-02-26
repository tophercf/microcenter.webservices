var Product =  require('../../models/microcenter/product');

/**
 * List all products
 */
exports.list = (req, h) => {
  return Product.find({}).exec().then((product) => {
    return { products: product };
  }).catch((err) => {
    return { err: err };
  });
}

/**
 * Get a product by ID
 */
exports.get = (req, h) => {

  return Product.findById(req.params.id).exec().then((product) => {
    if(!product) return { message: 'Product ID not found' };
    return { product: product };
  }).catch((err) => {
    return { err: err };
  });
}
/*Get product scrapes by run date*/
exports.getByDate = (req, h) => {

  return Product.find({date: req.params.date}).exec().then((product) => {
    if(!product) return { message: 'Products not found on this date' };
    return { product: product };
  }).catch((err) => {
    return { err: err };
  });
}
/*Get product scrapes by brand*/
exports.getByBrand = (req, h) => {

  return Product.find({brand: req.params.brand}).exec().then((product) => {
    if(!product) return { message: 'Products not found for this brand' };
    return { product: product };
  }).catch((err) => {
    return { err: err };
  });
}

/*Get product scrapes by name*/
exports.getByName = (req, h) => {
  return Product.find({name: req.params.name}).exec().then((product) => {
    if(!product) return { message: 'Products not found for this brand' };
    return { product: product };
  }).catch((err) => {
    return { err: err };
  });
}

/**
 * Add a new product
 */
exports.create = (req, h) => {

  const productData = {
    name: req.payload.name,
    imageLocation: req.payload.imageLocation,
    price: req.payload.price,
    brand: req.payload.brand,
    link: req.payload.link,
    sku: req.payload.sku,
    stock: req.payload.stock,
    inStoreOnly: req.payload.inStoreOnly,
    runGroup: req.payload.runGroup,
    date: req.payload.date
  };

  return Product.create(productData).then((product) => {

     return { message: "product added", product: product };

  }).catch((err) => {

    return { err: err };

  });
}

/**
 * Add multiple products
 */
exports.createMany = (req, h) => {

  return Product.insertMany(req.payload).then((products) => {

     return { message: "product added", products: products };

  }).catch((err) => {

    return { err: err };

  });
}

