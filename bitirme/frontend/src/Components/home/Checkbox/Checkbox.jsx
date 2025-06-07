import React from "react";

const CheckboxButton = ({ item, changeChecked }) => {
 

  const { id, checked, label } = item;

  return (
    <div>
      <input
        type="checkbox"
        checked={checked}
        onChange={() => changeChecked(id)}
        id={`checkbox-${id}`}
      />
      <label htmlFor={`checkbox-${id}`}>{label}</label>
    </div>
  );
};

export default CheckboxButton;


