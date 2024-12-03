// scripts.js
document.addEventListener('DOMContentLoaded', () => {
    console.log('JavaScript loaded!');
});

function showSubcategories(category) {
    const subcategories = {
        drinks: ['Hot Coffee', 'Cold Coffee', 'Tea', 'Smoothies'],
        food: ['Sandwiches', 'Salads', 'Pastries'],
        homeCoffee: ['Coffee Beans', 'Ground Coffee', 'Pods'],
        merchandise: ['Mugs', 'Tumblers', 'Apparel']
    };

    const subcategoryContainer = document.getElementById('subcategories');
    subcategoryContainer.innerHTML = '';

    subcategories[category].forEach(subcategory => {
        const subcategoryElement = document.createElement('div');
        subcategoryElement.innerHTML = `<a href="#" onclick="showResults('${subcategory}')">${subcategory}</a>`;
        subcategoryContainer.appendChild(subcategoryElement);
    });
}

function showResults(subcategory) {
    const resultsHeader = document.getElementById('results-header');
    resultsHeader.textContent = subcategory;

    const resultsContent = document.getElementById('results-content');
    resultsContent.innerHTML = '';

    const items = {
        'Hot Coffee': ['Americano', 'Espresso', 'Latte'],
        'Cold Coffee': ['Iced Americano', 'Cold Brew', 'Frappuccino'],
        'Tea': ['Green Tea', 'Black Tea', 'Herbal Tea'],
        'Smoothies': ['Berry Smoothie', 'Mango Smoothie', 'Green Smoothie'],
        'Sandwiches': ['Turkey Sandwich', 'Veggie Sandwich', 'Ham Sandwich'],
        'Salads': ['Caesar Salad', 'Greek Salad', 'Garden Salad'],
        'Pastries': ['Croissant', 'Muffin', 'Scone'],
        'Coffee Beans': ['Arabica', 'Robusta', 'Blend'],
        'Ground Coffee': ['Espresso Grind', 'French Press Grind', 'Drip Grind'],
        'Pods': ['Espresso Pods', 'Lungo Pods', 'Decaf Pods'],
        'Mugs': ['Ceramic Mug', 'Travel Mug', 'Glass Mug'],
        'Tumblers': ['Stainless Steel Tumbler', 'Plastic Tumbler', 'Insulated Tumbler'],
        'Apparel': ['T-Shirt', 'Hoodie', 'Cap']
    };

    items[subcategory].forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.textContent = item;
        resultsContent.appendChild(itemElement);
    });
}
