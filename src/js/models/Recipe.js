import axios from 'axios';
import { proxy, key } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {    
        try {
            const res = await axios(`${proxy}https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);

            if (res.data.hasOwnProperty('error')) {
                // Daily API uses limit reached
                if (res.data.error === 'limit') {
                    alert("Sorry :(\nAPI daily uses limit has reached!\nPlease visit our GitHub page for more details.");
                }
            } else {
                this.title = res.data.recipe.title;
                this.author = res.data.recipe.publisher;
                this.img = res.data.recipe.image_url;
                this.url = res.data.recipe.source_url;
                this.ingredients = res.data.recipe.ingredients;
            }
        } catch (error) {
            alert('Something went wrong :(');
        }
    }

    calcCookingTime() {
        // Asuming it will take 15 mins for each 3 ingredients
        const ingredientsCount = this.ingredients ? this.ingredients.length : 0;
        const periods = Math.ceil(ingredientsCount / 3);

        this.etaCook = periods * 15;
    }

    calcServeTo() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitShort, 'kg', 'g'];

        const newIngredients = this.ingredients.map(el => {
            // 1. Uniform units
            let ingredient = el.toLowerCase();
            unitLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitShort[i]);
            });

            // 2. Remmove perentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // 3. Parse ingredients into count, unit and ingredient
            const ingredArray = ingredient.split(' ');
            const unitIndex = ingredArray.findIndex(elem => units.includes(elem));

            let ingredObj;
            if (unitIndex > -1) {
                // There is an unit
                const arrayCount = ingredArray.slice(0, unitIndex);

                let count;
                if (arrayCount.length === 1) {
                    count = eval(ingredArray[0].replace('-', '+'));
                } else {
                    count = eval(arrayCount.join('+'));
                }

                ingredObj = {
                    count,
                    unit: ingredArray[unitIndex],
                    ingredient: ingredArray.slice(unitIndex + 1).join(' ')
                };

            } else if (parseInt(ingredArray[0], 10)) {
                // There is NO unit, but first element is a number
                ingredObj = {
                    count: parseInt(ingredArray[0], 10),
                    unit: '',
                    ingredient: ingredArray.slice(1).join(' ')
                };
            } else if (unitIndex === -1) {
                // There is NO unit and NO number in first position
                ingredObj = {
                    count: 1,
                    unit: '',
                    ingredient
                };
            }

            return ingredObj;
        });
        this.ingredients = newIngredients;
    }

    updateServings (type) {
        // Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        // Ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });

        this.servings = newServings;
    }
}