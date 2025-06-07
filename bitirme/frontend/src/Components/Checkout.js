import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";


const turkishNames = [
  "Ali", "Ayşe", "Mehmet", "Fatma", "Ahmet", "Zeynep", "Mustafa",
  "Hüseyin", "Emine", "Hasan", "Elif", "Murat", "Yusuf", "Hatice","Esin","Şebnem","Emin","Erkan","Bülent","Onur",
"Gürhan","Betül","Gülşah","Dionysis","Tacha","Mert","Cem","Tuana"
];

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalCartAmount, handleSuccess, clearCart } = useContext(ShopContext);
  const address = JSON.parse(localStorage.getItem("user-address"));

  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");

  const handlePayment = (e) => {
    e.preventDefault();

    const nameRegex = /^[a-zA-ZğüşöçİĞÜŞÖÇ\s]+$/;
    const cardNumberRegex = /^\d{11}$/;
    const expiryDateRegex = /^\d{2}\/\d{2}$/;
    const cvvRegex = /^\d{3}$/;

    if (!name) {
      alert("Cardholder Name is required.");
      return;
    }

    if (!nameRegex.test(name)) {
      alert("Cardholder Name must contain only letters.");
      return;
    }

    const nameWords = name.trim().split(" ");
    if (nameWords.length < 2 || !nameWords.every(w => /^[a-zA-ZğüşöçıİĞÜŞÖÇ]{2,}$/.test(w))) {
      alert("Lütfen geçerli bir isim ve soyisim girin (her kelime en az 2 harfli).");
      return;
    }

    const firstName = nameWords[0];
    const isValidFirstName = turkishNames.some(
      validName => validName.toLowerCase() === firstName.toLowerCase()
    );
    if (!isValidFirstName) {
      alert("Lütfen geçerli bir isim girin.");
      return;
    }

    if (!cardNumber) {
      alert("Card Number is required.");
      return;
    }

    if (!cardNumberRegex.test(cardNumber)) {
      alert("Card Number must be exactly 11 digits.");
      return;
    }

    if (!expiryDate) {
      alert("Expiry Date is required.");
      return;
    }

    if (!expiryDateRegex.test(expiryDate)) {
      alert("Expiry Date must be in MM/YY format.");
      return;
    }

    if (!cvv) {
      alert("CVV is required.");
      return;
    }

    if (!cvvRegex.test(cvv)) {
      alert("CVV must be exactly 3 digits.");
      return;
    }

    handleSuccess(cartItems, getTotalCartAmount());
    clearCart();
    navigate("/success");
  };

  
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); 
    if (value.length > 11) value = value.slice(0, 11); 
    setCardNumber(value);
  };


  const handleExpiryDateChange = (e) => {
    let value = e.target.value.replace(/[^\d]/g, ""); 
    if (value.length > 4) value = value.slice(0, 4); 

    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }
    setExpiryDate(value);
  };

 
  const handleCvvChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 3) value = value.slice(0, 3);
    setCvv(value);
  };

  return (
    <div>
      <h1>Payment Page</h1>
      <h3>Your Address Information:</h3>
      <p>{address?.fullName}</p>
      <p>{address?.street}</p>
      <p>{address?.city}, {address?.postalCode}</p>
      <p>{address?.country}</p>

      <form onSubmit={handlePayment}>
        <div>
          <label>Cardholder Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Card Number</label>
          <input
            type="text"
            value={cardNumber}
            onChange={handleCardNumberChange}
            maxLength={11}
            required
          />
        </div>
        <div>
          <label>Expiry Date (MM/YY)</label>
          <input
            type="text"
            value={expiryDate}
            onChange={handleExpiryDateChange}
            maxLength={5} // 2 rakam + '/' + 2 rakam
            placeholder="MM/YY"
            required
          />
        </div>
        <div>
          <label>CVV</label>
          <input
            type="text"
            value={cvv}
            onChange={handleCvvChange}
            maxLength={3}
            required
          />
        </div>
        <button type="submit">Complete Payment</button>
      </form>
    </div>
  );
};

export default Checkout;