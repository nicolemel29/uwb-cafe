import React from 'react'
import './CustomerLogin.css'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'



function CustomerLogin() {
    const navigate = useNavigate()

    function handleSubmit() {
        navigate("/menu")
    }

    return (
        <>
            <div id="login-container">
                <h2>Student Login</h2>
                <div class="input-field" id="username">
                    <label>Username: </label>
                    <input type="text"></input>
                </div>
                <div class="input-field" id="password">
                    <label>Password: </label>
                    <input type="password"></input>
                </div>
                <button onClick={handleSubmit}>
                    Login
                </button>
                <Link to={"/employee-login"}>
                    I am an employee
                </Link>
            </div>
            
            
            
        </>
    )
}

export default CustomerLogin