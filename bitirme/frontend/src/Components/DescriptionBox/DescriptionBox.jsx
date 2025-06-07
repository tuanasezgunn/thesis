import React from 'react';
import './DescriptionBox.css';
import ProductReview from '../ProductReviews/ProductReview';

const DescriptionBox = ({ token }) => {
  return (
    <div className='descriptionbox'>
      <div className="descriptionbox-navigator">
        <span className="descriptionbox-nav-box active">
          Reviews About Book
        </span>
      </div>

      <div className="descriptionbox-description">
        <ProductReview token={token} />
      </div>
    </div>
  );
};

export default DescriptionBox;
