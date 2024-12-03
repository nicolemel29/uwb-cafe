import React from 'react';
import './CustomerMenu.css'
import logo from './cafe-logo.PNG'
import { useState } from 'react'
import categories from './menuData.json'

function CustomerMenu() {

    const [selectedCategory, setSelectedCategory] = useState(-1)
    const [selectedSubcategory, setSelectedSubcategory] = useState(undefined) // category, subcategory index

    

    function changeCategory(index) {
        setSelectedCategory(index)
        console.log(selectedCategory)
    }

    function showSubcategories(index1, category) {
        return (
            category.subcategories.map((subcategory, index2) => (
                <li key={`${index1}.${index2}`} onClick={() => showGroups(subcategory)} class="subcategory-item">{subcategory.subcategoryName}</li>
            ))
        )   
    }

    function showGroups(subcategory) {
        setSelectedSubcategory(subcategory)
    }

    function renderResults() {
        if (selectedSubcategory == undefined) {
            return (
                <>
                    <h2 id="results-header">Select a Category</h2>
                    <div id="results-content"></div>
                </>
            )
        } else {
            return (
                <>
                    <h2 id="results-header">{selectedSubcategory.subcategoryName}</h2>
                    <div id="results-content">
                        {
                            selectedSubcategory.groups.map(group => (
                                <>
                                <h3>{group.groupName}</h3>
                                {
                                    group.items.map(item => (
                                        <p>{item.itemName}</p>
                                    ))
                                }
                                </>
                            ))
                        }
                    </div>
                </>
            )
        }
    }

    return (
        <>
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>UW Bothell Cafe</title>
                <link rel="stylesheet" href="../Stylesheets/homestyle.css" />
            </head>
            <body>
                <header>
                    <div class="logo">
                        <img src={logo} alt="UW Bothell Cafe Logo" />
                    </div>
                    <nav>
                        <ul>
                            <li><a href="#menu">Menu</a></li>
                            <li hidden><a href="#featured">Featured</a></li>
                            <li><a href="#previous">Transaction History</a></li>
                            <li hidden><a href="#favorites">Favorites</a></li>
                        </ul>
                    </nav>
                </header>
                <main>
                    <section id="categories" class="card">
                        <h2>Categories</h2>
                        <ul>
                            {
                                categories.map((category, index1) => (
                                    <>
                                        <li key={index1} class="category" onClick={() => changeCategory(index1)}>{category.categoryName}</li>
                                        <ul class="subcategory-list">
                                            {
                                                selectedCategory === index1 ? showSubcategories(index1, category) : null
                                            }
                                        </ul>
                                    </>
                                ))
                            }
                        </ul>
                        <div id="subcategories"></div>
                    </section>
                    <section id="results" class="card">
                        {
                            renderResults()
                        }
                        
                    </section>
                    <section id="cart" class="card">
                        <h2>Cart</h2>
                        <div id="cart-content"></div>
                    </section>
                </main>
                <footer>
                    <p>&copy; 2024 UW Bothell Cafe. All rights reserved.</p>
                </footer>
                <script src="../Scripts/homepage.js"></script>
            </body>
        </>
    )
}

export default CustomerMenu;