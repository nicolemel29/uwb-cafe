import React from 'react'
import './PaymentView.css'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, db } from './firebase.js'
import { ref, set, get, push } from 'firebase/database'  // Import get method to read data from DB

function PaymentView() {
    const navigate = useNavigate()

    const [cart, setCart] = useState([])
    const [cartTotal, setCartTotal] = useState(0)

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

    useEffect(() => {
        if (!localStorage.getItem("cart")) {
            navigate("/") // Redirect if no cart found
        } else {
            setCart(JSON.parse(localStorage.getItem("cart"))) // Set cart items from localStorage
        }
    }, [])

    useEffect(() => {
        let total = 0
        cart.forEach(cartItem => {
            total += parseFloat(cartItem.item.price)*parseFloat(cartItem.quantity)
        });
        setCartTotal(total)
    }, [cart])

    function handlePay() {
        if (localStorage.getItem("transaction")) {
            const oldTransactionHistory = JSON.parse(localStorage.getItem("transaction"))

            let tempTransactionHistory = [cart]
            for (let i = 0; i < 9 && i < oldTransactionHistory.length; i++) tempTransactionHistory.push(oldTransactionHistory[i])

            const newTransactionHistory = JSON.stringify(tempTransactionHistory)
            localStorage.setItem("transaction", newTransactionHistory)
        } else {
            const newTransactionHistory = JSON.stringify([cart])
            localStorage.setItem("transaction", newTransactionHistory)
        }
        localStorage.setItem("cart", [])
        const user = auth.currentUser; // Get the currently logged-in user
        if (!user) {
            alert("You need to be logged in to complete the payment.");
            return;
        }
    
        const userId = user.uid;
        console.log("userId:", userId);
    
        const ordersRef = ref(db, 'orders-pending'); // Reference to the orders node
        const newOrderRef = push(ordersRef); // Create a new unique order entry
    
        const userRef = ref(db, `users/${userId}`); // Reference to the user node based on userId
    
        get(userRef)
        .then((snapshot) => {
            const userData = snapshot.val();
            console.log("User Data:", userData); // Check if userData contains Fname and Lname
            
            const userName = `${userData.Fname || "No First Name"} ${userData.Lname || "No Last Name"}`;
            console.log("userName:", userName);
            const totalAmount = cart.reduce((sum, cartItem) => {
                const price = parseFloat(cartItem.item.price); // Access price from the nested `item` object
                const quantity = cartItem.quantity; // Access the quantity directly
                return sum + (price * quantity);  // Multiply price by quantity and add to sum
            }, 0);
            const formattedTotalAmount = totalAmount.toFixed(2);
    
            const orderData = {
                userId: userId,
                userName: userName, // Add userName to the order data
                cartItems: cart, // Use current cart state
                totalAmount: formattedTotalAmount,
                timestamp: Date.now(),
                status: 'pending' // Default status for new orders
            };
    
        //     console.log("Order Data:", orderData);
    
        //     // Push the new order to Firebase
            set(newOrderRef, orderData)
                .then(() => {
                    alert("Order placed successfully!");
                    localStorage.removeItem("cart"); // Clear local cart
                    setCart([]); // Clear cart state in the component
                    navigate("/menu"); // Redirect to menu or confirmation page
                })
                .catch((error) => {
                    console.error("Error placing order: ", error);
                    alert("Failed to place order. Please try again.");
                });
        })
        .catch((error) => {
            console.error("Error getting user data: ", error);
            alert("Failed to retrieve user information. Please try again.");
        });
    }

    return (
        <>
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Pay - UW Bothell Cafe</title>
            </head>
            <body>
                <h1 id="order-header">Review Order</h1>
                <div id="order-container">
                    <div class="content-container" id="order-info">
                        <div class="time">
                            <label>Pick-Up Time</label>    
                            <input type="time" min="08:00" max="18:00"></input>
                        </div>
                        <div class="card-details">
                            <label>Card Details</label>
                            <input type="text" placeholder="Address Line 1..." required></input>
                            <input type="text" placeholder="Address Line 2..."></input>
                            <div class="card-row">
                                <input type="text" placeholder="City..." required></input>
                                <input type="text" placeholder="Country..." required></input>
                            </div>
                            <div class="card-row">
                                <input type="text" placeholder="State..." required></input>
                                <input type="text" placeholder="Zip..." required></input>
                            </div>
                            <input type="text" placeholder="Card Number..." required></input>
                            <div class="card-row">
                                <input type="text" placeholder="Expiration..." required></input>
                                <input type="password" placeholder="CVV..." required></input>
                            </div>

                            <button onClick={handlePay} class="pay-button">
                                Pay!
                            </button>
                        </div>
                    </div>
    
                    <div class="content-container" id="order-recap">
                        {cart.map((cartItem, index) => (
                            <div class="cart-item">
                                <span class="cart-item-title" key={`cart${index}`}>{cartItem.item.itemName}</span>
                                <div class="cart-item-details">
                                    <div class="cart-item-info">
                                        <span class="cart-item-price">{`$${cartItem.item.price} each`}</span>
                                        <span class="cart-item-quantity">{`Quantity: ${cartItem.quantity}`}</span>
                                    </div>
                                    <div class="cart-item-options">
                                        <div class="spacer"></div>
                                        <div class="cart-quantity-change">
                                            <button onClick={() => {
                                                subtractQuantity(cartItem, index)
                                                saveCart();
                                            }}>-</button>

                                            <button onClick={() => {
                                                addQuantity(cartItem)
                                                saveCart();
                                            }}>+</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div class="cart-item cart-item-title">
                            {`Total: $${(cartTotal).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
                        </div>
                    </div>
                </div>
            </body>
        </>
    )
}

export default PaymentView;