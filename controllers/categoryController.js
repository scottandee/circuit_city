const Category = require('../models/categoryModel');
const { ObjectId } = require('mongodb')
require('dotenv').config();

async function getCategories(req, res) {
  try {
    const curPage = parseInt(req.query.page) || 1;
    const pageSize = 5;
    let prev = 'null';
    let next = 'null';
    const aggregationPipeline = [
      {
        $skip: (curPage - 1) * pageSize
      },
      {
        $limit: pageSize
      },
    ];
    const categories = await Category.aggregate(aggregationPipeline).exec();
    // const categoriesData = categories.map(category => category.toObject());
    const count = await Category.countDocuments().exec();
    if (curPage - 1 >= 1) {
      prev = `http://${req.hostname}${req.baseUrl}${req.path}/?page=${curPage - 1}`;
    }
    if (curPage * pageSize < count) {
      next = `http://${req.hostname}${req.baseUrl}${req.path}/?page=${curPage + 1}`;
    }
    // get all products in each category

    res.status(200).json({
      count,
      prev,
      next,
      data: categories
    });
  } catch(err) {
    console.log(err)
    res.status(500).json({error: 'internal server error'});
  }
}

async function getCategory(req, res) {
  const id = req.params.id;
  let category = await Category.findOne({ _id: id });
  if (!category) return res.status(404).json({ error: 'not found' });
  category = category.toObject();
  category.id = category._id;
  delete category._id;
  res.status(200).json(category)
}

async function createCategory(req, res) {
  const { name, description } = req.body;

  // Body parameters validation
  if (!name || !description) {
    res.status(400).json({ error: "missing name or description" });
    return;
  }
  if (await Category.findOne({ name })) {
    res.status(400).json({ error: "name already exists" });
    return;
  }

  // Create a new category
  const newCate = new Category({ name, description });
  newCate.save().then((saved) => {
    const savedDocObj = saved.toObject();
    savedDocObj.id = savedDocObj._id;
    delete savedDocObj._id;
    delete savedDocObj.__v;
    res.status(201).json(savedDocObj);
  }).catch((err) => {
    console.log(err);
    res.status(500).json({ error: 'internal server error' });
  });
}

async function updateCategory(req, res) {
  // const { name, description } = req.body;
  // if (await Category.find({ name }).length > 1) {
  //   res.status(400).json({ error: "name already exists" });
  //   return;
  // }
  // const id = new ObjectId(req.userId);
  // console.log(req.userId)
  // const category = await Category.findOne({ _id: id });
  // console.log(category)
  // if (name) category.name = name;
  // if (description != null) {
  //   category.description = description;
  // }

  // category.save().then((saved) => {
  //   const savedDocObj = saved.toObject();
  //   savedDocObj.id = savedDocObj._id;
  //   delete savedDocObj._id;
  //   delete savedDocObj.__v;
  //   res.status(201).json(savedDocObj);
  // }).catch((err) => {
  //   console.log(err);
  //   res.status(500).json({ error: 'internal server error' });
  // });
}

async function deleteCategory(req, res) {
  await Category.deleteOne({ _id: new ObjectId(req.userId) });
  res.status(200).json({success: 'deleted'});

}

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,  
};