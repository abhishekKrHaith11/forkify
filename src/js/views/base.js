export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchResult: document.querySelector('.results'),
    searchResultList: document.querySelector('.results__list'),
    searchResultPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shoppingList: document.querySelector('.shopping__list'),
    shoppingListClear: document.querySelector('.clear__list'),
    shoppingListForm: document.querySelector('.add__item'),
    likeList: document.querySelector('.likes__list'),
    likeMenu: document.querySelector('.likes__field'),
};

export const elementStrings = {
    loader: 'loader',
    pageButton: 'btn-inline',
    recipeLink: 'results__link',
    selectedRecipe: 'results__link--active',
    servingsInc: 'btn-increase',
    servingsDec: 'btn-decrease',
    servingsCount: 'recipe__info-data--people',
    recipeCount: 'recipe__count',
    recipeButtion: 'recipe__btn--add',
    shoppingItem: 'shopping__item',
    shoppingDelete: 'shopping__delete',
    shoppingItemCount: 'shopping__count--value',
    recipeLove: 'recipe__love',
    likesLink: 'likes__link',
    itemQuantity: 'item__quanlity',
    itemUnit: 'item__unit',
    itemName: 'item__name',
};

export const renderLoader = parent => {
    const loader = `
        <div class="${elementStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    if (loader) loader.parentElement.removeChild(loader);
};