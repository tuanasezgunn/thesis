import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../Context/ShopContext";
import "./Favorites.css";
const removeDuplicateFavorites = (favoritesList) => {
  const uniqueMap = new Map();
  favoritesList.forEach((item) => {
    if (!uniqueMap.has(item.id)) {
      uniqueMap.set(item.id, item);
    }
  });
  return Array.from(uniqueMap.values());
};

const Favorites = () => {
  const { favorites, setFavorites, removeFromFavorites, user, setUser } = useContext(ShopContext);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user-info");
    if (savedUser && setUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
    }
  }, [setUser]);

  useEffect(() => {
  if (!user || !setFavorites) return;

  const fetchFavorites = async () => {
    try {
      const savedFavorites = localStorage.getItem(`favorites_${user.username}`);

      if (savedFavorites) {
        const cleanFavorites = removeDuplicateFavorites(JSON.parse(savedFavorites));
        setFavorites(cleanFavorites);
        setIsLoaded(true);
      } else {
        const res = await fetch(`http://localhost:4000/favorites`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: user.username }),
        });
        const data = await res.json();

        if (data.success) {
          const cleanFavorites = removeDuplicateFavorites(data.favorites);
          setFavorites(cleanFavorites);
          localStorage.setItem(`favorites_${user.username}`, JSON.stringify(cleanFavorites));
        }
        setIsLoaded(true);
      }
    } catch (err) {
      console.error("Favoriler alınırken hata oluştu:", err);
      setIsLoaded(true);
    }
  };

  fetchFavorites();
}, [user, setFavorites]);


  const handleRemoveFromFavorites = (itemId) => {
    if (!favorites) return;
    const updatedFavorites = favorites.filter((item) => item.id !== itemId);
    setFavorites(updatedFavorites);
    localStorage.setItem(`favorites_${user?.username || "guest"}`, JSON.stringify(updatedFavorites));
    removeFromFavorites(itemId);
  };

  return (
    <div className="favorites-container">
      <h1>Favorites</h1>
      {!isLoaded ? (
        <p>Loading favorites...</p>
      ) : favorites.length === 0 ? (
        <p>There are no products in your favorite list.</p>
      ) : (
        <div className="favorites-grid">
       {favorites.map((item, index) => (
  <div key={`${item.id}-${index}`} className="favorite-item">

              <img src={item.image} alt={item.name} className="favorite-item-image" />
              <div className="favorite-item-info">
                <h3>{item.name}</h3>
                <p>{item.price} TL</p>
                <button
                  className="remove-favorite-btn"
                  onClick={() => handleRemoveFromFavorites(item.id)}
                >
                  Remove from Favorites
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
