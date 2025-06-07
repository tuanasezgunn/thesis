import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import { toast } from 'react-toastify';
import { useShopContext } from '../../Context/ShopContext';
import { useParams } from 'react-router-dom';

const ProductReview = ({ productID: propProductID }) => {
  const { user, setUser } = useShopContext();
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const { productID: routeProductID } = useParams();
  const [reviewProduct, setReviewProduct] = useState(null);

  const productID = propProductID || routeProductID;


  useEffect(() => {
    const savedUser = localStorage.getItem("user-info");
    if (savedUser && setUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
    }
  }, [setUser]);

  useEffect(() => {
    const allBooks = JSON.parse(localStorage.getItem("all_book"));
    if (allBooks && productID) {
      const product = allBooks.find(book => String(book.id) === String(productID));
      if (product) {
        setReviewProduct(product);
      }
    }
  }, [productID]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!productID) return;

      try {
        const res = await fetch(`http://localhost:4000/reviews/${productID}`);
        const data = await res.json();
        if (data.success) {
          setReviews(data.reviews);
          localStorage.setItem(`reviews_${productID}`, JSON.stringify(data.reviews));
        }
      } catch (err) {
        console.error("Yorumları çekerken hata:", err);
        const savedReviews = localStorage.getItem(`reviews_${productID}`);
        if (savedReviews) {
          setReviews(JSON.parse(savedReviews));
        }
      }
    };

    fetchReviews();
  }, [productID]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reviewText) {
      toast.error('Please write a review.');
      return;
    }

    const newReview = {
      text: reviewText,
      createdAt: new Date(),
      username: user?.username || 'Anonymous',
      productID: productID,
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem(`reviews_${productID}`, JSON.stringify(updatedReviews));

    try {
      const res = await fetch("http://localhost:4000/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReview),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Review added successfully!");
      } else {
        toast.error("Failed to save review to server.");
      }
    } catch (error) {
      console.error("MongoDB'ye yorum kaydedilirken hata:", error);
      toast.error("Failed to save review to server.");
    }

    setReviewText("");
  };

  return (
    <div className="review-page">
      <h2>Product Reviews</h2>

      <div>
        <h3>Add Your Review</h3>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="reviewText">Write your review here:</Label>
            <Input
              type="textarea"
              id="reviewText"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required
            />
          </FormGroup>
          <Button color="primary" type="submit">Submit Review</Button>
        </Form>
      </div>

      <div className="reviews-list mt-4">
        <h3>Reviews</h3>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((review, index) => (
            <div key={index} className="review mb-3 p-3 border rounded">
              <p>
                <strong>Reviewed by:</strong> {review.username} -{' '}
                {new Date(review.createdAt).toLocaleString()}
              </p>
              <p>{review.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductReview;
