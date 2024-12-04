import React from 'react'
import './PaymentView.css'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function PaymentView() {
    const navigate = useNavigate()

    const [cart, setCart] = useState([])

    useEffect(() => {
        if (!localStorage.getItem("cart")) {
            navigate("/")
        } else {
            setCart(JSON.parse(localStorage.getItem("cart")))
        }
    }, [])

    function handlePay() {
        if (localStorage.getItem("transaction")) {
            const oldTransactionHistory = JSON.parse(localStorage.getItem("transaction"))
            const newTransactionHistory = JSON.stringify([...oldTransactionHistory, cart])
            localStorage.setItem("transaction", newTransactionHistory)
            localStorage.setItem("cart", [])
            navigate("/")
        } else {
            const newTransactionHistory = JSON.stringify([cart])
            localStorage.setItem("transaction", newTransactionHistory)
            localStorage.setItem("cart", [])
            navigate("/")
        }
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
                {
                    cart.map(cartItem => (
                        <p class="cart-item">{cartItem.itemName}</p>
                    ))
                }
                <button onClick={handlePay} class="pay-button">
                    Pay!
                </button>
            </body>
        </>
    )
}

export default PaymentView