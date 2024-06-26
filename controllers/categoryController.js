const Category = require('../models/categoryModel');
const Products = require('../models/productModel');
const {
  selfUrlGenerator,
  urlGenerator,
  paginationUrlGen,
} = require('../utils/urlGenerator');

async function getCategories(req, res) {
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
    const categories = await Category.aggregate(aggregationPipeline).exec();
    const count = await Category.countDocuments().exec();

    // Generate next and prev
    if (curPage - 1 >= 1) {
      prev = paginationUrlGen(req, curPage - 1);
    }
    if (curPage * pageSize < count) {
      next = paginationUrlGen(req, curPage + 1);
    }

    // Generate product urls
    for (const c of categories) {
      c.url = urlGenerator(req, '/api/categories/', c._id);
      c.products = `${c.url}/products`;
    }

    // get all products in each category
    res.status(200).json({
      count, prev, next, data: categories, url: selfUrlGenerator(req),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'internal server error' });
  }
}

async function getCategory(req, res) {
  const { id } = req.params;
  await Category.findOne({ _id: id })
    .then((category) => {
      if (!category) {
        return res.status(404).json({ error: 'not found' });
      }
      return res.status(200).json(category);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'internal server error' });
    });
}

async function createCategory(req, res) {
  const { name, description } = req.body;

  // Body parameters validation
  if (!name) {
    res.status(400).json({ error: 'missing name' });
    return;
  }
  if (await Category.findOne({ name })) {
    res.status(400).json({ error: 'name already exists' });
    return;
  }

  // Create a new category
  await Category.create({ name, description })
    .then((category) => {
      res.status(201).json(category);
    }).catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'internal server error' });
    });
}

async function updateCategory(req, res) {
  const { name, description } = req.body;

  // Check if name already exists in db
  const result = await Category.find({ name });
  if (result.length !== 0) {
    res.status(400).json({ error: 'name already exists' });
    return;
  }

  // Update the db
  await Category.updateOne({ _id: req.params.id }, { name, description, updatedAt: new Date() })
    .then((result) => {
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'not found' });
      }
    }).catch((err) => {
      console.log(err);
      return res.status(500).json({ error: 'internal server error' });
    });

  // Retreive category object
  const category = await Category.findOne({ _id: req.params.id });
  res.status(201).json(category);
}

async function deleteCategory(req, res) {
  await Category.deleteOne({ _id: req.params.id })
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
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
