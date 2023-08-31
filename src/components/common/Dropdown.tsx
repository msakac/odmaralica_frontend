/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-vars */
import React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

export interface IDropdownOption {
  id: string;
  name: string;
}

interface IDropdownProps {
  value: string;
  setValue: (value: string) => void;
  options?: IDropdownOption[];
  label: string;
  disabled?: boolean;
}

const Dropdown = ({ value, setValue, options, label, disabled = false }: IDropdownProps) => {
  return (
    <FormControl fullWidth size="small">
      <InputLabel id="demo-simple-select-label">{label}</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={value}
        disabled={disabled}
        label={label}
        onChange={(e) => setValue(e.target.value as string)}
      >
        {options &&
          options.map((option: IDropdownOption, index: number) => (
            <MenuItem key={index} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};

export default Dropdown;
