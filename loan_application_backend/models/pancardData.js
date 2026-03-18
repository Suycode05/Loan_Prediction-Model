const mongoose = require('mongoose');

const userFinancialSchema = new mongoose.Schema({
  panCardNumber: {
    type: String,
    required: true,
    unique: true,
    match: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, // Basic PAN card format validation
  },
  AnnualIncome: {
    type: Number,
    required: true,
  },
  CreditScore: {
    type: Number,
    required: true,
    min: 300,
    max: 850,
  },
  CreditCardUtilizationRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  NetWorth: {
    type: Number,
    required: true,
  },
  BankruptcyHistory: {
    type: Boolean,
    required: true,
  },
  TotalLiabilities: {
    type: Number,
    required: true,
  },
  LengthOfCreditHistory: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('UserFinancial', userFinancialSchema);