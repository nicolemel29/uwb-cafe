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

    if (transactionsLoaded) {
        return (
            <>
                {
                    transactionHistory.map((transaction, index) => (
                        <>
                            <h2>Transaction {index}:</h2>
                            {
                                transaction.map(item => (
                                    <p>{item.itemName}</p>
                                ))
                            }
                        </>
                    ))
                }  
            </>
        )
    } else {
        return (
            <p>Loading...</p>
        )
    }
}

export default TransactionView