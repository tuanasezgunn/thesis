import React, { useState } from 'react';
import all_book from '../Assets/all_book';
import './AddBook.css';
import { useShopContext } from '../../Context/ShopContext';

const AddBook = () => {
  const { addNewBook, setBooks } = useShopContext();
  const [image, setImage] = useState(null);
  const [bookDetails, setBookDetails] = useState({
    name: '',
    category: 'shop',
    city: '',
    price: '',
    class: '',
    quantity: 1,
    image: '',
    description: '', 
  });
  
  const [successMessage, setSuccessMessage] = useState('');
  const [matchedImagePath, setMatchedImagePath] = useState('');

  const extractFileNameFromURL = (url) => {
    try {
      const parts = url.split('/');
      return parts[parts.length - 1].split('?')[0];
    } catch {
      return '';
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const selectedFileName = file.name;

      const matchedBook = all_book.find((book) => {
        const bookImageURL = book.image;
        const imageFileName = extractFileNameFromURL(bookImageURL);
        return imageFileName.startsWith(selectedFileName.split('.')[0]);
      });

      if (matchedBook) {
        setBookDetails((prev) => ({
          ...prev,
          name: matchedBook.name || prev.name,
          class: matchedBook.class || prev.class,
        }));
        setMatchedImagePath(matchedBook.image);
      } else {
        setMatchedImagePath('');
      }
    }
  };

const handleChange = (e) => {
  const { name, value, type } = e.target;
  setBookDetails((prev) => ({
    ...prev,
    [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value,
  }));
};

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const userInfo = JSON.parse(localStorage.getItem('user-info'));
    const sellerUsername = userInfo?.username;
    
    const existingBooks = JSON.parse(localStorage.getItem(`newBooks_${sellerUsername}`)) || [];
    
    const duplicateBook = existingBooks.find(
      (book) =>
        book.name.trim() === bookDetails.name.trim() &&
        book.price === bookDetails.price &&
        book.class.trim() === bookDetails.class.trim() &&
        book.city.trim() === bookDetails.city.trim()
    );

    
    if (duplicateBook) {
      alert('You have already added this book with the same details. If you have more than one, please use the quantity field.');
      return;
    }
    
    if (
  !bookDetails.name.trim() ||
  !bookDetails.class.trim() ||
  !bookDetails.city.trim() ||
  !bookDetails.description.trim() ||
  (bookDetails.price === '' || bookDetails.price === 0 || bookDetails.price === null || bookDetails.price === undefined)
) {
  alert('Please fill in all required fields.');
  return;
}

  
const storedBooks = JSON.parse(localStorage.getItem('all_book')) || [];

const allSources = [...storedBooks, ...all_book];

const matchedStoredBook = allSources.find(
  (book) => book.name.trim() === bookDetails.name.trim()
);

if (!matchedStoredBook) {
  alert('The book title does not exactly match any of the names in localStorage or all_book.js. Please enter the correct book title.');
  return;
}

if (matchedStoredBook.class.trim() !== bookDetails.class.trim()) {
  alert('The class does not match the book title. Please enter the correct class.');
  return;
}

  
    try {
      let imageURL = '';
  
      if (matchedImagePath) {
        imageURL = matchedImagePath;
      } else if (image) {
        const formData = new FormData();
        formData.append('image', image);
  
        const imageUploadResponse = await fetch('http://localhost:4000/upload', {
          method: 'POST',
          body: formData,
        });
  
        const responseData = await imageUploadResponse.json();
        if (!responseData.success) {
          alert('Image upload failed.');
          return;
        }
  
        imageURL = responseData.image_url;
      }
  
      const newBook = {
        id: Date.now(),
        ...bookDetails,
        image: imageURL,
      };
  
      addNewBook(newBook);
  
      await fetch('http://localhost:4000/allbooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBook),
      });
  
      const updatedBooks = JSON.parse(localStorage.getItem('all_book')) || [];
      setBooks(updatedBooks);
  
      setSuccessMessage('Book added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
  
      setBookDetails({
        name: '',
        category: 'shop',
        city: '',
        price: '',
        class: '',
        image: '',
      });
      setImage(null);
      setMatchedImagePath('');
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while adding the book.');
    }
  };
  
  

  return (
    <div className="add-book">
      {successMessage && <p className="success-message">{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div className="addbook-itemfield">
          <p>Product Title</p>
          <input
            value={bookDetails.name}
            onChange={handleChange}
            type="text"
            name="name"
            placeholder="Enter book title"
          />
        </div>

        <div className="addbook-itemfield">
          <p>Price (TL)</p>
          <input
            value={bookDetails.price}
            onChange={handleChange}
            type="number"
            name="price"
            placeholder="Enter price"
          />
        </div>

        <div className="addbook-itemfield">
          <p>Class</p>
          <input
            value={bookDetails.class}
            onChange={handleChange}
            type="text"
            name="class"
            placeholder="Enter class level"
          />
        </div>

        <div className="addbook-itemfield">
          <p>City</p>
          <input
            value={bookDetails.city}
            onChange={handleChange}
            type="text"
            name="city"
            placeholder="Enter city"
          />
        </div>
        <div className="addbook-itemfield">
  <p>Quantity</p>
  <input
    value={bookDetails.quantity}
    onChange={handleChange}
    type="number"
    name="quantity"
    min="1"
    placeholder="Enter quantity"
  />
</div>

  <div className="addbook-itemfield">
  <p>Description</p>
  <textarea
    value={bookDetails.description}
    onChange={handleChange}
    name="description"
    rows="4"
    placeholder="Enter details such as condition, any defects etc."
  />
</div>
        <div className="addbook-itemfield">
          <label htmlFor="file-input">
            {image || matchedImagePath ? (
              <img
                src={image ? URL.createObjectURL(image) : matchedImagePath}
                className="addbook-thumbnail-img"
                alt="Preview"
                style={{ width: '50px', height: 'auto', cursor: 'pointer' }}
              />
            ) : (
              <div
                className="upload-placeholder"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '120px',
                  height: '120px',
                  border: '1px dashed #ccc',
                  cursor: 'pointer',
                }}
              >
                Upload Image
              </div>
            )}
          </label>
          <input
            onChange={handleImageChange}
            type="file"
            name="image"
            id="file-input"
            hidden
          />
        </div>




 

        <button type="submit" className="addbook-btn">ADD</button>
      </form>
    </div>
  );
};

export default AddBook;
