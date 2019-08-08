import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    }

    getNumItem() {
        return this.items.length;
    }

    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        };
        this.items.push(item);

        // Persist the data in local storage
        this.persistData();

        return item;
    }

    deleteItem(id) {
        const index = this.items.findIndex(el => el.id === id);
        this.items.splice(index, 1);

        // Persist the data in local storage
        this.persistData();
    }

    updateCount(id, newCount) {
        this.items.find(el => el.id === id).count = newCount;

        // Persist the data in local storage
        this.persistData();
    }

    clearItems() {
        this.items = [];

        // Persist the data in local storage
        this.persistData();
    }

    persistData() {
        localStorage.setItem('list_items', JSON.stringify(this.items));
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('list_items'));

        // Restoring list from local storage
        if (storage) this.items = storage;
    }
}
