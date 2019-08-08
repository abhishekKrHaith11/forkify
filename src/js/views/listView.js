import { elements, elementStrings } from './base';

export const toggleClearList = numItem => {
    elements.shoppingListClear.style.visibility = numItem > 0 ? 'visible' : 'hidden';
};;

export const renderItem = item => {
    const markup = `
        <li class="${elementStrings.shoppingItem}" data-itemid=${item.id}>
            <div class="shopping__count">
                <input type="number" value="${item.count}" step="${item.count}" class="${elementStrings.shoppingItemCount}" min="0">
                <p>${item.unit}</p>
            </div>
            <p class="shopping__description">${item.ingredient}</p>
            <button class="${elementStrings.shoppingDelete} btn-tiny">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-cross"></use>
                </svg>
            </button>
        </li>
    `;
    elements.shoppingList.insertAdjacentHTML('beforeend', markup);
}

export const deleteItem = id => {
    const item = document.querySelector(`[data-itemid="${id}"]`);
    if (item) item.parentElement.removeChild(item);
};

export const clearItems = () => {
    elements.shoppingList.textContent = '';
};

export const getInputs = () => {
    const unitInput = elements.shoppingListForm.querySelector(`.${elementStrings.itemUnit}`);

    return {
        itemQuantity: elements.shoppingListForm.querySelector(`.${elementStrings.itemQuantity}`).value,
        itemUnit: unitInput.options[unitInput.selectedIndex].value,
        itemName: elements.shoppingListForm.querySelector(`.${elementStrings.itemName}`).value
    };
};

export const clearInputs = () => {
    elements.shoppingListForm.querySelector(`.${elementStrings.itemQuantity}`).value = '';
    elements.shoppingListForm.querySelector(`.${elementStrings.itemUnit}`).selectedIndex = 0;
    elements.shoppingListForm.querySelector(`.${elementStrings.itemName}`).value = '';
};
