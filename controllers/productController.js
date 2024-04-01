const Product = require('../models/productModel');
const { uploadImage } = require('../utils/uploadImage');

async function getProducts(req, res) {
  try {
    const curPage = parseInt(req.query.page, 10) || 1;
    const pageSize = 5;
    let prev = null;
    let next = null;

    const aggregationPipeline = [
      {
        $skip: (curPage - 1) * pageSize,
      },
      {
        $limit: pageSize,
      },
    ];
    const products = await Product.aggregate(aggregationPipeline).exec();
    const count = await Product.countDocuments().exec();
    
        // Generate next and prev
    if (curPage - 1 >= 1) {
      prev = `http://${req.hostname}${req.baseUrl}${req.path}/?page=${curPage - 1}`;
    }
    if (curPage * pageSize < count) {
      next = `http://${req.hostname}${req.baseUrl}${req.path}/?page=${curPage + 1}`;
    }
    
    res.status(200).json({
      count, prev, next, data: products,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'internal server error' });
  }
}

async function getProduct(req, res) {
  const { id } = req.params;
  await Product.findOne({ _id: id })
    .then((product) => {
      if (!product) {
        return res.status(404).json({ error: 'not found' });
      }
      return res.status(200).json(product);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'internal server error' });
    });
}

async function createProduct(req, res) {
  const { name, description, price, category } = req.body;
  console.log(name);

  // Body parameters validation
  if (!name || !price || !category) {
    res.status(400).json({ error: 'missing name, price and or category' });
    return;
  }
  if (await Product.findOne({ name })) {
    res.status(400).json({ error: 'name already exists' });
    return;
  }

  const imageURLs = [];
  const images = req.files;

  // Upload image to cloudinary
  for (const image of images) {
    const url = await uploadImage(image.path);
    if (url !== null) {
      imageURLs.push(url);
    } else {
      res.status(500).json({ error: 'internal server error' });
      return;
    }
  }

  console.log(imageURLs)
  // Create a new product
  await Product.create({ name, description, price, category, imageURLs })
    .then((product) => {
      res.status(201).json(product);
    }).catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'internal server error' });
    });
}

async function deleteProduct(req, res) {
  await Product.deleteOne({ _id: req.params.id })
    .then((result) => {
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'not found' });
      }
      return res.status(200).json({ success: 'deleted' });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: 'internal server error' });
    });
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct,
};