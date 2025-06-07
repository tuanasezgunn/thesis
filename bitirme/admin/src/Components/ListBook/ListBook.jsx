import React, { useState, useEffect } from 'react';
import './ListBook.css';
import all_product from '../../assets/all_product'; 
import cross_icon from '../../assets/cross_icon.png';

const ListBook = () => {
    const [books, setBooks] = useState(all_product); 
   

    useEffect(() => {

    
    }, []); 

    const removeBook = async (id) => {
        try {
            const res = await fetch('http://localhost:4000/removeproduct', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            if (!res.ok) throw new Error('Failed to remove book');
            console.log(`Book with ID ${id} removed successfully`);

            // Kitabı local state'den kaldır
            setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
        } catch (error) {
            console.error('Error removing book:', error);
        }
    };

    return (
        <div className="list-book">
            <h1>All Book List</h1>
            <div className="listbook-format-main">
                <p>Books</p>
                <p>Title</p>
                <p>City</p>
                <p>Price</p>
                <p>Category</p>
                <p>Class</p>
                <p>Remove</p>
            </div>
            <div className="listbook-allbook">
                <hr />
                {books.length > 0 ? (
                    books.map((product) => (
                        <React.Fragment key={product.id}>
                            <div className="listbook-format-main listbook-format">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="listbook-book-icon"
                                />
                                <p>{product.name}</p>
                                <p>{product.city}</p>
                                <p>{product.price} TL</p>
                                <p>{product.category}</p>
                                <p>{product.class}</p>
                                <img
                                    onClick={() => removeBook(product.id)}
                                    className="listbook-remove-icon"
                                    src={cross_icon}
                                    style={{ width: '50px', height: '50px' }}
                                    alt="Remove"
                                />
                            </div>
                            <hr />
                        </React.Fragment>
                    ))
                ) : (
                    <p>No books available</p>
                )}
            </div>
        </div>
    );
};

export default ListBook;
