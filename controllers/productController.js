const Product = require('../models/productModel');
const Categories = require('../models/categoryModel');
const { uploadImage } = require('../utils/uploadImage');
const {
  selfUrlGenerator,
  urlGenerator,
  paginationUrlGen,
} = require('../utils/urlGenerator');

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
      prev = paginationUrlGen(req, curPage - 1);
    }
    if (curPage * pageSize < count) {
      next = paginationUrlGen(req, curPage + 1);;
    }

    // Generate product urls
    for (product of products) {
      product.category = urlGenerator(req, '/api/categories/', product.categoryId);
      delete product.categoryId;
      product.url = urlGenerator(req, '/api/products/', product._id);
    }

    res.status(200).json({
      count, prev, next, data: products, url: selfUrlGenerator(req)
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
      // Add Urls
      product = product.toObject();
      product.category = urlGenerator(req, '/api/categories/', product.categoryId);
      delete product.categoryId;
      product.url = selfUrlGenerator(req);

      return res.status(200).json(product);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'internal server error' });
    });
}

async function createProduct(req, res) {
  const {
    name, description, price, categoryId, stock,
  } = req.body;

  // Body parameters validation
  if (!name || !price || !categoryId) {
    res.status(400).json({ error: 'missing name, price and or category' });
    return;
  }
  if (await Product.findOne({ name })) {
    res.status(400).json({ error: 'name already exists' });
    return;
  }
  if (!await Categories.findOne({ _id: categoryId })) {
    res.status(400).json({ error: 'category not found' });
    return
  }

  // Upload image to cloudinary
  const imageURLs = [];
  const images = req.files;
  for (const image of images) {
    const url = await uploadImage(image.path);
    console.log(url)
    if (url !== null) {
      imageURLs.push(url);
    } else {
      res.status(500).json({ error: 'internal server error' });
      return;
    }
  }

  // Create a new product
  await Product.create({
    name, description, price, categoryId, stock, imageURLs,
  })
    .then((product) => {
      product = product.toObject();
      product.category = urlGenerator(req, '/api/categories/', product.categoryId);
      delete product.categoryId;
      product.url = selfUrlGenerator(req);
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
      return res.status(200).json({ message: 'deleted' });
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
