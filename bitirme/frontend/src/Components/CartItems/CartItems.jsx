import React, { useContext, useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import './CartItems.css';
import { ShopContext } from '../../Context/ShopContext';
import remove_icon from '../Assets/cart_cross_icon.png';
import Checkout from '../Checkout'; 
import SuccessPage from '../SuccessPage';
import AddressPage from '../AdressPage';

const CartItems = () => {
  const { getTotalCartAmount, all_book, cartItems, removeFromCart } = useContext(ShopContext);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const isLoggedIn = !!localStorage.getItem("auth-token");

  const handleCheckout = () => {
    const isEmptyCart = Object.keys(cartItems).length === 0 || Object.values(cartItems).every(item => item === 0);
  
    if (isEmptyCart) {
      alert("Your shopping cart is empty! You must add products first.");
    } else if (isLoggedIn) {
      navigate('/address');  
    } else {
      setShowModal(true); 
    }
  };

const handlePaymentSuccess = () => {
  handleSuccess(); 
};

  const handleSuccess = () => {
    console.log("handleSuccess called");  
    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const newOrder = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      items: cartItems,
      total: getTotalCartAmount(),
      recipient: JSON.parse(localStorage.getItem("user-info"))?.username || "Guest",
      status: "success",
    };
  
    const updatedOrders = [...existingOrders, newOrder];
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  
    navigate("/success");
  };
  
  return (
    <div className='cartitems'>
      <div className="cartitems-format-main">
        <p>Books</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {all_book.map((e) => {
        if (cartItems[e.id] > 0) {
          return (
            <div key={e.id}>
              <div className="cartitems-format cartitems-format-main">
                <img src={e.image} alt="" className='carticon-product-icon' />
                <p>{e.name}</p>
                <p>{e.price} TL</p>
                <button className='cartitems-quantity'>{cartItems[e.id]}</button>
                <p>{e.price * cartItems[e.id]} TL</p>
                <img
                  className='cartitems-remove-icon'
                  src={remove_icon}
                  alt=""
                  style={{ width: '50px', height: '50px' }}
                  onClick={() => { removeFromCart(e.id) }}
                />
              </div>
              <hr />
            </div>
          );
        }
        return null;
      })}
      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Totals</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>{getTotalCartAmount()} TL</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>{getTotalCartAmount()} TL</h3>
            </div>
          </div>
          <button onClick={handleCheckout}>PROCEED TO CHECKOUT</button> 
        </div>
        <div className="cartitems-promocode">
          <p>If you have a promo code, enter it here</p>
          <div className="cartitems-promobox">
            <input type="text" placeholder='promo code' />
            <button>Submit</button>
          </div>
        </div>
      </div>


      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>You are not logged in</h2>
            <p>Would you like to continue as a guest or log in?</p>
            <div className="modal-buttons">
              <button 
                className="login-button" 
                onClick={() => navigate('/login')}
              >
                LOGIN
              </button>
              <button 
                className="guest-button" 
                onClick={() => {
                  setShowModal(false);
                  navigate('/checkout');
                }}
              >
                CONTINUE AS GUEST
              </button>
            </div>
          </div>
        </div>
      )}

      <Routes>
        <Route path="/address" element={<AddressPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </div>
  );
}

export default CartItems;
