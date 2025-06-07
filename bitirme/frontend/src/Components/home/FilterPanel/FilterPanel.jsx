import React from 'react';
import { ratingList } from '../../Assets/all_book';
import './FilterPanel.css';
import FilterListToggle from '../FilterListToggle/FilterListToggle';
import CheckboxButton from '../Checkbox/Checkbox';
import Slider from '../Slider/Slider';

const FilterPanel = ({
  selectedRating,
  selectedPrice,
  selectRating,
  changeChecked,
  classFilters,
  cityFilters, 
  handleCityChecked,
  changePrice,
}) => {
  return (
    <div>
      <h1>Filter Panel</h1>

      <div className="input-group">
        <p className="label">Star Rating</p>
        <FilterListToggle
          options={ratingList}
          value={selectedRating}
          selectToggle={(event,val)=>selectRating(val)}
        />
      </div>

      <div className="input-group">
        <p className="label">Price</p>
        <Slider value={selectedPrice} changePrice={changePrice} />
      </div>

      <div className="input-group">
        <p className="label">Class</p>
        {classFilters.map((item) => (
          <CheckboxButton key={item.id} item={item} changeChecked={changeChecked} />
        ))}
      </div>

      <div className="input-group">
        <p className="label">City</p>
        {cityFilters.map((item) => (
          <CheckboxButton
            key={item.id}
            item={item}
            changeChecked={handleCityChecked}  
          />
        ))}
      </div>
    </div>
  );
};

export default FilterPanel;




