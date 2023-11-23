
const express = require('express');
const Router = express.Router();
const isAdmin = require('../middleware/authmiddlewares.js');
const ProductModel = require('../model/Product.js');const multer = require('multer');
const formidable = require('express-formidable');
const slugify = require('slugify')
const fs = require('fs')
Router.post('/createproduct', formidable(), async (req, res) => {
  try {
    const { name, slug, price, category, description, quantity } = req.fields;
    const { photo } = req.files;

    // Check if the 'name' field is missing
    if (!name) {
      return res.status(400).json({ message: 'Product name is required' });
    }

    // Check if the 'slug' field is missing
    if (!slug) {
      return res.status(400).json({ message: 'Product slug is required' });
    }

    // Check if the 'price' field is missing
    if (!price) {
      return res.status(400).json({ message: 'Product price is required' });
    }

    // Check if the 'category' field is missing
    if (!category) {
      return res.status(400).json({ message: 'Product category is required' });
    }

    // Check if the 'description' field is missing
    if (!description) {
      return res.status(400).json({ message: 'Product description is required' });
    }

    // Check if the 'quantity' field is missing
    if (!quantity) {
      return res.status(400).json({ message: 'Product quantity is required' });
    }

    // Check if the 'photo' field is missing or empty
    if (!photo || !photo.size) {
      return res.status(400).json({ message: 'Product photo is required' });
    }

    
    const Products = new ProductModel({...req.fields, slug:slugify(name)})
    if(photo){
      Products.photo.data = fs.readFileSync(photo.path)
      Products.contentType = photo.type
    }


    // Save the product to the database
    await Products.save();

    // Return a success response with the photo included
    return res.status(200).json({ message: 'Product created successfully', Products });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product', error });
  }
});


// Define a route for updating a product
Router.put('/updateproduct/:id', formidable(), async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, slug, price, category, description, quantity } = req.fields;
    const { photo } = req.files;

    // Check if the 'name' field is missing
    if (!name) {
      return res.status(400).json({ message: 'Product name is required' });
    }

    // Check if the 'slug' field is missing
    if (!slug) {
      return res.status(400).json({ message: 'Product slug is required' });
    }

    // Check if the 'price' field is missing
    if (!price) {
      return res.status(400).json({ message: 'Product price is required' });
    }

    // Check if the 'category' field is missing
    if (!category) {
      return res.status(400).json({ message: 'Product category is required' });
    }

    // Check if the 'description' field is missing
    if (!description) {
      return res.status(400).json({ message: 'Product description is required' });
    }

    // Check if the 'quantity' field is missing
    if (!quantity) {
      return res.status(400).json({ message: 'Product quantity is required' });
    }

    // Find the product by ID
    const product = await ProductModel.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update product fields with the new data
    product.name = name;
    product.slug = slugify(name);
    product.price = price;
    product.category = category;
    product.description = description;
    product.quantity = quantity;

    // Check if a new photo was uploaded
    if (photo && photo.size > 0) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    // Save the updated product
    await product.save();

    // Return a success response with the updated product
    return res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product', error });
  }
});




Router.get('/products', async (req, res) => {
    try {
      // Fetch all products from the database
      const products = await ProductModel.find();
  
      res.status(200).json({ message: 'Products fetched successfully',CountTotal:products.length, products });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Error fetching products', error });
    }
  });

// Route to get products by category ID
Router.get('/products/:categoryId', async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    // Find products that reference the specified category ID
    const products = await ProductModel.find({ category: categoryId });

    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found in the specified category' });
    }

    res.status(200).json({ message: 'Products fetched by category successfully', CountTotal: products.length, products });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ message: 'Error fetching products by category', error });
  }
});
// Route to get an image by product ID
Router.get('/products/image/:productid', async (req, res) => {
  try {
    // Fetch the product by its ID
    const product = await ProductModel.findById(req.params.productid).select('photo');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.photo.data) {
      const contentType = 'image/jpeg'; // Change to the actual image format

      res.set("Content-Type", contentType); // Set the Content-Type header

      // Decode the Base64 data using Buffer.from
      const binaryImageData = Buffer.from(product.photo.data, 'base64');

      res.status(200).send(binaryImageData);
    } else {
      return res.status(404).json({ message: 'Image not found for this product' });
    }
  } catch (error) {
    console.error('Error fetching product image:', error);
    res.status(500).json({ message: 'Error fetching product image', error });
  }
});



// DELETE a product by ID
Router.delete('/products/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    const deletedProduct = await ProductModel.findByIdAndRemove(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(204).json({ message: 'Product deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
  });

  
// Route to get a single product by slug
Router.get('/products/:slug', async (req, res) => {
    try {
      const slug = req.params.slug;
  
      // Find the product by slug in the database
      const product = await ProductModel.findOne({ slug });
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      res.status(200).json({ message: 'single Product fetched successfully', product });
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ message: 'Error fetching product', error });
    }
  });

 

module.exports = Router;
