const slugify = require('slugify');
const express = require('express');
const Router = express.Router();

const isAdmin = require('../middleware/authmiddlewares.js');
const CategoryModel = require('../model/Category.js');

// Create Category
Router.post('/createcategory', isAdmin, async (req, res) => {
  try {
    const { Name } = req.body;
    console.log('Category name:', Name);
    const slug = slugify(Name, { lower: true });
    console.log(slug);
    const category = await CategoryModel({
      Name,
      slug,
    });

    const savedCategory = await category.save();
    res.status(200).json({ message: 'Category created successfully', category });
  } catch (error) {
    res.status(201).json({ message: 'Error', error });
  }
});

// Update Category by ID
Router.put('/updatecategory/:id', isAdmin, async (req, res) => {
  try {
    const { Name } = req.body;
    const { id } = req.params;

    const category = await CategoryModel.findByIdAndUpdate(
      id,
      {
        Name,
        slug: slugify(Name, { lower: true }),
      },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category updated successfully', category });
  } catch (error) {
    res.status(500).json({ message: 'Error', error });
  }
});

// Delete Category by ID
Router.delete('/deletecategory/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const category = await CategoryModel.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted successfully', category });
  } catch (error) {
    res.status(500).json({ message: 'Error', error });
  }
});
// Get All Categories
Router.get('/getallcategories', async (req, res) => {
    try {
      const categories = await CategoryModel.find();
  
      res.status(200).json({ message: 'All categories retrieved successfully', categories });
    } catch (error) {
      res.status(500).json({ message: 'Error', error });
    }
  });
// Get Single Category by ID
Router.get('/getcategory/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      const category = await CategoryModel.findById(id);
  
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
  
      res.status(200).json({ message: 'Category retrieved successfully', category });
    } catch (error) {
      res.status(500).json({ message: 'Error', error });
    }
  });
  
module.exports = Router;
