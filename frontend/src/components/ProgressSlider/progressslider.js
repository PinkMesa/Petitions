import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {Slider} from '@material-ui/core';

const ProgressSlider = ({value=0}) => {
  const MySlider = withStyles({
    root: {
      color: '#f44336',
      height: 8,
    },
    thumb: {
      height: 24,
      width: 24,
      backgroundColor: 'currentColor',
      border: '0.1px solid #3f51d5',
      marginTop: -8,
      marginLeft: 0,
      '&:focus, &:hover, &$active': {
        boxShadow: 'inherit',
      },
    },
    active: {},
    valueLabel: {
      left: 'calc(-50% + 4px)',
    },
    track: {
      height: 8,
      borderRadius: 4,
    },
    rail: {
      height: 8,
      borderRadius: 4,
    },
  })(Slider);

  return (<MySlider valueLabelDisplay="auto" aria-label="pretto slider" value={value} max={200}/>);
};

export default ProgressSlider;
