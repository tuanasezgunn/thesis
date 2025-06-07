import React, { useState, useEffect } from 'react';
import axios from 'axios';

function KitapListesi() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/allbooks`)
      .then(response => {
        setBooks(response.data);  
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p>Hata: {error}</p>;

  return (
    <div>
      <h2>Kitap Listesi</h2>
      <ul>
        {books.map(book => (
          <li key={book._id} style={{marginBottom: '20px'}}>
            <h3>{book.name}</h3>
            <img 
              src={book.image} 
              alt={book.name} 
              style={{width: '150px', height: 'auto'}}
            />
            <p>Kategori: {book.category}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default KitapListesi;
