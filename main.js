const mealContainer = document.querySelector(".meals");
const inputVal = document.querySelector(".search-input");
const favContainer = document.querySelector(".fav-container ul");
// let globalFavBtn;
const searchTerm = document.getElementById('search-term');
const searchBtn = document.getElementById('search-btn');
const logoBtn = document.querySelector('.logo');


getMeal();
fetchFavMeals();

async function getMeal(){
    const getMeal = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const respData = await getMeal.json();
    const randomMeal = respData.meals[0];
    console.log(randomMeal);

    addMeal(randomMeal);
}

async function getMealById(id){
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id);
    
    const respData = await resp.json();
    const meal = respData.meals[0];

    return meal;
}

async function getMealsByName(term){
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + term);
    const respData = await resp.json();
    const meals = respData.meals;

    if (meals) {
        random = false;
        meals.forEach((meal) => {
            addMeal(meal, random);
        });
    }
}

function addMeal(randomMeal, random = true){
    const meal = document.createElement("div");
    meal.classList.add('meal');
    meal.innerHTML = `
            ${random ? `
            <span class="random">Random Recipe</span>`
            : ""}
            <div class="meal">
                <div class="meal-header">
                    <img src=${randomMeal.strMealThumb} alt="Churros Image">
                </div>
                <div class="meal-body">
                    <h4 class="meal-name">${randomMeal.strMeal}</h4>
                    <button class="fav-btn"><i class="fa fa-heart fa-lg"></i></button>
                </div>
            </div>
    `

    const favBtn = meal.querySelector(".meal-body .fav-btn");
    favBtn.addEventListener("click", () => {
        if (favBtn.classList.contains('active')) {
            removeMealLS(randomMeal.idMeal);
            favBtn.classList.remove('active');
        }else {
            addMealLS(randomMeal.idMeal);
            favBtn.classList.add('active');
        }

        fetchFavMeals();
    });

    const recipeDiv = document.createElement('div');
    recipeDiv.classList.add('recipe-div-active');
    recipeDiv.classList.add('recipe-div');

    const ingredients = [];
    for (let i = 1; i <= 25; i++) { 
        const ingredient = randomMeal[`strIngredient${i}`];

        if (ingredient && ingredient.trim() !== "") {
            ingredients.push(ingredient);
        }
    }
    const ingredientsListItems = ingredients.map(ingredient => `<li>${ingredient}</li>`).join('');

    const measures = [];
    for (let i = 1; i <= 25; i++) { 
        const measure = randomMeal[`strMeasure${i}`];

        if (measure && measure.trim() !== "") {
            measures.push(measure);
        }
    }
    const measuresListItems = measures.map(measure => `<li>: ${measure}</li>`).join('');

    meal.addEventListener("click", () => {
        recipeDiv.innerHTML = `
        <h4>Ingredients</h4>
        <div class='ingredients'>
            <ul>
                ${ingredientsListItems}
            </ul>
            <ul>
                ${measuresListItems}
            </ul>
        </div>
        <h4>Instructions</h4>
        <div>
            <p>${randomMeal.strInstructions}</p>
        </div>
        `
        recipeDiv.classList.toggle('recipe-div-active');
    });

    meal.appendChild(recipeDiv);
    // globalFavBtn = favBtn;

    mealContainer.appendChild(meal);
}

function addMealLS(mealId) {
    const mealIds = getMealLS();

    localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
}

function removeMealLS (mealId) {
    const mealIds = getMealLS();

    localStorage.setItem("mealIds", 
    JSON.stringify(mealIds.filter((id) => id !== mealId)));
}

function getMealLS() {
    const mealIds = JSON.parse(localStorage.getItem("mealIds"));

    return mealIds == null ? [] : mealIds;
}

async function fetchFavMeals(){

    favContainer.innerHTML = "";

    const mealIds = getMealLS();

    for (let i = 0; i<mealIds.length; i++) {
        const mealId = mealIds[i];

        const meal = await getMealById(mealId);
        
        addMealFav(meal);
    }
}

function addMealFav(meal) {
    const favMeal = document.createElement("div");
    favMeal.innerHTML = `
    <li><div class="close-btn">x</div><img src=${meal.strMealThumb} alt="Buttered Chicken Image"><span>${meal.strMeal}</span></li>
    `

    favContainer.appendChild(favMeal);

    const closeBtn = favMeal.querySelector(".close-btn");
    closeBtn.addEventListener("click", () => {
        removeMealLS(meal.idMeal);
        // globalFavBtn.classList.remove('active');
        fetchFavMeals();
    });
}

searchBtn.addEventListener("click", () => {
    const searchTermVal = searchTerm.value;
    if (searchTermVal === "") {
        null;
    }else{
        getMealsByName(searchTermVal);
        while (mealContainer.firstChild) {
            mealContainer.removeChild(mealContainer.firstChild);
        }
    }
});

logoBtn.addEventListener("click", () => window.location.reload());