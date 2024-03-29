import {element} from "./base"
export const getInput = () => element.searchInput.value;
export const clearInput = () => {
    element.searchInput.value = '';
};
export const clearResult = () => {
    element.searchResultList.innerHTML = '';
    element.searchResPages.innerHTML = '';
}


/*
// 'Pasta with tomato and spinach'
acc: 0 / acc + cur.length = 5 / newTitle = ['Pasta']
acc: 5 / acc + cur.length = 9 / newTitle = ['Pasta', 'with']
acc: 9 / acc + cur.length = 15 / newTitle = ['Pasta', 'with', 'tomato']
acc: 15 / acc + cur.length = 18 / newTitle = ['Pasta', 'with', 'tomato']
acc: 18 / acc + cur.length = 24 / newTitle = ['Pasta', 'with', 'tomato']
*/
// export const limitRecipeTitle = (title, limit = 17) => {   ///************* limit the title to specific characters */
//     const newTitle = [];
//     if (title.length > limit) {
//         title.split(' ').reduce((acc, cur) => {
//             if (acc + cur.length <= limit) {
//                 newTitle.push(cur);
//             }
//             return acc + cur.length;
//         }, 0);

//         // return the result
//         return `${newTitle.join(' ')} ...`;
//     }
//     return title;
// }

const renderRecipe = recipe => {
    if(recipe.title.length > 20){
        recipe.title = `${recipe.title.substr(1, 20)} ...`;
    }
    const markup = `
            <li>
                <a class="results__link" href="#${recipe.recipe_id}">
                    <figure class="results__fig">
                        <img src="${recipe.image_url}" alt="${recipe.title}">
                    </figure>
                    <div class="results__data">
                        <h4 class="results__name">${recipe.title}</h4>
                        <p class="results__author">${recipe.publisher}</p>
                    </div>
                </a>
            </li>
    `;
    console.log(recipe.title.length);
    
    element.searchResultList.insertAdjacentHTML('beforeend', markup);
}

const createButton = (page, type) => `
        <button class="btn-inline results__btn--${type}" data-goto=${type == 'prev' ? page - 1 : page + 1}>
            <span>Page ${type == 'prev' ? page - 1 : page + 1}</span>    
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-${type == 'prev' ? 'left' : 'right'}"></use>
            </svg>
            
        </button>
`;

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults/resPerPage);
    let button;
    if(page === 1 && pages > 1){
        //button to go to next page
        button = createButton(page, 'next');
    }else if(page < pages){
        button = `${createButton(page, 'prev')}
                ${createButton(page, 'next')}
                `;
    }else if(page === pages && pages > 1){
        //only button to go to prev
        button = createButton(page, 'prev');

    }
    element.searchResPages.insertAdjacentHTML('afterbegin', button);

}
export const renderResults = (recipes, page=1, resPerPage=10) => {
     //console.log(page);

    //render results of current page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    console.log(recipes);
    
    //recipes.forEach(renderRecipe) ;
   recipes.slice(start, end).forEach(renderRecipe);

    //render Pagination buttons
    renderButtons(page, recipes.length, resPerPage);
}