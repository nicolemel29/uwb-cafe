import React from 'react';
import './CustomerMenu.css'
import logo from './cafe-logo.PNG'

function CustomerMenu() {
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
                            <li><a href="#" onclick="showSubcategories('drinks')">Drinks</a></li>
                            <li><a href="#" onclick="showSubcategories('food')">Food</a></li>
                            <li><a href="#" onclick="showSubcategories('homeCoffee')">At Home Coffee</a></li>
                            <li><a href="#" onclick="showSubcategories('merchandise')">Merchandise</a></li>
                        </ul>
                        <div id="subcategories"></div>
                    </section>
                    <section id="results" class="card">
                        <h2 id="results-header">Select a Category</h2>
                        <div id="results-content"></div>
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