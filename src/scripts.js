//NOTE: Data model and non-dom manipulating logic will live in this file.

import './styles.css'
// import apiCalls from './apiCalls'
// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/turing-logo.png'

//Example of one way to import functions from the domUpdates file. You will delete these examples.
import {viewAllRecipes, viewRecipeInfo, mainRecipe, tagButtons, filterRecipeByTag,searchButton,searchRecipe,userInput} from './domUpdates.js'




// Event Listeners
window.addEventListener('load', viewAllRecipes);
mainRecipe.addEventListener('click', (e) => {
  console.log(e.target)
  viewRecipeInfo(e)
 
})

tagButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    filterRecipeByTag(event)
    }) 
  })

  searchButton.addEventListener('click', searchRecipe)

