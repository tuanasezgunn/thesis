import React, { useState } from 'react';
import './Search.css';
import all_book from './Assets/all_book';

function Search() {
  const [value, setValue] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);

  const onChange = (event) => {
    setValue(event.target.value);
    const results = all_book.filter(item => 
      item.name.toLowerCase().startsWith(event.target.value.toLowerCase())
    );
    setFilteredItems(results.slice(0, 10));
  };

  const onSearch = (searchTerm) => {
    console.log("search", searchTerm);
    const results = all_book.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(results);
  };

  return (
    <div className="search-container">
      <div className="search-inner">
        <input type="text" value={value} onChange={onChange} />
        <button onClick={() => onSearch(value)}>Search</button>
      </div>
      {value && (
        <div className='dropdown'>
          {filteredItems.map((item) => (
            <div
              onClick={() => onSearch(item.name)}
              key={item.id}
              className='dropdown-row'
            >
              <a className="dataItem" href={`/product/${item.id}`} target="_blank" rel="noopener noreferrer">
                {item.name}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;




