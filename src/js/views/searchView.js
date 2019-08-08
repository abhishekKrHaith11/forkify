import { elements, elementStrings } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResultList.innerHTML = '';
    elements.searchResultPages.innerHTML = '';
};

export const highlightSelected = id => {
    const linksArray = Array.from(document.querySelectorAll(`.${elementStrings.recipeLink}`));
    linksArray.forEach(el => {
        el.classList.remove(elementStrings.selectedRecipe);
    });
    document.querySelector(`.${elementStrings.recipeLink}[href*="#${id}"]`).classList.add(elementStrings.selectedRecipe);
};

export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];

    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);

        // Return the new title
        return `${newTitle.join(' ')} ...`;
    }
    return title;
};

const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="${elementStrings.recipeLink}" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    elements.searchResultList.insertAdjacentHTML('beforeend', markup);
};

// type: 'next' or 'prev'
const renderButton = (page, type) => `
    <button class="${elementStrings.pageButton} results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;

const renderPagination = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    let button;

    if (page === 1 && pages > 1) {
        // Show only next page button
        button = renderButton(page, 'next');
    } else if (page < pages) {
        // Show both buttons
        button = `
            ${renderButton(page, 'prev')}
            ${renderButton(page, 'next')}
        `;
    } else if (page === pages && pages > 1) {
        // Show only prev page button
        button = renderButton(page, 'prev');
    }

    elements.searchResultPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, perPage = 10) => {
    // Render results of current page
    const start = (page - 1) * perPage;
    const end = page * perPage;

    recipes.slice(start, end).forEach(renderRecipe);

    // Render pagination buttons
    renderPagination(page,recipes.length, perPage);
};