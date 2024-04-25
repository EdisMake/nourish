// mongodb+srv://admin:RNtd6rGbooFyHidT@nourishnotescluster.yleaqyd.mongodb.net/?retryWrites=true&w=majority&appName=nourishnotescluster
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

app.use(cors());

const recipeRouter = require('./routes/recipes');
const userRouter = require('./routes/users');

mongoose.connect('mongodb+srv://admin:RNtd6rGbooFyHidT@nourishnotescluster.yleaqyd.mongodb.net/?retryWrites=true&w=majority&appName=nourishnotescluster', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

app.use(express.json());

app.use('/recipes', recipeRouter);
app.use('/users', userRouter);

app.listen(3001, () => console.log('Server Started'));

