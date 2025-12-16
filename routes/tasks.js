const express = require('express');
const Task = require('../models/Task');
const router = express.Router();

// Get all tasks
router.get('/', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

// Create a new task
router.post('/', async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: 'Invalid status value', details: err.message });
        }
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update a task
router.put('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(task);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: 'Invalid status value', details: err.message });
        }
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a task
router.delete('/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
});

module.exports = router;
