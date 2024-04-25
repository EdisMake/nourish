// nourish-notes-backend/routes/recipes.js

const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe');
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, 'your-secret-key', (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
}

// GET all recipes
router.get('/', async (req, res) => {
    try {
        const recipes = await Recipe.find().select('title recipe imageUrl'); // Select title, recipe, and imageUrl fields
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET a specific recipe
router.get('/:id', getRecipe, (req, res) => {
    res.json(res.recipe);
});

// CREATE a recipe
router.post('/', authenticateToken, async (req, res) => {
    const recipe = new Recipe({
        title: req.body.title,
        imageUrl: req.body.image,
        recipe: req.body.recipe,
        createdBy: req.body.createdBy // Assuming you pass the user ID here
    });

    try {
        const newRecipe = await recipe.save();
        res.status(201).json(newRecipe);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE a recipe
router.put('/:id', authenticateToken, getRecipe, async (req, res) => {
    if (req.body.title != null) {
        res.recipe.title = req.body.title;
    }
    if (req.body.ingredients != null) {
        res.recipe.ingredients = req.body.ingredients;
    }
    if (req.body.instructions != null) {
        res.recipe.instructions = req.body.instructions;
    }
    if (req.body.imageUrl != null) {
        res.recipe.imageUrl = req.body.imageUrl;
    }

    try {
        const updatedRecipe = await res.recipe.save();
        res.json(updatedRecipe);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
// DELETE a recipe
router.delete('/:id', authenticateToken, getRecipe, async (req, res) => {
    try {
        await res.recipe.remove();
        res.json({ message: 'Recipe deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware function to get a specific recipe by ID
async function getRecipe(req, res, next) {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (recipe == null) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.recipe = recipe;
        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

router.get('/user/:userId/recipes', authenticateToken, async (req, res) => {
    try {
        const recipes = await Recipe.find({ createdBy: req.params.userId });
        res.json({ recipes });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
