import React from "react";
import "./PaymentView.css";
import logo from "./cafe-logo.PNG";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { auth, db } from "./firebase.js";
import { ref, set, get, push } from "firebase/database"; // Import get method to read data from DB

import { Link } from "react-router-dom";

function PaymentView() {
  const navigate = useNavigate();

  const goToMenu = () => {
    navigate("/menu");
  };

  const [isPaymentValid, setIsPaymentValid] = useState(false);
  const inputs = document.querySelectorAll("input");

  const verifyPayment = {
    cardNumber: /^\d{4}[ -]?\d{4}[ -]?\d{4}[ -]?\d{4}$/,
    cvv: /^\d{3,4}$/,
    expDate: /^(0[1-9]|1[0-2])\/(2[5-9]|[3-9][0-9])$/, //12/24 cards have expired
  };

  function validatePayment(input) {
    const pattern = input.getAttribute("name");
    if (pattern !== null) {
      const regex = verifyPayment[pattern];
      const p = input.nextElementSibling;
      if (!input.value.match(regex)) {
        p.hidden = false;
        setIsPaymentValid(false);
      } else {
        p.hidden = true;
      }
    }

    //check if all inputs are valid
    const valid = Array.from(inputs).every((input) => {
      const pattern = input.getAttribute("name");
      const regex = verifyPayment[pattern];
      if (pattern && regex) {
        return input.value.match(regex);
      }
      return true;
    });
    setIsPaymentValid(valid);
  }

  useEffect(() => {
    inputs.forEach((input) => {
      input.addEventListener("input", (e) => {
        validatePayment(e.target);
      });
    });
  });

  useEffect(() => {
    if (localStorage.getItem("customerLogin") !== "true") {
      localStorage.setItem("customerLogin", false);
      navigate("/customer-login");
    }
  }, []);

  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  function removeFromCart(index) {
    const iterations = cart.length;
    let cartCopy = [];
    for (let i = 0; i < iterations; i++) {
      if (i != index) {
        cartCopy.push(cart[i]);
      }
    }
    setCart(cartCopy);
  }

  function subtractQuantity(cartItem, index) {
    cartItem.quantity -= 1;
    if (cartItem.quantity <= 0) removeFromCart(index);
    else setCart([...cart]);
  }

  function addQuantity(cartItem) {
    cartItem.quantity += 1;
    setCart([...cart]);
  }

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  useEffect(() => {
    if (!localStorage.getItem("cart")) {
      navigate("/"); // Redirect if no cart found
    } else {
      setCart(JSON.parse(localStorage.getItem("cart"))); // Set cart items from localStorage
    }
  }, []);

  useEffect(() => {
    let total = 0;
    cart.forEach((cartItem) => {
      total += parseFloat(cartItem.item.price) * parseFloat(cartItem.quantity);
    });
    setCartTotal(total);
  }, [cart]);

  function getDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    return mm + "/" + dd + "/" + yyyy;
  }

  function signout() {
    localStorage.setItem("customerLogin", false);
    navigate("/customer-login");
  }

  function handlePay() {
    const cartItem = {
      order: cart,
      date: getDate(),
    };
    if (cart.length === 0) {
      alert("Cart cannot be empty.");
      localStorage.removeItem("cart"); // Clear local cart
      setCart([]); // Clear cart state in the component
      navigate("/menu");
    } else {
      if (localStorage.getItem("transaction")) {
        const oldTransactionHistory = JSON.parse(
          localStorage.getItem("transaction")
        );

        let tempTransactionHistory = [cartItem];
        for (let i = 0; i < 11 && i < oldTransactionHistory.length; i++)
          tempTransactionHistory.push(oldTransactionHistory[i]);

        const newTransactionHistory = JSON.stringify(tempTransactionHistory);
        localStorage.setItem("transaction", newTransactionHistory);
      } else {
        const newTransactionHistory = JSON.stringify([cartItem]);
        localStorage.setItem("transaction", newTransactionHistory);
      }
      localStorage.setItem("cart", []);

      const user = auth.currentUser; // Get the currently logged-in user
      if (!user) {
        alert("You need to be logged in to complete the payment.");
        return;
      }

      const userId = user.uid;
      console.log("userId:", userId);

      const ordersRef = ref(db, "orders-pending"); // Reference to the orders node
      const newOrderRef = push(ordersRef); // Create a new unique order entry

      const userRef = ref(db, `users/${userId}`); // Reference to the user node based on userId

      get(userRef)
        .then((snapshot) => {
          const userData = snapshot.val();
          console.log("User Data:", userData); // Check if userData contains Fname and Lname

          const userName = `${userData.Fname || "No First Name"} ${
            userData.Lname || "No Last Name"
          }`;
          console.log("userName:", userName);
          const totalAmount = cart.reduce((sum, cartItem) => {
            const price = parseFloat(cartItem.item.price); // Access price from the nested `item` object
            const quantity = cartItem.quantity; // Access the quantity directly
            return sum + price * quantity; // Multiply price by quantity and add to sum
          }, 0);
          const checkQuantity = cart.forEach((cartItem) => {
            if (cartItem.quantity === 0) {
              removeFromCart(cartItem);
            }
          });
          const formattedTotalAmount = totalAmount.toFixed(2);

          const orderData = {
            userId: userId,
            userName: userName, // Add userName to the order data
            cartItems: cart, // Use current cart state
            totalAmount: formattedTotalAmount,
            timestamp: Date.now(),
            status: "pending", // Default status for new orders
          };

          //     console.log("Order Data:", orderData);

          // Push the new order to Firebase
          set(newOrderRef, orderData)
            .then(() => {
              alert("Order placed successfully!");
              localStorage.removeItem("cart"); // Clear local cart
              setCart([]); // Clear cart state in the component
              /*
                setTimeout(() => {
                    navigate("/menu"); // if Modal, will navigate to menu after 15 min if the ok button is not pressed
                    }, 900000);
                */
              navigate("/menu"); // Redirect to menu or confirmation page
            })
            .catch((error) => {
              console.error("Error placing order: ", error);
              alert("Failed to place order. Please try again.");
            });
        })
        .catch((error) => {
          console.error("Error getting user data: ", error);
          alert("Failed to retrieve user information. Please try again.");
        });
    }
  }

  return (
    <>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Pay - UW Bothell Cafe</title>
      </head>
      <body>
        <header>
          <div class="logo">
            <img src={logo} alt="UW Bothell Cafe Logo" />
          </div>
          <nav>
            <ul>
              <li>
                <Link to={`/menu`}>Menu</Link>
              </li>
              <li hidden>
                <a href="#featured">Featured</a>
              </li>
              <li>
                <Link to={`/transaction-history`}>Transaction History</Link>
              </li>
              <li hidden>
                <a href="#favorites">Favorites</a>
              </li>
              <li class="signout" onClick={signout}>
                Sign Out
              </li>
            </ul>
          </nav>
        </header>
        <div id="review-body">
          <h1 id="order-header">Review Order</h1>
          <div id="order-container">
            <div class="content-container" id="order-info">
              <div id="order-info-content">
                <div class="time">
                  <label>Pick-Up Time</label>
                  <input
                    class="payment-view"
                    type="time"
                    min="08:00"
                    max="18:00"
                  ></input>
                </div>
                <div class="card-details">
                  <label>Card Details</label>
                  <input
                    class="payment-view"
                    type="text"
                    placeholder="Address Line 1..."
                    required
                  ></input>
                  <input
                    class="payment-view"
                    type="text"
                    placeholder="Address Line 2..."
                  ></input>
                  <div class="card-row">
                    <input
                      class="payment-view"
                      type="text"
                      placeholder="City..."
                      required
                    ></input>
                    <input
                      class="payment-view"
                      type="text"
                      placeholder="Country..."
                      required
                    ></input>
                  </div>
                  <div class="card-row">
                    <input
                      class="payment-view"
                      type="text"
                      placeholder="State..."
                      required
                    ></input>
                    <input
                      class="payment-view"
                      type="text"
                      placeholder="Zip..."
                      required
                    ></input>
                  </div>
                  <input
                    class="payment-view"
                    type="text"
                    name="cardNumber"
                    placeholder="Card Number..."
                    required
                  ></input>
                  <p className="error-message" hidden>
                    Please enter a valid 16 digit card number.
                  </p>
                  <div class="card-row">
                    <input
                      class="payment-view"
                      type="text"
                      name="expDate"
                      placeholder="Expiration..."
                      required
                    ></input>
                    <p className="error-message" hidden>
                      Please enter a valid expiration date (MM/YY).
                    </p>
                    <input
                      class="payment-view"
                      type="password"
                      name="cvv"
                      placeholder="CVV..."
                      required
                    ></input>
                    <p className="error-message" hidden>
                      Please enter a valid cvv.
                    </p>
                  </div>

                  <div className="button-container">
                    <button onClick={goToMenu} class="cancel-button">
                      Cancel
                    </button>

                    <button
                      onClick={() => {
                        if (!isPaymentValid) {
                          alert("Please enter valid payment details.");
                        } else {
                          handlePay();
                        }
                      }}
                      className="pay-button"
                    >
                      Pay!
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="content-container" id="order-recap">
              {cart.map((cartItem, index) => (
                <div class="cart-item">
                  <span class="cart-item-title" key={`cart${index}`}>
                    {cartItem.item.itemName}
                  </span>
                  <div class="cart-item-details">
                    <div class="cart-item-info">
                      <span class="cart-item-price">{`$${cartItem.item.price} each`}</span>
                      <span class="cart-item-quantity">{`Quantity: ${cartItem.quantity}`}</span>
                    </div>
                    <div class="cart-item-options">
                      <div class="spacer"></div>
                      <div class="cart-quantity-change">
                        <button
                          onClick={() => {
                            subtractQuantity(cartItem, index);
                            saveCart();
                          }}
                        >
                          -
                        </button>

                        <button
                          onClick={() => {
                            addQuantity(cartItem);
                            saveCart();
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div class="cart-item cart-item-title">
                {`Total: $${cartTotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}
              </div>
            </div>
          </div>
        </div>
        <footer>
          <p>&copy; 2024 UW Bothell Cafe. All rights reserved.</p>
        </footer>
      </body>
    </>
  );
}

export default PaymentView;
