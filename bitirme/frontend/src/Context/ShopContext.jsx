import React, { useState, createContext, useContext, useEffect } from "react";
import all_book from "../Components/Assets/all_book";


export const ShopContext = createContext(null);

const getDefaultCart = () => {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    return JSON.parse(savedCart);
  }
  let cart = {};
  for (let index = 0; index <= 300; index++) {
    cart[index] = 0;
  }
  return cart;
};

export const ShopContextProvider = (props) => {
  const [Books, setBooks] = useState(all_book);
  const [newBooks, setNewBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cartItems, setCartItems] = useState(getDefaultCart());
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [productID, setProductID] = useState(null);
  const [sellerUsername, setSellerUsername] = useState(""); 
  
const [allBooks, setAllBooks] = useState([]);

  const [ratings, setRatings] = useState(() => {
    const savedRatings = localStorage.getItem("ratings");
    return savedRatings ? JSON.parse(savedRatings) : {};
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("user-info");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
    }
  }, []);
  useEffect(() => {
    const savedSeller = localStorage.getItem("sellerUsername");
    if (savedSeller) {
      setSellerUsername(savedSeller);
}}, []);
  useEffect(() => {
    if (user) {
      const savedFavorites = localStorage.getItem(`favorites_${user.username}`);
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      } else {
        setFavorites([]);
      }


      const savedNewBooks = localStorage.getItem(`newBooks_${user.username}`);
      if (savedNewBooks) {
        setNewBooks(JSON.parse(savedNewBooks));
      } else {
        setNewBooks([]);
      }

      const savedOrders = localStorage.getItem(`orders_${user.username}`);
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      } else {
        setOrders([]);
      }
    } else {
      setOrders([]);
    }
  }, [user]);

useEffect(() => {
  fetch("http://localhost:4000/allusers")
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        localStorage.setItem("all_users", JSON.stringify(data.users));
        console.log("Tüm kullanıcılar:", data.users);
      }
    })
    .catch((err) => {
      console.error("Kullanıcılar alınamadı:", err);
    });
}, []);



useEffect(() => {
  const allBooks = JSON.parse(localStorage.getItem('all_book')) || [];

  fetch('http://localhost:4000/allbooks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
     credentials: 'include',
    body: JSON.stringify(allBooks),
  })
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
}, []);  

useEffect(() => {
  fetch('http://localhost:4000/allbooks', {
    method: 'GET',
    credentials: 'include',
  })
    .then(res => res.json())
    .then(data => {
      setAllBooks(data); 
    })
    .catch(err => console.error('Kitapları çekerken hata:', err));
}, []);

useEffect(() => {
  if (orders.length === 0) return;

  const lastOrder = orders[orders.length - 1];

  console.log('Gönderilen order id:', lastOrder.id);

  fetch('http://localhost:4000/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(lastOrder),
  })
    .then(res => res.json())
    .then(data => {
      console.log('Order saved:', data);
    })
    .catch(err => console.error('Error saving order:', err));
}, [orders]);
;
 const handleCancelOrder = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:4000/orders/cancel/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancellations" }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to cancel order: ${errorText}`);
      }

      const data = await response.json();
      console.log("Order status updated:", data);

      const updatedOrders = orders.map((order) =>
        order.id === orderId ? { ...order, status: "cancellations" } : order
      );
      setOrders(updatedOrders);
      localStorage.setItem(`orders_${user.username}`, JSON.stringify(updatedOrders));
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };
useEffect(() => {
  const sendAllFavoritesToBackend = async () => {

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key.startsWith("favorites_")) {
        const username = key.replace("favorites_", "");
        const favorites = JSON.parse(localStorage.getItem(key));

        if (!favorites || favorites.length === 0) continue;

        for (const favorite of favorites) {
          try {
          
            const favoriteToSend = {
              ...favorite,
              username,
              bookClass: favorite.class,
            };
            delete favoriteToSend.class;

            const response = await fetch("http://localhost:4000/favorites", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(favoriteToSend),
            });

            const result = await response.json();
            console.log(`Favori (${username}) yanıt:`, result);
          } catch (error) {
            console.error(`Favori gönderilemedi (${username}):`, error);
          }
        }
      }
    }
  };

  sendAllFavoritesToBackend();
}, []);
useEffect(() => {
  const sendAllNewBooksToBackend = async () => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key.startsWith("newBooks_")) {
        const username = key.replace("newBooks_", "");
        const books = JSON.parse(localStorage.getItem(key));

        if (!books || books.length === 0) continue;

        for (const book of books) {
          try {
            const bookToSend = {
              ...book,
              sellerUsername: username,  // Backend'de sellerUsername bekliyor
              bookClass: book.class,      // Eğer backend'de "class" yerine bookClass kullanıyorsan
            };
            delete bookToSend.class;

            const response = await fetch("http://localhost:4000/newbooks", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(bookToSend),
            });

            const result = await response.json();
            console.log(`Kitap (${username}) yanıt:`, result);
          } catch (error) {
            console.error(`Kitap gönderilemedi (${username}):`, error);
          }
        }
      }
    }
  };

  sendAllNewBooksToBackend();
}, []);


useEffect(() => {
    if (!user || productID === null) return;

    const savedReviews = localStorage.getItem(`reviews_${productID}`);
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    } else {
      setReviews([]);
    }
  }, [user, productID]);

  useEffect(() => {
    const savedBooks = localStorage.getItem("all_book");
    const allBooks = savedBooks ? JSON.parse(savedBooks) : [];

    setBooks(allBooks); 
  }, []);

  useEffect(() => {
    const savedSeller = localStorage.getItem("sellerUsername");
    if (savedSeller) {
      setSellerUsername(savedSeller);
    }
  }, []);



  const updateSellerUsername = (newUsername) => {
    setSellerUsername(newUsername);
    localStorage.setItem("sellerUsername", newUsername);  
  };


  useEffect(() => {
    if (user && user.username) {
      const savedNewBooks = localStorage.getItem(`newBooks_${user.username}`);
      if (savedNewBooks) {
        const parsedBooks = JSON.parse(savedNewBooks);
        setNewBooks(parsedBooks);

        if (parsedBooks.length > 0 && parsedBooks[0].sellerUsername) {
          setSellerUsername(parsedBooks[0].sellerUsername);
        }
      } else {
        setNewBooks([]);
        setSellerUsername(""); 
      }
    }
  }, [user]);

  const addNewBook = (book) => {
    if (!user) return;
  

    const allBooks = [...Books, ...newBooks];
  

    const maxId = allBooks.reduce((max, b) => (b.id > max ? b.id : max), 0);
    const newBookWithId = {
      ...book,
      id: maxId + 1,  
      ratings: [],
      sellerUsername: user.username,
      
    };
  
    console.log("Kullanıcı adı:", user.username);

    setNewBooks((prevNewBooks) => {
      const updatedNewBooks = [...prevNewBooks, newBookWithId];
      localStorage.setItem(
        `newBooks_${user.username}`,
        JSON.stringify(updatedNewBooks)
      );
      return updatedNewBooks;
    });
  
  
    setBooks((prevBooks) => {
      const updatedBooks = [...prevBooks, newBookWithId];
      localStorage.setItem("all_book", JSON.stringify(updatedBooks)); 
      return updatedBooks;
    });
  };
  
  

  const addToFavorites = (product) => {
    if (!user) return;
    setFavorites((prevFavorites) => {
      if (!prevFavorites.find((item) => item.id === product.id)) {
        const updatedFavorites = [...prevFavorites, product];
        localStorage.setItem(
          `favorites_${user.username}`,
          JSON.stringify(updatedFavorites)
        );
        return updatedFavorites;
      }
      return prevFavorites;
    });
  };

  const removeFromFavorites = (productId) => {
    if (!user) return;
    setFavorites((prevFavorites) => {
      const updatedFavorites = prevFavorites.filter(
        (item) => item.id !== productId
      );
      localStorage.setItem(
        `favorites_${user.username}`,
        JSON.stringify(updatedFavorites)
      );
      return updatedFavorites;
    });
  };

  const addToReviews = (productID, reviewText) => {
    if (!user) return;
    const allBooks = JSON.parse(localStorage.getItem("all_book")) || [];
    const book = allBooks.find((b) => b.id === productID);
    if (!book) return;

    const newReview = {
      productID,
      reviewText,
      username: user.username,
      createdAt: new Date().toISOString(),
    };

    setReviews((prevReviews) => {
      const updatedReviews = [...prevReviews, newReview];
      localStorage.setItem(
        `reviews_${productID}`,
        JSON.stringify(updatedReviews)
      );
      return updatedReviews;
    });
  };

  const removeFromReviews = (productID) => {
    if (!user) return;
    setReviews((prevReviews) => {
      const updatedReviews = prevReviews.filter(
        (review) => review.bookId !== productID
      );
      localStorage.setItem(
        `reviews_${productID}`,
        JSON.stringify(updatedReviews)
      );
      return updatedReviews;
    });
  };

  const addToCart = (productID, quantity = 1) => {
    setCartItems((prevItems) => {
      const updatedCart = {
        ...prevItems,
        [productID]: (prevItems[productID] || 0) + quantity,
      };
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const removeFromCart = (productID) => {
    setCartItems((prevItems) => {
      const updatedCart = {
        ...prevItems,
        [productID]: Math.max((prevItems[productID] || 0) - 1, 0),
      };
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const clearCart = () => {
    const defaultCart = {};
    Object.keys(cartItems).forEach((key) => {
      defaultCart[key] = 0;
    });
    setCartItems(defaultCart);
    localStorage.setItem("cart", JSON.stringify(defaultCart));
  };

  const getTotalCartAmount = () => {
    return Object.keys(cartItems).reduce((totalAmount, item) => {
      if (cartItems[item] > 0) {
        const itemInfo = Books.find((product) => product.id === Number(item));
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
      return totalAmount;
    }, 0);
  };

  const handleSuccess = (cartItems, totalAmount) => {
    if (
      !cartItems ||
      Object.values(cartItems).every((qty) => qty === 0) ||
      totalAmount <= 0
    ) {
      console.error("No valid items in cart or invalid total amount.");
      return;
    }

    const order = {
      id: Date.now(),
      items: Object.entries(cartItems)
        .filter(([id, quantity]) => quantity > 0)
        .map(([bookId, quantity]) => ({ bookId: Number(bookId), quantity })),
      totalAmount,
      date: new Date().toLocaleString(),
      username: user?.username || "Guest",
      status: "success",
    };

    const savedOrders =
      JSON.parse(localStorage.getItem(`orders_${user.username}`)) || [];
    savedOrders.push(order);
    localStorage.setItem(
      `orders_${user.username}`,
      JSON.stringify(savedOrders)
    );
  };

  const getTotalCartItems = () =>
    Object.values(cartItems).reduce((total, qty) => total + qty, 0);

const contextValue = {
  user,
  setUser,
  getTotalCartItems,
  getTotalCartAmount,
  all_book: Books,
  newBooks,
  addNewBook,
  setBooks,
cartItems,
  addToCart,
  removeFromCart,
  handleSuccess,
  orders,
  clearCart,
  favorites,
  addToFavorites,
  setFavorites,
  removeFromFavorites,
  addToReviews,
  removeFromReviews,
   handleCancelOrder,
  sellerUsername,
  setSellerUsername: updateSellerUsername,
  setOrders,
};

  return (
    <ShopContext.Provider value={{ ...contextValue, productID, setProductID }}>
      {props.children}
    </ShopContext.Provider>
  );
};


export const useShopContext = () => {
  return useContext(ShopContext);
};

export default ShopContextProvider;