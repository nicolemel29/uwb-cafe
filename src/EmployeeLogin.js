import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from './firebase.js'
import { ref, set, get } from 'firebase/database'  // Import get method to read data from DB
import { Link } from 'react-router-dom'
import './EmployeeLogin.css'

function EmployeeLogin() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
      if (localStorage.getItem("employeeLogin") === "true") {
        navigate("/employee")
      } else {
        localStorage.setItem("employeeLogin", false)
      }
    }, [])

    const handleSubmit = async () => {
      try {
        // Sign in with Firebase Authentication
        const userCredential = await signInWithEmailAndPassword(auth, username, password)

        // Get user data from Firebase Authentication
        const user = userCredential.user

        // Get user data from Realtime Database
        const userRef = ref(db, 'users/' + user.uid) // Reference to the user's data in DB
        const snapshot = await get(userRef)  // Fetch data from Firebase
        if (snapshot.exists()) {
          const userData = snapshot.val()  // Get the user data as an object

          // Check if the user is a staff member
          if (userData.Staff === true) {
            // If the user is a staff member, navigate to the employee page
            localStorage.setItem("employeeLogin", true)
            navigate("/employee")
          } else {
            // If the user is not a staff member, show an error
            alert("Login failed! Not an Employee, Please check your credentials.")
          }
        } else {
          // Handle case where user data doesn't exist in the database
          console.error("No user data found")
          alert("Login failed! User not found in database.")
        }
      } catch (error) {
        console.error("Error signing in: ", error)
        alert("Login failed! Please check your credentials.")
      }
    }

    return (
        <div id="employee-background">
        <div id="login-container">
            <h2>Employee Login</h2>
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
            <Link to={"/customer-login"}>
            I am a student
            </Link>
        </div>           
        </div>
    )
}

export default EmployeeLogin