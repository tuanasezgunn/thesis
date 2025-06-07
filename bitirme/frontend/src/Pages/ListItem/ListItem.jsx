import React, { useEffect, useState } from "react";
import { useShopContext } from "../../Context/ShopContext";

const BookList = () => {
  const { newBooks, user } = useShopContext();
  const [booksLoaded, setBooksLoaded] = useState(false);

  useEffect(() => {
    if (user) {
      // User bilgisi yüklendiyse, books verisinin de yüklenmesini bekliyoruz
      setBooksLoaded(true);
    }
  }, [user]);

  useEffect(() => {
    console.log("New Books:", newBooks);
  }, [newBooks]);

  const shouldShowEmptyMessage = !user || newBooks.length === 0;

  return (
    <div>
      <h2>Recently Added Books</h2>
      {shouldShowEmptyMessage && !booksLoaded ? (
        <p>Loading books...</p> // Giriş yapmadıysa ve kitaplar yüklenmemişse
      ) : (
        <ul>
          {newBooks.length === 0 ? (
            <p>No books added yet.</p> // Kitaplar yoksa
          ) : (
            newBooks.map((book, index) => (
              <li key={index}>
                <img src={book.image} alt={book.name} width="100" height="100" />
                <p>{book.name} - {book.price}tl</p>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default BookList;
