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
    
    function renderTransactions() {

        return transactionHistory.map((transaction, index) => (
            <div class="transaction-card">
                <h2>Transaction: {index+1}</h2>
                {
                    transaction.map((cartItem) => (
                        <p><strong>{cartItem.item.itemName}</strong></p> 
                    ))
                }
                <button onClick={() => {
                    //add to cart
                    navigate('/pay');
                }}>Buy again</button>
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
                <h2>We'll save your last 10 orders here!</h2>
                {renderTransactions()}
                
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