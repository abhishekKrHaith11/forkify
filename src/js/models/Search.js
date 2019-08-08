import axios from 'axios';
import { proxy, key } from '../config';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {    
        try {
            const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
    
            if (res.hasOwnProperty('error')) {
                // Daily API uses limit reached
                if (res.error === 'limit') {
                    alert("Sorry :(\nAPI daily uses limit has reached!\nPlease visit our GitHub page for more details.");
                }
            } else {
                this.result = res.data.recipes;
            }
        } catch (error) {
            alert('Something went wrong :(');
        }
    }
}
