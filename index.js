require('dotenv/config');
const express = require('express');
const app = express();
const port = process.env.PORT || 5780; 
const connect = require('./config/db'); 
const userRoute = require('./routes/auth/userRoute'); 
const adminProductRoute = require ('./routes/admin/product');
const adminOrderRoute = require('./routes/admin/order');
const shopProductRoute = require('./routes/shop/product');
const shopOrderRoute = require ('./routes/shop/order');
const shopCartRoute = require ('./routes/shop/cart');
const productSearchRoute = require ('./routes/shop/search');
const addressRoute = require ('./routes/shop/address');
const upload = require('./config/multerConfig');  
const { uploadFile } =require ('./utils/fileUploadController')

// Middleware to parse JSON requests
app.use(express.json());

// file upload
app.post('/api/v1/users/upload', upload.single('file'), uploadFile);

// Routes
app.use('/api/v1/users', userRoute); 
app.use('/api/v1/products', adminProductRoute);
app.use('/api/admin/orders', adminOrderRoute);
app.use('/api/shop/product', shopProductRoute);
app.use('/api/shop/order', shopOrderRoute);
app.use('/api/shop/cart', shopCartRoute);
app.use('/api/shop/search', productSearchRoute);
app.use('/api/shop/address', addressRoute);

// Root path
app.get('/', (req, res) => {
  console.log('Running...');
  res.json({ success: true, message: 'Server is Running...' });
});

// Start server and connect to the database
connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log('Invalid database connection...', error);
  });

// Error handling for route not found
app.use((req, res, next) => {
  const error = new Error('Route Not Found');
  error.status = 404;
  next(error);
});

// Error handling middleware
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    success: false,
    message: error.message,
  });
});
