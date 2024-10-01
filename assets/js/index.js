import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: ""
}

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const inputFieldEl = document.getElementById('input-field');
const inputErrorMessageEl = document.getElementById('input--empty-error-message');
const addButtonEl = document.getElementById('add-button');
const shoppingListEl = document.getElementById('shopping-list');
const darkModeToggleEl = document.getElementById('toggle');

addButtonEl.addEventListener('click', () => {
    const inputValue = inputFieldEl.value

    if (inputValue) {
        clearInputFieldEl();
        clearShoppingListEl();
        push(shoppingListInDB, inputValue);
        inputErrorMessageEl.textContent = ""
    }
    else {
        inputErrorMessageEl.textContent = "Your item cannot be empty!"
    }
});

onValue(shoppingListInDB, (snapshot) => {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val());

        clearShoppingListEl();
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i];
            let currentItemID = currentItem[0];
            let currentItemValue = currentItem[1];

            appendItemToShoppingListEl(currentItem)
        }
    }
    else {
        shoppingListEl.innerHTML = "No items here... yet!"
    }
})

const clearShoppingListEl = () => shoppingListEl.innerHTML = ""

const clearInputFieldEl = () => inputFieldEl.value = ""

const appendItemToShoppingListEl = (item) => { 
    let itemID = item[0]
    let itemValue = item[1];
    let newEl = document.createElement("li");

    newEl.textContent = itemValue;

    newEl.addEventListener('click', () => {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
        remove(exactLocationOfItemInDB)
        inputErrorMessageEl.textContent = ""
    })

    shoppingListEl.append(newEl);
}

darkModeToggleEl.addEventListener('change', (e) => {
    e.preventDefault();
    document.body.classList.toggle('darkmode')
});
