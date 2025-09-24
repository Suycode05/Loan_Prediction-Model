const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const employeeLoginRoutes = require('./controller/employeeLoginController.js');
const userLoginRoutes = require('./controller/userLoginController.js');
const userDataRoutes = require('./controller/userDataController.js');
const panCardRoutes = require('./controller/panCardController.js');
const UserFinancial  = require('./models/pancardData.js');
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
app.post('/user/pancard', async (req, res) => {
  const { panCardNumber } = req.body;

  // Basic PAN card format validation
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if (!panCardNumber || !panRegex.test(panCardNumber)) {
    return res.status(400).json({ error: 'Invalid PAN card number' });
  }

  try {
    const userData = await UserFinancial.findOne({ panCardNumber });
    if (!userData) {
      return res.status(404).json({ error: 'PAN card number not found' });
    }

    res.status(200).json({
      AnnualIncome: userData.AnnualIncome,
      CreditScore: userData.CreditScore,
      CreditCardUtilizationRate: userData.CreditCardUtilizationRate,
      NetWorth: userData.NetWorth,
      BankruptcyHistory: userData.BankruptcyHistory,
      TotalLiabilities: userData.TotalLiabilities,
      LengthOfCreditHistory: userData.LengthOfCreditHistory,
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
app.post('/user/pancard/add', async (req, res) => {
  const {
    panCardNumber,
    AnnualIncome,
    CreditScore,
    CreditCardUtilizationRate,
    NetWorth,
    BankruptcyHistory,
    TotalLiabilities,
    LengthOfCreditHistory
  } = req.body;

  // Validate PAN card format
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if (!panCardNumber || !panRegex.test(panCardNumber)) {
    return res.status(400).json({ error: 'Invalid PAN card number' });
  }

  // Validate required fields
  const requiredFields = [
    'AnnualIncome',
    'CreditScore',
    'CreditCardUtilizationRate',
    'NetWorth',
    'BankruptcyHistory',
    'TotalLiabilities',
    'LengthOfCreditHistory'
  ];
  const missingFields = requiredFields.filter(field => req.body[field] === undefined || req.body[field] === null);
  if (missingFields.length > 0) {
    return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
  }

  // Validate field types and ranges
  if (typeof AnnualIncome !== 'number' || AnnualIncome < 0) {
    return res.status(400).json({ error: 'AnnualIncome must be a non-negative number' });
  }
  if (typeof CreditScore !== 'number' || CreditScore < 300 || CreditScore > 850) {
    return res.status(400).json({ error: 'CreditScore must be between 300 and 850' });
  }
  if (typeof CreditCardUtilizationRate !== 'number' || CreditCardUtilizationRate < 0 || CreditCardUtilizationRate > 100) {
    return res.status(400).json({ error: 'CreditCardUtilizationRate must be between 0 and 100' });
  }
  if (typeof NetWorth !== 'number') {
    return res.status(400).json({ error: 'NetWorth must be a number' });
  }
  if (typeof BankruptcyHistory !== 'boolean') {
    return res.status(400).json({ error: 'BankruptcyHistory must be a boolean' });
  }
  if (typeof TotalLiabilities !== 'number' || TotalLiabilities < 0) {
    return res.status(400).json({ error: 'TotalLiabilities must be a non-negative number' });
  }
  if (typeof LengthOfCreditHistory !== 'number' || LengthOfCreditHistory < 0) {
    return res.status(400).json({ error: 'LengthOfCreditHistory must be a non-negative number' });
  }

  try {
    // Check if PAN card number exists, update if it does, create if it doesn't
    const existingData = await UserFinancial.findOne({ panCardNumber });
    if (existingData) {
      // Update existing record
      existingData.AnnualIncome = AnnualIncome;
      existingData.CreditScore = CreditScore;
      existingData.CreditCardUtilizationRate = CreditCardUtilizationRate;
      existingData.NetWorth = NetWorth;
      existingData.BankruptcyHistory = BankruptcyHistory;
      existingData.TotalLiabilities = TotalLiabilities;
      existingData.LengthOfCreditHistory = LengthOfCreditHistory;
      await existingData.save();
      return res.status(200).json({ message: 'Financial data updated successfully', data: existingData });
    } else {
      // Create new record
      const newData = new UserFinancial({
        panCardNumber,
        AnnualIncome,
        CreditScore,
        CreditCardUtilizationRate,
        NetWorth,
        BankruptcyHistory,
        TotalLiabilities,
        LengthOfCreditHistory
      });
      await newData.save();
      return res.status(201).json({ message: 'Financial data added successfully', data: newData });
    }
  } catch (error) {
    console.error('Error saving financial data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
app.use('/employee', employeeLoginRoutes);
app.use('/user', userLoginRoutes);
app.use('/user', userDataRoutes);
app.use('/pancard', panCardRoutes);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// module.exports = app;