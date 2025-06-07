import React from 'react';
import { Slider as MuiSlider } from '@mui/material';
import { styled } from '@mui/system';

const CustomSlider = styled(MuiSlider)({
  width: '100%',
  '& .MuiSlider-thumb': {
    color: '#000',
  },
  '& .MuiSlider-rail': {
    color: 'rgba(0, 0, 0, 0.26)',
  },
  '& .MuiSlider-track': {
    color: '#000',
  },
});

const Slider = ({ value, changePrice }) => {
  return (
    <div>
      <CustomSlider
        value={value}
        onChange={changePrice}
        valueLabelDisplay="on"
        min={0}
        max={1000}
      />
    </div>
  );
};

export default Slider;

