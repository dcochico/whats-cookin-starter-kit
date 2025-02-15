import { recipesToCook, filterByTag, filterByName, determineIngredientNames, calculateCost, returnInstructions, toggleRecipesToCook } from './recipe.js';

// Global Variables
const user = document.querySelector('.user');
const userInput = document.querySelector('#search-bar');
const homeButton = document.querySelector('.home-button');
const favoriteButton = document.querySelector('.favorite-button');  
const searchButton = document.querySelector('.submit-button');
const mainPanel = document.querySelector('.main-panel');
const tagsPanel = document.querySelector('.tags-panel');
const tags = document.querySelectorAll('.tag');
let recipeInfo;
let page = {mode: 'home'};
let userID;

// Event Handlers
const getRandomIndex = array => Math.floor(Math.random() * array.length);

const loadUsers = (userData, recipes) => {
  let userIndex = getRandomIndex(userData);
  userID = userData[userIndex].id;
  userData.forEach(user => {
    if (user.id === userID) {
      user.recipesToCook.forEach(id => toggleRecipesToCook(id, recipes))
    }
  })
  user.innerText = userData[userIndex].name;
}

const loadTags = recipes => {
  recipes.forEach(recipe => recipe.tags.unshift('all'));
  let allTags = recipes.reduce((total, recipe) => [...total, ...recipe.tags], [])
  allTags = allTags.filter((tag, i) => allTags.indexOf(tag) === i);
  allTags.forEach(tag => tagsPanel.innerHTML += `<button class="tag" id="${tag}">${tag.toUpperCase()}</button>`);
}

const toggleMode = mode => {  
  page.mode = mode;
  if (page.mode === 'home') {
    userInput.placeholder = 'Search Recipes';
    searchButton.innerText = 'Search Recipes';
  } else {
    userInput.placeholder = 'Search Favorites';
    searchButton.innerText = 'Search Favorites';
  };
};

const viewRecipe = (recipe, pass, theDay) => {
  if (pass) {
    mainPanel.innerHTML += `
    <section class='recipe-container box' id='${recipe.id}'>
      <img class='box' id='${recipe.id}' src='${recipe.image}' alt='image not found'>
      <h3 class='recipe-name' id="${recipe.id}">${recipe.name}</h3>
      <img class='heart' id='unsaved-${recipe.id}' src='./images/black-heart.png' alt='black heart'>
      <img class='heart hidden' id='saved-${recipe.id}' src='./images/red-heart.png' alt='red heart'>
      <h3 class ='oftheday'>${theDay} OF THE DAY</h3>
    </section>
    `;
  } else {
  mainPanel.innerHTML += `
  <section class='recipe-container box' id='${recipe.id}'>
    <img class='box' id='${recipe.id}' src='${recipe.image}' alt='image not found'>
    <h3 class='recipe-name' id="${recipe.id}">${recipe.name}</h3>
    <img class='heart' id='unsaved-${recipe.id}' src='./images/black-heart.png' alt='black heart'>
    <img class='heart hidden' id='saved-${recipe.id}' src='./images/red-heart.png' alt='red heart'>
  </section>
  `;}
};

const viewAllRecipes = (recipes, pass) => {
  mainPanel.innerHTML = '';
  let ofTheDay = ['Appetizer', 'Main Dish', 'Side Dish']
  pass ? recipes.forEach((recipe, i)=> viewRecipe(recipe, pass, ofTheDay[i])) : recipes.forEach(recipe => viewRecipe(recipe));
};

const featureRecipe = (tag, recipes) => {
  let day = new Date().getDate();
  let filteredRecipes = filterByTag(tag, recipes);
  let recipeIndex = (day - 1) % filteredRecipes.length;
  let recipeOfTheDay = filteredRecipes[recipeIndex];
  recipeOfTheDay.tags.unshift('featured');
  return recipeOfTheDay;
}

const viewFeaturedRecipes = recipes => {
  page.mode === 'home' ? recipes : recipes = recipesToCook;
  let featuredRecipes = [featureRecipe('appetizer', recipes), featureRecipe('main dish', recipes), featureRecipe('side dish', recipes)];
  viewAllRecipes(featuredRecipes, 'passThrough');
}

const viewRecipeInfo = (recipes, ingredients, e) => {
  if (e.target.classList.contains('box')) {
    let selectedRecipe = recipes.find(recipe => recipe.id === Number(e.target.id));
    mainPanel.innerHTML = `
    <div class="recipeInfo">
      <button class='info-button'> Close </button>
      <h2 class='recipe-names'> ${selectedRecipe.name}</h2>
      <img class='recipe-img' id='${selectedRecipe.id}' src='${selectedRecipe.image}' alt='${selectedRecipe.name}'>
      <p class='ingredients'>${determineIngredientNames(recipes, ingredients, selectedRecipe.name).join(' -- ')}</p>
      <p class='instructions'>${organizeInstructions(returnInstructions(selectedRecipe))}</p>
      <p class='cost'>Total cost: $${calculateCost(selectedRecipe, ingredients)}</p>
    </div>
    `;
  };
  recipeInfo = document.querySelector('.recipeInfo');
};

const organizeInstructions = instructs => {
  instructs = instructs.reduce((string, instruction) => `${string}` + `${instruction.number}) ${instruction.instruction}`, '');
  return instructs.split('.)').join('.').split(' (').join(' ').split(')').join('.').split('..').join('.').split('.,').join(',').split('.').join('. <br>');
};

const exitPopUp = recipes => {
  recipeInfo = null;
  viewAllRecipes(recipes);
  loadHearts(recipesToCook);
};

const selectFilter = (e, type, recipes, pass) => {
  page.mode === 'home' ? recipes : recipes = recipesToCook;
  let filteredRecipes;
  type === 'tag' ? filteredRecipes = filterByTag(e.target.id, recipes) : filteredRecipes = filterByName(e, recipes);
  if (filteredRecipes.length && pass) {
    viewAllRecipes(filteredRecipes, 'passThrough');
    // loadHearts(filteredRecipes);
  } else if (filteredRecipes.length) {
    viewAllRecipes(filteredRecipes);
  } else {
    mainPanel.innerHTML = `<p id='try-again-message'>No recipes found, please try again !</p>`;
  }
}

const filterRecipeByTag = (e, recipes, pass) => selectFilter(e, 'tag', recipes, pass);

const searchRecipe = recipes => {
  mainPanel.innerHTML = '';
  let name = userInput.value.toLowerCase();
  selectFilter(name, 'name', recipes);
  homeButton.classList.remove('hidden');
  favoriteButton.classList.remove('hidden');
};

const displaySearchError = () => {
  if(!userInput.value) {
    userInput.placeholder = 'Please Fill Out This Field'
    mainPanel.innerHTML = `<p id='try-again-message'>No recipes found, please try again !</p>`
  } 
};

const toggleHearts = (e, recipes) => {
  recipes.forEach(recipe => {
    if (Number(e.target.parentNode.id) === recipe.id && !e.target.classList.contains('info-button')) {
      document.getElementById(`unsaved-${recipe.id}`).classList.toggle('hidden');
      document.getElementById(`saved-${recipe.id}`).classList.toggle('hidden');
    };
  });
};

const loadHearts = recipes => {
  let savedIDs = recipesToCook.map(recipe => recipe.id);
  recipes.forEach(recipe => {
    if (savedIDs.some(id => id === recipe.id)) {
      document.getElementById(`unsaved-${recipe.id}`).classList.add('hidden');
      document.getElementById(`saved-${recipe.id}`).classList.remove('hidden');
    } else {
      document.getElementById(`unsaved-${recipe.id}`).classList.remove('hidden');
      document.getElementById(`saved-${recipe.id}`).classList.add('hidden');
    };
  });
};

const viewHome = () => {
  toggleMode('home');
  homeButton.classList.add('hidden');
  favoriteButton.classList.remove('hidden');
};

const viewSaved = () => {
  toggleMode('favorite');
  homeButton.classList.remove('hidden');
  favoriteButton.classList.add('hidden');
};

export {
  user,
  userInput,
  homeButton,
  favoriteButton,
  searchButton,
  mainPanel,
  tagsPanel,
  tags,
  recipeInfo,
  page,
  userID,
  getRandomIndex,
  loadUsers,
  loadTags,
  toggleMode,
  viewRecipe,
  viewAllRecipes,
  viewFeaturedRecipes,
  viewRecipeInfo,
  exitPopUp,
  filterRecipeByTag,
  searchRecipe, 
  displaySearchError,
  toggleHearts,
  loadHearts,
  viewHome,
  viewSaved
};

