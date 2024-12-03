import React from 'react'
import {useEffect} from 'react'
import { useNavigate } from 'react-router-dom'

function PaymentView() {
    const navigate = useNavigate()

    useEffect(() => {
        if (!localStorage.getItem("cart")) {
            navigate("/")
        }
    }, [])
}

export default PaymentView