const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const dotenv = require('dotenv').config();

const app = express();
const port = 8000;


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Error connecting to MongoDB:", err));

const userSchema = new mongoose.Schema({
  name: String,
  phone: String,
  username: { type: String, unique: true },
  password: String,
  email: { type: String, unique: true },
});

const User = mongoose.model('user', userSchema, 'users');