import React, { useState, useEffect } from "react";
import FilterPanel from "./FilterPanel/FilterPanel";
import "./home.css";
import all_book from "../Assets/all_book";
import List from "../home/List/List";
import EmptyView from "../home/EmptyView"

const Home = () => {
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState([0, 1000]);
  const [list, setList] = useState(all_book);
  const [resultsFound, setResultsFound] = useState(true);
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

  const handleSelectRating = (event, value) => 
    !value ? null : setSelectedRating(value);

  const handleChangeChecked = (id) => {
    const updatedClassFilters = classFilters.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setClassFilters(updatedClassFilters);
  };

  const handleChangePrice = (event, value) => {
    setSelectedPrice(value);
  };

  const handleCityChecked = (id) => {
    const updatedCityFilters = cityFilters.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setCityFilters(updatedCityFilters);
  };

  const applyFilters = () => {
    let updatedList = all_book;


    if (selectedRating) {
      updatedList = updatedList.filter(
        (item) => parseInt(item.rating) === parseInt(selectedRating)
      );
    }

 
    const minPrice = selectedPrice[0];
    const maxPrice = selectedPrice[1];
    updatedList = updatedList.filter(
      (item) => item.price >= minPrice && item.price <= maxPrice
    );

  
    const classChecked = classFilters
      .filter((item) => item.checked)
      .map((item) => item.label);

    if (classChecked.length) {
      updatedList = updatedList.filter((item) =>
        classChecked.includes(item.class)
      );
    }


    const cityChecked = cityFilters
      .filter((item) => item.checked)
      .map((item) => item.label);

    if (cityChecked.length) {
      updatedList = updatedList.filter((item) =>
        cityChecked.includes(item.city)
      );
    }

    setList(updatedList);
    setResultsFound(updatedList.length > 0);
  };

  useEffect(() => {
    applyFilters();
  }, [selectedRating, selectedPrice, classFilters, cityFilters]);

  return (
    <div className="home">
      <div className="home_panelist-wrap">
        <FilterPanel
          selectRating={handleSelectRating}
          selectedRating={selectedRating}
          selectedPrice={selectedPrice}
          classFilters={classFilters}
          changeChecked={handleChangeChecked}
          changePrice={handleChangePrice}
          cityFilters={cityFilters}
          handleCityChecked={handleCityChecked}
        />
      </div>

     
    </div>
  );
};

export default Home;


