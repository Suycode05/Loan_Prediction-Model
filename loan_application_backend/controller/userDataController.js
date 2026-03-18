const express = require('express');
const router = express.Router();
const { TrainUser, TestUser } = require('../models/userDataModels.js'); // Adjust path as needed

// POST /user (already in your code)
router.post('/traindata', async (req, res) => {
    try {
        const userData = req.body;
        const user = new TrainUser(userData);
        await user.save();
        res.status(201).json({ message: 'User data saved successfully', user });
    } catch (error) {
        res.status(400).json({ error: 'Invalid data', details: error.message });
    }
});
// GET /user - Fetch all users
router.get('/traindata', async (req, res) => {
    try {
        const users = await TrainUser.find(); // Fetch all user documents
        res.status(200).json(users);     // Send as JSON response
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users', details: error.message });
    }
});
router.post('/testdata', async (req, res) => {
    try {
        const testData = req.body;
        const testUser = new TestUser(testData);
        await testUser.save();
        res.status(201).json({ message: 'TestUser data saved successfully', testUser });
    } catch (error) {
        res.status(400).json({ error: 'Invalid data', details: error.message });
    }
});
router.get('/testdata', async (req, res) => {
    try {
        const testUsers = await TestUser.find();
        res.status(200).json(testUsers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch TestUser data', details: error.message });
    }
});
router.get('/testdata/:id', async (req, res) => {
    try {
        const { id } = req.params; // extract id from URL
        const testUser = await TestUser.findById(id); // fetch by ID

        if (!testUser) {
            return res.status(404).json({ error: 'TestUser not found' });
        }

        res.status(200).json(testUser);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch TestUser data',
            details: error.message
        });
    }
});
router.patch('/testdata/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { Status } = req.body;

    // Validate Status
    if (!Status || !['pending', 'approved', 'rejected'].includes(Status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    // Find and update the user
    const updatedUser = await TestUser.findByIdAndUpdate(
      id,
      { Status },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ error: 'Failed to update user status', details: error.message });
  }
});
module.exports = router;