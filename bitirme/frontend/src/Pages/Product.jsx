import './CSS/Product.css'
import React, { useContext } from 'react';
import { ShopContext } from '../Context/ShopContext'; 
import { useParams } from 'react-router-dom';
import Breadcrum from '../Components/Breadcrum/Breadcrum';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';

const Product = (result) => {
  <section className="card-container">{result}</section>
  const { all_book } = useContext(ShopContext); 
  const { productID } = useParams();
  const product = all_book.find((e) => e.id === Number(productID));

  return (

    
      <div>
        <Breadcrum product={product} />
        <ProductDisplay product={product} />
        <DescriptionBox />
        <RelatedProducts />
      </div>

  );
};

export default Product;
