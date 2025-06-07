import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../../Context/ShopContext";
import { AiOutlineStar, AiFillStar, AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import "./ProductDisplay.css";
import ReactMarkdown from "react-markdown";

const ProductDisplay = (props) => {
  const [rating, setRating] = useState(0);
  const [hoverStar, setHoverStar] = useState(undefined);
  const [ratings, setRatings] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [displayProduct, setDisplayProduct] = useState(null);
  const [user, setUser] = useState(null);
  const { addToCart, addToFavorites, removeFromFavorites, favorites } = useContext(ShopContext);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user-info"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    const allBooks = JSON.parse(localStorage.getItem("all_book"));
    const productId = props.product?.id || id;
    if (allBooks && productId) {
      const product = allBooks.find(book => String(book.id) === String(productId));
      setDisplayProduct(product);
    }
  }, [props.product, id]);

  const storageKey = displayProduct ? `product_${displayProduct.id}_ratings` : null;

  useEffect(() => {
    if (storageKey) {
      const savedRatings = localStorage.getItem(storageKey);
      if (savedRatings) {
        setRatings(JSON.parse(savedRatings));
      }
    }
  }, [storageKey]);

  useEffect(() => {
    if (storageKey && ratings.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(ratings));
    }
  }, [ratings, storageKey]);

  const calculateAverageRating = () => {
    if (ratings.length === 0) return 0;
    const total = ratings.reduce((sum, r) => sum + r, 0);
    return (total / ratings.length).toFixed(1);
  };

  const handleRatingClick = (index) => {
    const newRatings = [...ratings, index + 1];
    setRatings(newRatings);
  };

  const handleSizeClick = (size) => setSelectedSize(size);

  const handleAddToCart = () => {
    if (selectedSize && displayProduct) {
      addToCart(displayProduct.id, selectedSize);
    }
  };

  const toggleFavorite = () => {
    if (!displayProduct) return;
    if (favorites.some(item => item.id === displayProduct.id)) {
      removeFromFavorites(displayProduct.id);
    } else {
      addToFavorites(displayProduct);
    }
  };

  const handleChatClick = () => {
     if (!user) {
      alert("Please log in to chat with the seller.");
      return;
    }
    if (user.username === displayProduct?.sellerUsername) {
      alert("You cannot chat with your own product.");
      return;
    }
    if (!displayProduct?.sellerUsername) return;
    localStorage.setItem("sellerUsername", displayProduct.sellerUsername);
    window.location.href = "/chat";
  };

  if (!displayProduct) return <div>Ürün bilgisi yükleniyor...</div>;

  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-img">
          <img
            className="productdisplay-main-img"
            src={displayProduct.image}
            alt={displayProduct.name}
          />
        </div>
      </div>
 
      <div className="productdisplay-right">
        <div className="productdisplay-header">
          {displayProduct.name}
          <span className="favorite-icon" onClick={toggleFavorite}>
            {favorites.some(item => item.id === displayProduct.id) ? (
              <AiFillHeart style={{ color: "red" }} />
            ) : (
              <AiOutlineHeart style={{ color: "red" }} />
            )}
          </span>
        </div>
        <div className="productdisplay-description" style={{ marginBottom: "20px" }}>
  <strong>Description:</strong>
  <ReactMarkdown>{displayProduct.description || "No description available."}</ReactMarkdown>
</div>

        <div className="productdisplay-right-prices">
          <div>{displayProduct.price} TL</div>
        </div>

        <div className="seller-username" style={{ marginBottom: "10px", fontWeight: "bold" }}>
          SELLER: {displayProduct.sellerUsername || "Bilinmiyor"}
        </div>

        <div className="productdisplay-right-size">
          <h1>Select Number of Book</h1>
          <div className="productdisplay-right-sizes">
            {[...Array(10)].map((_, i) => {
              const size = i + 1;
              return (
                <div
                  key={size}
                  className={`size ${selectedSize === size ? "selected" : ""}`}
                  onClick={() => handleSizeClick(size)}
                >
                  {size}
                </div>
              );
            })}
          </div>
        </div>

        <button onClick={handleAddToCart}>ADD TO CART</button>

        <h1>Overall Rating: {calculateAverageRating()}/5</h1>
        <div className="rating">
          {[...Array(5)].map((_, index) => (
            <span
              key={index}
              onClick={() => handleRatingClick(index)}
              onMouseOver={() => setHoverStar(index + 1)}
              onMouseLeave={() => setHoverStar(undefined)}
            >
              {rating >= index + 1 || hoverStar >= index + 1 ? (
                <AiFillStar style={{ color: "orange" }} />
              ) : (
                <AiOutlineStar style={{ color: "orange" }} />
              )}
            </span>
          ))}
        </div>

        <button
          onClick={handleChatClick}
          className="chat-with-seller-btn"
          title={
            !user
              ? "Please log in to chat with the seller."
              : user.username === displayProduct?.sellerUsername
              ? "You cannot chat with your own product."
              : ""
          }
        >
          Chat with Seller
        </button>
      </div>
    </div>
  );
};

export default ProductDisplay;
