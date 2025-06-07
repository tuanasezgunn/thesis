import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

const FilterListToggle = ({ value, selectToggle, options }) => {
  return (
    <ToggleButtonGroup
      value={value}
      onChange={selectToggle}
      sx={{
        width: '100%',
        justifyContent: 'space-between',
      }}
    >
      {options.map(({ label, id }) => (
        <ToggleButton
          key={id}
          value={id}
          sx={{
            fontFamily: `'Raleway', sans-serif`,
            fontSize: '.8rem',
            border: '1px solid rgba(0, 0, 0, 0.12)',
            borderRadius: '10px',
            '&.Mui-selected': {
              background: '#000',
              color: '#fff',
            },
            '&:hover': {
              background: '#000',
              color: '#fff',
            },
          }}
        >
          {label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default FilterListToggle;



