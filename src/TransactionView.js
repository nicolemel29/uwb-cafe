import React from 'react'
import logo from './cafe-logo.PNG'
import './TransactionView.css'
import { useState, useEffect } from 'react'
import {useNavigate, Link} from 'react-router-dom'



function TransactionView() {
    const navigate = useNavigate()
    const [transactionHistory, setTransactionHistory] = useState([])
    const [transactionsLoaded, setTransactionsLoaded] = useState(false)

    useEffect(() => {
        if (localStorage.getItem("transaction")) {
            setTransactionHistory(JSON.parse(localStorage.getItem("transaction")))
        }
        setTransactionsLoaded(true)
    }, [])

    function getTotal(index) {
        let total = 0;
        transactionHistory[index].order.forEach(cartItem => {
            total += (parseFloat(cartItem.item.price)*cartItem.quantity)
        });
        return total.toFixed(2)
    }
    
    function renderTransactions() {

        return transactionHistory.map((transaction, index) => (
            <div class="transaction-card">
                <h2>Transaction on: {transaction.date}</h2>
                <div id="transaction-details">
                    <div id="transaction-items">
                        {
                            transaction.order.map((cartItem, index2) => (
                                <>
                                    <p class="transaction-item"><strong>{`${cartItem.quantity} ${cartItem.item.itemName}${cartItem.quantity > 1 ? "s" : ""}`}</strong></p>
                                    <p class='indent'><strong>{`$${(parseFloat(cartItem.item.price)*cartItem.quantity).toFixed(2)}`}</strong> {`($${cartItem.item.price} each)`}</p>
                                </>
                            ))
                        }
                    </div>
                    <div id="right-content">
                        <p><strong>{`Total: $${getTotal(index)}`}</strong></p>
                        <button id="repurchase-button" onClick={() => {
                            //add to cart
                            localStorage.setItem("cart", JSON.stringify(transactionHistory[index].order))
                            navigate('/pay');
                        }}>Buy again</button>
                    </div>
                </div>
            </div>
        ))
    }
    function signout() {
        navigate("/customer-login")
    }

    if (transactionsLoaded) {
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
                <h2 id="transaction-history-title">We'll save your last 12 orders here!</h2>
                <div id="transaction-grid">
                {
                    renderTransactions()
                }
                </div>
                
            </body>
            </>
            
        )
    } else {
        return (
            <p>Loading...</p>
        )
    }
}

export default TransactionView