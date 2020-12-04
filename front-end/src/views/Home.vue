<template>
<div class="home">
    <section class="ingredients">
        <tr>
            <th>Ingredient</th>
            <th>Price</th>
            <th>Require this on pizzas</th>
            <th>Exclude pizzas containing this</th>
        </tr>
        <tr class="ingredient" v-for="(ingredient, index) in ingredients" :key="index">
            <td>{{ingredient.title}}</td>
            <td>${{formatPrice(ingredient.cost)}}</td>
            <td class="check"><input type="checkbox" class="check" :id="ingredient" :name="ingredient" v-model="checked[index]" @change="forbiddenUpdate(index)"></td>
            <td class="check"><input type="checkbox" class="check" :id="ingredient" :name="ingredient" v-model="forbidden[index]" @change="checkedUpdate(index)"></td>
        </tr>
    </section>
    <h3>Create your own pizza based on selected ingredients above:</h3>
    <section class="makePizza">
        <div class="form">
            <input v-model="name" placeholder="pizza name">
            <button @click="makePizza">Create</button>
        </div>
    </section>
    <h3> Pizzas: </h3>
    <section class="pizzas">
        <div class="pizza" v-for="pizza in selectedPizzas" :key="pizza.id">
            <h2>{{pizza.name}}</h2>
            <p class="price">${{priceOf(pizza)}}</p>
            <p>ingredients:</p>
            <ul>
                <li class="ingredient" v-for="(ingredient, index) in pizza.ingredients" :key="index"> {{ingredient.title}} </li>
            </ul>
            <button @click="upVote(pizza)">upvote</button> upvotes: {{pizza.upVotes}}
        </div>
    </section>
</div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'Home',
    data() {
        return {
            ingredients: [],
            checked: [],
            forbidden: [],
            pizzas: [],
            name,
        }
    },
    created() {
        this.getIngredients();
        this.getPizzas();
    },
    computed: {
        selectedPizzas() {
            let tuples = this.pizzas.map(p => [true, p]);
            for (let tuple of tuples) {
                for (let index = 0; index < this.ingredients.length; index++) {
                    let foundInPizza = tuple[1].ingredients.map(x => x.title).indexOf(this.ingredients[index].title);
                    if (this.checked[index] && foundInPizza < 0) {
                        tuple[0] = false;
                    } else if (this.forbidden[index] && foundInPizza >= 0) {
                        tuple[0] = false;
                    }
                }
            }
            return tuples.filter(t => t[0]).map(t => t[1]);
        },
    },
    methods: {
        ingredientByID(id) {
            for (let i = 0; i < this.ingredients.length; i++) {
                if (this.ingredients[i]._id == id) {
                    return this.ingredients[i];
                }
            }
        },
        formatPrice(value) {
            let val = (value / 1).toFixed(2).replace('.', '.')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
        priceOf(pizza) {
            let price = 10;
            for (let ingredient of pizza.ingredients) {
                price += ingredient.cost;
            }
            return this.formatPrice(price);
        },
        forbiddenUpdate(index) {
            if (this.checked[index]) {
                this.forbidden[index] = false;
            }
        },
        checkedUpdate(index) {
            if (this.forbidden[index]) {
                this.checked[index] = false;
            }
        },
        checkedIngredientIDs() {
            let ids = this.ingredients.map(x => x._id);
            let checked = this.checked.map(x => x);
            let checkedIDs = [];
            for (let i = 0; i < ids.length; i++) {
                if (checked[i]) {
                    checkedIDs.push(ids[i])
                }
            }
            return checkedIDs;
        },
        async getIngredients() {
            try {
                let response = await axios.get("/api/ingredients");
                this.ingredients = response.data;
                let i = 0;
                while (i < this.ingredients.length) {
                    this.checked.push(false);
                    this.forbidden.push(false);
                    i++;
                }
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
        async makePizza() {
            try {
                await axios.post('/api/pizzas', {
                    name: this.name,
                    ingredients: this.checkedIngredientIDs(),
                });
                this.getPizzas();
                return true;
            } catch (error) {
                //console.log(error);
            }
        },
        async upVote(pizza) {
            try {
                await axios.put("/api/upvote/" + pizza._id);
                this.getPizzas();
                return true;
            } catch (error) {
                //console.log(error);
            }
        },
    }
}
</script>

<style scoped>
.image h2 {
    font-style: italic;
}

/* Masonry */
*,
*:before,
*:after {
    box-sizing: inherit;
}

.pizza {
    border: 1px solid black;
    padding: 0 2em;
    margin: 1em;
}

/* Masonry on large screens */
@media only screen and (min-width: 1024px) {
    .image-gallery {
        column-count: 4;
    }
}

h2 {
    font-size: 1.2em;
    font-weight: bold;
    background-color: #e3e3e3;
    border-radius: 1em;
    padding: 0.3em;
    width: 12em;
}

.check {
    justify-content: center;
    text-align: center;
}

.price {
    margin-top: -10px;
    margin-bottom: -10px;
    margin-left: 18em;
    font-size: 0.7em;
}

th {
    font-weight: bold;
    font-style: oblique;
    margin: 1em;
    padding: 1em;
}

/* Masonry on medium-sized screens */
@media only screen and (max-width: 1023px) and (min-width: 768px) {
    .image-gallery {
        column-count: 3;
    }
}

/* Masonry on small screens */
@media only screen and (max-width: 767px) and (min-width: 540px) {
    .image-gallery {
        column-count: 2;
    }
}
</style>
