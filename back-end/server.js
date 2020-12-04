const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/pizzaria', {
    useNewUrlParser: true
});

const ingredientSchema = new mongoose.Schema({
    title: String,
    cost: Number,
});
const Ingredient = mongoose.model('Ingredient', ingredientSchema);

const pizzaSchema = new mongoose.Schema({
    name: String,
    upVotes: Number,
    ingredients: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Ingredient'
    }],
});
pizzaSchema.methods.upVote = function(cb) {
    this.upVotes += 1;
    this.save(cb);
};
const Pizza = mongoose.model('Pizza', pizzaSchema);

// Create a new item in the museum: takes a title and a path to an image.
app.post('/api/ingredients', async (req, res) => {
    const ingredient = new Ingredient({
        title: req.body.title,
        cost: req.body.path,
    });
    try {
        await ingredient.save();
        res.send(ingredient);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.post('/api/pizzas', async (req, res) => {
    const pizza = new Pizza({
        name: req.body.name,
        ingredients: req.body.ingredients,
        upVotes: 0,
    });
    try {
        await pizza.save();
        res.send(pizza);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.get('/api/ingredients', async (req, res) => {
    try {
        let ingredients = await Ingredient.find();
        res.send(ingredients);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.get('/api/pizzas', async (req, res) => {
    try {
        let pizzas = await Pizza.find({}).populate('ingredients');
        res.send(pizzas);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.delete('/api/ingredients/:id', async (req, res) => {
    try {
        await Ingredient.deleteOne({
            _id: req.params.id
        });
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.delete('/api/pizzas/:id', async (req, res) => {
    try {
        await Pizza.deleteOne({
            _id: req.params.id
        });
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.put('/api/pizzas/:id', async (req, res) => {
    try {
        pizzaToEdit = await Pizza.findOne({
            _id: req.params.id
        });
        pizzaToEdit.name = req.body.name;
        pizzaToEdit.ingredients = req.body.ingredients;
        pizzaToEdit.upVotes = req.body.upVotes;
        pizzaToEdit.save();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.put('/api/upvote/:id', async (req, res) => {
    try {
        pizzaToEdit = await Pizza.findOne({
            _id: req.params.id
        });
        pizzaToEdit.upVotes += 1;
        pizzaToEdit.save();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.listen(3001, () => console.log('Server listening on port 3001!'));