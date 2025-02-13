const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/signupDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

const productSchema = new mongoose.Schema({
  main_category: String,
  title: String,
  average_rating: Number,
  rating_number: Number,
  features: Array,
  description: Array,
  price: String,
  images: String,
  videos: String,
  store: String,
  categories: Array,
  details: Object,
  parent_asin: String,
  category: String,
});

const Product = mongoose.model('Product', productSchema);

// Routes
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  const newUser = new User({
    name,
    email,
    password,
  });

  try {
    await newUser.save();
    res.status(201).send('User created');
  } catch (error) {
    res.status(400).send('Error creating user');
  }
});

app.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });
    if (user) {
      res.status(200).json({ success: true });
    } else {
      res.status(401).json({ success: false });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/products', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50; // Number of products per page
  const skip = (page - 1) * limit;

  try {
    const products = await Product.find().skip(skip).limit(limit);
    const totalProducts = await Product.countDocuments();
    const hasMore = page * limit < totalProducts;

    const formattedProducts = products.map(product => {
      try {
        const images = JSON.parse(product.images.replace(/None/g, 'null').replace(/'/g, '"'));
        return {
          ...product._doc,
          images
        };
      } catch (error) {
        console.error('Error parsing images:', error);
        return {
          ...product._doc,
          images: { large: [], thumb: [] }
        };
      }
    });

    res.status(200).json({ products: formattedProducts, hasMore });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});