import React from 'react'
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

    return (
        <>
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Pay - UW Bothell Cafe</title>
            </head>
            <body>
                {
                    cart.map(cartItem => (
                        <p>{cartItem.itemName}</p>
                    ))
                }
            </body>
        </>
    )
}

export default PaymentView