const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv').config();
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();
const port = 8000;


// Middleware
require('dotenv').config();
app.use(express.json());
app.use(cors());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

// Mongoose connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Error connecting to MongoDB:", err));

// User Schema
const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: true },
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model('User', userSchema, 'users');

// Passport Google OAuth strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/auth/google/callback",
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        user = new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
        });
        await user.save();
      }
      return done(null, user);
    } catch (error) {
      console.error('Error in OAuth:', error);
      return done(error, null);
    }
  }
));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

// Routes for Google OAuth
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  });

  app.get('/logout', (req, res) => {
    req.logout(err => {
      if (err) {
        console.error('Error during logout:', err);
        return res.status(500).json({ message: 'Logout failed' });
      }
      req.session.destroy((err) => {
        if (err) {
          console.error('Error destroying session:', err);
          return res.status(500).json({ message: 'Failed to destroy session' });
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.redirect('/login'); // Redirect to the login page
      });
    });
  });
  

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
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100;
  const skip = (page - 1) * limit;

  try {
    const data = await FinancialData.find().skip(skip).limit(limit);
    const totalCount = await FinancialData.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);

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


// Route to get fraud amount by category
app.get('/api/v1/financial-data/fraud-by-category', async (req, res) => {
    try {
      const fraudData = await FinancialData.aggregate([
        { $match: { fraud: { $gt: 0 } } }, // Filter for fraud cases
        { $group: { _id: "$category", totalAmount: { $sum: "$amount" }, fraudCount: { $sum: 1 } } }
      ]);
      res.json(fraudData); // Ensure this is sending valid JSON
    } catch (err) {
      console.error('Error fetching fraud data by category:', err);
      res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// Route to get total number of fraud accounts
app.get('/api/v1/financial-data/total-frauds', async (req, res) => {
    try {
        const fraudCount = await FinancialData.countDocuments({ fraud: { $gt: 0 } });
        res.json({ totalFrauds: fraudCount });
    } catch (err) {
        console.error('Error fetching total fraud count:', err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});
  
// Start the server
app.listen(port, () => console.log(`Server running on port ${port}`));
