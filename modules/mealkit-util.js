const mealkits = [
    {
     title: "Chicken & Basil Meatballs",
     includes: "Tomato Orzo & Side Salad & Shrimp",
     description: "Creamy tomato orzo, crisp side salad, and smoky shrimp",
     category: "European Cuisine",
     price: 19.99,
     cookingTime: 45,
     servings: 2,
     imageUrl: "meal-kit-1.jpg",
     featuredMealKit: true
    },
    {
     title: "Tinned-Salmon Niçoise Sandwich",
     includes: "Eggs & Anchovy & Salmon",
     description: "Large eggs, chopped anchovy fillet, and smoked salmon",
     category: "European Cuisine",
     price: 19.99,
     cookingTime: 45,
     servings: 4,
     imageUrl: "meal-kit-7.webp",
     featuredMealKit: false
     },
    {
     title: "Beef Rib Vegetable Pot",
     includes: "Onion & Tofu & Red Pepper",
     description: "Veal ribs, white onion, fresh basil, and red pepper",
     category: "Asian Cuisine",
     price: 19.99,
     cookingTime: 40,
     servings: 3,
     imageUrl: "meal-kit-3.jpg",
     featuredMealKit: true
     },
    {
     title: "Broccoli Sesame Chicken",
     includes: "Sesame Seeds & White Rice & Garlic",
     description: "Skinless chicken breast, broccoli florets, and minced fresh garlic",
     category: "Asian Cuisine",
     price: 19.99,
     cookingTime: 30,
     servings: 2,
     imageUrl: "meal-kit-4.webp",
     featuredMealKit: false 
     },
    {
     title: "Cheater’s Paella",
     includes: "Shrimp & Rice & chorizo",
     description: "Tail-on medium shrimp, smoked spanish chorizo, and cooled cooked short-grain rice",
     category: "European Cuisine",
     price: 19.99,
     cookingTime: 50,
     servings: 6,
     imageUrl: "meal-kit-5.webp",
     featuredMealKit: true
     },
    {
     title: "Sheet-Pan Spinach Lasagna",
     includes: "Sausage & Onion & Spinach & Pepper",
     description: "Hot Italian sausage, medium chopped onion, frozen spinach, and freshly ground pepper",
     category: "European Cuisine",
     price: 19.99,
     cookingTime: 60,
     servings: 6,
     imageUrl: "meal-kit-6.webp",
     featuredMealKit: false
     }
]

module.exports.getAllMealKits = () => {

    return mealkits;
}

module.exports.getFeaturedMealKits = (mealkits) => {

    const featured = [];
    mealkits.forEach((mealkit) => {

        if (mealkit.featuredMealKit === true) featured.push(mealkit);
    })
    return featured;
}
module.exports.getMealKitsByCategory = (mealkits) => {

    const categories = [];
    const mealListByCategories = [];

    for (let i = 0; i < mealkits.length; i++) {

        if (categories.includes(mealkits[i].category) === false) {

            categories.push(mealkits[i].category);
        }
    }
    categories.forEach((category) => {
        mealListByCategories.push({categoryName: category, mealkits: []});
    })
    for (let i = 0; i < mealkits.length; i++) {

        for (let j = 0; j < categories.length; j++) {

            if (mealkits[i].category === categories[j]) {

                mealListByCategories[j].mealkits.push(mealkits[i]);
                break;
            }
        }
    }
    return mealListByCategories;
}