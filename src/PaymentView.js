import React from 'react'
import './PaymentView.css'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'


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
            navigate("/")
        } else {
            setCart(JSON.parse(localStorage.getItem("cart")))
        }
    }, [])

    useEffect(() => {
        let total = 0
        cart.forEach(cartItem => {
            total += parseFloat(cartItem.item.price)*parseFloat(cartItem.quantity)
        });
        setCartTotal(total)
    }, [cart])

    function getDate() {
        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1; // Months start at 0!
        let dd = today.getDate();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        return dd + '/' + mm + '/' + yyyy;
    }

    function handlePay() {
        const cartItem = {
            order: cart,
            date: getDate()
        }

        if (localStorage.getItem("transaction")) {
            const oldTransactionHistory = JSON.parse(localStorage.getItem("transaction"))

            let tempTransactionHistory = [cartItem]
            for (let i = 0; i < 9 && i < oldTransactionHistory.length; i++) tempTransactionHistory.push(oldTransactionHistory[i])

            const newTransactionHistory = JSON.stringify(tempTransactionHistory)
            localStorage.setItem("transaction", newTransactionHistory)
        } else {
            const newTransactionHistory = JSON.stringify([cartItem])
            localStorage.setItem("transaction", newTransactionHistory)
        }
        localStorage.setItem("cart", [])
        navigate("/menu")
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

export default PaymentView