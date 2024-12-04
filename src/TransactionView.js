import React from 'react'
import { useState, useEffect } from 'react'

function TransactionView() {
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
                <h3>Transaction: {index+1}</h3>
                {
                    transaction.map((item) => (
                        <p>{item.itemName}</p>
                    ))
                }
            </div>
        ))
    }

    if (transactionsLoaded) {
        return (
            <>
                <p>We'll save your last 10 orders here!</p>
                {renderTransactions()}
            </>
        )
    } else {
        return (
            <p>Loading...</p>
        )
    }
}

export default TransactionView