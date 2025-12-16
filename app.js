const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const taskRoutes = require('./routes/tasks');
require('dotenv').config();

const app = express();

// use "mongodb://localhost:27017/" locally
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(bodyParser.json());


if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(MONGO_URI);
}
//mongoose.connect(MONGO_URI);

app.use('/api/tasks', taskRoutes);

//app.listen(5000, () => console.log('Server running on http://localhost:5000'));
module.exports = app;
