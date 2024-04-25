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
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const recipeId = req.params.id;

        // Check if the recipe exists
        const existingRecipe = await Recipe.findById(recipeId);
        if (!existingRecipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        // Check if the user is authorized to update the recipe
        if (existingRecipe.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Unauthorized to update this recipe' });
        }

        // Update the recipe fields if provided in the request body
        if (req.body.title != null) {
            existingRecipe.title = req.body.title;
        }
        if (req.body.recipe != null) {
            existingRecipe.recipe = req.body.recipe;
        }
        if (req.body.image != null) {
            existingRecipe.imageUrl = req.body.image;
        }

        // Save the updated recipe
        const updatedRecipe = await existingRecipe.save();
        res.json(updatedRecipe);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a recipe
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const recipeId = req.params.id;

        // Check if the recipe exists
        const existingRecipe = await Recipe.findById(recipeId);
        if (!existingRecipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        // Check if the user is authorized to delete the recipe
        if (existingRecipe.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Unauthorized to delete this recipe' });
        }

        // Delete the recipe
        await Recipe.findByIdAndDelete(recipeId);
        res.json({ message: 'Recipe deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


async function getRecipe(req, res, next) {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.locals.recipe = recipe; // Assign the recipe to res.locals.recipe
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
