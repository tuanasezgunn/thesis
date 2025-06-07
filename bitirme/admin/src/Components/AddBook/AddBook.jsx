import React, { useState } from 'react';
import './AddBook.css';
import upload_area from '../../assets/upload_area.svg';

const AddBook = () => {
    const [image, setImage] = useState(null);
    const [bookDetails, setBookDetails] = useState({
        name: "",
        image: "",
        category: "Book",
        price: "",
        class: ""
    });
    const [isLoading, setIsLoading] = useState(false);

    const imageHandler = (e) => {
        setImage(e.target.files[0]);
    };

    const changeHandler = (e) => {
        setBookDetails({ ...bookDetails, [e.target.name]: e.target.value });
    };

    const Add_Book = async () => {
        setIsLoading(true);
        try {
            if (!image) {
                alert("Please upload an image.");
                setIsLoading(false);
                return;
            }

            let formData = new FormData();
            formData.append('product', image);

         
            const imageUploadResponse = await fetch('http://localhost:4000/upload', {
                method: 'POST',
                body: formData,
            });

            if (!imageUploadResponse.ok) {
                throw new Error('Image upload failed');
            }

            const imageResponseData = await imageUploadResponse.json();

            if (!imageResponseData.success) {
                alert("Image upload failed");
                setIsLoading(false);
                return;
            }

            const book = { ...bookDetails, image: imageResponseData.image_url };

            // Add book request
            const addBookResponse = await fetch('http://localhost:4000/addproduct', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(book),
            });

            const addBookData = await addBookResponse.json();

            if (addBookData.success) {
                alert("Book added successfully!");
                setBookDetails({ name: "", image: "", category: "Book", price: "", class: "" });
                setImage(null);
            } else {
                alert("Failed to add book.");
            }
        } catch (error) {
            console.error('Error:', error);
            alert("An error occurred while adding the book.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="add-book">
            <div className="addbook-itemfield">
                <p>Product Title</p>
                <input
                    value={bookDetails.name}
                    onChange={changeHandler}
                    type="text"
                    name="name"
                    placeholder="Type here"
                />
            </div>

 
            <div className="addbook-class">
                <div className="addbook-itemfield">
                    <p>Class</p>
                    <input
                        value={bookDetails.class}
                        onChange={changeHandler}
                        type="text"
                        name="class"
                        placeholder="Type here"
                    />
                </div>
            </div>

            <div className="addbook-price">
                <div className="addbook-itemfield">
                    <p>Price</p>
                    <input
                        value={bookDetails.price}
                        onChange={changeHandler}
                        type="text"
                        name="price"
                        placeholder="Type here"
                    />
                </div>
            </div>

            <div className="addbook-itemfield">
                <p>Book Category</p>
                <select
                    value={bookDetails.category}
                    onChange={changeHandler}
                    name="category"
                    className="add-book-selector"
                >
                    <option value="Book">Book</option>
                </select>
            </div>

            <div className="addbook-itemfield">
                <label htmlFor="file-input">
                    <img
                        src={image ? URL.createObjectURL(image) : upload_area}
                        className="addbook-thumbnail-img"
                        alt="Thumbnail preview"
                        style={{ width: '50px', height: 'auto' }}
                    />
                </label>
            </div>
            <input
                onChange={imageHandler}
                type="file"
                name="image"
                id="file-input"
                hidden
            />

            <button
                onClick={Add_Book}
                className="addbook-btn"
                disabled={isLoading}
            >
                {isLoading ? 'Adding...' : 'ADD'}
            </button>
        </div>
    );
};

export default AddBook;


