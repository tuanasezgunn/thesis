import React from "react";
import "./Breadcrum.css";
import arrow_icon from "../Assets/breadcrum_arrow.png";
const Breadcrum = (props) => {
  const { product = {} } = props; 
  return (
    <div className="breadcrum">
      HOME <img src={arrow_icon} alt="" style={{ width: '50px', height: '50px' }}/> SHOP <img src={arrow_icon} alt=""style={{ width: '50px', height: '50px' }} />
      {product.category || "Category"} <img src={arrow_icon} alt=""style={{ width: '50px', height: '50px' }} /> {product.name || "Product"}
    </div>
  );
};
export default Breadcrum;