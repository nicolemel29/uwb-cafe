import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

function Redirect() {
    const navigate = useNavigate()

    useEffect(() => {
        navigate("/")
    }, [])
}

export default Redirect