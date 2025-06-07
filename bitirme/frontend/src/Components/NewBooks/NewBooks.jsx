import React, { useState, useEffect } from "react";
import "./NewBooks.css";
import Item from "../Item/Item";
import all_books from "../Assets/all_book"

const NewBooks = () => {
  const [newBooks, setNewBooks] = useState([]);

  useEffect(() => {
  
    const newBooksData = all_books.filter((book) => book.isNew); 
    setNewBooks(newBooksData);
  }, []);

  return (
    <div className="new-books">
      <h1>NEW BOOKS</h1>
      <hr />
      <div className="books">
        {newBooks.length === 0 ? (
          <p>No new books available.</p> 
        ) : (
          newBooks.map((item, index) => (
            <Item
              key={item.id || `book-${index}`} 
              id={item.id}
              name={item.name}
              image={item.image}
              price={item.price}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NewBooks;

