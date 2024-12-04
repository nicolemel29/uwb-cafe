import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import { auth, db } from './firebase.js'
import { ref, set, get } from 'firebase/database'
import { Link } from 'react-router-dom'
import stulogo from './cafe-logo.PNG'
import './CustomerSignup.css'


function CustomerSignup() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const [firstNameError, setFirstNameError] = useState(false)
  const [lastNameError, setLastNameError] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)



  useEffect(() => {
    if (localStorage.getItem("customerLogin") === "true") {
      navigate("/menu")
    } else {
      localStorage.setItem("customerLogin", false)
    }
  }, [])

  const handleSubmit = async () => {
    let flag = false;

    if (firstName.length <= 0) {
      flag = true
      setFirstNameError(true)
    } else {
      setFirstNameError(false)
    }

    if (lastName.length <= 0) {
      flag = true
      setLastNameError(true)
    } else {
      setLastNameError(false)
    }

    if (!username.endsWith("@uw.edu")) {
      flag = true
      setEmailError(true)
    } else {
      setEmailError(false)
    }

    if (password.length < 6) {
      flag = true
      setPasswordError(true)
    } else {
      setPasswordError(false)
    }

    if (flag) return;

    try {
      createUserWithEmailAndPassword(auth, username, password)
      .then((userCredential) => {
        
        const user = userCredential.user; // Populate Authentication on Firebase

        console.log("User created:", user);
        const userRef = ref(db, 'users/' + user.uid) // Reference to the user's data in DB
        // Set the Realtime Database
        set(userRef, {
          Net_ID_Email: user.email,
          Fname: firstName, // You can set these values based on user input
          Lname: lastName,  // or use a registration form to get real user details
          Phone_Number: '123-456-7890',
          Staff: false,  // Default for regular users
        })
        // Send the email verification
        sendEmailVerification(user)
        .then(() => {
          // Email sent
          console.log("Verification email sent to:", user.email);
          alert(`Verification Link Sent to ${user.email}`)
        })

      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error creating user:", errorCode, errorMessage);
      });
      
      navigate("/customer-login")
    } catch (error) {
      console.error("Error signing in: ", error)
      alert("Login failed! Please check your credentials.")
    }
  }

  return (
    <div id="customer-background">
      <div id="login-container">
        <div id="student-login-box">
        <div id="student-login-logo">
          <img src={stulogo} alt="Cafe logo student login" />
        </div>
        <h2 id="student-login-header">Student Signup</h2>
        <div className="input-field" id="cust-first-name">
          <label>First Name: </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          { firstNameError ? <p class="error">First Name Should Be Filled</p> : <></> }
        </div>
        <div className="input-field" id="cust-last-name">
          <label>Last Name: </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          { lastNameError ? <p class="error">Last Name Should Be Filled</p> : <></> }
        </div>
        <div className="input-field" id="cust-email">
          <label>Email: </label>
          <input
            type="email" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          { emailError ? <p class="error">Email Should End With @uw.edu</p> : <></> }
        </div>
        <div className="input-field" id="cust-password">
          <label>Set Password: </label>
          <input
            type="password"
            required minlength="6" 
            maxlength="6"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          { passwordError ? <p class="error">Password Should Be 6+ Characters Long</p> : <></> }
        </div>
        <button id="cust-login-button" onClick={handleSubmit}>
          Sign Up
        </button>
        </div>
        <Link id="to-employee-link" to={"/customer-login"}>
          I already have an account
        </Link>
        <Link id="to-employee-link" to={"/employee-login"}>
          I am an employee
        </Link>
      </div>
    </div>
  )
}

export default CustomerSignup