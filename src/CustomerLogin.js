import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from './firebase.js'
import { ref, set, get } from 'firebase/database'
import { Link } from 'react-router-dom'
import stulogo from './cafe-logo.PNG'
import './CustomerLogin.css'


function CustomerLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem("customerLogin") === "true") {
      navigate("/menu")
    } else {
      localStorage.setItem("customerLogin", false)
    }
  }, [])

  const handleSubmit = async () => {
    try {
      
      // Check if the email ends with @uw.edu or @uw.netid
      if (!username.endsWith("@uw.edu")) {
        alert("Only University of Washington email addresses are allowed.");
      return;
      }
      // // Sign in with Firebase Authentication
      // const userCredential = await signInWithEmailAndPassword(auth, username, password)

      // // Get user data from Firebase Authentication
      // const user = userCredential.user

      // const userRef = ref(db, 'users/' + user.uid) // Reference to the user's data in DB

      //   // Get user data from Realtime Database
      //   const snapshot = await get(userRef)  // Fetch data from Firebase
      //   if (snapshot.exists()) {
      //       localStorage.setItem("customerLogin", true)
      //       navigate("/menu")
      //   } else {
      //     // Handle case where user data doesn't exist in the database
      //     console.error("No user data found")
      //     alert("Login failed! User not found in database.")
      //   }


      // // Navigate to menu page after successful login
      // navigate("/menu")
      signInWithEmailAndPassword(auth, username, password)
      .then((userCredential) => {
        const user = userCredential.user;
  
        // Check if the email is verified
        if (user.emailVerified) {
          console.log("Email verified! User logged in:", user);
          localStorage.setItem("customerLogin", true)
        
          navigate("/menu"); // Navigate to the logged-in user dashboard or home page
        } else {
          console.log("Email not verified yet.");
          alert("Please verify your email address before logging in. Check your inbox for the verification email.");
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
  
        // Handle specific error codes
        if (errorCode === 'auth/user-not-found') {
          console.error("No user found with this email.");
          alert("No account found with this email address. Please check your email or sign up.");
        } else if (errorCode === 'auth/wrong-password') {
          console.error("Incorrect password.");
          alert("Incorrect password. Please try again.");
        } else {
          console.error("Error signing in:", errorMessage);
          alert("Login failed! Please check your credentials.");
        }
      });
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
        <h2 id="student-login-header">Student Login</h2>
        <div className="input-field" id="cust-email">
          <label>Email: </label>
          <input
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="input-field" id="cust-password">
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button id="cust-login-button" onClick={handleSubmit}>
          Login
        </button>
        </div>
        <Link id="to-employee-link" to={"/customer-signup"}>
          New User? Sign Up!
        </Link>
        <Link id="to-employee-link" to={"/employee-login"}>
          I am an employee
        </Link>
      </div>
    </div>
  )
}

export default CustomerLogin