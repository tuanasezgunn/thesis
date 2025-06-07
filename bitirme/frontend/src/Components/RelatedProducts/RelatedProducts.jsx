import React from "react";
import "./RelatedProducts.css";
import all_book from "../Assets/all_book.js"; 
import Item from "../Item/Item";

const RelatedProducts = ({ productId }) => {
  /**

   * @param {Array} books 
   * @param {Number} count 
   * @param {Number} excludeId
   * @returns {Array} 
   */
  const getRandomBooks = (books, count, excludeId) => {
    const filteredBooks = books.filter((book) => book.id !== excludeId); 
    const shuffled = [...filteredBooks].sort(() => 0.5 - Math.random()); 
    return shuffled.slice(0, count); 
  };

  const randomBooks = getRandomBooks(all_book, 6, productId);

  return (
    <div className="relatedproducts">
      <h1>Related Products</h1>
      <hr />
      <div className="relatedproducts-items">
        {randomBooks.length > 0 ? (
          randomBooks.map((item) => (
            <Item
              key={item.id}
              id={item.id}
              name={item.name}
              image={item.image}
              price={item.price}
            />
          ))
        ) : (
          <p>No related books found.</p>
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;




