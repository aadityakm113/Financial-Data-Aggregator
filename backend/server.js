const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv').config();

const app = express();
const port = 8000;

// Middleware
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Error connecting to MongoDB:", err));

const userSchema = new mongoose.Schema({
  name: String,
  phone: String,
  username: { type: String, unique: true },
  password: { type: String, required: true },
  email: { type: String, unique: true },
});

const User = mongoose.model('User', userSchema, 'users');

// Register Route
app.post('/register', async (req, res) => {
  const { name, phone, username, password, email } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, phone, username, password: hashedPassword, email });
    await newUser.save();

    res.status(200).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Financial Data Schema
const financialDataSchema = new mongoose.Schema({
  step: { type: Number, required: true },
  customer: { type: String, required: true },
  age: { type: String, required: true },
  gender: { type: String, required: true },
  zipcodeOri: { type: String, required: true },
  merchant: { type: String, required: true },
  zipMerchant: { type: String, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  fraud: { type: Number, required: true },
});

const FinancialData = mongoose.model('FinancialData', financialDataSchema, 'data');

// Paginated Route for Financial Data
app.get('/api/v1/financial-data', async (req, res) => {
  // Parse the page and limit parameters from the query string
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const limit = parseInt(req.query.limit) || 100; // Default to limit 100 if not provided

  // Calculate the number of documents to skip
  const skip = (page - 1) * limit;

  try {
    // Fetch the paginated data
    const data = await FinancialData.find()
      .skip(skip)   // Skip the number of documents based on page and limit
      .limit(limit); // Limit the number of documents returned

    // Fetch the total count of documents to provide total page information
    const totalCount = await FinancialData.countDocuments();
    
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalCount / limit);

    // Respond with paginated data and metadata
    res.json({
      page,
      limit,
      totalPages,
      totalCount,
      data,
      links: {
        previous: page > 1 ? `/api/v1/financial-data?page=${page - 1}&limit=${limit}` : null,
        next: page < totalPages ? `/api/v1/financial-data?page=${page + 1}&limit=${limit}` : null
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to get category distribution
app.get('/api/v1/financial-data/categories', async (req, res) => {
    try {
      const categories = await FinancialData.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } }
      ]);
      res.json(categories);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Route to get merchant frequency
  app.get('/api/v1/financial-data/merchants', async (req, res) => {
    try {
      const merchants = await FinancialData.aggregate([
        { $group: { _id: "$merchant", count: { $sum: 1 } } }
      ]);
      res.json(merchants);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Route to get merchants per category
  app.get('/api/v1/financial-data/merchants-per-category', async (req, res) => {
    try {
      const merchantsPerCategory = await FinancialData.aggregate([
        { $group: { _id: { category: "$category", merchant: "$merchant" }, count: { $sum: 1 } } },
        { $group: { _id: "$_id.category", merchants: { $push: { merchant: "$_id.merchant", count: "$count" } } } }
      ]);
      res.json(merchantsPerCategory);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Route to get customers by age and gender
  app.get('/api/v1/financial-data/customers-by-age-gender', async (req, res) => {
    try {
      const customersByAgeGender = await FinancialData.aggregate([
        { $group: { _id: { age: "$age", gender: "$gender" }, count: { $sum: 1 } } },
        { $group: { _id: "$_id.age", genders: { $push: { gender: "$_id.gender", count: "$count" } } } }
      ]);
      res.json(customersByAgeGender);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

// Start the server
app.listen(port, () => console.log(`Server running on port ${port}`));
