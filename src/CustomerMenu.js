import React from 'react';
import './CustomerMenu.css'
import logo from './cafe-logo.PNG'
import { useEffect, useState, useRef } from 'react'
//import categories from './menuData.json'
import {useNavigate, Link} from 'react-router-dom'

import { ref, onValue, off } from 'firebase/database';
import { db, auth } from './firebase'; // Import your Firebase config
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CustomerMenu(props) {
    const [categories, setCategories] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate()

    const seenOrdersRef = useRef(new Set(JSON.parse(localStorage.getItem('seenOrders') || '[]'))); // Use `useRef` to track seen orders without causing re-renders
    // localStorage.clear();

    useEffect(() => {
        if (localStorage.getItem("customerLogin") !== "true") {
            localStorage.setItem("customerLogin", false)
            navigate("/customer-login")
        }
    }, [])

    // real time listener for isOpen
    useEffect(() => {
        const orderRef = ref(db, 'isOpen'); // Reference to the 'isOpen' node in Firebase
    
        // Set up the real-time listener
        const unsubscribe = onValue(orderRef, (snapshot) => {
            if (snapshot.exists()) {
                setIsOpen(snapshot.val()); // Update the state with the fetched data
            } else {
                console.log('No isOpen data available');
            }
        });
    
        // Cleanup the listener on component unmount
        return () => unsubscribe();
    
    }, []);

    // real time listener for Categories
    useEffect(() => {
        const orderRef = ref(db, 'categories'); // Reference to the 'isOpen' node in Firebase
    
        // Set up the real-time listener
        const unsubscribe = onValue(orderRef, (snapshot) => {
            if (snapshot.exists()) {
                setCategories(snapshot.val())
            } else {
                console.log('No category data available');
            }
        });
    
        // Cleanup the listener on component unmount
        return () => unsubscribe();
    
    }, []);

    

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const userId = user.uid;
        const ordersCompletedRef = ref(db, 'orders-completed');

        // Listen for changes in the orders-completed node
        const listener = onValue(ordersCompletedRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();

                Object.entries(data).forEach(([orderId, order]) => {
                    if (order.userId === userId && !seenOrdersRef.current.has(orderId)) {
                        alert(`Order ${orderId} has been completed!`);
                        seenOrdersRef.current.add(orderId); // Add order to the seen set
                        // Persist seenOrders in localStorage
                        localStorage.setItem(
                            'seenOrders',
                            JSON.stringify([...seenOrdersRef.current])
                        );
                    }
                });
            }
        });

        // Cleanup listener when component unmounts
        return () => off(ordersCompletedRef, 'value', listener); // Remove listener
    }, []); // Empty dependency array ensures it runs only once

    const [selectedCategory, setSelectedCategory] = useState(undefined)

    const [cart, setCart] = useState([])
    const [cartLoaded, setCartLoaded] = useState(false)
    const [cartTotal, setCartTotal] = useState(0)

    function changeCategory(index) {
        setSelectedCategory(index)
    }


    function addToCart(item) {

        for (let i = 0; i < cart.length; i++) {
            const cartItem = cart[i]
            if (item.itemName === cartItem.item.itemName) {
                cartItem.quantity += 1
                setCart([...cart])
                return
            }
        }

        const cartItem = {
            item: item,
            quantity: 1
        }
        setCart([...cart, cartItem])
    }

    function removeFromCart(index) {
        const iterations = cart.length
        let cartCopy = []
        for (let i = 0; i < iterations; i++) {
            if (i != index) {
                cartCopy.push(cart[i])
            }
        }
        setCart(cartCopy)
    }

    function subtractQuantity(cartItem, index) {
        cartItem.quantity -= 1
        if (cartItem.quantity <= 0) removeFromCart(index)
        else setCart([...cart])
    }

    function addQuantity(cartItem) {
        cartItem.quantity += 1
        setCart([...cart])
    }

    function saveCart() {
        localStorage.setItem("cart", JSON.stringify(cart))
    }

    function renderResults() {
        if (selectedCategory === undefined) {
            return (
                <>
                    <h2 id="results-header" class="menu-heading">Select a Category</h2>
                    <div id="results-content"></div>
                </>
            )
        } else {
            return (
                <>
                    <h2 id="results-header" class="menu-heading">{categories[selectedCategory].categoryName}</h2>
                    <div id="results-content">
                    {categories[selectedCategory].items.map((item, index) => (
                        <div 
                            key={index} 
                            class="menu-item clickable" 
                            onClick={() => {
                                addToCart(item);
                                saveCart();
                            }}
                        >
                        <div class="item-header">
                            <h3 class="item-name">{item.itemName}</h3>
                            <span class="item-price">${item.price}</span>
                        </div>
                        <div class="item-details">
                            <p>{item.desc}</p>
                            <p><strong>Calories:</strong> {item.calories}</p>
                        </div>
                        </div>
                    ))}
                </div>

                </>
            )
        }
    }

    // cart retrieval
    useEffect(() => {
        if (localStorage.getItem("cart")) {
            setCart(JSON.parse(localStorage.getItem("cart")));
        }
        setCartLoaded(true)
    }, []);

    // cart saving
    useEffect(() => {
        if (cartLoaded) {
            localStorage.setItem("cart", JSON.stringify(cart))
        }
    }, [cart]);

    useEffect(() => {
        let total = 0
        cart.forEach(cartItem => {
            total += parseFloat(cartItem.item.price)*parseFloat(cartItem.quantity)
        });
        setCartTotal(total)
    }, [cart])

    function renderCartItems() {
        return (
            <>
                {cart.map((cartItem, index) => (
                    <div class="cart-item">
                        <span class="cart-item-title" key={`cart${index}`}>{cartItem.item.itemName}</span>
                        <div class="cart-item-details">
                            <div class="cart-item-info">
                                <span class="cart-item-price">{`$${cartItem.item.price} each`}</span>
                                <span class="cart-item-quantity">{`Quantity: ${cartItem.quantity}`}</span>
                            </div>
                            <div class="cart-item-options">
                                <button class="cart-item-button" onClick={() => {
                                    removeFromCart(index)
                                    saveCart()
                                }}>Delete</button>
                                <div class="cart-quantity-change">
                                    <button class="cart-item-button" onClick={() => {
                                        subtractQuantity(cartItem, index)
                                        saveCart();
                                    }}>-</button>

                                    <button class="cart-item-button" onClick={() => {
                                        addQuantity(cartItem)
                                        saveCart();
                                    }}>+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </>
        )
    }

    function renderCart() {
        if (cart.length === 0) {
            return (
                <div>
                    <h2 class="menu-heading">Cart</h2>
                    <div id="cart-content">
                        No Items Yet
                    </div>
                </div>
            )
        } else {
            return (<>
                    <div id="cart-top-content">
                        <h2 class="menu-heading">Cart</h2>
                        <div id="cart-content">
                            {
                                renderCartItems()
                            }
                        </div>
                    </div>
                    <div class="cart-bottom">
                        <p>{`Total: $${(cartTotal).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}</p>
                        <Link to={"/pay"} >
                            <button class="menu-button">
                                Go To Payment Page
                            </button>
                        </Link>
                    </div>
                    
                </>
            )
        }
        
    }

    function signout() {
        localStorage.setItem("customerLogin", false)
        navigate("/customer-login")
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
                            <li><Link to={`/menu`}>Menu</Link></li>
                            <li hidden><a href="#featured">Featured</a></li>
                            <li><Link to={`/transaction-history`}>Transaction History</Link></li>
                            <li hidden><a href="#favorites">Favorites</a></li>
                            <li class="signout" onClick={signout}>Sign Out</li>
                        </ul>
                    </nav>
                </header>
                {!isOpen ? <p id="closed">We are currently closed. Gold Brew Opens at 8:00 AM.</p> : <></>} {/* This does NOT happen in real time */}
                <main>
                    <section id="categories" class="card">
                        <h2 class="menu-heading">Categories</h2>
                        <ul id="category-list">
                            {
                                categories.map((category, index1) => (
                                    <>
                                        <li key={index1} class={`category ${selectedCategory === index1 ? 'active' : ''}`} onClick={() => changeCategory(index1)}>{category.categoryName}</li>
                                    </>
                                ))
                            }
                        </ul>
                    </section>
                    <section id="results" class="customer-card-center">
                        {
                            renderResults()
                        }
                        
                    </section>
                    <section id="cart" class="card">
                        {
                            renderCart()
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

export default CustomerMenu;