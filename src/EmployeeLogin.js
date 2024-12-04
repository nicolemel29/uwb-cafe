import React from 'react'
import './EmployeeLogin.css'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'



function EmployeeLogin() {
    // validation/authentication
    //
    

    const navigate = useNavigate()

    function handleSubmit() {

        navigate("/employee")
    }

    return (
        <>
            <div id="login-container">
                <h2>Employee Login</h2>
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
                <Link to={"/customer-login"}>
                    I am a student
                </Link>
            </div>
            
            
            
        </>
    )
}

export default EmployeeLogin