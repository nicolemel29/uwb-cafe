import React from "react";
import "./EmployeeView.css";
import logo from "./cafe-logo.PNG";
import { useEffect, useState } from "react";
// import categories from './menuData.json'
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { db } from "./firebase"; // import the db reference
import {
  ref,
  set,
  get,
  push,
  update,
  remove,
  onValue,
} from "firebase/database"; // Import get method to read data from DB

function EmployeeView(props) {
  const navigate = useNavigate();

  const [categoryIDs, setCategoryIDs] = useState([]);
  const [categories, setCategories] = useState([]);

  const [itemIDs, setItemIDs] = useState([]);
  const [items, setItems] = useState([]);

  const [isOpen, setIsOpen] = useState(false);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newItemName, setNewItemName] = useState("");

  const [selectedCategory, setSelectedCategory] = useState(undefined);
  const [selectedItem, setSelectedItem] = useState(undefined);

  useEffect(() => {
    if (localStorage.getItem("employeeLogin") !== "true") {
      localStorage.setItem("employeeLogin", false);
      navigate("/employee-login");
    }
  }, []);

  // get isOpen
  useEffect(() => {
    const orderRef = ref(db, `isOpen`);
    get(orderRef)
      .then((snapshot) => {
        if (snapshot.exists) {
          setIsOpen(snapshot.val());
        }
      })
      .catch((error) => {
        console.error("Error fetching isOpen: ", error);
      });
  }, []);

  // get Categories
  useEffect(() => {
    fetchCategoriesFromDatabase();
  }, []);

  const fetchCategoriesFromDatabase = () => {
    const orderRef = ref(db, `categories`);
    get(orderRef)
      .then((snapshot) => {
        if (snapshot.exists) {
          let tempCategoryIDs = [];
          let tempCategories = [];
          for (let [key, value] of Object.entries(snapshot.val())) {
            tempCategoryIDs.push(key);
            tempCategories.push(value);
          }
          setCategoryIDs(tempCategoryIDs);
          setCategories(tempCategories);
        }
      })
      .catch((error) => {
        console.error(`Couldn't load categories data: `, error);
      });
  };

  const fetchItemsFromDatabase = () => {
    const orderRef = ref(
      db,
      `categories/${categoryIDs[selectedCategory]}/items`
    );
    get(orderRef)
      .then((snapshot) => {
        if (snapshot.exists) {
          let tempItemIDs = [];
          for (let [key, _] of Object.entries(snapshot.val())) {
            tempItemIDs.push(key);
          }
          setItemIDs(tempItemIDs);
        }
      })
      .catch((error) => {
        console.error(`Couldn't load categories data: `, error);
      });
  };

  function changeItem(index) {
    setSelectedItem(index);
  }

  function changeCategory(index) {
    setSelectedCategory(index);
  }

  function renderResults() {
    if (selectedCategory === undefined) {
      return (
        <>
          <h2 id="results-header">Select a Category</h2>
          <div id="results-content"></div>
        </>
      );
    } else {
      return (
        <>
          <h2 id="results-header">
            {categories[selectedCategory].categoryName}
          </h2>
          <div id="results-content">
            {categories[selectedCategory].items.map((item, index) => (
              <h3
                key={`item${index}`}
                class={`category ${selectedItem === index ? "active" : ""}`}
                onClick={() => changeItem(index)}
              >
                {item.itemName}
              </h3>
            ))}
            <button onClick={addItem}>Add Item</button>
            {0 <= selectedItem &&
            selectedItem < categories[selectedCategory].items.length &&
            1 < categories[selectedCategory].items.length ? (
              <button onClick={deleteItem}>Delete Item</button>
            ) : (
              <></>
            )}
            {0 <= selectedItem &&
            selectedItem < categories[selectedCategory].items.length ? (
              <button onClick={editItem}>Rename Item</button>
            ) : (
              <></>
            )}
            {0 <= selectedItem &&
            selectedItem < categories[selectedCategory].items.length ? (
              <input
                type="text"
                value={newItemName}
                onChange={(e) => {
                  setNewItemName(e.target.value);
                }}
              />
            ) : (
              <></>
            )}
          </div>
        </>
      );
    }
  }

  function addCategory() {
    const orderRef = ref(db, "categories");
    get(orderRef)
      .then((snapshot) => {
        if (snapshot.exists) {
          update(ref(db, `categories/${snapshot.val().length}`), {
            categoryName: "New Category",
            items: [
              {
                itemName: "N/A",
                price: "0",
                calories: "0",
                desc: "N/A",
              },
            ],
          });
          fetchCategoriesFromDatabase();
        }
      })
      .catch((error) => {
        console.error("Error adding category: ", error);
      });
  }

  function editCategory() {
    // includes name
    if (newCategoryName.length === 0) return;

    const orderRef = ref(db, `categories/${categoryIDs[selectedCategory]}`);
    get(orderRef)
      .then((snapshot) => {
        if (snapshot.exists) {
          const ssValue = {
            categoryName: newCategoryName,
            items: snapshot.val().items,
          };
          remove(orderRef)
            .then(() => {
              update(orderRef, ssValue)
                .then((snapshot2) => {
                  fetchCategoriesFromDatabase();
                })
                .catch((error) => {
                  console.error("Couldn't replace file: ", error);
                });
            })
            .catch((error) => {
              console.error("Couldn't remove file: ", error);
            });
        }
      })
      .catch((error) => {
        console.error("Couldn't retrieve category to edit: ", error);
      });
  }

  function deleteCategory() {
    const orderRef = ref(db, `categories/${categoryIDs[selectedCategory]}`);
    remove(orderRef)
      .then(() => {
        setSelectedCategory(undefined);
        fetchCategoriesFromDatabase();
      })
      .catch((error) => {
        console.error("Error adding category: ", error);
      });
  }

  function reorganizeCategory() {}

  function addItem() {
    const orderRef = ref(
      db,
      `categories/${categoryIDs[selectedCategory]}/items`
    );
    get(orderRef)
      .then((snapshot) => {
        if (snapshot.exists) {
          console.log(snapshot.val());
          update(
            ref(
              db,
              `categories/${categoryIDs[selectedCategory]}/items/${
                snapshot.val().length
              }`
            ),
            {
              itemName: "N/A",
              price: "0",
              calories: "0",
              desc: "N/A",
            }
          );
          fetchCategoriesFromDatabase();
        }
      })
      .catch((error) => {
        console.error("Error adding category: ", error);
      });
  }

  function editItem() {
    if (newItemName.length === 0) return;

    fetchItemsFromDatabase();
    const orderRef = ref(
      db,
      `categories/${categoryIDs[selectedCategory]}/items/${itemIDs[selectedItem]}`
    );

    get(orderRef)
      .then((snapshot) => {
        if (snapshot.exists) {
          const ssValue = {
            itemName: newItemName,
            price: snapshot.val().price,
            calories: snapshot.val().calories,
            desc: snapshot.val().desc,
          };
          remove(orderRef)
            .then(() => {
              update(orderRef, ssValue)
                .then((snapshot2) => {
                  fetchCategoriesFromDatabase();
                })
                .catch((error) => {
                  console.error("Couldn't replace file: ", error);
                });
            })
            .catch((error) => {
              console.error("Couldn't remove file: ", error);
            });
        }
      })
      .catch((error) => {
        console.error("Couldn't retrieve category to edit: ", error);
      });
  }

  function deleteItem() {
    const orderRef = ref(
      db,
      `categories/${categoryIDs[selectedCategory]}/items/${itemIDs[selectedItem]}`
    );
    remove(orderRef)
      .then(() => {
        setSelectedItem(undefined);
        fetchCategoriesFromDatabase();
      })
      .catch((error) => {
        console.error("Error adding category: ", error);
      });
  }

  function reorganizeItem() {}

  function signout() {
    localStorage.setItem("employeeLogin", false);
    navigate("/employee-login");
  }

  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    const orderRef = ref(db, "orders-pending"); // Reference to the 'orders-pending' node in Firebase

    // Set up the real-time listener
    const unsubscribe = onValue(orderRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val(); // Get the data from the snapshot
        const orderArray = Object.keys(data).map((key) => ({
          ...data[key],
          id: key,
        }));
        setOrderData(orderArray); // Update the state with the fetched data
      } else {
        console.log("No orders data available");
      }
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);

  // Function to mark order as completed
  const completeOrder = (orderId) => {
    const orderRef = ref(db, `orders-pending/${orderId}`); // Reference to the specific order in "orders-pending"

    // Get the current data of the order
    get(orderRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const orderData = snapshot.val(); // Get the data from the pending order
          // console.log('Order status updated successfully');

          // Move the order to the "orders-completed" node
          const ordersCompletedRef = ref(db, "orders-completed"); // Reference to the "orders-completed" node
          const newOrderRef = push(ordersCompletedRef); // Create a new unique entry in "orders-completed"

          // Set the order data in the new reference
          set(newOrderRef, orderData)
            .then(() => {
              // console.log('Order moved to completed successfully');
              setOrderData((prevOrders) =>
                prevOrders.filter((order) => order.id !== orderId)
              ); // Remove the completed order from the state
            })
            .catch((error) => {
              console.error("Error moving order to completed: ", error);
            });
        }
        deleteOrder(orderId);
      })
      .catch((error) => {
        console.error("Error fetching order data: ", error);
      });
  };

  const deleteOrder = (orderId) => {
    const orderRef = ref(db, `orders-pending/${orderId}`); // Reference to the specific order by ID

    remove(orderRef)
      .then(() => {
        //console.log("Order removed successfully");
        // Optionally, update the state to remove the deleted order from UI
      })
      .catch((error) => {
        console.error("Error removing order: ", error);
      });
  };

  const toggleStoreOpen = () => {
    const orderRef = ref(db, `isOpen`);
    set(orderRef, !isOpen)
      .then((snapshot) => {
        //console.log("Updated isOpen successfully")
        setIsOpen(!isOpen);
      })
      .catch((error) => {
        console.error("Error updating isOpen: ", error);
      });

    //update("isOpen", !isOpen)
  };

  return (
    <>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Menu - UW Bothell Cafe</title>
        <link rel="stylesheet" href="../Stylesheets/homestyle.css" />
      </head>
      <body>
        <header>
          <div class="logo">
            <img src={logo} alt="UW Bothell Cafe Logo" />
          </div>
          <nav>
            <ul>
              <li class="signout" onClick={signout}>
                Sign Out
              </li>
            </ul>
          </nav>
        </header>
        <main>
          <section id="store-section" class="card-container">
            <div id="store-open-employee" class="card">
              <label>
                <input
                  id="store-open-input"
                  type="checkbox"
                  checked={isOpen}
                  onChange={toggleStoreOpen}
                />
                Is the Store Open?
              </label>
            </div>
            <section id="categories" class="card">
              <h2>Categories</h2>
              <ul>
                {console.log(categories)}
                {console.log(categoryIDs)}
                {categories.map((category, index1) => (
                  <>
                    <li
                      key={`category${index1}`}
                      class={`category ${
                        selectedCategory === index1 ? "active" : ""
                      }`}
                      onClick={() => changeCategory(index1)}
                    >
                      {category.categoryName}
                    </li>
                  </>
                ))}
                <button id="add-category-button" onClick={addCategory}>Add Category</button>
                {0 <= selectedCategory &&
                selectedCategory < categories.length &&
                1 < categories.length ? (
                  <button onClick={deleteCategory}>Delete Category</button>
                ) : (
                  <></>
                )}
                {0 <= selectedCategory &&
                selectedCategory < categories.length ? (
                  <button onClick={editCategory}>Rename Category</button>
                ) : (
                  <></>
                )}
                {0 <= selectedCategory &&
                selectedCategory < categories.length ? (
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => {
                      setNewCategoryName(e.target.value);
                    }}
                  />
                ) : (
                  <></>
                )}
              </ul>
            </section>
          </section>
          <section id="results" class="card">
            {/* Should be on same column but in a seperate card*/}
            {/* If there is a customer order, then parse throught array to output, else no pending orders */}
            <div id="soonest-order">
              {orderData.length ? (
                orderData.map((order, index) => (
                  <div key={order.id} className="order-card">
                    <p>
                      The next order is at:{" "}
                      {new Date(order.timestamp).toLocaleTimeString()}
                    </p>
                    {order.cartItems.map((item, itemIndex) => (
                      <p key={itemIndex}>
                        {item.quantity} x {item.item.itemName}
                      </p>
                    ))}
                    <p>Total: {order.totalAmount}</p>
                    <p>For: {order.userName}</p>
                    <button onClick={() => completeOrder(order.id)}>
                      Complete
                    </button>
                  </div>
                ))
              ) : (
                <p id="no-orders">No pending orders</p>
              )}
            </div>
            {renderResults()}
          </section>
        </main>
        <footer>
          <p>&copy; 2024 UW Bothell Cafe. All rights reserved.</p>
        </footer>
        <script src="../Scripts/homepage.js"></script>
      </body>
    </>
  );
}

export default EmployeeView;
