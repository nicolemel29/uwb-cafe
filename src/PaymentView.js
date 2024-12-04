import React from 'react'
import './PaymentView.css'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function PaymentView() {
    const navigate = useNavigate()

    const [cart, setCart] = useState([])

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

    function handlePay() {
        const user = auth.currentUser // Get the currently logged-in user
        if (!user) {
            alert("You need to be logged in to complete the payment.")
            return
        }

        const userId = user.uid
        const ordersRef = ref(db, 'orders') // Reference to the orders node
        const newOrderRef = push(ordersRef) // Create a new unique order entry

        const orderData = {
            userId: userId,
            cartItems: cart, // Use current cart state
            // totalAmount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0), // Calculate total amount
            timestamp: Date.now(),
            status: 'pending' // Default status for new orders
        }

        // Push the new order to Firebase
        set(newOrderRef, orderData)
            .then(() => {
                alert("Order placed successfully!")
                localStorage.removeItem("cart") // Clear local cart
                setCart([]) // Clear cart state in the component
                navigate("/menu") // Redirect to menu or confirmation page
            })
            .catch((error) => {
                console.error("Error placing order: ", error)
                alert("Failed to place order. Please try again.")
            })
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
                        <input type="text"></input>
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
                                        <button onClick={() => {
                                            removeFromCart(index)
                                            saveCart()
                                        }}>Delete</button>
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
                    </div>
                </div>
                <button onClick={handlePay} class="pay-button">
                    Pay!
                </button>
            </body>
        </>
    )
}

export default PaymentView;