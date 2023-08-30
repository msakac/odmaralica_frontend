/* eslint-disable no-unused-vars */
import React from 'react';
import { FormControlLabel, Checkbox } from '@mui/material';

interface ICheckboxProps {
  value: boolean;
  setValue: (value: boolean) => void;
  label: string;
}

const CustomCheckbox = ({ value, setValue, label }: ICheckboxProps) => {
  return <FormControlLabel control={<Checkbox checked={value} onChange={() => setValue(!value)} />} label={label} />;
};

export default CustomCheckbox;
