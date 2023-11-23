const express = require('express');
const Order = require('../model/Order');
const Router = express.Router();

Router.post('/create', async (req, res) => {
  try {
    const { user, products } = req.body;

    if (!user || !products) {
      return res.status(400).json({ error: 'Missing user or products in the request.' });
    }

    // Create the order
    const order = new Order({
      user,
      products,
    });

    // Save the order
    await order.save();

    // Respond with a success message
    res.status(201).json({ message: 'Order created successfully' });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create an order.' });
  }
});

Router.get('/all', async (req, res) => {
  try {
    // Fetch all orders from your database (assuming you have a database set up)
    const orders = await Order.find();

    // Respond with the list of orders
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ error: 'Failed to retrieve orders.' });
  }
});
// Route to update the status of an order by order ID
Router.put('/updateStatus/:orderId', async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const newStatus = req.body.newStatus;

    // Find the order by order ID
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update the status
    order.status = newStatus;

    // Save the updated order
    await order.save();

    res.status(200).json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Route to get an order by ID
Router.get('/orderId', async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Find the order by its ID
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found by order id' });
    }

    // Respond with the order data
    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    res.status(500).json({ error: 'Failed to retrieve the order by id.' });
  }
});
// Route to get orders by user ID
Router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find orders associated with the specified user ID
    const orders = await Order.find({ user: userId });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: 'Orders not found for this user' });
    }

    // Respond with the list of orders for the user
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders by user ID:', error);
    res.status(500).json({ error: 'Failed to retrieve orders by this user id.' });
  }
});

module.exports = Router;
