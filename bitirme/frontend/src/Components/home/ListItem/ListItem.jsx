import React from "react";


const ListItem = ({
  item: { name, category, city, rating, image, price, link },
}) => (
  <div className="listItem-wrap">
    <img src={image} alt={name} />
    <header>
      <h4>{name}</h4>
      <span>🌟 {rating}</span>
    </header>
    <footer>
      <p>
        <b>{category}</b> <span> | {city}</span>
      </p>
      <p>
        <b>{price} TL</b>
      </p>
      <a href={link} target="_blank" rel="noopener noreferrer">
        View Details
      </a>
    </footer>
  </div>
);

export default ListItem;
