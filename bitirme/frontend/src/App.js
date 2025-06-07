import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Shop from './Pages/shop';
import ShopCategory from './Pages/ShopCategory';
import Product from "./Pages/Product";
import Cart from "./Pages/Cart";
import LoginSignup from "./Pages/LoginSignup";
import book_banner from './Components/Assets/banner_book.png';
import all_book from "./Components/Assets/all_book"; 
import Search from './Components/Search';
import Chat from './Chat';
import './styles.css';
import AddBook from './Components/AddBook/AddBook';
import ProductReview from "./Components/ProductReviews/ProductReview";
import Checkout from './Components/Checkout';
import SuccessPage from './Components/SuccessPage';
import ForgotPassword from './Pages/ForgotPassword';
import PasswordUpdate from './Pages/PasswordUpdate';
import UserInformation from './Components/UserInformation'
import MyOrders from './Components/MyOrders/MyOrders';
import ListItem  from './Pages/ListItem/ListItem';
import Favorites from './Components/Favorites/Favorites';
import AddressPage from './Components/AdressPage';

import { ShopContextProvider } from './Context/ShopContext';
function App() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [query, setQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState(all_book); 

  useEffect(() => {
    const results = all_book.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredItems(results);
  }, [query]);

  const handleChange = (event) => {
    setSelectedCategory(event.target.value);
  };


  const handleSendMsg = (msg) => {
    console.log("Message sent:", msg);

  };

  return (
    <Router>
      <ShopContextProvider>  
        <div className="App">
          <Navbar query={query} handleInputChange={(event) => setQuery(event.target.value)} />
          <div className="search-container">
            <div className="search-inner">
              <Search />
            </div>
          </div>

          <Routes>  
            <Route path="/" element={<Shop />} />
            <Route path="/book" element={<ShopCategory banner={book_banner} category="shop" filteredItems={filteredItems} />} />
            <Route path="/product" element={<Product />} />
            <Route path="/chat" element={<Chat handleSendMsg={handleSendMsg} />} />
            <Route path="/product/:productID/reviews" element={<ProductReview />} />
            <Route path="/product/:productID" element={<Product />} />
            <Route path="/cart/*" element={<Cart />} />

            <Route path="/login" element={<LoginSignup />} />
            <Route path="/addbook" element={<AddBook />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/passwordupdate" element={<PasswordUpdate />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/address" element={<AddressPage />} />
            <Route path="/userinformation" element={<UserInformation />} />
            <Route path="/listitem" element={<ListItem />} />
            <Route path="/myorders" element={<MyOrders />} />
            <Route path="/orders/all" element={<MyOrders />} />
            <Route path="/orders/ongoing" element={<MyOrders />} />
            <Route path="/orders/returns" element={<MyOrders />} />
            <Route path="/orders/cancellations" element={<MyOrders />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </div>
      </ShopContextProvider>
    </Router>
  );
}

export default App;