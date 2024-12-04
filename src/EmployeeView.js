import React from 'react'
import './EmployeeView.css'
import logo from './cafe-logo.PNG'
import { useEffect, useState } from 'react'
import categories from './menuData.json'
import {Link} from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import { db } from './firebase';  // import the db reference
import { ref, set, get, push } from 'firebase/database'  // Import get method to read data from DB


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



    const [orderData, setOrderData] = useState([]);
    useEffect(() => {
        // Pull categories from Firebase on component mount
        const orderRef = ref(db, 'orders'); // Path to categories node in Firebase
            
        get(orderRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                // Map Firebase data to an array
                const orderArray = Object.keys(data).map(key => ({
                    ...data[key],
                    id: key
                }));
                setOrderData(orderArray);
            } else {
                console.log('No orders data available');
            }
        })
        .catch((error) => {
            console.error("Error getting orders data: ", error);
        });    
    }, []);

    // Function to mark order as completed
    const completeOrder = (orderId) => {
        // Logic to mark the order as completed (e.g., update the order status in Firebase)
        console.log("Order Completed:", orderId);
    };


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
                            <li><Link to={`/menu`}>Menu</Link></li>
                            <li hidden><a href="#featured">Featured</a></li>
                            <li><Link to={`/transaction-history`}>Transaction History</Link></li>
                            <li hidden><a href="#favorites">Favorites</a></li>
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
                        {orderData.length > 0 ? (
                            orderData.map((order, index) => (
                                <div key={order.id} className="order-card">
                                    <p>The next order is at: {new Date(order.timestamp).toLocaleTimeString()}</p>
                                    {order.cartItems.map((item, itemIndex) => (
                                        <p key={itemIndex}>{item.quantity} x {item.item.itemName}</p>
                                    ))}
                                    <p>Total: {order.totalAmount}</p>
                                    <p>For: {order.userName}</p>
                                    <button onClick={() => completeOrder(order.id)}>Complete</button>
                                </div>
                            ))
                        ) : (
                            <p>No pending orders</p>
                        )}
                        </div>
                        {/* {
                            renderResults()
                        } */}
                        
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

export default EmployeeView;