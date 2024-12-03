import React from 'react'
import './CustomerMenu.css'
import logo from './cafe-logo.PNG'
import { useEffect, useState } from 'react'
import categories from './menuData.json'
import {Link} from 'react-router-dom'

function EmployeeView() {

    const [selectedCategory, setSelectedCategory] = useState(undefined)

    function changeCategory(index) {
        setSelectedCategory(index)
    }


        function renderResults() {
        if (selectedCategory === undefined) {
            return (
                <>
                    <h2 id="results-header">Select a Category</h2>
                    <div id="results-content"></div>
                </>
            )
        } else {
            return (
                <>
                    <h2 id="results-header">{categories[selectedCategory].categoryName}</h2>
                    <div id="results-content">
                        {
                            categories[selectedCategory].items.map(item => (
                                <>
                                <h3>{item.itemName}</h3>
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
                <title>Menu - UW Bothell Cafe</title>
                <link rel="stylesheet" href="../Stylesheets/homestyle.css" />
            </head>
            <body>
                <header>
                    <div class="logo">
                        <img src={logo} alt="UW Bothell Cafe Logo" />
                    </div>
                    <nav>
                    <ul>
                            <li><Link to={`/`}>Menu</Link></li>
                            <li hidden><a href="#featured">Featured</a></li>
                            <li><Link to={`/transaction-history`}>Transaction History</Link></li>
                            <li hidden><a href="#favorites">Favorites</a></li>
                            <li><Link to={`/employee`} >Employees Only!</Link></li>
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
                                    </>
                                ))
                            }
                        </ul>
                    </section>
                    <section id="results" class="card">
                        {
                            renderResults()
                        }
                        
                    </section>
                    <section id="cart" class="card">
                        {
                            
                        }
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

export default EmployeeView