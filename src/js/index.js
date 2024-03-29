

/*
//if cors proxy is required then add cors proxy to the requested url

async function getResults(query){
    const key = '6cdd8f4ea807d23fd7a090ea8b6dfe82';
    const proxy = 'https://cors-anywhere.herokuapp.com/';
   const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${query}`);
   const result = res.data.recipes;
   console.log(result);
}
getResults('pizza');
*/

import Search from "../models/Search";
import * as searchView from "../views/searchView";
import {element, renderLoader, clearLoader} from "../views/base";
import Recipe from '../models/Recipe';
import { stat } from "fs";

/** Global state of the object
 * -search object
 * current recipe object
 * shopping list objects
 * liked recipes
 */
const state = {};


//Search Controller 
const controlSearch = async () => {
    //1. get the query form the view
    const query = searchView.getInput();

    if(query){
        //2. create a new search object and add it to the state
        state.search = new Search(query);

        //3. Prepare UI results
        searchView.clearInput();
        searchView.clearResult();
        renderLoader(element.results);

        try {
            //4. Search for the recipes
            await state.search.getResults();

            //5. Render results  on UI
            // console.log(state.search.result);
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (error) {
            alert(`${error}: Something wrong with the search`);
            clearLoader();

        }
        
        

    }
}

element.searchForm.addEventListener('submit', e => {
    e.preventDefault(); // preventing the default behaviour of submit i.e., reloding the page
    controlSearch();
})

element.searchResPages.addEventListener('click', e => {
    const button = e.target.closest('.btn-inline');
    
    if(button){
        const goToPage = parseInt(button.dataset.goto, 10);  // 10 is the base i.e., decimal
        searchView.clearResult();
        searchView.renderResults(state.search.result, goToPage);
        console.log(goToPage);
    }
    
})


//Recipe controller
// const r = new Recipe(47746);
// r.getRecipe();
// console.log(r);

const controlRecipe= async () => {
    //get Id fro Url
    const id = window.location.hash.replace('#', '');
    console.log(id);
    if (id) {
        //Prepare the UI for changes

        //create a new recipe object

        state.recipe = new Recipe(id);

        try {
              //get Recipe Data
            await state.recipe.getRecipe();
            //calculate Servings and TIme
            state.recipe.calcTime();
            state.recipe.calcServings();
            //Render Recipe
            console.log(state.recipe);
        } catch (error) {
            alert('Error Processing Recipe')
        }
      
    }
}

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => addEventListener(event, controlRecipe)); // same eventListener for diff events

