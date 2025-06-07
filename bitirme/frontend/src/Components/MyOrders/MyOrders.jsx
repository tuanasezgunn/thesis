import React, { useEffect, useState, useContext } from "react";
import { ShopContext } from "../../Context/ShopContext";
import Cross from "../Assets/cart_cross_icon.png";

const OrderList = () => {
  const { all_book, orders, setOrders, user, cartItems, totalAmount } = useContext(ShopContext);
  const [category, setCategory] = useState("all");

  const handleSuccess = async (cartItems, totalAmount) => {
    if (!user || !user.username) {
      console.error("No user logged in.");
      return;
    }

    const generateUniqueId = () => {
      return `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    };

    const orderItems = Object.entries(cartItems)
      .filter(([id, quantity]) => quantity > 0)
      .map(([bookId, quantity]) => {
        const book = all_book.find(book => book.id === Number(bookId));
        if (!book) return null;
        return {
          bookId: String(bookId),
          title: book.name,
          quantity,
          price: book.price,
        };
      })
      .filter(Boolean);

    const now = new Date();
    const formattedDate = now.toLocaleDateString("tr-TR") + " " + now.toLocaleTimeString("tr-TR");

    const order = {
      id: generateUniqueId(),
      username: user.username,
      items: orderItems,
      totalAmount: totalAmount,
      status: "success",
      date: formattedDate,
    };

    try {
      const res = await fetch('http://localhost:4000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      const data = await res.json();

      if (data.success) {
        console.log("Order successfully saved to MongoDB");

        const savedOrders = JSON.parse(localStorage.getItem(`orders_${user.username}`)) || [];
        savedOrders.push(order);
        localStorage.setItem(`orders_${user.username}`, JSON.stringify(savedOrders));
        setOrders(savedOrders);



      } else {
        console.error("Failed to save order to MongoDB");
      }
    } catch (err) {
      console.error("Error saving order to MongoDB:", err);
    }
  };

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem(`orders_${user?.username || "guest"}`));
    setOrders(storedOrders || []);
  }, [setOrders, user]);

  const completeOrder = () => {
    if (cartItems && totalAmount > 0) {
      handleSuccess(cartItems, totalAmount);
    } else {
      console.error("No items in the cart or invalid total amount");
    }
  };

  const getBookInfo = (bookId) => {
    return all_book.find((book) => book.id === Number(bookId));
  };
const handleCancelOrder = async (orderId) => {
  try {
    const response = await fetch(`http://localhost:4000/orders/cancel/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: "cancellations" }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to cancel order: ${errorText}`);
    }

    const data = await response.json();
    console.log("Order status updated:", data);

    // Backend'den başarı geldiyse local state ve localStorage'ı güncelleyelim:
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: "cancellations" } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem(`orders_${user?.username || "guest"}`, JSON.stringify(updatedOrders));

  } catch (err) {
    console.error("Error updating order status:", err);
  }
};


  return (
    <div>
      <h2>Orders</h2>

      <div className="order-categories" style={{ marginBottom: "20px" }}>
        {["all", "success", "cancellations"].map((cat) => (
          <button
            key={cat}
            className={`category-button ${category === cat ? "active" : ""}`}
            onClick={() => setCategory(cat)}
            style={{
              padding: "8px 12px",
              marginRight: "10px",
              background: category === cat ? "#333" : "#eee",
              color: category === cat ? "#fff" : "#000",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <button onClick={completeOrder}>Complete Order</button>

{orders.length > 0 ? (
  orders
    .filter(order => category === "all" || order.status === category)
    .map((order, index) => {
      const items = Array.isArray(order.items) ? order.items : [];
      return (
        <div key={index} style={{
          border: "1px solid #ddd", padding: "20px", borderRadius: "10px", position: "relative", marginBottom: "20px"
        }}>
          <img
            src={Cross}
            alt="Cancel"
            style={{
              position: "absolute", top: "10px", right: "10px", width: "20px", height: "20px", cursor: "pointer"
            }}
            onClick={() => handleCancelOrder(index)}
          />

          <p><strong>Date:</strong> {order.date}</p>
          <p><strong>Status:</strong> {order.status}</p>

          <div style={{
            display: "flex", gap: "20px", flexWrap: "wrap", marginTop: "10px"
          }}>
            {items.map(({ bookId, quantity }) => {
              const book = getBookInfo(bookId);
              if (!book || quantity === 0) return null;
              return (
                <div key={bookId} style={{
                  display: "flex", flexDirection: "column", alignItems: "center"
                }}>
                  <img
                    src={book.image}
                    alt={book.name}
                    style={{
                      width: "100px", height: "100px", objectFit: "cover", borderRadius: "10px"
                    }}
                  />
                  <p>{book.name}</p>
                  <p>{book.price * quantity} TL</p>
                </div>
              );
            })}
          </div>
        </div>
      );
    })
) : (
  <p>No orders available.</p>
)}

    </div>
  );
};

export default OrderList;
