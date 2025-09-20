const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const employeeLoginRoutes = require('./controller/employeeLoginController.js');
const userLoginRoutes = require('./controller/userLoginController.js');
const userDataRoutes = require('./controller/userDataController.js');
const panCardRoutes = require('./controller/panCardController.js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000', 'https://loan-prediction-model-eight.vercel.app', 'https://loan-prediction-ml-model.web.app','https://loan-prediction-model-1mnx.vercel.app','http://localhost:5173/prediction'],
  credentials: true
}));app.use(express.json());

mongoose.connect(process.env.MONGODB_URI,{ dbName: 'Loan-Prediction-Model' })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => { console.error('MongoDB error:', err); process.exit(1); });

app.get('/',(req,res)=>{res.status(200).json({message:"Loaded"});})
app.use('/employee', employeeLoginRoutes);
app.use('/user', userLoginRoutes);
app.use('/user', userDataRoutes);
app.use('/pancard', panCardRoutes);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// module.exports = app;