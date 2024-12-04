import React from 'react'
import './EmployeeView.css'
import logo from './cafe-logo.PNG'
import { useEffect, useState } from 'react'
import categories from './menuData.json'
import {Link} from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function EmployeeView(props) {
    const navigate = useNavigate()
    const isOpen = props.isOpen
    const toggleOpen = props.toggleOpen

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

    function addCategory() {

    }

    function editCategory() {
        // includes name
    }

    function deleteCategory() {

    }

    function reorganizeCategory() {

    }

    function addItem() {

    }

    function editItem() {

    }

    function deleteItem() {

    }

    function reorganizeItem() {

    }



    function signout() {
        navigate("/employee-login")
    }

    function dismissOrder() {
        
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
                            <li class="signout" onClick={signout}>Sign Out</li>
                        </ul>
                    </nav>
                </header>
                <main>
                    <section id="categories" class="card">
                    { /* Should be on same column but in a seperate card*/ }
                        <div id="store-open-employee">
                            <label>
                                <input
                                    id="store-open-input"
                                    type="checkbox"
                                    checked={isOpen}
                                    onChange={toggleOpen}
                                />
                                Is the Store Open?
                            </label>
                        </div>
                        <h2>Categories</h2>
                        <ul>
                            {
                                categories.map((category, index1) => (
                                    <>
                                        <li key={index1} class="category" onClick={() => changeCategory(index1)}>{category.categoryName}</li>
                                    </>
                                ))
                            }
                            <button onClick={addCategory}>Add Category</button>
                        </ul>
                    </section>
                    <section id="results" class="card">
                        { /* Should be on same column but in a seperate card*/ }
                        <div id="soonest-order">
                            <p>The next order is at: 5:45pm</p>
                            <p>Item Name 1</p>
                            <p>Item Name 2</p>
                            <p>Item Name 3</p>
                            <p>For: User's Name</p>
                            <button onClick={dismissOrder}>
                                Dismiss
                            </button>
                        </div>
                        {
                            renderResults()
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