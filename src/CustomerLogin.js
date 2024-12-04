import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from './firebase.js'
import { ref, set, get } from 'firebase/database'
import { Link } from 'react-router-dom'
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
      // Sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, username, password)

      // Get user data from Firebase Authentication
      const user = userCredential.user

    // Since we don't have a signup page, I manually added a user // 
    //   set(userRef, {
    //     Net_ID_Email: user.email,
    //     Fname: 'John', // You can set these values based on user input
    //     Lname: 'Doe',  // or use a registration form to get real user details
    //     Phone_Number: '123-456-7890',
    //     Staff: false,  // Default for regular users
    //   })

        // Get user data from Realtime Database
        const userRef = ref(db, 'users/' + user.uid) // Reference to the user's data in DB
        const snapshot = await get(userRef)  // Fetch data from Firebase
        if (snapshot.exists()) {
            localStorage.setItem("customerLogin", true)
            navigate("/menu")
        } else {
          // Handle case where user data doesn't exist in the database
          console.error("No user data found")
          alert("Login failed! User not found in database.")
        }


      // Navigate to menu page after successful login
      navigate("/menu")
    } catch (error) {
      console.error("Error signing in: ", error)
      alert("Login failed! Please check your credentials.")
    }
  }

  return (
    <>
      <div id="login-container">
        <h2>Student Login</h2>
        <div className="input-field" id="username">
          <label>Username: </label>
          <input
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="input-field" id="password">
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
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