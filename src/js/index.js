import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader, elementStrings } from './views/base';

/** Global state of the app
 * -- Search object
 * -- Current recipe object
 * -- Shopping list object
 * -- Liked recipes
 */

const state = {};

/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
   // 1. Get query from view
   const query = searchView.getInput();

   if (query) {
      // 2. New search object and add to state
      state.search = new Search(query);

      // 3. Prepare UI for results
      searchView.clearInput();
      searchView.clearResults();
      renderLoader(elements.searchResult);

      try {
         // 4. Search for results
         await state.search.getResults();
   
         // 5. Render results on UI
         clearLoader();
         searchView.renderResults(state.search.result);
      } catch (error) {
         alert('Something went wrong with the search...');
         clearLoader();
      }
   }
};

// Handle search form submit
elements.searchForm.addEventListener('submit', e => {
   e.preventDefault();

   controlSearch();
});

// Handle recipe click
elements.searchResultPages.addEventListener('click', e => {
   const btn = e.target.closest(`.${elementStrings.pageButton}`);
   if (btn) {
      const goToPage = parseInt(btn.dataset.goto, 10);

      searchView.clearResults();
      searchView.renderResults(state.search.result, goToPage);
   }
});


/** 
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {
   // Get the recipe id from url
   const id = parseInt(window.location.hash.replace('#', ''), 10);
   
   if (id) {
      // Prepare the UI for changes
      recipeView.clearRecipe();
      renderLoader(elements.recipe);

      // Highlight selected search item
      if (state.search) searchView.highlightSelected(id);

      // Creat new recipe object
      state.recipe = new Recipe(id);

      try {
         // Get recipe data and parse the ingredients
         await state.recipe.getRecipe();
         state.recipe.parseIngredients();
   
         // Calculate servings and cooking time
         state.recipe.calcServeTo();
         state.recipe.calcCookingTime();
   
         // Render recipe
         clearLoader();
         recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));

      } catch (error) {
         alert('Error processing recipe!');
      }
   }
};


['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


/** 
 * LIST CONTROLLER
 */
const controlList = () => {
   // Create a new list if there is none yet
   if (!state.list) state.list = new List;

   // Add each ingredients to the list and UI
   state.recipe.ingredients.forEach(ingred => {
      const item = state.list.addItem(ingred.count, ingred.unit, ingred.ingredient);
      listView.renderItem(item);
   });

   // Toggle shopping list clear button
   listView.toggleClearList(state.list.getNumItem());
};


// Handle delete item and update list item events
elements.shoppingList.addEventListener('click', e => {
   const id = e.target.closest(`.${elementStrings.shoppingItem}`).dataset.itemid;

   // Handle the delete button
   if (e.target.matches(`.${elementStrings.shoppingDelete}, .${elementStrings.shoppingDelete} *`)) {
      // Delete from state
      state.list.deleteItem(id);

      // Delete from UI
      listView.deleteItem(id);

   // Handle the count update
   } else if (e.target.matches(`.${elementStrings.shoppingItemCount}`)) {
      const val = parseFloat(e.target.value, 10);
      state.list.updateCount(id, val);
   }

   // Toggle shopping list clear button
   listView.toggleClearList(state.list.getNumItem());
});


/** 
 * LIKE CONTROLLER
 */
const controlLike = () => {
   if (!state.likes) state.likes = new Likes;
   const recipeID = state.recipe.id;

   // User has NOT yet liked current recipe
   if (!state.likes.isLiked(recipeID)) {
      // Add like to the state
      const newLike = state.likes.addLike(
         recipeID,
         state.recipe.title,
         state.recipe.author,
         state.recipe.img
      );

      // Toggle like button
      likesView.toggleLikeBtn(true);

      // Add like to UI list
      likesView.renderLike(newLike);

   // User HAS liked current recipe
   } else {
      // Remove like to the state
      state.likes.deleteLike(recipeID);

      // Toggle like button
      likesView.toggleLikeBtn(false);

      // Remove like to UI list
      likesView.deleteLike(recipeID);
   }
   likesView.toggleLikesMenu(state.likes.getNumLikes());
};


// Restore liked recipe and shopping list on page load
window.addEventListener('load', e => {
   state.likes = new Likes;

   // Restore likes
   state.likes.readStorage();
   
   // Toggle like menu button
   likesView.toggleLikesMenu(state.likes.getNumLikes());

   // Render the existing likes
   state.likes.likes.forEach(like => {
      likesView.renderLike(like);
   });

   state.list = new List;

   // Restore shopping list
   state.list.readStorage();

   // Toggle shopping list clear button
   listView.toggleClearList(state.list.getNumItem());

   // Render the shopping list
   state.list.items.forEach(item => {
      listView.renderItem(item);
   });
});


// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
   if (e.target.matches(`.${elementStrings.servingsDec}, .${elementStrings.servingsDec} *`)) {
      // Decrease button clicked
      if (state.recipe.servings > 1) {
         state.recipe.updateServings('dec');
         recipeView.updateServingsIngredients(state.recipe);
      }
   } else if (e.target.matches(`.${elementStrings.servingsInc}, .${elementStrings.servingsInc} *`)) {
      // Increase button clicked
      state.recipe.updateServings('inc');
      recipeView.updateServingsIngredients(state.recipe);
   } else if (e.target.matches(`.${elementStrings.recipeButtion}, .${elementStrings.recipeButtion} *`)) {
      // Add ingredients to shopping list
      controlList();
   } else if (e.target.matches(`.${elementStrings.recipeLove}, .${elementStrings.recipeLove} *`)) {
      // Add recipe to like list
      controlLike();
   }
});


/** 
 * SHOPPING LIST CONTROLLER
 */
const controlShoppingList = () => {
   // Create a new list if there is none yet
   if (!state.list) state.list = new List;

   const {itemQuantity, itemUnit, itemName} = listView.getInputs();
   
   if (itemQuantity && itemName) {
      // Add item to list
      const item = state.list.addItem(itemQuantity, itemUnit, itemName);

      // Clear UI
      listView.clearInputs();

      // Render list item
      listView.renderItem(item);

      // Toggle shopping list clear button
      listView.toggleClearList(state.list.getNumItem());
   }
};


// Handle shopping list item form
elements.shoppingListForm.addEventListener('submit', e => {
   e.preventDefault();

   controlShoppingList();
});


// Handle shopping list clear
elements.shoppingListClear.addEventListener('click', e => {
   // Clear list items
   state.list.clearItems();

   // Clear from UI
   listView.clearItems();

   // Toggle shopping list clear button
   listView.toggleClearList(state.list.getNumItem());
});
