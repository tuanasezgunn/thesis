import { useEffect, useContext } from "react";
import { Link } from "react-router-dom"; 
import { ShopContext } from "../Context/ShopContext";
import "./SuccessPage.css";

export default function SuccessPage() {
  const { clearCart } = useContext(ShopContext);

  useEffect(() => {
    console.log("SuccessPage loaded, clearing cart...");
    clearCart();

    setTimeout(() => {
      console.log("After timeout, cart:", localStorage.getItem("cart"));
    }, 100);
  }, []); 

  return (
    <div>
      <h1>Thank you for the purchase 🎉</h1>
      <p>We will proceed with your payment and send a confirmation.</p>
      <Link className="link" to="/">Go Back Home</Link>
    </div>
  );
}
