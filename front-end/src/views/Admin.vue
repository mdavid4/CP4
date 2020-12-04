<template>
<div class="admin">
    <h1>Master Pizzaiolo's Page</h1>
    <h2>Ingredients: </h2>
    <div class="add">
        <div class="form">
            <input v-model="title" placeholder="Ingredient">
            $<input v-model="cost" type="number" min="0.00" max="10000.00" step="0.01" placeholder="0.00">
            <button @click="addIngredient">Add</button>
        </div>
    </div>
    <div class="ingredient" v-for="ingredient in ingredients" :key="ingredient.id">
        <p>{{ingredient.title}} <button @click="deleteIngredient(ingredient)">X</button></p>
    </div>
    <h2>Pizzas: </h2>
    <div class="form">
        <input v-model="findTitle" placeholder="Search">
        <div class="suggestions" v-if="suggestions.length > 0">
            <div class="suggestion" v-for="s in suggestions" :key="s.id" @click="selectItem(s)">{{s.name}}
            </div>
        </div>
    </div>
    <div class=results>
        <div class="upload" v-if="findItem">
            Name: <input v-model="findItem.name">
        </div>
        <div class="upvotes" v-if="findItem">
            Upvotes: <input type="number" v-model="newUpVotes">
        </div>
        <div class="ingredients" v-if="findItem">
            <p>Ingredients:</p>
            <p class="li" v-for="(ingredient, index) in ingredients" :key="index">
                <input type="checkbox" :id="ingredient" :name="ingredient" v-model="contains[index]">
                {{ingredient.title}}
            </p>
        </div>
        <div class="actions" v-if="findItem">
            <button @click="deletePizza(findItem)">Delete</button>
            <button @click="editPizza(findItem)">Edit</button>
        </div>
    </div>

</div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'Admin',
    data() {
        return {
            title: "",
            cost: null,
            ingredients: [],
            name,
            pizzas: [],
            findTitle: "",
            findItem: null,
            contains: [],
            newUpVotes: 0,
        }
    },
    created() {
        this.getIngredients();
        this.getPizzas();
    },
    computed: {
        suggestions() {
            let items = this.pizzas.filter(item => item.name.toLowerCase().startsWith(this.findTitle.toLowerCase()));
            return items.sort((a, b) => a.title > b.title);
        },
    },
    methods: {
        checkedIngredientIDs() {
            let ids = this.ingredients.map(x => x._id);
            let checkedIDs = [];
            for (let i = 0; i < ids.length; i++) {
                if (this.contains[i]) {
                    checkedIDs.push(ids[i])
                }
            }
            return checkedIDs;
        },
        selectItem(item) {
            this.findTitle = "";
            this.findItem = item;
            this.newUpVotes = item.upVotes;
            let contains = [];
            for (let i = 0; i < this.ingredients.length; i++) {
                if (item.ingredients.some(ingr => ingr._id == this.ingredients[i]._id)) {
                    contains.push(true);
                } else {
                    contains.push(false);
                }
            }
            this.contains = contains;
        },
        async addIngredient() {
            try {
                await axios.post('/api/ingredients', {
                    title: this.title,
                    path: this.cost
                });
                this.getIngredients();
            } catch (error) {
                //console.log(error);
            }
        },
        async getIngredients() {
            try {
                let response = await axios.get("/api/ingredients");
                this.ingredients = response.data;
                return true;
            } catch (error) {
                //console.log(error);
            }
        },
        async getPizzas() {
            try {
                let response = await axios.get("/api/pizzas");
                this.pizzas = response.data;
                return true;
            } catch (error) {
                //console.log(error);
            }
        },
        async deleteIngredient(ingredient) {
            try {
                await axios.delete("/api/ingredients/" + ingredient._id);
                this.getIngredients();
                return true;
            } catch (error) {
                //console.log(error);
            }
        },
        async deletePizza(pizza) {
            try {
                await axios.delete("/api/pizzas/" + pizza._id);
                this.getPizzas();
                return true;
            } catch (error) {
                //console.log(error);
            }
        },
        async editPizza(pizza) {
            try {
                await axios.put("/api/pizzas/" + pizza._id, {
                    name: this.findItem.name,
                    ingredients: this.checkedIngredientIDs(),
                    upVotes: parseInt(this.newUpVotes),
                });
                this.findItem = null;
                this.getPizzas();
                return true;
            } catch (error) {
                //console.log(error);
            }
        },
    },
}
</script>

<style scoped>
.heading {
    display: flex;
    margin-bottom: 20px;
    margin-top: 20px;
}

.heading h2 {
    margin-top: 8px;
    margin-left: 10px;
}

.add,
.edit {
    display: flex;
}

/* Suggestions */
.suggestions {
    width: 200px;
    border: 1px solid #ccc;
    color: black;
}

.suggestion {
    min-height: 20px;
}

.suggestion:hover {
    background-color: #5BDEFF;
    color: #fff;
}

.results {
    margin-top: 3em;
    border: 1px solid #905000;
    border-radius: 2em;
    padding: 1em;
    width: 24em;
}

.li {
    margin: 1px 10px;
}

h2 {
    font-size: 1.2em;
    font-weight: bold;
    background-color: #e3e3e3;
    border-radius: 1em;
    padding: 0.3em;
    width: 12em;
}

/* Form */
input,
textarea,
select,
button {
    font-family: 'Montserrat', sans-serif;
    font-size: 1em;
}

.form {
    margin-right: 50px;
}

/* Uploaded images */
</style>
