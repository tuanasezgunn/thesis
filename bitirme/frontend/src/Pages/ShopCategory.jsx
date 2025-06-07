import React, { useContext, useState, useEffect } from 'react';
import './CSS/ShopCategory.css';
import { ShopContext } from '../Context/ShopContext';
import Item from '../Components/Item/Item.jsx';
import FilterPanel from '../Components/home/FilterPanel/FilterPanel.jsx';

const ShopCategory = (props) => {
  const { all_book, setAllBooks } = useContext(ShopContext);  

  const [sortedBooks, setSortedBooks] = useState(all_book);
  const [selectedRating, setSelectedRating] = useState(null);  
  const [selectedPrice, setSelectedPrice] = useState([0, 1000]);
  const [classFilters, setClassFilters] = useState([
    { id: 1, checked: false, label: "1st class" },
    { id: 2, checked: false, label: "2nd class" },
    { id: 3, checked: false, label: "3rd class" },
    { id: 4, checked: false, label: "4th class" },
  ]);

  const [cityFilters, setCityFilters] = useState([
    { id: 1, checked: false, label: "Istanbul" },
    { id: 2, checked: false, label: "Ankara" },
    { id: 3, checked: false, label: "Izmir" },
    { id: 4, checked: false, label: "Other" },
  ]);

  const handleSelectRating = (value) => {
    setSelectedRating(value ? value : null);  
  };

  const handleChangeChecked = (id) => {
    const updatedClassFilters = classFilters.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setClassFilters(updatedClassFilters);
  };

  const handleCityChecked = (id) => {
    const updatedCityFilters = cityFilters.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setCityFilters(updatedCityFilters);
  };

  const handleChangePrice = (event, value) => {
    setSelectedPrice(value);
  };

  const handleSortChange = (e) => {
    const sortBy = e.target.value;
    let sortedData = [...sortedBooks];
    switch (sortBy) {
      case "price-asc":
        sortedData.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sortedData.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        sortedData.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        sortedData.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    setSortedBooks(sortedData);
  };

  const applyFilters = () => {
    let updatedList = [...all_book];  

    const [minPrice, maxPrice] = selectedPrice;
    updatedList = updatedList.filter(
      (item) => item.price >= minPrice && item.price <= maxPrice
    );

    const classChecked = classFilters
      .filter((item) => item.checked)
      .map((item) => item.label);
    if (classChecked.length > 0) {
      updatedList = updatedList.filter((item) =>
        classChecked.includes(item.class)
      );
    }

    const cityChecked = cityFilters
      .filter((item) => item.checked)
      .map((item) => item.label);
    if (cityChecked.length > 0) {
      updatedList = updatedList.filter((item) =>
        cityChecked.includes(item.city)
      );
    }

    if (selectedRating !== null && selectedRating.length !== 0) {
      updatedList = updatedList.filter(
        (item) => parseInt(item.rating) === parseInt(selectedRating)
      );
    }

    setSortedBooks(updatedList);  
  };

  useEffect(() => {
    applyFilters();  
  }, [selectedRating, selectedPrice, classFilters, cityFilters, all_book]); 
  return (
    <div className="shop-category">
      <img className="shopcategory-banner" src={props.banner} alt="" />
      <div className="shopcategory-indexSort">
        <p>
          <span>Showing {sortedBooks.length} </span> out of {all_book.length} books
        </p>
        <div className="shopcategory-sort">
          <select onChange={handleSortChange} className="select-filter" defaultValue="">
            <option value="">Sort by</option>
            <option value="price-asc">Cheap to Expensive</option>
            <option value="price-desc">Expensive to Cheap</option>
            <option value="name-asc">Name A to Z</option>
            <option value="name-desc">Name Z to A</option>
          </select>
        </div>
      </div>

      <div className="shopcategory-container">
        <div className="shopcategory-filterpanel">
          <FilterPanel
            selectRating={(r) => handleSelectRating(r)}
            selectedRating={selectedRating}
            selectedPrice={selectedPrice}
            classFilters={classFilters}
            changeChecked={handleChangeChecked}
            changePrice={handleChangePrice}
            cityFilters={cityFilters}
            handleCityChecked={handleCityChecked}
          />
        </div>

        <div className="shopcategory-products">
          {sortedBooks.length > 0 ? (
            sortedBooks.map((item, i) => (
              <Item key={i} id={item.id} name={item.name} image={item.image} price={item.price} />
            ))
          ) : (
            all_book.map((item, i) => (
              <Item key={i} id={item.id} name={item.name} image={item.image} price={item.price} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopCategory;
